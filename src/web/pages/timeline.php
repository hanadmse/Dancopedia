<?php if (session_status() === PHP_SESSION_NONE) session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Timeline – Dancopedia Brazil</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="stylesheet" href="../assets/css/fonts.css">
  <link rel="stylesheet" href="../assets/css/Chatbox.css">
  <link rel="stylesheet" href="../assets/css/Timeline.css">
  <link rel="stylesheet" href="../assets/css/Breadcrumb.css">
  <link rel="stylesheet" href="../assets/css/toolbar.css">
  <script src="../assets/js/toolbar.js" defer></script>
</head>
<body>
<?php include __DIR__ . '/../partials/toolbar.php'; ?>
<?php include __DIR__ . '/../partials/chatbox.html'; ?>
<?php
$crumbs = [['Home', $base], ['Timeline', null]];
include __DIR__ . '/../partials/breadcrumb.php';
?>

<main>

  <div class="page-hero">
    <p class="ph-label">History</p>
    <h1>Brazilian Dance Through Time</h1>
    <p>From colonial-era roots to UNESCO-recognized heritage — trace the story of Brazilian dance across five centuries.</p>
  </div>

  <div class="tl-outer">
    <div class="tl-container">

      <div class="tl-item">
        <div class="tl-card">
          <img class="tl-img" src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Oscar_Pereira_da_Silva_-_Desembarque_de_Pedro_%C3%81lvares_Cabral_em_Porto_Seguro%2C_1500%2C_Acervo_do_Museu_Paulista_da_USP.jpg" alt="Desembarque de Cabral em Porto Seguro, 1500 – painting by Oscar Pereira da Silva" loading="lazy">
          <div class="tl-card-body">
            <span class="tl-year">1500s</span>
            <h3>European Roots Arrive</h3>
            <p>Portuguese colonization brings quadrilha and early European folk forms to Brazilian shores, laying the first layer of what would become a complex cultural blend.</p>
          </div>
        </div>
      </div>

      <div class="tl-item">
        <div class="tl-card">
          <img class="tl-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Garota_batucando.jpg/500px-Garota_batucando.jpg" alt="Batuquejê – Afro-Brazilian Candomblé percussion and dance tradition" loading="lazy">
          <div class="tl-card-body">
            <span class="tl-year">1600s – 1700s</span>
            <h3>African Rhythms Take Root</h3>
            <p>Enslaved Africans bring Candomblé ceremonies, batuque percussion, and Yoruba movement traditions. These rhythms would become the foundation of virtually all Brazilian popular dance.</p>
          </div>
        </div>
      </div>

      <div class="tl-item">
        <div class="tl-card">
          <img class="tl-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Batuque.jpg/500px-Batuque.jpg" alt="Batuque dance in Brazil, painting by Johann Moritz Rugendas c. 1822–1825" loading="lazy">
          <div class="tl-card-body">
            <span class="tl-year">1870s</span>
            <h3>Samba Emerges in Rio</h3>
            <p>Born in the Afro-Brazilian communities of Bahia migrants settled in Rio's port neighborhoods, samba fuses African percussion with European melody into something entirely new.</p>
          </div>
        </div>
      </div>

      <div class="tl-item">
        <div class="tl-card">
          <img class="tl-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Samba_Parade_-_Rio%27s_Carnival_2008.jpg/500px-Samba_Parade_-_Rio%27s_Carnival_2008.jpg" alt="Samba performers at Rio Carnival Sambódromo parade" loading="lazy">
          <div class="tl-card-body">
            <span class="tl-year">1917</span>
            <h3>First Samba Recording</h3>
            <p>"Pelo Telefone" by Ernesto dos Santos becomes the first officially registered samba, cementing the genre's identity and launching it toward national prominence.</p>
          </div>
        </div>
      </div>

      <div class="tl-item">
        <div class="tl-card">
          <img class="tl-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Carnival_in_Rio_de_Janeiro.jpg/500px-Carnival_in_Rio_de_Janeiro.jpg" alt="Mocidade Independente de Padre Miguel samba school float at Rio Carnival 2007" loading="lazy">
          <div class="tl-card-body">
            <span class="tl-year">1930s</span>
            <h3>Samba Schools Formalize</h3>
            <p>Rio's escolas de samba organize competitive carnival parades, turning samba into a structured national art form embraced across all social classes.</p>
          </div>
        </div>
      </div>

      <div class="tl-item">
        <div class="tl-card">
          <img class="tl-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Caruaru-S%C3%A3o-Jo%C3%A3o-2005-Trio-forr%C3%B3.jpg/500px-Caruaru-S%C3%A3o-Jo%C3%A3o-2005-Trio-forr%C3%B3.jpg" alt="Forró trio musicians in Caruaru" loading="lazy">
          <div class="tl-card-body">
            <span class="tl-year">1950s</span>
            <h3>Forró Goes National</h3>
            <p>Northeastern workers migrating to Rio and São Paulo bring forró's accordion-driven rhythms to urban Brazil. The dance of the sertão becomes a symbol of northeastern identity.</p>
          </div>
        </div>
      </div>

      <div class="tl-item">
        <div class="tl-card">
          <img class="tl-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Baden_Powell_no_Teatro_da_Praia%2C_1972.tif/lossy-page1-500px-Baden_Powell_no_Teatro_da_Praia%2C_1972.tif.jpg" alt="Brazilian guitarist performing bossa nova" loading="lazy">
          <div class="tl-card-body">
            <span class="tl-year">1958</span>
            <h3>Bossa Nova Is Born</h3>
            <p>João Gilberto's intimate guitar technique and Antônio Carlos Jobim's lush harmonies fuse samba with cool jazz. The result captivates the world and redefines Brazilian music internationally.</p>
          </div>
        </div>
      </div>

      <div class="tl-item">
        <div class="tl-card">
          <img class="tl-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Modern-Agogo.jpg/500px-Modern-Agogo.jpg" alt="Agogô bell instrument from Bahia" loading="lazy">
          <div class="tl-card-body">
            <span class="tl-year">1960s</span>
            <h3>Axé Rises in Bahia</h3>
            <p>Electric instruments meet African-rooted rhythms in Salvador's carnival streets. Axé music and its energetic, synchronized dance style becomes Bahia's signature cultural export.</p>
          </div>
        </div>
      </div>

      <div class="tl-item">
        <div class="tl-card">
          <img class="tl-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tamborim.JPG/500px-Tamborim.JPG" alt="Brazilian percussion instrument from Rio" loading="lazy">
          <div class="tl-card-body">
            <span class="tl-year">1990s</span>
            <h3>Funk Carioca Emerges</h3>
            <p>Miami bass influences collide with Rio's baile funk parties in the city's favelas. Funk Carioca creates Brazil's most urban, community-rooted dance culture — controversial and unstoppable.</p>
          </div>
        </div>
      </div>

      <div class="tl-item">
        <div class="tl-card">
          <img class="tl-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Samba_de_Roda_da_Nega_Duda_1.jpg/500px-Samba_de_Roda_da_Nega_Duda_1.jpg" alt="Samba de Roda da Nega Duda – traditional circle samba of Recôncavo Bahia" loading="lazy">
          <div class="tl-card-body">
            <span class="tl-year">2005</span>
            <h3>UNESCO: Samba de Roda</h3>
            <p>The traditional samba form of Recôncavo Bahia — intimate, circular, and tied to Candomblé — becomes the first Brazilian dance recognized as UNESCO Intangible Cultural Heritage.</p>
          </div>
        </div>
      </div>

      <div class="tl-item">
        <div class="tl-card">
          <img class="tl-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/O_frevo_rola_at%C3%A9_o_%C3%BAltimo_minuto_%283308917355%29.jpg/500px-O_frevo_rola_at%C3%A9_o_%C3%BAltimo_minuto_%283308917355%29.jpg" alt="Frevo dancers with yellow parasols at Carnival of Olinda 2009" loading="lazy">
          <div class="tl-card-body">
            <span class="tl-year">2012</span>
            <h3>UNESCO: Frevo</h3>
            <p>Pernambuco's acrobatic carnival dance — with its lightning footwork and signature parasol — joins the UNESCO heritage list, preserving its unique Afro-Brazilian and working-class roots.</p>
          </div>
        </div>
      </div>

      <div class="tl-item">
        <div class="tl-card">
          <img class="tl-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Capoeira_handstand_kick.jpg/500px-Capoeira_handstand_kick.jpg" alt="Capoeira practitioner performing a handstand kick (Aú)" loading="lazy">
          <div class="tl-card-body">
            <span class="tl-year">2014</span>
            <h3>UNESCO: Capoeira</h3>
            <p>The Afro-Brazilian martial art and dance tradition, born from the resistance of enslaved people, receives global UNESCO heritage recognition — a landmark, belated acknowledgment.</p>
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
