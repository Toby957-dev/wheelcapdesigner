// Mehrsprachigkeit. Deutsch ist die Basis (Quelltext = Schlüssel).
// t(deutscherText) liefert die Übersetzung der aktiven Sprache (oder Deutsch als Fallback).

export const LANGS = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
];

export const FLAGS = {
  de: '<svg viewBox="0 0 22 15"><rect width="22" height="5" fill="#000"/><rect y="5" width="22" height="5" fill="#DD0000"/><rect y="10" width="22" height="5" fill="#FFCE00"/></svg>',
  en: '<svg viewBox="0 0 22 15"><rect width="22" height="15" fill="#012169"/><path d="M0,0 L22,15 M22,0 L0,15" stroke="#fff" stroke-width="3"/><path d="M0,0 L22,15 M22,0 L0,15" stroke="#C8102E" stroke-width="1.5"/><path d="M11,0 V15 M0,7.5 H22" stroke="#fff" stroke-width="4"/><path d="M11,0 V15 M0,7.5 H22" stroke="#C8102E" stroke-width="2.2"/></svg>',
  fr: '<svg viewBox="0 0 22 15"><rect width="22" height="15" fill="#fff"/><rect width="7.34" height="15" fill="#0055A4"/><rect x="14.66" width="7.34" height="15" fill="#EF4135"/></svg>',
  es: '<svg viewBox="0 0 22 15"><rect width="22" height="15" fill="#AA151B"/><rect y="3.75" width="22" height="7.5" fill="#F1BF00"/></svg>',
  it: '<svg viewBox="0 0 22 15"><rect width="22" height="15" fill="#fff"/><rect width="7.34" height="15" fill="#009246"/><rect x="14.66" width="7.34" height="15" fill="#CE2B37"/></svg>',
};

