# Rencana Redesign Portofolio — Berdasarkan Analisis Repo `rafvs/portofolio`

**Repo:** https://github.com/rafvs/portofolio
**Live:** https://portofolio-pi-amber-86.vercel.app/
**Referensi gaya (±50%):** https://galihaleanda.cloud/
**Referensi format Edukasi/Experience:** screenshot kartu "SMKN 7 Samarinda" yang kamu kirim

---

## 1. Kondisi Project Saat Ini (hasil analisis kode)

**Tech stack:** React 19 + Vite + Tailwind CSS v4, ditambah tumpukan library efek visual:
`three` + `@react-three/fiber` + `@react-three/rapier` (kartu ID 3D fisik di section Experience), `gsap`, `motion` (Framer Motion), `ogl` (WebGL shader untuk background terminal).

**Struktur section saat ini** (`src/App.jsx`):

| Section | Komponen | id | Isi saat ini |
|---|---|---|---|
| Navbar | `GlassSurface` (glassmorphism) + `TargetCursor` (custom cursor kotak) | — | Logo "Nerravs", menu: Karya, Pengalaman, Tentang, Stack, Kontak |
| Hero | `FaultyTerminal` (WebGL glitch/CRT background) + `BlurText` + `RevealImage` (efek reveal+glitch foto) + `SpecularButton` | — | Headline animasi kata-per-kata, marquee kata berjalan, 3 hero-stat |
| Pengalaman | `Experience.jsx` + `Lanyard` (kartu ID 3D draggable, model .glb 2.4MB + physics) | `#pengalaman` | Koordinator OSIS, 4 poin paragraf panjang |
| Pendidikan | `Education.jsx` + `ProfileCard` (tilt 3D + glow) | `#education` | SMKN 7 Samarinda, 4 poin paragraf panjang |
| Tentang | `Contrast.jsx` | `#tentang` | Band terang di tengah halaman gelap, 4 stat card |
| Karya | `Projects.jsx` + `AccordionGallery` | `#projects` | 5 **placeholder** (foto picsum.photos, belum ada proyek asli/link) |
| Stack | `TechStack.jsx` + `LogoLoop` | `#stack` | Marquee logo: HTML5, CSS3, Tailwind, JS, PHP, MySQL, Git, GitHub, VS Code, Figma |
| Kontak | `Footer.jsx` | `#footer` | Email `vnoved@gmail.com`, WhatsApp `wa.me/6289630415126`, **GitHub placeholder** (`github.com/username` — belum diisi) |

**Catatan penting temuan:**
- **Tidak ada section "Sertifikat"** sama sekali di kode saat ini — perlu dibuat baru kalau tetap mau ada.
- **Tidak ada toggle Light/Night mode** — seluruh tema saat ini fixed dark ("deep-space dark") dengan satu band terang (Contrast) sebagai penyeimbang. Sistem theming (light/dark) perlu dibangun dari nol.
- Nav item `Tentang` mengarah ke section `Contrast` (bukan Education), dan section `Education` (`#education`) sendiri **tidak ada link-nya di navbar** — ada inkonsistensi penamaan (Pendidikan vs Edukasi vs Tentang) yang perlu dirapikan.
- Section Karya (Projects) masih **placeholder penuh** — foto dari picsum.photos, label generik "Project 1–5", tanpa link. Ini perlu diisi konten asli sebelum/saat redesign, meskipun strukturnya "dipertahankan" sesuai permintaanmu.
- Footer punya link GitHub placeholder (`github.com/username`) — sesuai permintaan "kontak hanya WA & Email", ini perlu dihapus.
- Efek-efek berat yang jadi sumber kesan "AI glow": `FaultyTerminal` (CRT/glitch shader di hero), `RevealImage` (glitch reveal), `GlassSurface` (glass navbar dengan saturasi tinggi), `SpecularButton` (tombol dengan garis highlight bergerak + gradient ungu), `ProfileCard` & `Lanyard` (glow belakang kartu + tilt 3D + fisika drag), `TargetCursor` (cursor custom), marquee kata di hero. Semua ini kandidat utama untuk dihapus/disederhanakan.

