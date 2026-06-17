SET FOREIGN_KEY_CHECKS=0;
DROP DATABASE IF EXISTS brazil_dances;
CREATE DATABASE IF NOT EXISTS brazil_dances CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE brazil_dances;

CREATE TABLE users_form (
                            id INT(255) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                            username VARCHAR(255) NOT NULL,
                            password VARCHAR(255) NOT NULL,
                            user_type VARCHAR(255) NOT NULL DEFAULT 'user',
                            email VARCHAR(255) NOT NULL,
                            email_hash VARCHAR(64) DEFAULT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE dance_categories (
                                  category_id INT PRIMARY KEY AUTO_INCREMENT,
                                  category_name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO dance_categories (category_name) VALUES
                                                 ('Traditional'), ('Festival'), ('Partner'), ('Pop');

CREATE TABLE media (
                       media_id INT PRIMARY KEY AUTO_INCREMENT,
                       media_url VARCHAR(255) UNIQUE,
                       alttext VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO media (media_url, alttext) VALUES
    ('assets/images/samba_img.jpg',  'Samba dance image'),
    ('assets/images/forro_img.jpg',  'Forro dance image'),
    ('assets/images/frevo_img.jpg',  'Frevo dance image'),
    ('assets/images/axe_img.jpg',    'Axé dance image'),
    ('assets/images/bossa_img.jpg',  'Bossa Nova dance image'),
    ('assets/images/capoeira_img.jpg',    'Capoeira practitioners sparring in Salvador, Bahia'),
    ('assets/images/maracatu_img.jpg',    'Maracatu Estrela Brilhante procession in Recife'),
    ('assets/images/lambada_img.jpg',     'Couple performing a close-hold Latin partner dance dip'),
    ('assets/images/maculele_img.jpg',    'Maculelê warriors with sticks in Arembepe, Bahia'),
    ('assets/images/carimbo_img.jpg',     'Carimbó folk dancers in traditional dress, Pará'),
    ('assets/images/quadrilha_img.jpg',   'Quadrilha dancers at São João festival'),
    ('assets/images/funk_carioca_img.jpg','Funk Carioca baile in Rio de Janeiro'),
    ('assets/images/baiao_img.jpg',       'Luiz Gonzaga, King of Baião, performing in 1957');

CREATE TABLE region (
                        region_key INT PRIMARY KEY AUTO_INCREMENT,
                        region_name VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO region (region_name, region_key) VALUES
                                                 ('Rio de Janeiro', 1),
                                                 ('Northeastern Brazil', 2),
                                                 ('Pernambuco', 3),
                                                 ('Bahia', 4);

CREATE TABLE dances (
                        dance_id INT PRIMARY KEY AUTO_INCREMENT,
                        dance_name VARCHAR(100) NOT NULL UNIQUE,
                        slug VARCHAR(120) NOT NULL DEFAULT '' UNIQUE,
                        category_id INT,
                        description TEXT,
                        media_id INT,
                        region INT,
                        x INT,
                        y INT,
                        user_id INT,
                        approved BOOL,
                        FOREIGN KEY (user_id) REFERENCES users_form(id) ON DELETE CASCADE,
                        FOREIGN KEY (category_id) REFERENCES dance_categories(category_id) ON DELETE CASCADE,
                        FOREIGN KEY (media_id) REFERENCES media(media_id) ON DELETE CASCADE,
                        FOREIGN KEY (region) REFERENCES region(region_key) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO dances (dance_name, slug, category_id, description, media_id, region, user_id, approved, x, y) VALUES
    ('Samba', 'samba', 1,
     'Samba is a lively, rhythmical dance with deep roots in Afro-Brazilian communities, born in the favelas and terreiros of Rio de Janeiro. Brought to Brazil by enslaved West Africans, it blends Candomblé ritual movement with the influence of European polka and maxixe. At Carnival, elaborate samba schools parade through the Sambadrome with thousands of performers, dazzling costumes, and percussion-driven bateria ensembles. Its 2/4 rhythm, syncopated footwork, and swaying hips make it one of the most recognizable dances in the world.',
     1, 1, 1, 1, 473, 431),

    ('Forró', 'forro', 3,
     'Forró is a close-partner dance from the interior of Northeastern Brazil, driven by the accordion, zabumba drum, and triangle. Popularized by the legendary musician Luiz Gonzaga, it became the defining dance of the São João festival celebrated every June. Partners embrace closely and mirror each other''s shuffling footwork in a constant back-and-forth conversation. Its warm, inclusive spirit has made it beloved far beyond the northeast, with forró clubs now thriving in São Paulo, Rio de Janeiro, and across Europe.',
     2, 2, 1, 1, 510, 197),

    ('Frevo', 'frevo', 2,
     'Frevo is a high-energy, acrobatic dance born on the streets of Recife and Olinda during Pernambuco''s Carnival. Dancers perform dizzying footwork — jumps, spins, and splits — while brandishing a tiny, colorful umbrella called a sombrinha. The brass-heavy music pushes tempos to a frantic pace, challenging even the most skilled performers. Frevo was inscribed on the UNESCO Intangible Cultural Heritage list in 2012, cementing its place as one of Brazil''s most treasured cultural expressions.',
     3, 3, 1, 1, 580, 200),

    ('Axé', 'axe', 4,
     'Axé is a vibrant, Afro-Brazilian dance style that exploded out of Salvador da Bahia in the 1980s and quickly swept across Brazil. Its name references the spiritual force central to Candomblé, the African-derived religion that runs deep in Bahian culture. The dance blends elements of reggae, lambada, and Caribbean rhythms into a joyful, high-energy style perfect for outdoor festivals and street parties. Dancers move with expressive arm gestures, hip rolls, and quick footwork, celebrating life and community in every performance.',
     4, 4, 1, 1, 548, 277),

    ('Bossa Nova', 'bossa-nova', 4,
     'Bossa Nova emerged in the late 1950s in the upscale neighborhoods of Rio de Janeiro as a revolutionary fusion of traditional samba rhythms with cool American jazz harmonies. Pioneered by João Gilberto, Antônio Carlos Jobim, and lyricist Vinícius de Moraes, it stripped samba down to an intimate whisper — gentle guitar strumming, brushed percussion, and introspective melodies. The accompanying dance is understated and fluid, with a subtle sway rather than extravagant movement. Its worldwide breakthrough came with "The Girl from Ipanema," which remains one of the most-recorded songs in history.',
     5, 1, 1, 1, 460, 440),

    ('Capoeira', 'capoeira', 1,
     'Capoeira is a remarkable Afro-Brazilian martial art disguised as a dance, developed by enslaved Africans in Brazil beginning in the 16th century. Performed to the hypnotic sound of the berimbau and accompanied by the atabaque drum and pandeiro, it blends acrobatic kicks, sweeps, and feints into a flowing, circular sparring match called the jogo. Because slave owners forbade combat training, practitioners hid the fighting techniques within seemingly playful dance moves. Today it is practiced worldwide and recognized by UNESCO as Intangible Cultural Heritage.',
     6, 4, 1, 1, 543, 283),

    ('Maracatu', 'maracatu', 2,
     'Maracatu is a majestic Afro-Brazilian ritual procession that emerged from the coronation ceremonies of African kings and queens held in Pernambuco during the colonial era. Two main styles exist: Maracatu de Baque Virado, featuring thunderous alfaia drums and a Dama do Paço carrying a sacred doll, and Maracatu Rural, featuring fantastical characters called caboclos de lança. Every Carnival season, Recife erupts with maracatu groups in elaborate dress parading through the streets in a powerful celebration of Black Brazilian identity.',
     7, 3, 1, 1, 578, 205),

    ('Lambada', 'lambada', 3,
     'Lambada is a sensual, close-contact partner dance that rocketed to global fame in 1989 through the hit song of the same name. Originating in the port city of Belém, it blended carimbó, forró, and merengue into an intimate style that captivated millions worldwide. Partners intertwine their legs in a characteristic swaying figure-eight motion, requiring both trust and technique. Although its international fame faded by the early 1990s, lambada left a lasting legacy by evolving into Brazilian Zouk and inspiring a generation of Latin social dancers.',
     8, 2, 1, 1, 387, 93),

    ('Quadrilha', 'quadrilha', 2,
     'Quadrilha Brasileira is a lively square dance that arrived from France in the 19th century and was enthusiastically transformed by the rural communities of the Northeast. Today it is the centerpiece of the Festa Junina celebrations held every June in honor of Saints Anthony, John, and Peter. Couples in colorful polka-dot dresses and plaid shirts perform intricate formations guided by a caller called the marcador. Competitive quadrilha groups now stage spectacular theatrical productions that rival Carnival in their artistry and scale.',
     11, 2, 1, 1, 490, 210),

    ('Maculelê', 'maculele', 1,
     'Maculelê is a dramatic Afro-Brazilian warrior dance from Santo Amaro da Purificação in Bahia, traditionally performed with biriba sticks or machetes. Dancers form a circle and take turns clashing their sticks together in rhythmic patterns that tell stories of valor, battle, and resistance. Legend credits its survival to Popó de Abará, who revived the practice in the 1940s after it had nearly vanished. Today Maculelê is often performed alongside capoeira and candomblé celebrations as a testament to Afro-Brazilian cultural resilience.',
     9, 4, 1, 1, 542, 268),

    ('Carimbó', 'carimbo', 1,
     'Carimbó is a joyful, circular folk dance indigenous to the state of Pará, with roots stretching back to the Tupinambá people and the enslaved Africans brought to the Amazon delta. Its name comes from the hollow log drum — the curimbó — that provides its driving, earthy rhythm. Women in wide, white skirts spin and dip in a flowing circle while men attempt to throw their hats into the skirts, which the women catch with their hems. The dance gained national attention through musicians like Mestre Verequete and was inscribed as Brazilian Intangible Heritage in 2014.',
     10, 2, 1, 1, 380, 88),

    ('Funk Carioca', 'funk-carioca', 4,
     'Funk Carioca is a raw, bass-heavy dance music and culture that exploded from the favelas of Rio de Janeiro in the late 1980s, drawing lineage from Miami bass records that arrived in Brazil through cassette tapes. Its characteristic dance features aggressive hip movements, footwork called the passinho, and group choreography that emerged from the baile funk parties held in community spaces across Rio''s hillside communities. Despite decades of controversy, Funk Carioca evolved from underground phenomenon to mainstream cultural export, with artists like Anitta and Ludmilla carrying its energy to global stages.',
     12, 1, 1, 1, 468, 445),

    ('Baião', 'baiao', 3,
     'Baião is a traditional music and dance style from the arid sertão of Northeastern Brazil, immortalized by accordion maestro Luiz Gonzaga and his lyricist Humberto Teixeira in 1946. The dance is performed in pairs with a light, syncopated two-step that stays close to the floor, reflecting the understated dignity of the sertanejo people who created it. Unlike the frantic energy of forró, baião carries a melancholic quality that mirrors the harsh beauty of the semi-arid landscape. Gonzaga''s baião paved the way for all northeastern music that followed and earned him the title "King of Baião."',
     13, 2, 1, 1, 505, 216);

CREATE TABLE preferences (
                             preference_id INT PRIMARY KEY AUTO_INCREMENT,
                             user_id INT,
                             dance_id INT,
                             FOREIGN KEY (user_id) REFERENCES users_form(id) ON DELETE CASCADE,
                             FOREIGN KEY (dance_id) REFERENCES dances(dance_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE feedback (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          username VARCHAR(255) NOT NULL,
                          fname VARCHAR(255) NOT NULL,
                          lname VARCHAR(255) NOT NULL,
                          continent VARCHAR(255) NOT NULL,
                          feedback_text VARCHAR(300) NOT NULL,
                          approved TINYINT(1) NOT NULL DEFAULT 0,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO feedback (username, fname, lname, continent, feedback_text, approved) VALUES
('system', 'Maria',   'Silva',    'south_america', 'What an incredible resource for learning about Brazilian dance culture!', 1),
('system', 'James',   'Carter',   'north_america', 'I love how the archive is organized by region — makes exploration so intuitive.', 1),
('system', 'Yuki',    'Tanaka',   'asia',          'The chatbot answered my questions about Samba history instantly. Impressive!', 1),
('system', 'Sophie',  'Müller',   'europe',        'Beautifully designed site. The dance descriptions are thorough and engaging.', 1),
('system', 'Lucas',   'Oliveira', 'south_america', 'Frevo is my favourite. Great to see it getting the coverage it deserves.', 1);

SET FOREIGN_KEY_CHECKS=1;