const DICT = {
  // ---- Topbar / global ----
  'Maße einstellen · Logo wählen · als STL / 3MF herunterladen': {
    en: 'Set dimensions · pick a logo · download as STL / 3MF',
    fr: 'Régler les dimensions · choisir un logo · télécharger en STL / 3MF',
    es: 'Ajusta medidas · elige un logo · descarga en STL / 3MF',
    it: 'Imposta le misure · scegli un logo · scarica in STL / 3MF' },
  'Standard': { en: 'Standard', fr: 'Standard', es: 'Estándar', it: 'Standard' },
  'Experte': { en: 'Expert', fr: 'Expert', es: 'Experto', it: 'Esperto' },
  'STL herunterladen': { en: 'Download STL', fr: 'Télécharger STL', es: 'Descargar STL', it: 'Scarica STL' },
  'Kaffee spendieren': { en: 'Buy me a coffee', fr: 'Offrir un café', es: 'Invítame a un café', it: 'Offrimi un caffè' },
  'Feedback geben': { en: 'Give feedback', fr: 'Donner un avis', es: 'Enviar comentarios', it: 'Lascia un feedback' },
  'Zur Startseite': { en: 'Home', fr: 'Accueil', es: 'Inicio', it: 'Home' },
  'Hell/Dunkel umschalten': { en: 'Toggle light/dark', fr: 'Basculer clair/sombre', es: 'Cambiar claro/oscuro', it: 'Chiaro/scuro' },
  'Linksklick: drehen · Rechtsklick: verschieben · Scrollen: zoomen': {
    en: 'Left-click: rotate · Right-click: pan · Scroll: zoom',
    fr: 'Clic gauche : pivoter · Clic droit : déplacer · Molette : zoom',
    es: 'Clic izq.: rotar · Clic der.: mover · Rueda: zoom',
    it: 'Clic sx: ruota · Clic dx: sposta · Rotella: zoom' },
  'Ziehen: drehen · 2 Finger: verschieben/zoomen': {
    en: 'Drag: rotate · 2 fingers: pan/zoom',
    fr: 'Glisser : pivoter · 2 doigts : déplacer/zoom',
    es: 'Arrastrar: rotar · 2 dedos: mover/zoom',
    it: 'Trascina: ruota · 2 dita: sposta/zoom' },
  'berechne…': { en: 'computing…', fr: 'calcul…', es: 'calculando…', it: 'calcolo…' },
  'Höhe': { en: 'Height', fr: 'Hauteur', es: 'Altura', it: 'Altezza' },
  'Material': { en: 'Material', fr: 'Matière', es: 'Material', it: 'Materiale' },
  'Konnte nicht laden': { en: 'Could not load', fr: 'Échec du chargement', es: 'No se pudo cargar', it: 'Caricamento non riuscito' },
  'Die 3D-Bibliothek konnte nicht geladen werden (Internetverbindung nötig).': {
    en: 'The 3D library could not be loaded (internet connection required).',
    fr: 'La bibliothèque 3D n’a pas pu être chargée (connexion Internet requise).',
    es: 'No se pudo cargar la biblioteca 3D (se requiere conexión a Internet).',
    it: 'Impossibile caricare la libreria 3D (serve una connessione Internet).' },

  // ---- Startseite ----
  'Nabendeckel selbst gestalten – Maße, Logo, 3D-Vorschau, STL/3MF': {
    en: 'Design your own hub cap – dimensions, logo, 3D preview, STL/3MF',
    fr: 'Créez votre cache-moyeu – dimensions, logo, aperçu 3D, STL/3MF',
    es: 'Diseña tu tapa de buje – medidas, logo, vista 3D, STL/3MF',
    it: 'Progetta il tuo coprimozzo – misure, logo, anteprima 3D, STL/3MF' },
  'Neues Projekt': { en: 'New project', fr: 'Nouveau projet', es: 'Nuevo proyecto', it: 'Nuovo progetto' },
  'Leer mit Standardmaßen starten': {
    en: 'Start blank with default dimensions',
    fr: 'Démarrer vierge avec les dimensions par défaut',
    es: 'Empezar en blanco con medidas estándar',
    it: 'Inizia vuoto con le misure predefinite' },
  'Projekt öffnen': { en: 'Open project', fr: 'Ouvrir un projet', es: 'Abrir proyecto', it: 'Apri progetto' },
  '.wcd-Datei vom Rechner laden': {
    en: 'Load a .wcd file from your computer',
    fr: 'Charger un fichier .wcd depuis l’ordinateur',
    es: 'Cargar un archivo .wcd del equipo',
    it: 'Carica un file .wcd dal computer' },
  'Gespeicherte Projekte': { en: 'Saved projects', fr: 'Projets enregistrés', es: 'Proyectos guardados', it: 'Progetti salvati' },
  'in diesem Browser': { en: 'in this browser', fr: 'dans ce navigateur', es: 'en este navegador', it: 'in questo browser' },
  'Aktuelles Projekt weiter bearbeiten →': {
    en: 'Continue with current project →',
    fr: 'Continuer le projet en cours →',
    es: 'Seguir con el proyecto actual →',
    it: 'Continua il progetto attuale →' },
  'Noch keine gespeicherten Projekte. Speichere im Designer über „Projekt".': {
    en: 'No saved projects yet. Save one in the designer under “Project”.',
    fr: 'Aucun projet enregistré. Enregistrez-en un dans l’éditeur via « Projet ».',
    es: 'Aún no hay proyectos guardados. Guarda uno en el editor en «Proyecto».',
    it: 'Nessun progetto salvato. Salvane uno nell’editor tramite “Progetto”.' },
  'Öffnen': { en: 'Open', fr: 'Ouvrir', es: 'Abrir', it: 'Apri' },
  'Löschen': { en: 'Delete', fr: 'Supprimer', es: 'Eliminar', it: 'Elimina' },
  'Sprache': { en: 'Language', fr: 'Langue', es: 'Idioma', it: 'Lingua' },

  // ---- Projekt-Sektion ----
  'Projekt': { en: 'Project', fr: 'Projet', es: 'Proyecto', it: 'Progetto' },
  'Projektname': { en: 'Project name', fr: 'Nom du projet', es: 'Nombre del proyecto', it: 'Nome progetto' },
  'Speichern': { en: 'Save', fr: 'Enregistrer', es: 'Guardar', it: 'Salva' },
  'Als Datei': { en: 'As file', fr: 'Fichier', es: 'Como archivo', it: 'Come file' },
  'Neues Projekt ': { en: 'New project ', fr: 'Nouveau projet ', es: 'Nuevo proyecto ', it: 'Nuovo progetto ' },
  '„Als Datei" = .wcd zum Sichern/Teilen · „Speichern" legt es in diesem Browser ab.': {
    en: '“As file” = .wcd to back up/share · “Save” stores it in this browser.',
    fr: '« Fichier » = .wcd pour sauvegarder/partager · « Enregistrer » le stocke dans ce navigateur.',
    es: '«Como archivo» = .wcd para guardar/compartir · «Guardar» lo almacena en este navegador.',
    it: '“Come file” = .wcd per salvare/condividere · “Salva” lo memorizza in questo browser.' },
  'Gespeichert ✓': { en: 'Saved ✓', fr: 'Enregistré ✓', es: 'Guardado ✓', it: 'Salvato ✓' },
  '✓ Projekt gespeichert: ': { en: '✓ Project saved: ', fr: '✓ Projet enregistré : ', es: '✓ Proyecto guardado: ', it: '✓ Progetto salvato: ' },
  '✓ Projekt geöffnet: ': { en: '✓ Project opened: ', fr: '✓ Projet ouvert : ', es: '✓ Proyecto abierto: ', it: '✓ Progetto aperto: ' },
  '⚠ Datei konnte nicht geöffnet werden': { en: '⚠ Could not open file', fr: '⚠ Impossible d’ouvrir le fichier', es: '⚠ No se pudo abrir el archivo', it: '⚠ Impossibile aprire il file' },
  '⚠ Projekt beschädigt': { en: '⚠ Project corrupted', fr: '⚠ Projet corrompu', es: '⚠ Proyecto dañado', it: '⚠ Progetto danneggiato' },

  // ---- Vorlagen ----
  'Vorlagen': { en: 'Templates', fr: 'Modèles', es: 'Plantillas', it: 'Modelli' },
  'Hersteller': { en: 'Manufacturer', fr: 'Constructeur', es: 'Fabricante', it: 'Produttore' },
  'Größe / Modell': { en: 'Size / model', fr: 'Taille / modèle', es: 'Tamaño / modelo', it: 'Misura / modello' },
  'Richtwerte – bitte am Rad nachmessen.': {
    en: 'Reference values – please measure on the wheel.',
    fr: 'Valeurs indicatives – mesurez sur la roue.',
    es: 'Valores orientativos – mide en la rueda.',
    it: 'Valori indicativi – misura sulla ruota.' },
  'Eigene Maße speichern': { en: 'Save your own dimensions', fr: 'Enregistrer vos dimensions', es: 'Guardar tus medidas', it: 'Salva le tue misure' },
  'z. B. Meine Felge 18 Zoll': { en: 'e.g. My 18-inch wheel', fr: 'p. ex. Ma jante 18 pouces', es: 'p. ej. Mi llanta de 18"', it: 'es. Il mio cerchio da 18"' },
  'Noch keine eigenen Vorlagen.': { en: 'No templates of your own yet.', fr: 'Aucun modèle personnel.', es: 'Aún no tienes plantillas.', it: 'Nessun modello personale.' },
  'Anwenden': { en: 'Apply', fr: 'Appliquer', es: 'Aplicar', it: 'Applica' },
  'Als Vorlage vorschlagen': { en: 'Suggest as template', fr: 'Proposer comme modèle', es: 'Proponer como plantilla', it: 'Proponi come modello' },
  'Hilft, die Bibliothek für alle zu füllen.': {
    en: 'Helps fill the library for everyone.',
    fr: 'Aide à enrichir la bibliothèque pour tous.',
    es: 'Ayuda a llenar la biblioteca para todos.',
    it: 'Aiuta a riempire la libreria per tutti.' },
  'Allgemeine Größen': { en: 'Common sizes', fr: 'Tailles courantes', es: 'Tamaños comunes', it: 'Misure comuni' },
  'Klein · 54 mm': { en: 'Small · 54 mm', fr: 'Petit · 54 mm', es: 'Pequeño · 54 mm', it: 'Piccolo · 54 mm' },
  'Standard · 60 mm': { en: 'Standard · 60 mm', fr: 'Standard · 60 mm', es: 'Estándar · 60 mm', it: 'Standard · 60 mm' },
  'Mittel · 65 mm': { en: 'Medium · 65 mm', fr: 'Moyen · 65 mm', es: 'Medio · 65 mm', it: 'Medio · 65 mm' },
  'Groß · 68 mm': { en: 'Large · 68 mm', fr: 'Grand · 68 mm', es: 'Grande · 68 mm', it: 'Grande · 68 mm' },
  'XL · 75 mm': { en: 'XL · 75 mm', fr: 'XL · 75 mm', es: 'XL · 75 mm', it: 'XL · 75 mm' },
  'Autohersteller': { en: 'Car makers', fr: 'Constructeurs auto', es: 'Fabricantes de coches', it: 'Case automobilistiche' },
  'Felgenhersteller': { en: 'Wheel makers', fr: 'Fabricants de jantes', es: 'Fabricantes de llantas', it: 'Produttori di cerchi' },
  'Community': { en: 'Community', fr: 'Communauté', es: 'Comunidad', it: 'Community' },
  'Sende Vorschlag …': { en: 'Sending suggestion …', fr: 'Envoi de la proposition …', es: 'Enviando propuesta …', it: 'Invio proposta …' },
  'Danke! Vorschlag eingereicht – wird nach Prüfung aufgenommen.': {
    en: 'Thanks! Suggestion submitted – added after review.',
    fr: 'Merci ! Proposition envoyée – ajoutée après vérification.',
    es: '¡Gracias! Propuesta enviada – se añadirá tras revisión.',
    it: 'Grazie! Proposta inviata – aggiunta dopo la verifica.' },
  'Konnte nicht senden: ': { en: 'Could not send: ', fr: 'Échec de l’envoi : ', es: 'No se pudo enviar: ', it: 'Invio non riuscito: ' },

  // ---- Bewertung ----
  'Passt diese Vorlage?': { en: 'Does this template fit?', fr: 'Ce modèle convient-il ?', es: '¿Encaja esta plantilla?', it: 'Questo modello va bene?' },
  'Noch keine Bewertung': { en: 'No ratings yet', fr: 'Pas encore d’avis', es: 'Sin valoraciones', it: 'Nessuna valutazione' },
  'Danke! ✓': { en: 'Thanks! ✓', fr: 'Merci ! ✓', es: '¡Gracias! ✓', it: 'Grazie! ✓' },
  'Bewerten aktuell nicht möglich': { en: 'Rating not available right now', fr: 'Évaluation indisponible', es: 'Valoración no disponible', it: 'Valutazione non disponibile' },

  // ---- Logo-Quelle ----
  'Bibliothek': { en: 'Library', fr: 'Bibliothèque', es: 'Biblioteca', it: 'Libreria' },
  'Eigenes SVG hochladen': { en: 'Upload your own SVG', fr: 'Importer votre SVG', es: 'Subir tu propio SVG', it: 'Carica il tuo SVG' },
  'Bibliotheks-Logo konnte nicht geladen werden.': {
    en: 'Library logo could not be loaded.',
    fr: 'Impossible de charger le logo de la bibliothèque.',
    es: 'No se pudo cargar el logo de la biblioteca.',
    it: 'Impossibile caricare il logo della libreria.' },

  // ---- Download-Popup ----
  'Dein Nabendeckel wird geladen …': { en: 'Your hub cap is downloading …', fr: 'Votre cache-moyeu se télécharge …', es: 'Descargando tu tapa de buje …', it: 'Download del coprimozzo …' },
  'Weiter zum Designen': { en: 'Back to designing', fr: 'Continuer la création', es: 'Seguir diseñando', it: 'Torna a progettare' },
  'Wenn dir WheelCapDesigner gefällt, freue ich mich riesig über einen Kaffee. Danke! 🙌': {
    en: 'If you like WheelCapDesigner, a coffee would make my day. Thanks! 🙌',
    fr: 'Si vous aimez WheelCapDesigner, un café me ferait très plaisir. Merci ! 🙌',
    es: 'Si te gusta WheelCapDesigner, un café me haría muy feliz. ¡Gracias! 🙌',
    it: 'Se ti piace WheelCapDesigner, un caffè mi farebbe felice. Grazie! 🙌' },

  // ---- Export ----
  'Export': { en: 'Export', fr: 'Export', es: 'Exportar', it: 'Esporta' },
  '3MF · mit Farben (Bambu Studio)': {
    en: '3MF · with colors (Bambu Studio)',
    fr: '3MF · avec couleurs (Bambu Studio)',
    es: '3MF · con colores (Bambu Studio)',
    it: '3MF · con colori (Bambu Studio)' },
  'Deckel': { en: 'Cap', fr: 'Cache', es: 'Tapa', it: 'Coprimozzo' },
  'Eine Datei, beide Teile korrekt positioniert. <b>3MF</b> enthält die Farben – Bambu Studio erkennt Deckel + Logo als getrennte Objekte. STL ist farblos (Teile lassen sich im Slicer trennen).': {
    en: 'One file, both parts correctly positioned. <b>3MF</b> carries the colors – Bambu Studio detects cap + logo as separate objects. STL is colorless (parts can be split in the slicer).',
    fr: 'Un fichier, les deux pièces bien positionnées. Le <b>3MF</b> contient les couleurs – Bambu Studio détecte le cache et le logo comme objets séparés. Le STL est sans couleur (pièces séparables dans le slicer).',
    es: 'Un archivo, ambas piezas bien posicionadas. El <b>3MF</b> lleva los colores – Bambu Studio detecta tapa y logo como objetos separados. El STL no tiene color (las piezas se pueden separar en el slicer).',
    it: 'Un file, entrambe le parti posizionate correttamente. Il <b>3MF</b> contiene i colori – Bambu Studio riconosce coprimozzo e logo come oggetti separati. L’STL è senza colore (le parti si possono separare nello slicer).' },

  // ---- diverse ----
  'heruntergeladen': { en: 'downloaded', fr: 'téléchargé', es: 'descargado', it: 'scaricato' },
  'Fehler': { en: 'Error', fr: 'Erreur', es: 'Error', it: 'Errore' },
  'Vorlage': { en: 'Template', fr: 'Modèle', es: 'Plantilla', it: 'Modello' },
  '— auswählen —': { en: '— select —', fr: '— choisir —', es: '— elegir —', it: '— scegli —' },
  'Maße kopiert – E-Mail-Fenster geöffnet.': {
    en: 'Dimensions copied – email window opened.',
    fr: 'Dimensions copiées – fenêtre e-mail ouverte.',
    es: 'Medidas copiadas – ventana de correo abierta.',
    it: 'Misure copiate – finestra email aperta.' },

  // ---- Feedback ----
  'Feedback zum Designer': { en: 'Feedback on the designer', fr: 'Avis sur l’éditeur', es: 'Comentarios sobre el editor', it: 'Feedback sull’editor' },
  'Wie gefällt dir WheelCapDesigner? Über Sterne und ein paar Worte freue ich mich sehr.': {
    en: 'How do you like WheelCapDesigner? A few stars and words would mean a lot.',
    fr: 'Comment trouvez-vous WheelCapDesigner ? Quelques étoiles et un mot me feraient plaisir.',
    es: '¿Qué te parece WheelCapDesigner? Unas estrellas y unas palabras me alegrarían.',
    it: 'Ti piace WheelCapDesigner? Qualche stella e due parole mi farebbero piacere.' },
  'Was läuft gut, was fehlt dir?': { en: 'What works well, what’s missing?', fr: 'Ce qui va, ce qui manque ?', es: '¿Qué va bien, qué falta?', it: 'Cosa funziona, cosa manca?' },
  'E-Mail (optional, für Rückfragen)': { en: 'Email (optional, for follow-up)', fr: 'E-mail (facultatif, pour vous recontacter)', es: 'Correo (opcional, para respuestas)', it: 'Email (facoltativa, per ricontattarti)' },
  'Feedback senden': { en: 'Send feedback', fr: 'Envoyer l’avis', es: 'Enviar comentarios', it: 'Invia feedback' },
  'Bitte Sterne oder eine Nachricht angeben.': { en: 'Please give stars or a message.', fr: 'Indiquez des étoiles ou un message.', es: 'Indica estrellas o un mensaje.', it: 'Indica stelle o un messaggio.' },
  'Feedback ist gerade nicht verfügbar.': { en: 'Feedback is not available right now.', fr: 'L’avis n’est pas disponible pour le moment.', es: 'Los comentarios no están disponibles ahora.', it: 'Il feedback non è disponibile ora.' },
  'Sende …': { en: 'Sending …', fr: 'Envoi …', es: 'Enviando …', it: 'Invio …' },
  'Danke für dein Feedback! 🙌': { en: 'Thanks for your feedback! 🙌', fr: 'Merci pour votre avis ! 🙌', es: '¡Gracias por tus comentarios! 🙌', it: 'Grazie per il feedback! 🙌' },

  // ---- Warnungen ----
  'Außen-Ø muss größer als Montage-Ø sein.': { en: 'Outer Ø must be larger than mounting Ø.', fr: 'Le Ø extérieur doit dépasser le Ø de montage.', es: 'El Ø exterior debe ser mayor que el Ø de montaje.', it: 'Il Ø esterno deve superare il Ø di montaggio.' },
  'Zu viele/zu breite Clips.': { en: 'Too many / too wide clips.', fr: 'Clips trop nombreux/larges.', es: 'Demasiados clips o muy anchos.', it: 'Troppi clip o troppo larghi.' },
  'Klemmdicke + Einführschräge > Clip-Länge.': { en: 'Clamp thickness + lead-in > clip length.', fr: 'Épaisseur de serrage + rampe > longueur du clip.', es: 'Grosor de sujeción + rampa > longitud del clip.', it: 'Spessore di serraggio + rampa > lunghezza del clip.' },

  // ==== config.js: Gruppen ====
  'Grundmaße': { en: 'Basic dimensions', fr: 'Dimensions de base', es: 'Medidas básicas', it: 'Misure di base' },
  'Rand & Profil': { en: 'Rim & profile', fr: 'Bord et profil', es: 'Borde y perfil', it: 'Bordo e profilo' },
  'Farbe': { en: 'Color', fr: 'Couleur', es: 'Color', it: 'Colore' },
  'Schnappnasen': { en: 'Snap clips', fr: 'Clips', es: 'Clips a presión', it: 'Clip a scatto' },
  'Logo': { en: 'Logo', fr: 'Logo', es: 'Logo', it: 'Logo' },

  // ==== config.js: Labels ====
  'Außen-Ø': { en: 'Outer Ø', fr: 'Ø extérieur', es: 'Ø exterior', it: 'Ø esterno' },
  'Montage-Ø': { en: 'Mounting Ø', fr: 'Ø de montage', es: 'Ø de montaje', it: 'Ø di montaggio' },
  'Höhe / Tiefe': { en: 'Height / depth', fr: 'Hauteur / profondeur', es: 'Altura / profundidad', it: 'Altezza / profondità' },
  'Deckplatte': { en: 'Top plate', fr: 'Plaque supérieure', es: 'Placa superior', it: 'Piastra superiore' },
  'Profil': { en: 'Profile', fr: 'Profil', es: 'Perfil', it: 'Profilo' },
  'Ecken': { en: 'Corners', fr: 'Côtés', es: 'Lados', it: 'Lati' },
  'Polygon-Größe': { en: 'Polygon size', fr: 'Taille du polygone', es: 'Tamaño del polígono', it: 'Dimensione poligono' },
  'Plattform-Ø': { en: 'Platform Ø', fr: 'Ø plateforme', es: 'Ø plataforma', it: 'Ø piattaforma' },
  'Plattform': { en: 'Platform', fr: 'Plateforme', es: 'Plataforma', it: 'Piattaforma' },
  'Vertiefung-Tiefe': { en: 'Recess depth', fr: 'Profondeur du creux', es: 'Profundidad del hueco', it: 'Profondità incavo' },
  'Abrundung': { en: 'Rounding', fr: 'Arrondi', es: 'Redondeo', it: 'Arrotondamento' },
  'Fase oben': { en: 'Top chamfer', fr: 'Chanfrein haut', es: 'Bisel superior', it: 'Smusso superiore' },
  'Deckel-Farbe': { en: 'Cap color', fr: 'Couleur du cache', es: 'Color de la tapa', it: 'Colore del coprimozzo' },
  'Anzahl Clips': { en: 'Clip count', fr: 'Nombre de clips', es: 'Número de clips', it: 'Numero di clip' },
  'Clip-Dicke': { en: 'Clip thickness', fr: 'Épaisseur du clip', es: 'Grosor del clip', it: 'Spessore clip' },
  'Clip-Breite': { en: 'Clip width', fr: 'Largeur du clip', es: 'Ancho del clip', it: 'Larghezza clip' },
  'Rastnase': { en: 'Barb', fr: 'Ergot', es: 'Lengüeta', it: 'Dente' },
  'Einführschräge': { en: 'Lead-in ramp', fr: 'Rampe d’insertion', es: 'Rampa de entrada', it: 'Rampa d’inserimento' },
  'Klemmdicke': { en: 'Clamp thickness', fr: 'Épaisseur de serrage', es: 'Grosor de sujeción', it: 'Spessore di serraggio' },
  'Toleranz': { en: 'Tolerance', fr: 'Tolérance', es: 'Tolerancia', it: 'Tolleranza' },
  'Quelle': { en: 'Source', fr: 'Source', es: 'Origen', it: 'Sorgente' },
  'Form': { en: 'Shape', fr: 'Forme', es: 'Forma', it: 'Forma' },
  'Text': { en: 'Text', fr: 'Texte', es: 'Texto', it: 'Testo' },
  'Stil': { en: 'Style', fr: 'Style', es: 'Estilo', it: 'Stile' },
  'Logo-Farbe': { en: 'Logo color', fr: 'Couleur du logo', es: 'Color del logo', it: 'Colore del logo' },
  'Größe': { en: 'Size', fr: 'Taille', es: 'Tamaño', it: 'Dimensione' },
  'Outline-Breite': { en: 'Outline width', fr: 'Largeur du contour', es: 'Ancho del contorno', it: 'Larghezza contorno' },
  'Abstand vom Rand': { en: 'Distance from edge', fr: 'Distance du bord', es: 'Distancia al borde', it: 'Distanza dal bordo' },
  'Position X': { en: 'Position X', fr: 'Position X', es: 'Posición X', it: 'Posizione X' },
  'Position Y': { en: 'Position Y', fr: 'Position Y', es: 'Posición Y', it: 'Posizione Y' },
  'Drehung': { en: 'Rotation', fr: 'Rotation', es: 'Rotación', it: 'Rotazione' },
  'Vertiefung': { en: 'Recess', fr: 'Creux', es: 'Hueco', it: 'Incavo' },
  'Vertiefung-Ø': { en: 'Recess Ø', fr: 'Ø du creux', es: 'Ø del hueco', it: 'Ø incavo' },
  // 'Höhe' bereits oben definiert (Badge) und passt auch hier.

  // ==== config.js: Select-Optionen ====
  'Flach': { en: 'Flat', fr: 'Plat', es: 'Plano', it: 'Piatto' },
  'CenterLock (Mutter)': { en: 'CenterLock (nut)', fr: 'CenterLock (écrou)', es: 'CenterLock (tuerca)', it: 'CenterLock (dado)' },
  'Kein Logo': { en: 'No logo', fr: 'Aucun logo', es: 'Sin logo', it: 'Nessun logo' },
  'Eigenes SVG': { en: 'Custom SVG', fr: 'SVG personnalisé', es: 'SVG propio', it: 'SVG personale' },
  'Stern': { en: 'Star', fr: 'Étoile', es: 'Estrella', it: 'Stella' },
  'Blitz': { en: 'Bolt', fr: 'Éclair', es: 'Rayo', it: 'Fulmine' },
  'Ringe': { en: 'Rings', fr: 'Anneaux', es: 'Anillos', it: 'Anelli' },
  'Sechseck': { en: 'Hexagon', fr: 'Hexagone', es: 'Hexágono', it: 'Esagono' },
  'Kreis-Ring': { en: 'Circle ring', fr: 'Anneau', es: 'Anillo circular', it: 'Anello' },
  'Erhaben': { en: 'Raised', fr: 'En relief', es: 'En relieve', it: 'In rilievo' },
  'Graviert': { en: 'Engraved', fr: 'Gravé', es: 'Grabado', it: 'Inciso' },
  'Plan (bündig, 2-teilig)': { en: 'Flush (2-part inlay)', fr: 'Affleurant (2 parties)', es: 'Enrasado (2 piezas)', it: 'A filo (2 parti)' },
  'Bündig (keine extra Fläche)': { en: 'Flush (no extra face)', fr: 'Affleurant (sans surface)', es: 'Enrasado (sin cara extra)', it: 'A filo (senza superficie)' },
  'Erhöht': { en: 'Raised', fr: 'Surélevé', es: 'Elevado', it: 'Rialzato' },
  'Vertieft': { en: 'Recessed', fr: 'En creux', es: 'Hundido', it: 'Incassato' },

  // ==== config.js: Hints ====
  'Sichtbarer Rand, liegt auf dem Rad auf': { en: 'Visible rim, rests on the wheel', fr: 'Bord visible, repose sur la roue', es: 'Borde visible, apoya en la rueda', it: 'Bordo visibile, appoggia sulla ruota' },
  'Durchmesser der Radöffnung (Klemm-Ø)': { en: 'Wheel opening diameter (clamp Ø)', fr: 'Diamètre de l’ouverture (Ø de serrage)', es: 'Diámetro de la abertura (Ø de sujeción)', it: 'Diametro dell’apertura (Ø di serraggio)' },
  'Anzahl Ecken der Mutter (6 = Sechskant)': { en: 'Number of nut corners (6 = hex)', fr: 'Nombre de côtés de l’écrou (6 = six pans)', es: 'Número de lados de la tuerca (6 = hexágono)', it: 'Numero di lati del dado (6 = esagono)' },
  'Ø der Mutter (über Ecken)': { en: 'Nut Ø (across corners)', fr: 'Ø de l’écrou (sur les pointes)', es: 'Ø de la tuerca (entre puntas)', it: 'Ø del dado (sulle punte)' },
  'Höhe der Erhöhung': { en: 'Height of the boss', fr: 'Hauteur de la surélévation', es: 'Altura del realce', it: 'Altezza del rialzo' },
  'Runde Fläche oben fürs Logo': { en: 'Round top area for the logo', fr: 'Surface ronde en haut pour le logo', es: 'Área redonda superior para el logo', it: 'Area rotonda in alto per il logo' },
  'Lage der Logo-Fläche auf der Mutter': { en: 'Position of the logo face on the nut', fr: 'Position de la surface du logo sur l’écrou', es: 'Posición de la cara del logo en la tuerca', it: 'Posizione della superficie del logo sul dado' },
  'Kanten oben abschrägen (0 = scharf)': { en: 'Chamfer top edges (0 = sharp)', fr: 'Chanfreiner les arêtes (0 = vif)', es: 'Biselar los bordes (0 = vivo)', it: 'Smussa gli spigoli (0 = vivo)' },
  'Haltekraft': { en: 'Holding force', fr: 'Force de maintien', es: 'Fuerza de sujeción', it: 'Forza di tenuta' },
  'Materialstärke des Rades': { en: 'Wheel material thickness', fr: 'Épaisseur du matériau de la roue', es: 'Grosor del material de la rueda', it: 'Spessore del materiale della ruota' },
  'Bei zu strammem Sitz erhöhen': { en: 'Increase if the fit is too tight', fr: 'Augmenter si l’ajustement est trop serré', es: 'Auméntalo si queda muy ajustado', it: 'Aumenta se troppo stretto' },
  'Ring am Deckelrand · 0 = aus': { en: 'Ring at the cap edge · 0 = off', fr: 'Anneau au bord · 0 = désactivé', es: 'Anillo en el borde · 0 = apagado', it: 'Anello sul bordo · 0 = off' },
  'Plan: Einlage-Tiefe (1 mm empfohlen)': { en: 'Flush: inlay depth (1 mm recommended)', fr: 'Affleurant : profondeur d’incrustation (1 mm conseillé)', es: 'Enrasado: profundidad del inserto (1 mm)', it: 'A filo: profondità dell’inserto (1 mm)' },
  'Eingelassener „Teller" unter dem Logo': { en: 'Recessed “plate” under the logo', fr: 'Plateau en creux sous le logo', es: 'Plato hundido bajo el logo', it: 'Piattello incassato sotto il logo' },
};

const VALID = new Set(LANGS.map(l => l.code));

export function getLang() {
  let l = null;
  try { l = localStorage.getItem('wcd_lang'); } catch (_) {}
  if (l && VALID.has(l)) return l;
  const nav = (navigator.language || 'de').slice(0, 2).toLowerCase();
  return VALID.has(nav) ? nav : 'de';
}
export function setLang(code) {
  if (!VALID.has(code)) return;
  try { localStorage.setItem('wcd_lang', code); } catch (_) {}
}
let LANG = getLang();
export function applyHtmlLang() { try { document.documentElement.lang = LANG; } catch (_) {} }

export function t(s) {
  if (s == null) return s;
  if (LANG === 'de') return s;
  const e = DICT[s];
  return (e && e[LANG]) || s;
}
