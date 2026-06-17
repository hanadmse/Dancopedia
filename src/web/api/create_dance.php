<?php
session_start();

require __DIR__ . '/../../config/database.php';
require __DIR__ . '/../../app/api_helpers.php';

jsonHeader();

function failCreateDance(string $message, int $status = 400): void
{
    http_response_code($status);
    echo json_encode(["error" => $message]);
    exit();
}

function requireIntField(string $name, array $allowed = null): int
{
    $value = filter_input(INPUT_POST, $name, FILTER_VALIDATE_INT);
    if ($value === false || $value === null) {
        failCreateDance('Please fill in all required fields and place the pin on the map.');
    }
    if ($allowed !== null && !in_array($value, $allowed, true)) {
        failCreateDance('Invalid form selection.');
    }
    return $value;
}

function ensureImageUpload(array $file): array
{
    $maxBytes = 5 * 1024 * 1024;
    $allowed = [
        IMAGETYPE_JPEG => ['mime' => 'image/jpeg', 'ext' => 'jpg'],
        IMAGETYPE_PNG  => ['mime' => 'image/png',  'ext' => 'png'],
        IMAGETYPE_WEBP => ['mime' => 'image/webp', 'ext' => 'webp'],
    ];

    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        $message = ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE
            ? 'A dance image is required.'
            : 'Image upload failed. Please choose a valid image under 5 MB.';
        failCreateDance($message);
    }

    if (!is_uploaded_file($file['tmp_name'] ?? '')) {
        failCreateDance('Invalid upload.');
    }

    if (($file['size'] ?? 0) <= 0 || $file['size'] > $maxBytes) {
        failCreateDance('Image must be under 5 MB.');
    }

    $info = @getimagesize($file['tmp_name']);
    $imageType = $info[2] ?? null;
    if ($info === false || !isset($allowed[$imageType])) {
        failCreateDance('Invalid file type. Only JPG, PNG, and WebP images are allowed.');
    }

    if ($info === false || ($info['mime'] ?? '') !== $allowed[$imageType]['mime']) {
        failCreateDance('The uploaded file is not a valid image.');
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    if ($mime !== $allowed[$imageType]['mime']) {
        failCreateDance('The uploaded file content does not match the selected image type.');
    }

    if (($info[0] ?? 0) < 1 || ($info[1] ?? 0) < 1 || $info[0] > 8000 || $info[1] > 8000) {
        failCreateDance('Image dimensions are invalid.');
    }

    return $allowed[$imageType];
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    failCreateDance('Invalid request method.', 405);
}

if (!isset($_SESSION['user_name']) && !isset($_SESSION['admin_name'])) {
    failCreateDance('Please log in before submitting a dance.', 401);
}

verifyCsrfToken();

$dance_name  = trim($_POST['dance_name'] ?? '');
$description = trim($_POST['description'] ?? '');
$category_id = requireIntField('category_id', [1, 2, 3, 4]);
$region      = requireIntField('region', [1, 2, 3, 4]);
$pin_x       = requireIntField('pin_x');
$pin_y       = requireIntField('pin_y');

if ($dance_name === '' || mb_strlen($dance_name) < 2 || mb_strlen($dance_name) > 100) {
    failCreateDance('Dance name must be between 2 and 100 characters.');
}

if ($description === '' || mb_strlen($description) > 5000) {
    failCreateDance('Description is required and must be 5,000 characters or fewer.');
}

if ($pin_x < 0 || $pin_x > 600 || $pin_y < 0 || $pin_y > 600) {
    failCreateDance('Map pin coordinates are invalid.');
}

if (!isset($_FILES['dance_image'])) {
    failCreateDance('A dance image is required.');
}

$imageMeta = ensureImageUpload($_FILES['dance_image']);
$uploadDir = __DIR__ . '/../assets/images';
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
    failCreateDance('Upload directory is unavailable.', 500);
}

$filename = time() . '_' . bin2hex(random_bytes(12)) . '.' . $imageMeta['ext'];
$targetFile = $uploadDir . '/' . $filename;

if (!move_uploaded_file($_FILES['dance_image']['tmp_name'], $targetFile)) {
    failCreateDance('Error uploading file. Please try again.', 500);
}
chmod($targetFile, 0644);

$mediaPath = 'assets/images/' . $filename;
$altText   = $dance_name . ' image';

$stmtMedia = $conn->prepare("INSERT INTO media (media_url, alttext) VALUES (?, ?)");
if (!$stmtMedia) {
    @unlink($targetFile);
    error_log('[Dancopedia create_dance] Media prepare failed: ' . $conn->error);
    failCreateDance('Submission failed. Please try again.', 500);
}
$stmtMedia->bind_param("ss", $mediaPath, $altText);
if (!$stmtMedia->execute()) {
    @unlink($targetFile);
    error_log('[Dancopedia create_dance] Media insert failed: ' . $stmtMedia->error);
    failCreateDance('Submission failed. Please try again.', 500);
}
$media_id = $stmtMedia->insert_id;
$stmtMedia->close();

function cleanupMedia(mysqli $conn, int $media_id, string $targetFile): void
{
    @unlink($targetFile);
    $del = $conn->prepare("DELETE FROM media WHERE media_id = ?");
    if ($del) {
        $del->bind_param("i", $media_id);
        $del->execute();
        $del->close();
    }
}

$approved = 2;
$slug = generateSlug($dance_name);
$baseSlug = $slug;
$i = 1;
while (true) {
    $chk = $conn->prepare("SELECT dance_id FROM dances WHERE slug = ?");
    if (!$chk) {
        cleanupMedia($conn, $media_id, $targetFile);
        error_log('[Dancopedia create_dance] Slug check prepare failed: ' . $conn->error);
        failCreateDance('Submission failed. Please try again.', 500);
    }
    $chk->bind_param("s", $slug);
    $chk->execute();
    $chk->store_result();
    $exists = $chk->num_rows > 0;
    $chk->close();
    if (!$exists) break;
    $slug = $baseSlug . '-' . $i++;
}

$sqlDance = "INSERT INTO dances (dance_name, slug, category_id, description, media_id, region, approved, x, y)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmtDance = $conn->prepare($sqlDance);
if (!$stmtDance) {
    cleanupMedia($conn, $media_id, $targetFile);
    error_log('[Dancopedia create_dance] Dance prepare failed: ' . $conn->error);
    failCreateDance('Submission failed. Please try again.', 500);
}
$stmtDance->bind_param("ssisiiiii", $dance_name, $slug, $category_id, $description, $media_id, $region, $approved, $pin_x, $pin_y);

if ($stmtDance->execute()) {
    echo json_encode(["success" => true, "message" => "Dance submitted! Upon admin review and approval, it will be added to the archive."]);
} else {
    $errno = $stmtDance->errno;
    $errMsg = $stmtDance->error;
    $stmtDance->close();
    cleanupMedia($conn, $media_id, $targetFile);
    if ($errno === 1062) {
        failCreateDance('A dance with that name already exists. Please choose a different name.');
    }
    error_log('[Dancopedia create_dance] Dance insert failed: ' . $errMsg);
    failCreateDance('Submission failed. Please try again.', 500);
}

$stmtDance->close();
$conn->close();
?>