---

## 2. Tujuan Redesign

- Hilangkan seluruh kesan "AI-generated / glow-glow / efek berlebihan" → ganti dengan **clean, minimal, profesional**.
- Nuansa **black & white** murni.
- **2 mode**: Light Mode (dominan putih) & Night Mode (dominan hitam), dengan toggle di navbar.
- Section **Pengalaman** & **Pendidikan**: dari 4-poin-paragraf-panjang → **1–2 kalimat inti** per kartu, mengikuti format kartu di screenshot (nomor urut, badge status, tag teknologi/bidang).
- Section **Kontak**: hanya **WhatsApp** & **Email** (hapus placeholder GitHub).
- Section **Proyek**: struktur dipertahankan (grid/gallery karya), tapi diisi data asli & disesuaikan styling ke tema baru (bukan lagi accordion dengan overlay ungu terang).
- Hapus semua komponen/efek yang tidak fungsional bagi desain baru.

---

## 3. Komponen yang Dihapus / Diganti

| Komponen lama | Tindakan | Alasan |
|---|---|---|
| `FaultyTerminal` (WebGL glitch background) | **Hapus** | Efek glitch/CRT = kesan AI/futuristik berlebihan |
| `RevealImage` (glitch reveal foto hero) | **Hapus**, ganti foto statis biasa | Efek glitch tidak sesuai tema clean |
| `GlassSurface` (navbar glass blur+saturasi) | **Sederhanakan** jadi navbar solid dengan border tipis | Glassmorphism berat, ganti minimal |
| `TargetCursor` (cursor kotak custom) | **Hapus** | Gimmick, tidak menambah kegunaan, sering dianggap "AI slop" |
| `SpecularButton` (tombol garis cahaya bergerak + gradient ungu) | **Ganti** jadi tombol solid monokrom (hitam/putih sesuai mode) | Warna ungu + efek specular tidak sesuai black & white |
| `Lanyard` (kartu ID 3D fisika draggable, .glb 2.4MB) | **Hapus** | Berat (three.js+rapier), sangat "flashy", tidak perlu untuk poin singkat |
| `ProfileCard` (tilt 3D + behindGlow) | **Hapus atau sederhanakan drastis** jadi card foto statis | Glow di belakang kartu = sumber kesan AI-glow |
| `AccordionGallery` (hover-expand dengan overlay ungu `#cf9eff`/`#0b0616`) | **Pertahankan struktur grid/showcase**, styling ulang ke monokrom, isi data asli | Sesuai permintaan "Proyek tetap dipertahankan" — hanya restyle |
| `Contrast` (band terang di tengah halaman gelap) | **Gabungkan konsepnya ke sistem Light/Night mode** — tidak perlu "band" khusus lagi karena seluruh halaman sudah bisa di-switch terang/gelap | Sudah tergantikan fungsinya oleh toggle mode |
| Hero marquee kata berjalan (`hero-marquee`) | **Hapus atau buat sangat minimal (opsional)** | Dekoratif, tidak esensial |
| `BlurText` (animasi blur kata-per-kata) | **Sederhanakan** jadi fade-in halus biasa, atau hapus | Animasi lucu tapi berlebihan untuk kesan profesional |

**Dipertahankan/digunakan ulang:** `LogoLoop` (marquee tech stack) bisa dipertahankan tapi disederhanakan (grayscale/monokrom, tanpa warna brand berwarna-warni), `useInView` hook (untuk reveal on scroll — dipakai versi minimal), struktur grid dua-kolom di Experience/Education (kolom kiri teks, kanan visual) bisa dipertahankan tapi visual kanan diganti jadi elemen statis/simple, bukan 3D.

---

## 4. Sistem Warna (Black & White Theme)

| Elemen | Light Mode | Night Mode |
|---|---|---|
| Background utama | `#FFFFFF` / `#FAFAFA` | `#0A0A0A` / `#111111` |
| Teks utama | `#111111` | `#F5F5F5` |
| Teks sekunder | `#555555` | `#AAAAAA` |
| Border/divider | `#E5E5E5` | `#2A2A2A` |
| Aksen tombol/highlight | Hitam solid | Putih solid |
| Card/surface | Putih, border tipis | `#161616`, border tipis |

