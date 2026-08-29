// ============================================================
//  WheelCapDesigner – Nabendeckel-Generator (MakerWorld)
//  Parametrischer Nabendeckel mit Schnappnasen + Logo.
//  Web-Version mit freiem Logo-Upload & 3MF:
//     https://wheelcapdesigner-u4aa.vercel.app
//
//  Für MakerWorld Parametric Model Maker (OpenSCAD 2021).
//  Die SVG-Dateien (star.svg, bolt.svg, rings.svg) MIT hochladen.
//  Einheit: Millimeter (mm)
// ============================================================


/* [Grundmaße] */
// Außendurchmesser der sichtbaren Deckel-Oberseite (liegt auf dem Rad auf). Muss größer als Montage-Ø sein.
outer_diameter = 60;      // [20:0.5:220]
// Montage-/Klemmdurchmesser: Durchmesser der Radöffnung, in die der Deckel einrastet.
mount_diameter = 56;      // [15:0.5:210]
// Gesamthöhe / Einstecktiefe
total_height = 12;        // [5:0.5:60]
// Dicke der Deckel-Oberseite
face_thickness = 2.0;     // [0.8:0.2:6]

/* [Rand] */
// Fase (Abschrägung) an der oberen Außenkante
top_chamfer = 1.0;        // [0:0.2:8]

/* [Schnappnasen] */
// Anzahl der Clips
clip_count = 6;           // [2:1:16]
// Wandstärke eines Clips
clip_thickness = 1.6;     // [0.8:0.1:4]
// Winkelbreite eines Clips (Grad)
clip_width_deg = 30;      // [4:1:60]
// Höhe der Rastnase (Haltekraft)
barb_depth = 1.0;         // [0.2:0.1:4]
// Länge der Einführschräge
barb_ramp = 2.0;          // [0.5:0.1:8]
// Klemmdicke = Materialstärke des Rades
grip_thickness = 2.5;     // [0.5:0.1:12]
// Spiel/Toleranz (Druckertoleranz)
tolerance = 0.3;          // [0:0.05:1.5]

/* [Logo] */
// Logo-Quelle
logo_mode = "none";       // [none:Kein Logo, text:Text, shape:Form]
// Stil: Plan = bündige, 2-farbige Einlage (Oberseite aufs Druckbett)
logo_style = "raised";    // [raised:Erhaben, engraved:Graviert, flush:Plan (2-farbig)]
// Text (nur bei Quelle = Text)
logo_text = "LOGO";
// Schriftart
logo_font = "Liberation Sans:style=Bold";
// Form (nur bei Quelle = Form)
logo_shape = "star";      // [star:Stern, bolt:Blitz, rings:Ringe, hexagon:Sechseck, circle:Kreis-Ring]
// Zielgröße/-breite des Logos
logo_size = 30;           // [5:0.5:200]
// Höhe (erhaben) bzw. Tiefe (graviert/plan) des Logos
logo_depth = 1.0;         // [0.4:0.1:4]
// Outline-Ring am Deckelrand: Breite (0 = aus)
outline_width = 0;        // [0:0.2:15]
// Outline: Abstand von der Außenkante
outline_gap = 4;          // [0:0.5:40]
// Logo frei platzieren: Versatz X / Y
logo_offset_x = 0;        // [-40:0.5:40]
logo_offset_y = 0;        // [-40:0.5:40]
// Logo drehen (Grad)
logo_rotation = 0;        // [0:1:360]
// Vertiefte Kreisfläche unter dem Logo (0 = keine)
logo_recess_depth = 0;    // [0:0.1:3]
// Durchmesser der Vertiefung
logo_recess_diameter = 36;// [5:0.5:200]

/* [Farben] */
// Deckel-Farbe (Multicolor-Ausgabe)
cap_color = "#d7dbe1";
// Logo-/Einlage-Farbe (bei Erhaben & Plan)
logo_color = "#ff7a45";

/* [Qualität] */
// Auflösung der Rundungen
resolution = 120;         // [40:10:360]


/* [Hidden] */
// ---- abgeleitete Werte (nicht im Customizer sichtbar) ----
fn        = resolution;
top_r     = outer_diameter / 2;
skirt_r   = mount_diameter / 2 - tolerance;
inner_r   = max(1, skirt_r - clip_thickness);
barb_r    = mount_diameter / 2 + barb_depth;
skirt_h   = max(1, total_height - face_thickness);
ledge_z   = max(barb_ramp + 0.2, skirt_h - grip_thickness);
ramp_z    = max(0.1, ledge_z - barb_ramp);
pitch     = 360 / clip_count;
clip_w    = min(clip_width_deg, pitch - 2);
gap_w     = max(1, pitch - clip_w);
chamfer   = min(top_chamfer, top_r - 0.5, face_thickness - 0.1);
H         = total_height;
depth     = max(0.4, logo_depth);
surface_z = H - (logo_recess_depth > 0 ? logo_recess_depth : 0);

