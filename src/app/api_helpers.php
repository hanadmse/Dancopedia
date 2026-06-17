<?php

function jsonHeader(): void {
    header("Content-Type: application/json; charset=UTF-8");
}

function requireAdminApi(): void {
    if (!isset($_SESSION['admin_name'])) {
        jsonHeader();
        http_response_code(403);
        echo json_encode(["error" => "Unauthorized."]);
        exit;
    }
}

function verifyCsrfToken(): void {
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
        jsonHeader();
        http_response_code(403);
        echo json_encode(["error" => "Invalid CSRF token."]);
        exit;
    }
}

function generateSlug(string $name): string {
    $map = [
        'á'=>'a','à'=>'a','ã'=>'a','â'=>'a','ä'=>'a',
        'é'=>'e','è'=>'e','ê'=>'e','ë'=>'e',
        'í'=>'i','ì'=>'i','î'=>'i','ï'=>'i',
        'ó'=>'o','ò'=>'o','õ'=>'o','ô'=>'o','ö'=>'o',
        'ú'=>'u','ù'=>'u','û'=>'u','ü'=>'u',
        'ç'=>'c','ñ'=>'n',
    ];
    $name = mb_strtolower($name, 'UTF-8');
    $name = strtr($name, $map);
    $name = preg_replace('/[^a-z0-9]+/', '-', $name);
    return trim($name, '-');
}

function formatDanceRow(array $row): array {
    return [
        "dance_id"    => $row['dance_id']      ?? '',
        "dance_name"  => $row['dance_name']    ?? 'Unknown',
        "slug"        => $row['slug']          ?? '',
        "description" => $row['description']   ?? 'No description available',
        "category"    => $row['category_name'] ?? 'Uncategorized',
        "region"      => $row['region_name']   ?? 'Unknown',
        "media_url"   => $row['media_url']     ?? '',
        "alttext"     => $row['alttext']       ?? 'Dance image',
    ];
}