- Tidak ada lagi warna ungu (`#7c3aed`, `#6d28d9`, `#e9d5ff`, `#cf9eff`) atau warna brand berwarna-warni di TechStack.
- Toggle disimpan di state React + `localStorage` (aman untuk project Vite/React asli ini, bukan artifact), transisi warna 200–300ms.

---

## 5. Rencana Section demi Section

### 5.1 Navbar
- Ganti `GlassSurface` → navbar solid sederhana (background sesuai mode + border-bottom tipis), sticky.
- Tetap: logo/nama, menu link, tombol "Hubungi Saya".
- Rapikan link: pastikan semua section (termasuk Pendidikan) ada di menu, konsisten penamaan (pilih salah satu: "Edukasi" atau "Pendidikan").
- Tambah toggle Light/Night (icon matahari/bulan) menggantikan `TargetCursor` yang dihapus.

### 5.2 Hero
- Hapus `FaultyTerminal` dan `RevealImage` glitch.
- Foto hero jadi gambar statis biasa (boleh tetap ada sedikit efek reveal halus/fade, tanpa glitch).
- Headline & subtext: animasi fade-in sederhana (bukan blur-per-kata beruntun), atau tampil langsung tanpa animasi.
- CTA tetap 2 tombol ("Lihat Karya", "Tentang Saya") tapi versi solid monokrom.
- Hero-stat (5+ Proyek, 3+ Tahun, 10+ Teknologi) dipertahankan sebagai elemen informatif ringkas.
- Hapus marquee kata berjalan di dasar hero (atau buat versi teks statis kecil).

### 5.3 Pengalaman (Experience) — format baru
Ganti dari "4 poin paragraf panjang + kartu ID 3D draggable" menjadi kartu ringkas ala screenshot:

```
[01] PENGALAMAN                              [Status: mis. "Sedang Aktif"]
Koordinator OSIS
Organisasi Siswa Intra Sekolah · 07/2024 – 12/2026
-----------------------------------------------
Ringkasan 1–2 kalimat: mis. "Memimpin Seksi Dokumentasi & Publikasi,
mengoordinasikan tim untuk memastikan seluruh kegiatan sekolah terdokumentasi
dan terpublikasi dengan baik."

BIDANG/PERAN:
[Kepemimpinan] [Dokumentasi] [Koordinasi Tim]
```
- Hapus `Lanyard` 3D card (berat & flashy) → ganti dengan elemen visual statis sederhana (foto/icon) atau dihilangkan sama sekali, area jadi 1 kolom penuh kalau perlu.

### 5.4 Pendidikan (Education) — format baru
Sama persis pola dengan screenshot referensi:

```
[01] EDUKASI                                 [Status: "Sedang Belajar"]
SMKN 7 Samarinda
-----------------------------------------------
[A] Ringkasan 1–2 kalimat: mis. "Mendalami pengembangan web & PBO,
    membangun proyek nyata bersama tim di jurusan PPLG."

BIDANG YANG DIEKSPLORASI:
[Web] [PBO] [Struktur Data] [UI/UX]
```
- Hapus `ProfileCard` tilt+glow → ganti foto sekolah/logo statis dalam frame sederhana (border tipis, tanpa efek glow di belakang).

### 5.5 Skill / Stack
- Pertahankan `LogoLoop` (marquee) tapi ubah tiap logo jadi **monokrom** (hitam di light mode / putih di night mode), hapus warna brand berwarna-warni.
- Alternatif: ganti jadi grid statis nama+icon skill tanpa marquee, kalau ingin lebih "diam" sesuai gaya galihaleanda.cloud.

### 5.6 Sertifikat (section baru — belum ada di kode)
- Perlu dibuat dari nol karena belum ada di repo.
- Format: grid/list card sederhana (nama sertifikat, penerbit, tahun), border tipis, tanpa efek 3D/glow.
- **Perlu data dari kamu**: daftar sertifikat yang ingin ditampilkan.