// ---- Bauteile ----
module skirt_ring() {
  rotate_extrude($fn = fn)
    polygon([
      [inner_r, 0], [skirt_r, 0], [skirt_r, ramp_z], [barb_r, ledge_z],
      [skirt_r, ledge_z], [skirt_r, skirt_h], [inner_r, skirt_h]
    ]);
}

module gaps() {
  for (i = [0 : clip_count - 1])
    rotate([0, 0, i * pitch + pitch / 2 - gap_w / 2])
      rotate_extrude(angle = gap_w, $fn = fn)
        translate([0.1, -0.3]) square([barb_r + 3, skirt_h + 0.6]);
}

module plate() {
  rotate_extrude($fn = fn)
    polygon([
      [0, skirt_h - 0.3], [top_r, skirt_h - 0.3],
      [top_r, H - chamfer], [top_r - chamfer, H], [0, H]
    ]);
}

module cap_body() {
  union() {
    difference() { skirt_ring(); gaps(); }
    plate();
  }
}

module body_with_recess() {
  difference() {
    cap_body();
    if (logo_mode != "none" && logo_recess_depth > 0)
      translate([0, 0, H - logo_recess_depth])
        cylinder(h = logo_recess_depth + 1, r = logo_recess_diameter / 2, $fn = fn);
  }
}

// Prozedurale Formen – immer zentriert, exakt skaliert, keine Zusatzdateien.
module shape_star(s) {
  R = s / 2; r = R * 0.42;
  polygon([for (i = [0 : 9]) let(a = 90 + i * 36, rad = (i % 2 == 0) ? R : r) [rad * cos(a), rad * sin(a)]]);
}
module shape_bolt(s) {
  translate([-2, 0]) scale(s / 92) polygon([[8, 46], [-26, -6], [-2, -6], [-10, -46], [30, 10], [4, 10]]);
}
module shape_rings(s) {
  R = s / 2;
  difference() { circle(r = R, $fn = fn); circle(r = R * 0.80, $fn = fn); }
  circle(r = R * 0.28, $fn = fn);
}
module shape_hex(s)    { circle(r = s / 2, $fn = 6); }
module shape_circle(s) { difference() { circle(r = s / 2, $fn = fn); circle(r = s / 2 * 0.6, $fn = fn); } }

module logo_2d() {
  if (logo_mode == "text")
    text(logo_text, size = logo_size * 0.5, halign = "center", valign = "center", font = logo_font);
  else if (logo_mode == "shape") {
    if      (logo_shape == "star")    shape_star(logo_size);
    else if (logo_shape == "bolt")    shape_bolt(logo_size);
    else if (logo_shape == "rings")   shape_rings(logo_size);
    else if (logo_shape == "hexagon") shape_hex(logo_size);
    else if (logo_shape == "circle")  shape_circle(logo_size);
  }
}

module outline_2d() {
  if (outline_width > 0) {
    o = min(top_r - outline_gap, top_r - 0.5);
    i = max(1, o - outline_width);
    difference() { circle(r = o, $fn = fn); circle(r = i, $fn = fn); }
  }
}

// Zweitfarb-Fläche (Logo platziert + Outline zentriert)
module second_2d() {
  translate([logo_offset_x, logo_offset_y]) rotate(logo_rotation) logo_2d();
  outline_2d();
}
module second_3d(h, zbase) { translate([0, 0, zbase]) linear_extrude(height = h) second_2d(); }


// ============================================================
//  ZUSAMMENBAU  (mehrfarbig via color())
// ============================================================
if (logo_mode == "none") {
  color(cap_color) cap_body();

} else if (logo_style == "engraved") {
  color(cap_color) difference() {
    body_with_recess();
    second_3d(depth + 0.2, surface_z - depth + 0.1);
  }

} else if (logo_style == "flush") {
  // Plan: bündige Einlage – Deckel mit Tasche + farbige Einlage
  color(cap_color) difference() {
    body_with_recess();
    second_3d(depth + 0.3, surface_z - depth);   // Tasche (öffnet nach oben)
  }
  color(logo_color) second_3d(depth, surface_z - depth);  // Einlage, bündig

} else {  // raised
  color(cap_color) body_with_recess();
  color(logo_color) second_3d(depth, surface_z - 0.1);    // erhaben, leicht eingetaucht
}
