// Mehrsprachigkeit. Deutsch ist die Basis (Quelltext = Schlüssel).
// t(deutscherText) liefert die Übersetzung der aktiven Sprache (oder Deutsch als Fallback).

export const LANGS = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
  { code: 'pl', name: 'Polski' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
];

export const FLAGS = {
  de: '<svg viewBox="0 0 22 15"><rect width="22" height="5" fill="#000"/><rect y="5" width="22" height="5" fill="#DD0000"/><rect y="10" width="22" height="5" fill="#FFCE00"/></svg>',
  en: '<svg viewBox="0 0 22 15"><rect width="22" height="15" fill="#012169"/><path d="M0,0 L22,15 M22,0 L0,15" stroke="#fff" stroke-width="3"/><path d="M0,0 L22,15 M22,0 L0,15" stroke="#C8102E" stroke-width="1.5"/><path d="M11,0 V15 M0,7.5 H22" stroke="#fff" stroke-width="4"/><path d="M11,0 V15 M0,7.5 H22" stroke="#C8102E" stroke-width="2.2"/></svg>',
  fr: '<svg viewBox="0 0 22 15"><rect width="22" height="15" fill="#fff"/><rect width="7.34" height="15" fill="#0055A4"/><rect x="14.66" width="7.34" height="15" fill="#EF4135"/></svg>',
  es: '<svg viewBox="0 0 22 15"><rect width="22" height="15" fill="#AA151B"/><rect y="3.75" width="22" height="7.5" fill="#F1BF00"/></svg>',
  it: '<svg viewBox="0 0 22 15"><rect width="22" height="15" fill="#fff"/><rect width="7.34" height="15" fill="#009246"/><rect x="14.66" width="7.34" height="15" fill="#CE2B37"/></svg>',
  pl: '<svg viewBox="0 0 22 15"><rect width="22" height="7.5" fill="#fff"/><rect y="7.5" width="22" height="7.5" fill="#DC143C"/></svg>',
  ru: '<svg viewBox="0 0 22 15"><rect width="22" height="5" fill="#fff"/><rect y="5" width="22" height="5" fill="#0039A6"/><rect y="10" width="22" height="5" fill="#D52B1E"/></svg>',
  zh: '<svg viewBox="0 0 22 15"><rect width="22" height="15" fill="#DE2910"/><g fill="#FFDE00"><polygon points="4,1.6 4.588,3.391 6.473,3.397 4.951,4.509 5.528,6.303 4,5.2 2.472,6.303 3.049,4.509 1.527,3.397 3.412,3.391"/><circle cx="8" cy="1.8" r="0.5"/><circle cx="9.4" cy="3.1" r="0.5"/><circle cx="9.4" cy="4.9" r="0.5"/><circle cx="8" cy="6.2" r="0.5"/></g></svg>',
  ja: '<svg viewBox="0 0 22 15"><rect width="22" height="15" fill="#fff"/><circle cx="11" cy="7.5" r="4.4" fill="#BC002D"/></svg>',
};

