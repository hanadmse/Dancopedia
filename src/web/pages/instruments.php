<?php if (session_status() === PHP_SESSION_NONE) session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instruments – Dancopedia Brazil</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="stylesheet" href="../assets/css/fonts.css">
  <link rel="stylesheet" href="../assets/css/Chatbox.css">
  <link rel="stylesheet" href="../assets/css/Instruments.css">
  <link rel="stylesheet" href="../assets/css/Breadcrumb.css">
  <link rel="stylesheet" href="../assets/css/toolbar.css">
  <script src="../assets/js/toolbar.js" defer></script>
</head>
<body>
<?php include __DIR__ . '/../partials/toolbar.php'; ?>
<?php include __DIR__ . '/../partials/chatbox.html'; ?>
<?php
$crumbs = [['Home', $base], ['Instruments', null]];
include __DIR__ . '/../partials/breadcrumb.php';
?>

<main>

  <div class="page-hero">
    <p class="ph-label">The Sound</p>
    <h1>Instruments of Brazilian Dance</h1>
    <p>Every dance has a pulse. Discover the percussion and string instruments that drive Brazil's most iconic dance traditions.</p>
  </div>

  <div class="inst-outer">
    <div class="inst-wrap">

      <div class="inst-grid">

        <div class="inst-card">
          <img class="inst-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Olodum-drummers.jpg/500px-Olodum-drummers.jpg" alt="Surdo drums being played by Olodum percussionists" loading="lazy">
          <div class="inst-body">
            <div class="inst-name">Surdo</div>
            <span class="inst-tag">Samba · Traditional</span>
            <p class="inst-desc">The heartbeat of samba. A large bass drum carried on a strap, the surdo provides the deep, pulsing foundation that anchors every samba bateria. Three sizes — first, second, and third surdo — each play a distinct rhythmic role during Carnival parades.</p>
          </div>
        </div>

        <div class="inst-card">
          <img class="inst-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Repique.JPG/500px-Repique.JPG" alt="Repique drum" loading="lazy">
          <div class="inst-body">
            <div class="inst-name">Repique</div>
            <span class="inst-tag">Samba · Traditional</span>
            <p class="inst-desc">The samba caller. A high-pitched cylindrical drum played by the head of the percussion section, the repique signals transitions and keeps the entire bateria synchronized. Its sharp, accented patterns cut through the loudest carnival crowds.</p>
          </div>
        </div>

        <div class="inst-card">
          <img class="inst-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Snare_Drum.jpg/500px-Snare_Drum.jpg" alt="Caixa snare drum" loading="lazy">
          <div class="inst-body">
            <div class="inst-name">Caixa</div>
            <span class="inst-tag">Frevo · Festival</span>
            <p class="inst-desc">The marching snare. A shallow, double-headed drum with wire snares that produce a crisp, cutting sound, the caixa is essential to frevo and military band traditions. Its rolling, relentless rhythms propel the acrobatic footwork of Pernambuco's carnival.</p>
          </div>
        </div>

        <div class="inst-card">
          <img class="inst-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tamborim.JPG/500px-Tamborim.JPG" alt="Tamborim hand drum" loading="lazy">
          <div class="inst-body">
            <div class="inst-name">Tamborim</div>
            <span class="inst-tag">Samba · Traditional</span>
            <p class="inst-desc">The melody of percussion. A small, single-headed hand drum played with a rigid stick or multi-tined beater, the tamborim adds fast, syncopated melodic patterns that weave above the heavier samba drums — giving the bateria its characteristic sparkle.</p>
          </div>
        </div>

        <div class="inst-card">
          <img class="inst-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Modern-Agogo.jpg/500px-Modern-Agogo.jpg" alt="Agogô double iron bell" loading="lazy">
          <div class="inst-body">
            <div class="inst-name">Agogô</div>
            <span class="inst-tag">Axé · Candomblé</span>
            <p class="inst-desc">The iron voice. A double iron bell struck with a metal rod, the agogô is one of Africa's oldest percussive instruments brought to Brazil via Yoruba culture. It defines the rhythmic feel of Candomblé ceremonies and is inseparable from axé and Afro-Brazilian spiritual traditions.</p>
          </div>
        </div>

        <div class="inst-card">
          <img class="inst-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/History_of_Inventions_USNM_41_Angola_Muscial_Bow.jpg/500px-History_of_Inventions_USNM_41_Angola_Muscial_Bow.jpg" alt="Berimbau musical bow" loading="lazy">
          <div class="inst-body">
            <div class="inst-name">Berimbau</div>
            <span class="inst-tag">Capoeira · Partner</span>
            <p class="inst-desc">The soul of capoeira. A single-string musical bow with a resonating gourd, the berimbau controls the entire rhythm and tempo of every capoeira roda. Its three tones — toque — dictate whether fighters move slowly and fluidly or explode into fast, evasive sequences.</p>
          </div>
        </div>

        <div class="inst-card">
          <img class="inst-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/A_Zabumba_do_Boi_de_Guimar%C3%A3es_%28MA%29.jpg/500px-A_Zabumba_do_Boi_de_Guimar%C3%A3es_%28MA%29.jpg" alt="Zabumba drum played in Bumba Meu Boi folk tradition, Maranhão" loading="lazy">
          <div class="inst-body">
            <div class="inst-name">Zabumba</div>
            <span class="inst-tag">Forró · Partner</span>
            <p class="inst-desc">The backbone of forró. A flat, double-headed bass drum struck on both sides simultaneously — a deep boom from one side and a sharp tap from the other — the zabumba creates forró's distinctive thump-and-snap drive alongside the triangle and sanfona accordion.</p>
          </div>
        </div>

        <div class="inst-card">
          <img class="inst-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Pandeiro3.JPG/500px-Pandeiro3.JPG" alt="Pandeiro Brazilian tambourine being played" loading="lazy">
          <div class="inst-body">
            <div class="inst-name">Pandeiro</div>
            <span class="inst-tag">Samba · Forró</span>
            <p class="inst-desc">The Brazilian tambourine. Far more complex than its European counterpart, the pandeiro is played with elaborate finger techniques producing bass tones, open slaps, and jingle rolls in a single stroke. It is central to samba, forró, and choro — Brazil's most versatile folk instrument.</p>
          </div>
        </div>

      </div>
    </div>
  </div>

</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
<script src="../assets/js/chatbox.js"></script>
</body>
</html>