### 5.7 Proyek (Karya) — dipertahankan strukturnya
- Tetap pakai konsep gallery/grid (`AccordionGallery` bisa dipertahankan kerangkanya), tapi:
  - Ganti overlay warna ungu (`#cf9eff`, `#0b0616`) → overlay monokrom sesuai mode.
  - Hapus efek `grayscale` paksa di style lama kalau nanti fotonya sudah asli & ingin tetap berwarna saat hover (opsional, didiskusikan).
  - **Isi data proyek asli** menggantikan 5 placeholder picsum.photos — perlu foto, judul, deskripsi singkat, dan link tiap proyek dari kamu.

### 5.8 Kontak (Footer) — disederhanakan
- Sudah ada data asli: Email `vnoved@gmail.com`, WhatsApp `wa.me/6289630415126`.
- **Hapus** link GitHub placeholder (`github.com/username`).
- Tampilkan hanya 2 tombol/link besar: WhatsApp & Email, versi solid monokrom (ganti `SpecularButton`).
- Copy ajakan singkat tetap boleh dipertahankan ("Mari Berkolaborasi").

### 5.9 Footer bawah
- Copyright singkat dipertahankan: "© 2026 Muhammad Rafi".

---

## 6. Interaksi & Micro-animation (pengganti efek lama)

- Reveal-on-scroll: pertahankan pola `useInView` tapi animasi jadi **fade + sedikit translate-Y**, bukan blur/glitch/stagger rumit.
- Hover card/tombol: perubahan warna/border tipis atau elevasi ringan (shadow halus monokrom).
- Transisi light/night mode: fade warna smooth di seluruh halaman.
- Tidak ada lagi: custom cursor, glitch shader, specular light-sweep, 3D physics drag.

---

## 7. Dampak ke Dependencies (opsional, untuk performa)

Setelah komponen di atas dihapus, dependency berikut berpotensi **tidak lagi dipakai** dan bisa dicopot dari `package.json` untuk mengecilkan ukuran bundle:
- `@react-three/fiber`, `@react-three/rapier`, `@react-three/drei`, `three`, `meshline` (dipakai khusus `Lanyard`)
- `ogl` (dipakai khusus `FaultyTerminal`)
- `gsap`, `@gsap/react`, `motion` — cek dulu apakah masih dipakai komponen lain sebelum dihapus.

Ini akan mempercepat loading halaman secara signifikan (terutama karena `Lanyard` memuat model `.glb` 2.4MB + physics engine).

---

## 8. Keputusan Final

1. **Branding navbar:** tetap menggunakan "Nerravs".
2. **Proyek:** struktur grid dipertahankan dengan data placeholder dan status "Segera hadir" sampai foto, deskripsi, dan tautan proyek asli tersedia.
3. **Sertifikat:** section baru tetap dibuat dengan empty state "Daftar sertifikat menyusul" sampai nama sertifikat, penerbit, dan tahun tersedia.
4. **Pengalaman dan Pendidikan:** menggunakan ringkasan 1–2 kalimat, status badge, dan tag bidang; visual kanan memakai aset foto lokal yang sudah tersedia.
5. **Skill/Stack:** menggunakan marquee monokrom berbasis CSS.
6. **Font:** tetap menggunakan Poppins untuk body dan Space Grotesk untuk heading.
7. **Kontak:** hanya WhatsApp dan Email; GitHub tidak ditampilkan.

---

## 9. Langkah Eksekusi

1. Bangun design tokens (variabel CSS untuk warna light/night) + logic toggle mode di `App.jsx`.
2. Ganti/hapus komponen efek berat sesuai tabel di bagian 3, section per section: Navbar → Hero → Pengalaman → Pendidikan → Skill → Sertifikat (baru) → Proyek (restyle + isi data asli) → Kontak → Footer.
3. Bersihkan dependency yang sudah tidak terpakai dari `package.json`.
4. Jalankan lint dan production build untuk verifikasi.
5. Review hasil akhir, lalu deploy ulang ke Vercel.