const DICT = {
  // ---- Topbar / global ----
  'Maße einstellen · Logo wählen · als STL / 3MF herunterladen': {
    en: 'Set dimensions · pick a logo · download as STL / 3MF',
    fr: 'Régler les dimensions · choisir un logo · télécharger en STL / 3MF',
    es: 'Ajusta medidas · elige un logo · descarga en STL / 3MF',
    it: 'Imposta le misure · scegli un logo · scarica in STL / 3MF',
    pl: 'Ustaw wymiary · wybierz logo · pobierz jako STL / 3MF',
    ru: 'Задайте размеры · выберите логотип · скачайте как STL / 3MF',
    zh: '设置尺寸 · 选择徽标 · 下载为 STL / 3MF',
    ja: '寸法を設定 · ロゴを選択 · STL / 3MF でダウンロード' },
  'Standard': { en: 'Standard', fr: 'Standard', es: 'Estándar', it: 'Standard', pl: 'Standard', ru: 'Стандарт', zh: '标准', ja: '標準' },
  'Experte': { en: 'Expert', fr: 'Expert', es: 'Experto', it: 'Esperto', pl: 'Ekspert', ru: 'Эксперт', zh: '专家', ja: 'エキスパート' },
  'STL herunterladen': { en: 'Download STL', fr: 'Télécharger STL', es: 'Descargar STL', it: 'Scarica STL', pl: 'Pobierz STL', ru: 'Скачать STL', zh: '下载 STL', ja: 'STL をダウンロード' },
  'Kaffee spendieren': { en: 'Buy me a coffee', fr: 'Offrir un café', es: 'Invítame a un café', it: 'Offrimi un caffè', pl: 'Postaw kawę', ru: 'Купить кофе', zh: '请我喝咖啡', ja: 'コーヒーをおごる' },
  'Feedback geben': { en: 'Give feedback', fr: 'Donner un avis', es: 'Enviar comentarios', it: 'Lascia un feedback', pl: 'Zostaw opinię', ru: 'Оставить отзыв', zh: '提供反馈', ja: 'フィードバック' },
  'Zur Startseite': { en: 'Home', fr: 'Accueil', es: 'Inicio', it: 'Home', pl: 'Strona główna', ru: 'На главную', zh: '首页', ja: 'ホーム' },
  'Hell/Dunkel umschalten': { en: 'Toggle light/dark', fr: 'Basculer clair/sombre', es: 'Cambiar claro/oscuro', it: 'Chiaro/scuro', pl: 'Jasny/ciemny motyw', ru: 'Светлая/тёмная тема', zh: '切换明暗', ja: 'ライト/ダーク切替' },
  'Linksklick: drehen · Rechtsklick: verschieben · Scrollen: zoomen': {
    en: 'Left-click: rotate · Right-click: pan · Scroll: zoom',
    fr: 'Clic gauche : pivoter · Clic droit : déplacer · Molette : zoom',
    es: 'Clic izq.: rotar · Clic der.: mover · Rueda: zoom',
    it: 'Clic sx: ruota · Clic dx: sposta · Rotella: zoom',
    pl: 'LPM: obrót · PPM: przesuwanie · Kółko: powiększenie',
    ru: 'ЛКМ: вращать · ПКМ: перемещать · Колесо: масштаб',
    zh: '左键：旋转 · 右键：平移 · 滚轮：缩放',
    ja: '左クリック：回転 · 右クリック：移動 · スクロール：ズーム' },
  'Ziehen: drehen · 2 Finger: verschieben/zoomen': {
    en: 'Drag: rotate · 2 fingers: pan/zoom',
    fr: 'Glisser : pivoter · 2 doigts : déplacer/zoom',
    es: 'Arrastrar: rotar · 2 dedos: mover/zoom',
    it: 'Trascina: ruota · 2 dita: sposta/zoom',
    pl: 'Przeciąganie: obrót · 2 palce: przesuwanie/zoom',
    ru: 'Перетаскивание: вращать · 2 пальца: перемещать/масштаб',
    zh: '拖动：旋转 · 双指：平移/缩放',
    ja: 'ドラッグ：回転 · 2本指：移動/ズーム' },
  'berechne…': { en: 'computing…', fr: 'calcul…', es: 'calculando…', it: 'calcolo…', pl: 'obliczanie…', ru: 'вычисление…', zh: '计算中…', ja: '計算中…' },
  'Höhe': { en: 'Height', fr: 'Hauteur', es: 'Altura', it: 'Altezza', pl: 'Wysokość', ru: 'Высота', zh: '高度', ja: '高さ' },
  'Material': { en: 'Material', fr: 'Matière', es: 'Material', it: 'Materiale', pl: 'Materiał', ru: 'Материал', zh: '材料', ja: '材料' },
  'Konnte nicht laden': { en: 'Could not load', fr: 'Échec du chargement', es: 'No se pudo cargar', it: 'Caricamento non riuscito', pl: 'Nie udało się załadować', ru: 'Не удалось загрузить', zh: '加载失败', ja: '読み込めませんでした' },
  'Die 3D-Bibliothek konnte nicht geladen werden (Internetverbindung nötig).': {
    en: 'The 3D library could not be loaded (internet connection required).',
    fr: 'La bibliothèque 3D n’a pas pu être chargée (connexion Internet requise).',
    es: 'No se pudo cargar la biblioteca 3D (se requiere conexión a Internet).',
    it: 'Impossibile caricare la libreria 3D (serve una connessione Internet).',
    pl: 'Nie udało się załadować biblioteki 3D (wymagane połączenie z internetem).',
    ru: 'Не удалось загрузить 3D-библиотеку (требуется интернет-соединение).',
    zh: '无法加载 3D 库（需要网络连接）。',
    ja: '3D ライブラリを読み込めませんでした（インターネット接続が必要です）。' },

  // ---- Startseite ----
  'Nabendeckel selbst gestalten – Maße, Logo, 3D-Vorschau, STL/3MF': {
    en: 'Design your own hub cap – dimensions, logo, 3D preview, STL/3MF',
    fr: 'Créez votre cache-moyeu – dimensions, logo, aperçu 3D, STL/3MF',
    es: 'Diseña tu tapa de buje – medidas, logo, vista 3D, STL/3MF',
    it: 'Progetta il tuo coprimozzo – misure, logo, anteprima 3D, STL/3MF',
    pl: 'Zaprojektuj własny kołpak piasty – wymiary, logo, podgląd 3D, STL/3MF',
    ru: 'Создайте колпачок ступицы сами — размеры, логотип, 3D-просмотр, STL/3MF',
    zh: '自己设计轮毂盖 — 尺寸、徽标、3D 预览、STL/3MF',
    ja: 'ホイールセンターキャップを自作 — 寸法・ロゴ・3Dプレビュー・STL/3MF' },
  'Neues Projekt': { en: 'New project', fr: 'Nouveau projet', es: 'Nuevo proyecto', it: 'Nuovo progetto', pl: 'Nowy projekt', ru: 'Новый проект', zh: '新建项目', ja: '新規プロジェクト' },
  'Leer mit Standardmaßen starten': {
    en: 'Start blank with default dimensions',
    fr: 'Démarrer vierge avec les dimensions par défaut',
    es: 'Empezar en blanco con medidas estándar',
    it: 'Inizia vuoto con le misure predefinite',
    pl: 'Zacznij od zera z domyślnymi wymiarami',
    ru: 'Начать с нуля со стандартными размерами',
    zh: '以标准尺寸从空白开始',
    ja: '標準寸法で新規に開始' },
  'Projekt öffnen': { en: 'Open project', fr: 'Ouvrir un projet', es: 'Abrir proyecto', it: 'Apri progetto', pl: 'Otwórz projekt', ru: 'Открыть проект', zh: '打开项目', ja: 'プロジェクトを開く' },
  '.wcd-Datei vom Rechner laden': {
    en: 'Load a .wcd file from your computer',
    fr: 'Charger un fichier .wcd depuis l’ordinateur',
    es: 'Cargar un archivo .wcd del equipo',
    it: 'Carica un file .wcd dal computer',
    pl: 'Wczytaj plik .wcd z komputera',
    ru: 'Загрузить файл .wcd с компьютера',
    zh: '从电脑加载 .wcd 文件',
    ja: 'PC から .wcd ファイルを読み込む' },
  'Gespeicherte Projekte': { en: 'Saved projects', fr: 'Projets enregistrés', es: 'Proyectos guardados', it: 'Progetti salvati', pl: 'Zapisane projekty', ru: 'Сохранённые проекты', zh: '已保存的项目', ja: '保存したプロジェクト' },
  'in diesem Browser': { en: 'in this browser', fr: 'dans ce navigateur', es: 'en este navegador', it: 'in questo browser', pl: 'w tej przeglądarce', ru: 'в этом браузере', zh: '在此浏览器中', ja: 'このブラウザ内' },
  'Aktuelles Projekt weiter bearbeiten →': {
    en: 'Continue with current project →',
    fr: 'Continuer le projet en cours →',
    es: 'Seguir con el proyecto actual →',
    it: 'Continua il progetto attuale →',
    pl: 'Kontynuuj bieżący projekt →',
    ru: 'Продолжить текущий проект →',
    zh: '继续当前项目 →',
    ja: '現在のプロジェクトを続ける →' },
  'Noch keine gespeicherten Projekte. Speichere im Designer über „Projekt".': {
    en: 'No saved projects yet. Save one in the designer under “Project”.',
    fr: 'Aucun projet enregistré. Enregistrez-en un dans l’éditeur via « Projet ».',
    es: 'Aún no hay proyectos guardados. Guarda uno en el editor en «Proyecto».',
    it: 'Nessun progetto salvato. Salvane uno nell’editor tramite “Progetto”.',
    pl: 'Brak zapisanych projektów. Zapisz jeden w edytorze przez „Projekt".',
    ru: 'Пока нет сохранённых проектов. Сохраните в редакторе через «Проект».',
    zh: '还没有已保存的项目。请在设计器中通过“项目”保存。',
    ja: '保存済みプロジェクトはまだありません。エディターの「プロジェクト」から保存してください。' },
  'Öffnen': { en: 'Open', fr: 'Ouvrir', es: 'Abrir', it: 'Apri', pl: 'Otwórz', ru: 'Открыть', zh: '打开', ja: '開く' },
  'Löschen': { en: 'Delete', fr: 'Supprimer', es: 'Eliminar', it: 'Elimina', pl: 'Usuń', ru: 'Удалить', zh: '删除', ja: '削除' },
  'Sprache': { en: 'Language', fr: 'Langue', es: 'Idioma', it: 'Lingua', pl: 'Język', ru: 'Язык', zh: '语言', ja: '言語' },

  // ---- Projekt-Sektion ----
  'Projekt': { en: 'Project', fr: 'Projet', es: 'Proyecto', it: 'Progetto', pl: 'Projekt', ru: 'Проект', zh: '项目', ja: 'プロジェクト' },
  'Projektname': { en: 'Project name', fr: 'Nom du projet', es: 'Nombre del proyecto', it: 'Nome progetto', pl: 'Nazwa projektu', ru: 'Название проекта', zh: '项目名称', ja: 'プロジェクト名' },
  'Speichern': { en: 'Save', fr: 'Enregistrer', es: 'Guardar', it: 'Salva', pl: 'Zapisz', ru: 'Сохранить', zh: '保存', ja: '保存' },
  'Als Datei': { en: 'As file', fr: 'Fichier', es: 'Como archivo', it: 'Come file', pl: 'Do pliku', ru: 'В файл', zh: '保存为文件', ja: 'ファイルに保存' },
  'Neues Projekt ': { en: 'New project ', fr: 'Nouveau projet ', es: 'Nuevo proyecto ', it: 'Nuovo progetto ', pl: 'Nowy projekt ', ru: 'Новый проект ', zh: '新建项目 ', ja: '新規プロジェクト ' },
  '„Als Datei" = .wcd zum Sichern/Teilen · „Speichern" legt es in diesem Browser ab.': {
    en: '“As file” = .wcd to back up/share · “Save” stores it in this browser.',
    fr: '« Fichier » = .wcd pour sauvegarder/partager · « Enregistrer » le stocke dans ce navigateur.',
    es: '«Como archivo» = .wcd para guardar/compartir · «Guardar» lo almacena en este navegador.',
    it: '“Come file” = .wcd per salvare/condividere · “Salva” lo memorizza in questo browser.',
    pl: '„Do pliku" = .wcd do kopii/udostępniania · „Zapisz" przechowuje w tej przeglądarce.',
    ru: '«В файл» = .wcd для копии/обмена · «Сохранить» хранит в этом браузере.',
    zh: '“保存为文件” = .wcd 用于备份/分享 · “保存” 存放在此浏览器中。',
    ja: '「ファイルに保存」= .wcd（バックアップ/共有用）·「保存」はこのブラウザに保存します。' },
  'Gespeichert ✓': { en: 'Saved ✓', fr: 'Enregistré ✓', es: 'Guardado ✓', it: 'Salvato ✓', pl: 'Zapisano ✓', ru: 'Сохранено ✓', zh: '已保存 ✓', ja: '保存しました ✓' },
  '✓ Projekt gespeichert: ': { en: '✓ Project saved: ', fr: '✓ Projet enregistré : ', es: '✓ Proyecto guardado: ', it: '✓ Progetto salvato: ', pl: '✓ Projekt zapisany: ', ru: '✓ Проект сохранён: ', zh: '✓ 项目已保存：', ja: '✓ プロジェクトを保存：' },
  '✓ Projekt geöffnet: ': { en: '✓ Project opened: ', fr: '✓ Projet ouvert : ', es: '✓ Proyecto abierto: ', it: '✓ Progetto aperto: ', pl: '✓ Projekt otwarty: ', ru: '✓ Проект открыт: ', zh: '✓ 项目已打开：', ja: '✓ プロジェクトを開きました：' },
  '⚠ Datei konnte nicht geöffnet werden': { en: '⚠ Could not open file', fr: '⚠ Impossible d’ouvrir le fichier', es: '⚠ No se pudo abrir el archivo', it: '⚠ Impossibile aprire il file', pl: '⚠ Nie udało się otworzyć pliku', ru: '⚠ Не удалось открыть файл', zh: '⚠ 无法打开文件', ja: '⚠ ファイルを開けませんでした' },
  '⚠ Projekt beschädigt': { en: '⚠ Project corrupted', fr: '⚠ Projet corrompu', es: '⚠ Proyecto dañado', it: '⚠ Progetto danneggiato', pl: '⚠ Projekt uszkodzony', ru: '⚠ Проект повреждён', zh: '⚠ 项目已损坏', ja: '⚠ プロジェクトが破損しています' },

  // ---- Vorlagen ----
  'Vorlagen': { en: 'Templates', fr: 'Modèles', es: 'Plantillas', it: 'Modelli', pl: 'Szablony', ru: 'Шаблоны', zh: '模板', ja: 'テンプレート' },
  'Hersteller': { en: 'Manufacturer', fr: 'Constructeur', es: 'Fabricante', it: 'Produttore', pl: 'Producent', ru: 'Производитель', zh: '制造商', ja: 'メーカー' },
  'Größe / Modell': { en: 'Size / model', fr: 'Taille / modèle', es: 'Tamaño / modelo', it: 'Misura / modello', pl: 'Rozmiar / model', ru: 'Размер / модель', zh: '尺寸 / 型号', ja: 'サイズ / モデル' },
  'Richtwerte – bitte am Rad nachmessen.': {
    en: 'Reference values – please measure on the wheel.',
    fr: 'Valeurs indicatives – mesurez sur la roue.',
    es: 'Valores orientativos – mide en la rueda.',
    it: 'Valori indicativi – misura sulla ruota.',
    pl: 'Wartości orientacyjne – zmierz na feldze.',
    ru: 'Ориентировочные значения — измерьте на колесе.',
    zh: '参考值 — 请在轮毂上实测。',
    ja: '目安値です — ホイールで実測してください。' },
  'Eigene Maße speichern': { en: 'Save your own dimensions', fr: 'Enregistrer vos dimensions', es: 'Guardar tus medidas', it: 'Salva le tue misure', pl: 'Zapisz własne wymiary', ru: 'Сохранить свои размеры', zh: '保存自定义尺寸', ja: '自分の寸法を保存' },
  'z. B. Meine Felge 18 Zoll': { en: 'e.g. My 18-inch wheel', fr: 'p. ex. Ma jante 18 pouces', es: 'p. ej. Mi llanta de 18"', it: 'es. Il mio cerchio da 18"', pl: 'np. Moja felga 18 cali', ru: 'напр. Мой диск 18 дюймов', zh: '例如 我的 18 寸轮毂', ja: '例：18インチのホイール' },
  'Noch keine eigenen Vorlagen.': { en: 'No templates of your own yet.', fr: 'Aucun modèle personnel.', es: 'Aún no tienes plantillas.', it: 'Nessun modello personale.', pl: 'Brak własnych szablonów.', ru: 'Пока нет своих шаблонов.', zh: '还没有自定义模板。', ja: '自分のテンプレートはまだありません。' },
  'Anwenden': { en: 'Apply', fr: 'Appliquer', es: 'Aplicar', it: 'Applica', pl: 'Zastosuj', ru: 'Применить', zh: '应用', ja: '適用' },
  'Als Vorlage vorschlagen': { en: 'Suggest as template', fr: 'Proposer comme modèle', es: 'Proponer como plantilla', it: 'Proponi come modello', pl: 'Zaproponuj jako szablon', ru: 'Предложить как шаблон', zh: '建议为模板', ja: 'テンプレートとして提案' },
  'Hilft, die Bibliothek für alle zu füllen.': {
    en: 'Helps fill the library for everyone.',
    fr: 'Aide à enrichir la bibliothèque pour tous.',
    es: 'Ayuda a llenar la biblioteca para todos.',
    it: 'Aiuta a riempire la libreria per tutti.',
    pl: 'Pomaga wypełniać bibliotekę dla wszystkich.',
    ru: 'Помогает наполнять библиотеку для всех.',
    zh: '帮助为大家充实模板库。',
    ja: 'みんなのためにライブラリを充実させます。' },
  'Allgemeine Größen': { en: 'Common sizes', fr: 'Tailles courantes', es: 'Tamaños comunes', it: 'Misure comuni', pl: 'Rozmiary ogólne', ru: 'Общие размеры', zh: '通用尺寸', ja: '一般的なサイズ' },
  'Klein · 54 mm': { en: 'Small · 54 mm', fr: 'Petit · 54 mm', es: 'Pequeño · 54 mm', it: 'Piccolo · 54 mm', pl: 'Mały · 54 mm', ru: 'Маленький · 54 мм', zh: '小 · 54 mm', ja: '小 · 54 mm' },
  'Standard · 60 mm': { en: 'Standard · 60 mm', fr: 'Standard · 60 mm', es: 'Estándar · 60 mm', it: 'Standard · 60 mm', pl: 'Standard · 60 mm', ru: 'Стандарт · 60 мм', zh: '标准 · 60 mm', ja: '標準 · 60 mm' },
  'Mittel · 65 mm': { en: 'Medium · 65 mm', fr: 'Moyen · 65 mm', es: 'Medio · 65 mm', it: 'Medio · 65 mm', pl: 'Średni · 65 mm', ru: 'Средний · 65 мм', zh: '中 · 65 mm', ja: '中 · 65 mm' },
  'Groß · 68 mm': { en: 'Large · 68 mm', fr: 'Grand · 68 mm', es: 'Grande · 68 mm', it: 'Grande · 68 mm', pl: 'Duży · 68 mm', ru: 'Большой · 68 мм', zh: '大 · 68 mm', ja: '大 · 68 mm' },
  'XL · 75 mm': { en: 'XL · 75 mm', fr: 'XL · 75 mm', es: 'XL · 75 mm', it: 'XL · 75 mm', pl: 'XL · 75 mm', ru: 'XL · 75 мм', zh: 'XL · 75 mm', ja: 'XL · 75 mm' },
  'Autohersteller': { en: 'Car makers', fr: 'Constructeurs auto', es: 'Fabricantes de coches', it: 'Case automobilistiche', pl: 'Producenci aut', ru: 'Автопроизводители', zh: '汽车制造商', ja: '自動車メーカー' },
  'Felgenhersteller': { en: 'Wheel makers', fr: 'Fabricants de jantes', es: 'Fabricantes de llantas', it: 'Produttori di cerchi', pl: 'Producenci felg', ru: 'Производители дисков', zh: '轮毂制造商', ja: 'ホイールメーカー' },
  'Community': { en: 'Community', fr: 'Communauté', es: 'Comunidad', it: 'Community', pl: 'Społeczność', ru: 'Сообщество', zh: '社区', ja: 'コミュニティ' },
  'Sende Vorschlag …': { en: 'Sending suggestion …', fr: 'Envoi de la proposition …', es: 'Enviando propuesta …', it: 'Invio proposta …', pl: 'Wysyłanie propozycji …', ru: 'Отправка предложения …', zh: '正在提交建议 …', ja: '提案を送信中 …' },
  'Danke! Vorschlag eingereicht – wird nach Prüfung aufgenommen.': {
    en: 'Thanks! Suggestion submitted – added after review.',
    fr: 'Merci ! Proposition envoyée – ajoutée après vérification.',
    es: '¡Gracias! Propuesta enviada – se añadirá tras revisión.',
    it: 'Grazie! Proposta inviata – aggiunta dopo la verifica.',
    pl: 'Dziękujemy! Propozycja wysłana – dodamy po weryfikacji.',
    ru: 'Спасибо! Предложение отправлено — добавим после проверки.',
    zh: '谢谢！建议已提交 — 审核后加入。',
    ja: 'ありがとうございます！提案を送信しました — 確認後に追加します。' },
  'Konnte nicht senden: ': { en: 'Could not send: ', fr: 'Échec de l’envoi : ', es: 'No se pudo enviar: ', it: 'Invio non riuscito: ', pl: 'Nie udało się wysłać: ', ru: 'Не удалось отправить: ', zh: '发送失败：', ja: '送信できませんでした：' },

  // ---- Bewertung ----
  'Passt diese Vorlage?': { en: 'Does this template fit?', fr: 'Ce modèle convient-il ?', es: '¿Encaja esta plantilla?', it: 'Questo modello va bene?', pl: 'Czy ten szablon pasuje?', ru: 'Этот шаблон подходит?', zh: '这个模板合适吗？', ja: 'このテンプレートは合いますか？' },
  'Noch keine Bewertung': { en: 'No ratings yet', fr: 'Pas encore d’avis', es: 'Sin valoraciones', it: 'Nessuna valutazione', pl: 'Brak ocen', ru: 'Пока нет оценок', zh: '暂无评分', ja: '評価はまだありません' },
  'Danke! ✓': { en: 'Thanks! ✓', fr: 'Merci ! ✓', es: '¡Gracias! ✓', it: 'Grazie! ✓', pl: 'Dziękujemy! ✓', ru: 'Спасибо! ✓', zh: '谢谢！✓', ja: 'ありがとう！✓' },
  'Bewerten aktuell nicht möglich': { en: 'Rating not available right now', fr: 'Évaluation indisponible', es: 'Valoración no disponible', it: 'Valutazione non disponibile', pl: 'Ocena chwilowo niedostępna', ru: 'Оценка сейчас недоступна', zh: '当前无法评分', ja: '現在評価できません' },

  // ---- Logo-Quelle ----
  'Bibliothek': { en: 'Library', fr: 'Bibliothèque', es: 'Biblioteca', it: 'Libreria', pl: 'Biblioteka', ru: 'Библиотека', zh: '库', ja: 'ライブラリ' },
  'Eigenes SVG hochladen': { en: 'Upload your own SVG', fr: 'Importer votre SVG', es: 'Subir tu propio SVG', it: 'Carica il tuo SVG', pl: 'Wgraj własny plik SVG', ru: 'Загрузить свой SVG', zh: '上传自己的 SVG', ja: '自分の SVG をアップロード' },
  'Bibliotheks-Logo konnte nicht geladen werden.': {
    en: 'Library logo could not be loaded.',
    fr: 'Impossible de charger le logo de la bibliothèque.',
    es: 'No se pudo cargar el logo de la biblioteca.',
    it: 'Impossibile caricare il logo della libreria.',
    pl: 'Nie udało się załadować logo z biblioteki.',
    ru: 'Не удалось загрузить логотип из библиотеки.',
    zh: '无法加载库中的徽标。',
    ja: 'ライブラリのロゴを読み込めませんでした。' },

  // ---- Download-Popup ----
  'Dein Nabendeckel wird geladen …': { en: 'Your hub cap is downloading …', fr: 'Votre cache-moyeu se télécharge …', es: 'Descargando tu tapa de buje …', it: 'Download del coprimozzo …', pl: 'Twój kołpak jest pobierany …', ru: 'Ваш колпачок скачивается …', zh: '正在下载你的轮毂盖 …', ja: 'センターキャップをダウンロード中 …' },
  'Weiter zum Designen': { en: 'Back to designing', fr: 'Continuer la création', es: 'Seguir diseñando', it: 'Torna a progettare', pl: 'Wróć do projektowania', ru: 'Вернуться к дизайну', zh: '返回设计', ja: 'デザインに戻る' },
  'Wenn dir WheelCapDesigner gefällt, freue ich mich riesig über einen Kaffee. Danke! 🙌': {
    en: 'If you like WheelCapDesigner, a coffee would make my day. Thanks! 🙌',
    fr: 'Si vous aimez WheelCapDesigner, un café me ferait très plaisir. Merci ! 🙌',
    es: 'Si te gusta WheelCapDesigner, un café me haría muy feliz. ¡Gracias! 🙌',
    it: 'Se ti piace WheelCapDesigner, un caffè mi farebbe felice. Grazie! 🙌',
    pl: 'Jeśli podoba Ci się WheelCapDesigner, ucieszy mnie kawa. Dzięki! 🙌',
    ru: 'Если вам нравится WheelCapDesigner, буду рад чашке кофе. Спасибо! 🙌',
    zh: '如果你喜欢 WheelCapDesigner，一杯咖啡会让我很开心。谢谢！🙌',
    ja: 'WheelCapDesigner を気に入ってもらえたら、コーヒー一杯いただけると嬉しいです。ありがとう！🙌' },

  // ---- Export ----
  'Export': { en: 'Export', fr: 'Export', es: 'Exportar', it: 'Esporta', pl: 'Eksport', ru: 'Экспорт', zh: '导出', ja: 'エクスポート' },
  '3MF · mit Farben (Bambu Studio)': {
    en: '3MF · with colors (Bambu Studio)',
    fr: '3MF · avec couleurs (Bambu Studio)',
    es: '3MF · con colores (Bambu Studio)',
    it: '3MF · con colori (Bambu Studio)',
    pl: '3MF · z kolorami (Bambu Studio)',
    ru: '3MF · с цветами (Bambu Studio)',
    zh: '3MF · 带颜色（Bambu Studio）',
    ja: '3MF · カラー付き（Bambu Studio）' },
  'Deckel': { en: 'Cap', fr: 'Cache', es: 'Tapa', it: 'Coprimozzo', pl: 'Kołpak', ru: 'Колпачок', zh: '盖子', ja: 'キャップ' },
  'Eine Datei, beide Teile korrekt positioniert. <b>3MF</b> enthält die Farben – Bambu Studio erkennt Deckel + Logo als getrennte Objekte. STL ist farblos (Teile lassen sich im Slicer trennen).': {
    en: 'One file, both parts correctly positioned. <b>3MF</b> carries the colors – Bambu Studio detects cap + logo as separate objects. STL is colorless (parts can be split in the slicer).',
    fr: 'Un fichier, les deux pièces bien positionnées. Le <b>3MF</b> contient les couleurs – Bambu Studio détecte le cache et le logo comme objets séparés. Le STL est sans couleur (pièces séparables dans le slicer).',
    es: 'Un archivo, ambas piezas bien posicionadas. El <b>3MF</b> lleva los colores – Bambu Studio detecta tapa y logo como objetos separados. El STL no tiene color (las piezas se pueden separar en el slicer).',
    it: 'Un file, entrambe le parti posizionate correttamente. Il <b>3MF</b> contiene i colori – Bambu Studio riconosce coprimozzo e logo come oggetti separati. L’STL è senza colore (le parti si possono separare nello slicer).',
    pl: 'Jeden plik, obie części poprawnie ustawione. <b>3MF</b> zawiera kolory – Bambu Studio rozpoznaje kołpak i logo jako osobne obiekty. STL jest bez koloru (części można rozdzielić w slicerze).',
    ru: 'Один файл, обе части правильно расположены. <b>3MF</b> содержит цвета — Bambu Studio распознаёт колпачок и логотип как отдельные объекты. STL без цвета (части можно разделить в слайсере).',
    zh: '一个文件，两个部件位置正确。<b>3MF</b> 含颜色 — Bambu Studio 将盖子和徽标识别为独立对象。STL 无颜色（可在切片软件中分离部件）。',
    ja: '1つのファイルに両パーツが正しく配置。<b>3MF</b> は色を含み、Bambu Studio はキャップとロゴを別オブジェクトとして認識します。STL は色なし（スライサーでパーツを分離可能）。' },

  // ---- diverse ----
  'heruntergeladen': { en: 'downloaded', fr: 'téléchargé', es: 'descargado', it: 'scaricato', pl: 'pobrano', ru: 'скачан', zh: '已下载', ja: 'をダウンロードしました' },
  'Fehler': { en: 'Error', fr: 'Erreur', es: 'Error', it: 'Errore', pl: 'Błąd', ru: 'Ошибка', zh: '错误', ja: 'エラー' },
  'Vorlage': { en: 'Template', fr: 'Modèle', es: 'Plantilla', it: 'Modello', pl: 'Szablon', ru: 'Шаблон', zh: '模板', ja: 'テンプレート' },
  '— auswählen —': { en: '— select —', fr: '— choisir —', es: '— elegir —', it: '— scegli —', pl: '— wybierz —', ru: '— выбрать —', zh: '— 选择 —', ja: '— 選択 —' },
  'Maße kopiert – E-Mail-Fenster geöffnet.': {
    en: 'Dimensions copied – email window opened.',
    fr: 'Dimensions copiées – fenêtre e-mail ouverte.',
    es: 'Medidas copiadas – ventana de correo abierta.',
    it: 'Misure copiate – finestra email aperta.',
    pl: 'Wymiary skopiowane – otwarto okno e-mail.',
    ru: 'Размеры скопированы — открыто окно эл. почты.',
    zh: '尺寸已复制 — 已打开邮件窗口。',
    ja: '寸法をコピーしました — メール画面を開きました。' },

  // ---- Feedback ----
  'Feedback zum Designer': { en: 'Feedback on the designer', fr: 'Avis sur l’éditeur', es: 'Comentarios sobre el editor', it: 'Feedback sull’editor', pl: 'Opinia o edytorze', ru: 'Отзыв о редакторе', zh: '对设计器的反馈', ja: 'エディターへのフィードバック' },
  'Wie gefällt dir WheelCapDesigner? Über Sterne und ein paar Worte freue ich mich sehr.': {
    en: 'How do you like WheelCapDesigner? A few stars and words would mean a lot.',
    fr: 'Comment trouvez-vous WheelCapDesigner ? Quelques étoiles et un mot me feraient plaisir.',
    es: '¿Qué te parece WheelCapDesigner? Unas estrellas y unas palabras me alegrarían.',
    it: 'Ti piace WheelCapDesigner? Qualche stella e due parole mi farebbero piacere.',
    pl: 'Jak Ci się podoba WheelCapDesigner? Ucieszą mnie gwiazdki i kilka słów.',
    ru: 'Как вам WheelCapDesigner? Буду очень рад звёздам и паре слов.',
    zh: '你觉得 WheelCapDesigner 怎么样？给几颗星和几句话我会很开心。',
    ja: 'WheelCapDesigner はいかがですか？星といくつかの言葉をいただけると嬉しいです。' },
  'Was läuft gut, was fehlt dir?': { en: 'What works well, what’s missing?', fr: 'Ce qui va, ce qui manque ?', es: '¿Qué va bien, qué falta?', it: 'Cosa funziona, cosa manca?', pl: 'Co działa dobrze, czego brakuje?', ru: 'Что нравится, чего не хватает?', zh: '哪里好用，缺少什么？', ja: '良い点・足りない点は？' },
  'E-Mail (optional, für Rückfragen)': { en: 'Email (optional, for follow-up)', fr: 'E-mail (facultatif, pour vous recontacter)', es: 'Correo (opcional, para respuestas)', it: 'Email (facoltativa, per ricontattarti)', pl: 'E-mail (opcjonalnie, do kontaktu)', ru: 'E-mail (необязательно, для ответа)', zh: '邮箱（可选，便于回复）', ja: 'メール（任意・返信用）' },
  'Feedback senden': { en: 'Send feedback', fr: 'Envoyer l’avis', es: 'Enviar comentarios', it: 'Invia feedback', pl: 'Wyślij opinię', ru: 'Отправить отзыв', zh: '发送反馈', ja: 'フィードバックを送信' },
  'Bitte Sterne oder eine Nachricht angeben.': { en: 'Please give stars or a message.', fr: 'Indiquez des étoiles ou un message.', es: 'Indica estrellas o un mensaje.', it: 'Indica stelle o un messaggio.', pl: 'Podaj gwiazdki lub wiadomość.', ru: 'Укажите звёзды или сообщение.', zh: '请给出星级或留言。', ja: '星またはメッセージを入力してください。' },
  'Feedback ist gerade nicht verfügbar.': { en: 'Feedback is not available right now.', fr: 'L’avis n’est pas disponible pour le moment.', es: 'Los comentarios no están disponibles ahora.', it: 'Il feedback non è disponibile ora.', pl: 'Opinie są chwilowo niedostępne.', ru: 'Отзыв сейчас недоступен.', zh: '反馈目前不可用。', ja: 'フィードバックは現在利用できません。' },
  'Sende …': { en: 'Sending …', fr: 'Envoi …', es: 'Enviando …', it: 'Invio …', pl: 'Wysyłanie …', ru: 'Отправка …', zh: '发送中 …', ja: '送信中 …' },
  'Danke für dein Feedback! 🙌': { en: 'Thanks for your feedback! 🙌', fr: 'Merci pour votre avis ! 🙌', es: '¡Gracias por tus comentarios! 🙌', it: 'Grazie per il feedback! 🙌', pl: 'Dziękujemy za opinię! 🙌', ru: 'Спасибо за отзыв! 🙌', zh: '感谢你的反馈！🙌', ja: 'フィードバックをありがとう！🙌' },

  // ---- Warnungen ----
  'Außen-Ø muss größer als Montage-Ø sein.': { en: 'Outer Ø must be larger than mounting Ø.', fr: 'Le Ø extérieur doit dépasser le Ø de montage.', es: 'El Ø exterior debe ser mayor que el Ø de montaje.', it: 'Il Ø esterno deve superare il Ø di montaggio.', pl: 'Ø zewnętrzna musi być większa niż Ø montażowa.', ru: 'Внешний Ø должен быть больше монтажного Ø.', zh: '外径 Ø 必须大于安装 Ø。', ja: '外径 Ø は取付 Ø より大きくしてください。' },
  'Zu viele/zu breite Clips.': { en: 'Too many / too wide clips.', fr: 'Clips trop nombreux/larges.', es: 'Demasiados clips o muy anchos.', it: 'Troppi clip o troppo larghi.', pl: 'Za dużo / za szerokie zaczepy.', ru: 'Слишком много/широкие защёлки.', zh: '卡扣过多/过宽。', ja: 'クリップが多すぎ/広すぎます。' },
  'Klemmdicke + Einführschräge > Clip-Länge.': { en: 'Clamp thickness + lead-in > clip length.', fr: 'Épaisseur de serrage + rampe > longueur du clip.', es: 'Grosor de sujeción + rampa > longitud del clip.', it: 'Spessore di serraggio + rampa > lunghezza del clip.', pl: 'Grubość zacisku + faza > długość zaczepu.', ru: 'Толщина зажима + фаска > длины защёлки.', zh: '夹持厚度 + 导入斜面 > 卡扣长度。', ja: 'クランプ厚 + 導入テーパー > クリップ長。' },

  // ==== config.js: Gruppen ====
  'Grundmaße': { en: 'Basic dimensions', fr: 'Dimensions de base', es: 'Medidas básicas', it: 'Misure di base', pl: 'Wymiary podstawowe', ru: 'Основные размеры', zh: '基本尺寸', ja: '基本寸法' },
  'Rand & Profil': { en: 'Rim & profile', fr: 'Bord et profil', es: 'Borde y perfil', it: 'Bordo e profilo', pl: 'Krawędź i profil', ru: 'Край и профиль', zh: '边缘与轮廓', ja: '縁とプロファイル' },
  'Farbe': { en: 'Color', fr: 'Couleur', es: 'Color', it: 'Colore', pl: 'Kolor', ru: 'Цвет', zh: '颜色', ja: '色' },
  'Schnappnasen': { en: 'Snap clips', fr: 'Clips', es: 'Clips a presión', it: 'Clip a scatto', pl: 'Zaczepy', ru: 'Защёлки', zh: '卡扣', ja: 'スナップクリップ' },
  'Logo': { en: 'Logo', fr: 'Logo', es: 'Logo', it: 'Logo', pl: 'Logo', ru: 'Логотип', zh: '徽标', ja: 'ロゴ' },

  // ==== config.js: Labels ====
  'Außen-Ø': { en: 'Outer Ø', fr: 'Ø extérieur', es: 'Ø exterior', it: 'Ø esterno', pl: 'Ø zewnętrzna', ru: 'Внешний Ø', zh: '外径 Ø', ja: '外径 Ø' },
  'Montage-Ø': { en: 'Mounting Ø', fr: 'Ø de montage', es: 'Ø de montaje', it: 'Ø di montaggio', pl: 'Ø montażowa', ru: 'Монтажный Ø', zh: '安装 Ø', ja: '取付 Ø' },
  'Höhe / Tiefe': { en: 'Height / depth', fr: 'Hauteur / profondeur', es: 'Altura / profundidad', it: 'Altezza / profondità', pl: 'Wysokość / głębokość', ru: 'Высота / глубина', zh: '高度 / 深度', ja: '高さ / 深さ' },
  'Deckplatte': { en: 'Top plate', fr: 'Plaque supérieure', es: 'Placa superior', it: 'Piastra superiore', pl: 'Płyta górna', ru: 'Верхняя пластина', zh: '顶板', ja: '天板' },
  'Profil': { en: 'Profile', fr: 'Profil', es: 'Perfil', it: 'Profilo', pl: 'Profil', ru: 'Профиль', zh: '轮廓', ja: 'プロファイル' },
  'Ecken': { en: 'Corners', fr: 'Côtés', es: 'Lados', it: 'Lati', pl: 'Boki', ru: 'Стороны', zh: '边数', ja: '辺の数' },
  'Polygon-Größe': { en: 'Polygon size', fr: 'Taille du polygone', es: 'Tamaño del polígono', it: 'Dimensione poligono', pl: 'Rozmiar wielokąta', ru: 'Размер многоугольника', zh: '多边形大小', ja: '多角形サイズ' },
  'Plattform-Ø': { en: 'Platform Ø', fr: 'Ø plateforme', es: 'Ø plataforma', it: 'Ø piattaforma', pl: 'Ø platformy', ru: 'Ø платформы', zh: '平台 Ø', ja: 'プラットフォーム Ø' },
  'Plattform': { en: 'Platform', fr: 'Plateforme', es: 'Plataforma', it: 'Piattaforma', pl: 'Platforma', ru: 'Платформа', zh: '平台', ja: 'プラットフォーム' },
  'Vertiefung-Tiefe': { en: 'Recess depth', fr: 'Profondeur du creux', es: 'Profundidad del hueco', it: 'Profondità incavo', pl: 'Głębokość wgłębienia', ru: 'Глубина углубления', zh: '凹陷深度', ja: 'くぼみの深さ' },
  'Abrundung': { en: 'Rounding', fr: 'Arrondi', es: 'Redondeo', it: 'Arrotondamento', pl: 'Zaokrąglenie', ru: 'Скругление', zh: '圆角', ja: '丸み' },
  'Fase oben': { en: 'Top chamfer', fr: 'Chanfrein haut', es: 'Bisel superior', it: 'Smusso superiore', pl: 'Faza u góry', ru: 'Фаска сверху', zh: '顶部倒角', ja: '上部の面取り' },
  'Deckel-Farbe': { en: 'Cap color', fr: 'Couleur du cache', es: 'Color de la tapa', it: 'Colore del coprimozzo', pl: 'Kolor kołpaka', ru: 'Цвет колпачка', zh: '盖子颜色', ja: 'キャップの色' },
  'Anzahl Clips': { en: 'Clip count', fr: 'Nombre de clips', es: 'Número de clips', it: 'Numero di clip', pl: 'Liczba zaczepów', ru: 'Число защёлок', zh: '卡扣数量', ja: 'クリップ数' },
  'Clip-Dicke': { en: 'Clip thickness', fr: 'Épaisseur du clip', es: 'Grosor del clip', it: 'Spessore clip', pl: 'Grubość zaczepu', ru: 'Толщина защёлки', zh: '卡扣厚度', ja: 'クリップ厚' },
  'Clip-Breite': { en: 'Clip width', fr: 'Largeur du clip', es: 'Ancho del clip', it: 'Larghezza clip', pl: 'Szerokość zaczepu', ru: 'Ширина защёлки', zh: '卡扣宽度', ja: 'クリップ幅' },
  'Rastnase': { en: 'Barb', fr: 'Ergot', es: 'Lengüeta', it: 'Dente', pl: 'Zaczep', ru: 'Фиксатор', zh: '卡钩', ja: '爪' },
  'Einführschräge': { en: 'Lead-in ramp', fr: 'Rampe d’insertion', es: 'Rampa de entrada', it: 'Rampa d’inserimento', pl: 'Faza wprowadzająca', ru: 'Заходная фаска', zh: '导入斜面', ja: '導入テーパー' },
  'Klemmdicke': { en: 'Clamp thickness', fr: 'Épaisseur de serrage', es: 'Grosor de sujeción', it: 'Spessore di serraggio', pl: 'Grubość zacisku', ru: 'Толщина зажима', zh: '夹持厚度', ja: 'クランプ厚' },
  'Toleranz': { en: 'Tolerance', fr: 'Tolérance', es: 'Tolerancia', it: 'Tolleranza', pl: 'Tolerancja', ru: 'Допуск', zh: '公差', ja: '公差' },
  'Quelle': { en: 'Source', fr: 'Source', es: 'Origen', it: 'Sorgente', pl: 'Źródło', ru: 'Источник', zh: '来源', ja: 'ソース' },
  'Form': { en: 'Shape', fr: 'Forme', es: 'Forma', it: 'Forma', pl: 'Kształt', ru: 'Форма', zh: '形状', ja: '形状' },
  'Text': { en: 'Text', fr: 'Texte', es: 'Texto', it: 'Testo', pl: 'Tekst', ru: 'Текст', zh: '文字', ja: 'テキスト' },
  'Stil': { en: 'Style', fr: 'Style', es: 'Estilo', it: 'Stile', pl: 'Styl', ru: 'Стиль', zh: '样式', ja: 'スタイル' },
  'Logo-Farbe': { en: 'Logo color', fr: 'Couleur du logo', es: 'Color del logo', it: 'Colore del logo', pl: 'Kolor logo', ru: 'Цвет логотипа', zh: '徽标颜色', ja: 'ロゴの色' },
  'Größe': { en: 'Size', fr: 'Taille', es: 'Tamaño', it: 'Dimensione', pl: 'Rozmiar', ru: 'Размер', zh: '大小', ja: 'サイズ' },
  'Outline-Breite': { en: 'Outline width', fr: 'Largeur du contour', es: 'Ancho del contorno', it: 'Larghezza contorno', pl: 'Szerokość obrysu', ru: 'Ширина контура', zh: '轮廓线宽度', ja: 'アウトライン幅' },
  'Abstand vom Rand': { en: 'Distance from edge', fr: 'Distance du bord', es: 'Distancia al borde', it: 'Distanza dal bordo', pl: 'Odległość od krawędzi', ru: 'Отступ от края', zh: '距边缘的距离', ja: '縁からの距離' },
  'Position X': { en: 'Position X', fr: 'Position X', es: 'Posición X', it: 'Posizione X', pl: 'Pozycja X', ru: 'Позиция X', zh: '位置 X', ja: '位置 X' },
  'Position Y': { en: 'Position Y', fr: 'Position Y', es: 'Posición Y', it: 'Posizione Y', pl: 'Pozycja Y', ru: 'Позиция Y', zh: '位置 Y', ja: '位置 Y' },
  'Drehung': { en: 'Rotation', fr: 'Rotation', es: 'Rotación', it: 'Rotazione', pl: 'Obrót', ru: 'Поворот', zh: '旋转', ja: '回転' },
  'Vertiefung': { en: 'Recess', fr: 'Creux', es: 'Hueco', it: 'Incavo', pl: 'Wgłębienie', ru: 'Углубление', zh: '凹陷', ja: 'くぼみ' },
  'Vertiefung-Ø': { en: 'Recess Ø', fr: 'Ø du creux', es: 'Ø del hueco', it: 'Ø incavo', pl: 'Ø wgłębienia', ru: 'Ø углубления', zh: '凹陷 Ø', ja: 'くぼみ Ø' },

  // ==== config.js: Select-Optionen ====
  'Flach': { en: 'Flat', fr: 'Plat', es: 'Plano', it: 'Piatto', pl: 'Płaski', ru: 'Плоский', zh: '平面', ja: 'フラット' },
  'CenterLock (Mutter)': { en: 'CenterLock (nut)', fr: 'CenterLock (écrou)', es: 'CenterLock (tuerca)', it: 'CenterLock (dado)', pl: 'CenterLock (nakrętka)', ru: 'CenterLock (гайка)', zh: 'CenterLock（螺母）', ja: 'CenterLock（ナット）' },
  'Kein Logo': { en: 'No logo', fr: 'Aucun logo', es: 'Sin logo', it: 'Nessun logo', pl: 'Bez logo', ru: 'Без логотипа', zh: '无徽标', ja: 'ロゴなし' },
  'Eigenes SVG': { en: 'Custom SVG', fr: 'SVG personnalisé', es: 'SVG propio', it: 'SVG personale', pl: 'Własny SVG', ru: 'Свой SVG', zh: '自定义 SVG', ja: 'カスタム SVG' },
  'Stern': { en: 'Star', fr: 'Étoile', es: 'Estrella', it: 'Stella', pl: 'Gwiazda', ru: 'Звезда', zh: '星形', ja: '星' },
  'Blitz': { en: 'Bolt', fr: 'Éclair', es: 'Rayo', it: 'Fulmine', pl: 'Błyskawica', ru: 'Молния', zh: '闪电', ja: '稲妻' },
  'Ringe': { en: 'Rings', fr: 'Anneaux', es: 'Anillos', it: 'Anelli', pl: 'Pierścienie', ru: 'Кольца', zh: '圆环', ja: 'リング' },
  'Sechseck': { en: 'Hexagon', fr: 'Hexagone', es: 'Hexágono', it: 'Esagono', pl: 'Sześciokąt', ru: 'Шестиугольник', zh: '六边形', ja: '六角形' },
  'Kreis-Ring': { en: 'Circle ring', fr: 'Anneau', es: 'Anillo circular', it: 'Anello', pl: 'Pierścień', ru: 'Кольцо', zh: '圆环形', ja: '円リング' },
  'Erhaben': { en: 'Raised', fr: 'En relief', es: 'En relieve', it: 'In rilievo', pl: 'Wypukły', ru: 'Выпуклый', zh: '凸起', ja: '凸（浮き出し）' },
  'Graviert': { en: 'Engraved', fr: 'Gravé', es: 'Grabado', it: 'Inciso', pl: 'Grawer', ru: 'Гравировка', zh: '雕刻', ja: '彫り込み' },
  'Plan (bündig, 2-teilig)': { en: 'Flush (2-part inlay)', fr: 'Affleurant (2 parties)', es: 'Enrasado (2 piezas)', it: 'A filo (2 parti)', pl: 'Licowany (2-częściowy)', ru: 'Заподлицо (2 части)', zh: '齐平（两件式嵌件）', ja: '面一（2部品はめ込み）' },
  'Bündig (keine extra Fläche)': { en: 'Flush (no extra face)', fr: 'Affleurant (sans surface)', es: 'Enrasado (sin cara extra)', it: 'A filo (senza superficie)', pl: 'Licowany (bez dodatkowej powierzchni)', ru: 'Заподлицо (без доп. площадки)', zh: '齐平（无额外平面）', ja: '面一（追加面なし）' },
  'Erhöht': { en: 'Raised', fr: 'Surélevé', es: 'Elevado', it: 'Rialzato', pl: 'Podwyższony', ru: 'Приподнятый', zh: '凸起', ja: 'かさ上げ' },
  'Vertieft': { en: 'Recessed', fr: 'En creux', es: 'Hundido', it: 'Incassato', pl: 'Wgłębiony', ru: 'Углублённый', zh: '凹入', ja: 'くぼみ' },

  // ==== config.js: Hints ====
  'Sichtbarer Rand, liegt auf dem Rad auf': { en: 'Visible rim, rests on the wheel', fr: 'Bord visible, repose sur la roue', es: 'Borde visible, apoya en la rueda', it: 'Bordo visibile, appoggia sulla ruota', pl: 'Widoczna krawędź, opiera się na feldze', ru: 'Видимый край, лежит на колесе', zh: '可见边缘，搭在轮毂上', ja: '見える縁、ホイールに載る' },
  'Durchmesser der Radöffnung (Klemm-Ø)': { en: 'Wheel opening diameter (clamp Ø)', fr: 'Diamètre de l’ouverture (Ø de serrage)', es: 'Diámetro de la abertura (Ø de sujeción)', it: 'Diametro dell’apertura (Ø di serraggio)', pl: 'Średnica otworu felgi (Ø zacisku)', ru: 'Диаметр отверстия колеса (зажимной Ø)', zh: '轮毂开口直径（夹持 Ø）', ja: 'ホイール開口部の直径（クランプ Ø）' },
  'Anzahl Ecken der Mutter (6 = Sechskant)': { en: 'Number of nut corners (6 = hex)', fr: 'Nombre de côtés de l’écrou (6 = six pans)', es: 'Número de lados de la tuerca (6 = hexágono)', it: 'Numero di lati del dado (6 = esagono)', pl: 'Liczba boków nakrętki (6 = sześciokąt)', ru: 'Число граней гайки (6 = шестигранник)', zh: '螺母的边数（6 = 六角）', ja: 'ナットの辺数（6 = 六角）' },
  'Ø der Mutter (über Ecken)': { en: 'Nut Ø (across corners)', fr: 'Ø de l’écrou (sur les pointes)', es: 'Ø de la tuerca (entre puntas)', it: 'Ø del dado (sulle punte)', pl: 'Ø nakrętki (po wierzchołkach)', ru: 'Ø гайки (по углам)', zh: '螺母 Ø（对角）', ja: 'ナット Ø（角をまたぐ）' },
  'Höhe der Erhöhung': { en: 'Height of the boss', fr: 'Hauteur de la surélévation', es: 'Altura del realce', it: 'Altezza del rialzo', pl: 'Wysokość wypukłości', ru: 'Высота выступа', zh: '凸台高度', ja: '凸部の高さ' },
  'Runde Fläche oben fürs Logo': { en: 'Round top area for the logo', fr: 'Surface ronde en haut pour le logo', es: 'Área redonda superior para el logo', it: 'Area rotonda in alto per il logo', pl: 'Okrągła powierzchnia u góry na logo', ru: 'Круглая площадка сверху для логотипа', zh: '顶部用于徽标的圆形平面', ja: 'ロゴ用の上部円形エリア' },
  'Lage der Logo-Fläche auf der Mutter': { en: 'Position of the logo face on the nut', fr: 'Position de la surface du logo sur l’écrou', es: 'Posición de la cara del logo en la tuerca', it: 'Posizione della superficie del logo sul dado', pl: 'Położenie powierzchni logo na nakrętce', ru: 'Положение площадки логотипа на гайке', zh: '徽标平面在螺母上的位置', ja: 'ナット上のロゴ面の位置' },
  'Kanten oben abschrägen (0 = scharf)': { en: 'Chamfer top edges (0 = sharp)', fr: 'Chanfreiner les arêtes (0 = vif)', es: 'Biselar los bordes (0 = vivo)', it: 'Smussa gli spigoli (0 = vivo)', pl: 'Sfazuj górne krawędzie (0 = ostre)', ru: 'Скосить верхние кромки (0 = острые)', zh: '顶部边缘倒角（0 = 锐利）', ja: '上部エッジを面取り（0 = シャープ）' },
  'Haltekraft': { en: 'Holding force', fr: 'Force de maintien', es: 'Fuerza de sujeción', it: 'Forza di tenuta', pl: 'Siła trzymania', ru: 'Сила удержания', zh: '固定力', ja: '保持力' },
  'Materialstärke des Rades': { en: 'Wheel material thickness', fr: 'Épaisseur du matériau de la roue', es: 'Grosor del material de la rueda', it: 'Spessore del materiale della ruota', pl: 'Grubość materiału felgi', ru: 'Толщина материала колеса', zh: '轮毂材料厚度', ja: 'ホイールの材料厚' },
  'Bei zu strammem Sitz erhöhen': { en: 'Increase if the fit is too tight', fr: 'Augmenter si l’ajustement est trop serré', es: 'Auméntalo si queda muy ajustado', it: 'Aumenta se troppo stretto', pl: 'Zwiększ, gdy pasuje zbyt ciasno', ru: 'Увеличьте при слишком плотной посадке', zh: '过紧时增大', ja: 'きつすぎる場合は増やす' },
  'Ring am Deckelrand · 0 = aus': { en: 'Ring at the cap edge · 0 = off', fr: 'Anneau au bord · 0 = désactivé', es: 'Anillo en el borde · 0 = apagado', it: 'Anello sul bordo · 0 = off', pl: 'Pierścień na krawędzi kołpaka · 0 = wył.', ru: 'Кольцо по краю колпачка · 0 = выкл.', zh: '盖边圆环 · 0 = 关闭', ja: 'キャップ縁のリング · 0 = オフ' },
  'Plan: Einlage-Tiefe (1 mm empfohlen)': { en: 'Flush: inlay depth (1 mm recommended)', fr: 'Affleurant : profondeur d’incrustation (1 mm conseillé)', es: 'Enrasado: profundidad del inserto (1 mm)', it: 'A filo: profondità dell’inserto (1 mm)', pl: 'Licowany: głębokość wkładki (zalecane 1 mm)', ru: 'Заподлицо: глубина вставки (реком. 1 мм)', zh: '齐平：嵌件深度（建议 1 mm）', ja: '面一：はめ込み深さ（1 mm 推奨）' },
  'Eingelassener „Teller" unter dem Logo': { en: 'Recessed “plate” under the logo', fr: 'Plateau en creux sous le logo', es: 'Plato hundido bajo el logo', it: 'Piattello incassato sotto il logo', pl: 'Wpuszczany „talerz" pod logo', ru: 'Утопленная «площадка» под логотипом', zh: '徽标下方的内嵌“底盘”', ja: 'ロゴ下の埋め込み「皿」' },

  // ==== Kegel / cone ====
  'Kegel': { en: 'Cone', fr: 'Cône', es: 'Cono', it: 'Cono', pl: 'Stożek', ru: 'Конус', zh: '圆锥', ja: 'コーン' },
  'Dicke Grundplatte': { en: 'Base plate thickness', fr: 'Épaisseur de la base', es: 'Grosor de la base', it: 'Spessore base', pl: 'Grubość podstawy', ru: 'Толщина основания', zh: '底板厚度', ja: 'ベース厚' },
  'Durchmesser obere Platte': { en: 'Top plate diameter', fr: 'Ø plateau supérieur', es: 'Ø placa superior', it: 'Ø piastra superiore', pl: 'Ø górnej płyty', ru: 'Ø верхней площадки', zh: '顶板直径', ja: '上面プレート径' },
  'Rand oben': { en: 'Top rim', fr: 'Rebord haut', es: 'Reborde superior', it: 'Bordo superiore', pl: 'Rant górny', ru: 'Верхний бортик', zh: '顶部边缘', ja: '上部リム' },
  'Gerade Basis unten, bevor der Kegel beginnt': { en: 'Straight base before the cone starts', fr: 'Base droite avant le cône', es: 'Base recta antes del cono', it: 'Base dritta prima del cono', pl: 'Prosta podstawa przed stożkiem', ru: 'Прямое основание до начала конуса', zh: '圆锥开始前的直基座', ja: 'コーンが始まる前のまっすぐな基部' },
  'Gesamthöhe des Kegels': { en: 'Total cone height', fr: 'Hauteur totale du cône', es: 'Altura total del cono', it: 'Altezza totale del cono', pl: 'Całkowita wysokość stożka', ru: 'Полная высота конуса', zh: '圆锥总高', ja: 'コーンの全高' },
  'Erhabener Rand um die obere Platte (0 = kein Rand)': { en: 'Raised rim around the top plate (0 = none)', fr: 'Rebord en relief autour du plateau (0 = aucun)', es: 'Reborde elevado alrededor de la placa (0 = ninguno)', it: 'Bordo rialzato attorno alla piastra (0 = nessuno)', pl: 'Wypukły rant wokół górnej płyty (0 = brak)', ru: 'Выступающий бортик вокруг верхней площадки (0 = нет)', zh: '顶板周围的凸起边缘（0 = 无）', ja: '上面プレート周囲の凸リム（0 = なし）' },
  'Wandstärke (hohl)': { en: 'Wall thickness (hollow)', fr: 'Épaisseur de paroi (creux)', es: 'Grosor de pared (hueco)', it: 'Spessore parete (cavo)', pl: 'Grubość ścianki (pusty)', ru: 'Толщина стенки (полый)', zh: '壁厚（空心）', ja: '肉厚（中空）' },
  'Höhlt den Kegel aus (deckt herausstehende Achsen ab) · 0 = massiv': { en: 'Hollows the cone (covers protruding axles) · 0 = solid', fr: 'Évide le cône (recouvre les axes saillants) · 0 = plein', es: 'Vacía el cono (cubre ejes salientes) · 0 = macizo', it: 'Svuota il cono (copre assi sporgenti) · 0 = pieno', pl: 'Drąży stożek (zakrywa wystające osie) · 0 = pełny', ru: 'Делает конус полым (закрывает выступающие оси) · 0 = сплошной', zh: '将圆锥掏空（罩住凸出的轴）· 0 = 实心', ja: 'コーンを中空にする（突き出た軸を覆う）· 0 = 中実' },
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
