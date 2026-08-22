// ============================================================
//  NABENDECKEL / HUB-CAP GENERATOR
//  Parametrischer Nabendeckel mit Schnappnasen (Clip-Fit)
//  und optionalem Logo (eigenes SVG oder Text).
//
//  Kompatibel mit dem MakerWorld-Customizer und OpenSCAD Desktop.
//  Einheit: Millimeter (mm)
// ============================================================


/* [Grundmaße] */
// Außendurchmesser der sichtbaren Deckel-Oberseite (der Rand/die Blende, die auf dem Rad aufliegt)
outer_diameter = 60;      // [20:0.5:220]
// Montage-/Bohrungsdurchmesser: der Durchmesser, mit dem der Deckel in die Radöffnung greift (dort sitzen die Clips)
mount_diameter = 56;      // [15:0.5:210]
// Gesamthöhe / Einstecktiefe des Deckels
total_height = 12;        // [5:0.5:60]
// Dicke der Deckel-Oberseite (Deckplatte)
face_thickness = 2.0;     // [0.8:0.2:6]

/* [Rand / Optik] */
// Fase (Abschrägung) an der oberen Außenkante – 0 = scharfe Kante
top_chamfer = 1.0;        // [0:0.2:8]
// Erhabener Zierring am äußeren Rand der Oberseite (0 = aus)
rim_ring_height = 0;      // [0:0.2:4]
// Breite des Zierrings
rim_ring_width = 3;       // [1:0.5:15]

/* [Schnappnasen / Clips] */
// Anzahl der Clips rund herum
clip_count = 6;           // [2:1:16]
// Wandstärke eines Clip-Fingers (radial)
clip_thickness = 1.6;     // [0.8:0.1:4]
// Winkelbreite eines Clips in Grad (muss kleiner als 360/Anzahl sein)
clip_width_deg = 22;      // [4:1:60]
// Höhe der Rastnase (wie weit sie radial nach außen steht und damit greift)
barb_depth = 1.0;         // [0.2:0.1:4]
// Länge der Einführschräge der Rastnase (größer = leichter einzudrücken)
barb_ramp = 2.0;          // [0.5:0.1:8]
// Klemmdicke: Materialstärke des Rades zwischen Auflage-Rand und Rastkante
grip_thickness = 2.5;     // [0.5:0.1:12]
// Spiel/Toleranz zwischen Clip-Außenseite und Bohrung (Druckertoleranz)
tolerance = 0.3;          // [0:0.05:1.5]

/* [Logo] */
// Logo-Quelle
logo_mode = "none";       // [none:Kein Logo, svg:SVG-Datei, text:Text]
// Pfad zur SVG-Datei (im selben Ordner ablegen). SVG möglichst mittig exportieren.
logo_file = "logos/logo.svg";
// Zieldurchmesser/-breite des Logos auf dem Deckel
logo_size = 30;           // [5:0.5:200]
// Höhe des Logos: positiv = erhaben, negativ = graviert/vertieft
logo_height = 0.8;        // [-4:0.1:4]
// Vertiefte Kreisfläche unter dem Logo (0 = keine). Gibt dem Logo einen sauberen "Teller".
logo_recess_depth = 0;    // [0:0.1:3]
// Durchmesser der vertieften Kreisfläche
logo_recess_diameter = 36; // [5:0.5:200]
// Feinjustierung der Logo-Position (falls SVG nicht ganz zentriert ist)
logo_offset_x = 0;        // [-30:0.1:30]
logo_offset_y = 0;        // [-30:0.1:30]
// Logo drehen (Grad)
logo_rotation = 0;        // [0:1:360]

/* [Text-Logo] */
// Text (nur wenn Logo-Quelle = text)
logo_text = "LOGO";
// Schriftart
logo_font = "Liberation Sans:style=Bold";

/* [Qualität] */
// Auflösung der Rundungen (höher = glatter, aber langsamer)
resolution = 120;         // [40:10:360]


// ============================================================
//  ABGELEITETE WERTE  (nicht im Customizer sichtbar)
// ============================================================
module __END_OF_CUSTOMIZER__() {}  // Marker: alles darunter ist interne Logik

eps = 0.01;
$fn = resolution;

top_r     = outer_diameter / 2;              // Radius der Oberseite/Blende
skirt_r   = mount_diameter / 2 - tolerance;  // Außenradius der Clip-Schürze
inner_r   = max(1, skirt_r - clip_thickness);// Innenradius der Clips
barb_tip_r = mount_diameter / 2 + barb_depth;// wie weit die Rastnase greift

skirt_height = total_height - face_thickness; // Länge der Clips (unter der Deckplatte)
ledge_z  = max(barb_ramp + 0.2, skirt_height - grip_thickness); // z der Rastkante (flacher Fang)
ramp_z   = ledge_z - barb_ramp;               // Start der Einführschräge

pitch    = 360 / clip_count;
clip_w   = min(clip_width_deg, pitch - 2);    // Sicherheit: Clip schmaler als Teilung


// ============================================================
//  BAUTEILE
// ============================================================

// -- Profil eines Clip-Rings (wird später in Segmente geschnitten) --
module clip_ring_profile() {
    rotate_extrude(angle = 360)
        polygon(points = [
            [inner_r, 0],
            [skirt_r, 0],
            [skirt_r, ramp_z],
            [barb_tip_r, ledge_z],   // Einführschräge hoch nach außen
            [skirt_r, ledge_z],      // flache Rastkante (hält gegen Herausziehen)
            [skirt_r, skirt_height + eps],
            [inner_r, skirt_height + eps]
        ]);
}

// -- Ein Winkelsegment als Schneidwerkzeug --
module wedge(angle) {
    rotate_extrude(angle = angle)
        square([barb_tip_r + 2, skirt_height + face_thickness + 2]);
}

// -- Alle Clips rund herum --
module clips() {
    for (i = [0 : clip_count - 1]) {
        rotate([0, 0, i * pitch])
            intersection() {
                clip_ring_profile();
                rotate([0, 0, -clip_w / 2]) wedge(clip_w);
            }
    }
}

// -- Deckplatte (Oberseite) --
module face_plate() {
    difference() {
        // Grundplatte
        translate([0, 0, skirt_height])
            cylinder(h = face_thickness, r = top_r);

        // Obere Außenkante fasen
        if (top_chamfer > 0) {
            rotate_extrude()
                polygon(points = [
                    [top_r - top_chamfer, total_height + eps],
                    [top_r + eps,         total_height + eps],
                    [top_r + eps,         total_height - top_chamfer]
                ]);
        }

        // Vertiefte Kreisfläche für das Logo
        if (logo_recess_depth > 0) {
            translate([0, 0, total_height - logo_recess_depth + eps])
                cylinder(h = logo_recess_depth, d = logo_recess_diameter);
        }
    }
}

// -- Optionaler erhabener Zierring am Rand --
module rim_ring() {
    if (rim_ring_height > 0) {
        translate([0, 0, total_height - eps])
            difference() {
                cylinder(h = rim_ring_height, r = top_r);
                translate([0, 0, -eps])
                    cylinder(h = rim_ring_height + 2 * eps, r = top_r - rim_ring_width);
            }
    }
}

// -- Logo als 2D-Form (SVG oder Text), zentriert --
module logo_2d() {
    if (logo_mode == "svg") {
        // resize skaliert das SVG proportional auf die Zielbreite
        resize([logo_size, 0, 0], auto = true)
            import(logo_file, center = true);
    } else if (logo_mode == "text") {
        text(logo_text, size = logo_size / 2,
             halign = "center", valign = "center", font = logo_font);
    }
}

// -- Logo platziert (erhaben oder graviert) --
module logo_3d() {
    if (logo_mode != "none" && logo_height != 0) {
        // Oberfläche, auf der das Logo sitzt (Boden der Vertiefung, falls vorhanden)
        surface_z = total_height - (logo_recess_depth > 0 ? logo_recess_depth : 0);
        h = abs(logo_height);
        // erhaben: von der Oberfläche nach oben; graviert: von der Oberfläche nach unten
        base_z = (logo_height > 0) ? surface_z : surface_z - h;

        translate([logo_offset_x, logo_offset_y, base_z - eps])
            rotate([0, 0, logo_rotation])
                linear_extrude(height = h + eps)
                    logo_2d();
    }
}


// ============================================================
//  ZUSAMMENBAU
// ============================================================
module nabendeckel() {
    // Graviertes Logo abziehen, erhabenes Logo hinzufügen
    union() {
        difference() {
            union() {
                face_plate();
                clips();
                rim_ring();
            }
            // graviert
            if (logo_mode != "none" && logo_height < 0) logo_3d();
        }
        // erhaben
        if (logo_mode != "none" && logo_height > 0) logo_3d();
    }
}

nabendeckel();
