# AGENT.md — Website Portofolio Muhammad Rafi

Dokumen ini adalah instruksi lengkap untuk AI coding agent yang mengerjakan project portofolio ini. Project sudah berjalan (Vite + React), sudah ada Hero section & Experience section, tapi masih ada bug dan section yang perlu ditambahkan. Ikuti brief di bawah ini section per section.

---

## 1. Gaya Visual (Design System)

**Nama style: "Dreamcore Glass"** — perpaduan **dark theme + dreamcore (nuansa ungu/pink lembut, atmosferik, sedikit surreal)** dengan **glassmorphism** (permukaan blur, border tipis semi-transparan, glow lembut).

Ciri-ciri berdasarkan screenshot referensi yang sudah dibuat:
- Background gelap pekat (`#0d0b14` – `#120F17` range).
- Aksen warna ungu-pink (`#cf9eff`, `#FF79C6`, gradient ungu ke pink).
- Card/kontainer pakai `background: rgba(255,255,255,0.05–0.1)`, `backdrop-filter: blur(...)`, `border: 1px solid rgba(255,255,255,0.1)`.
- Tombol dengan border tipis rounded-full/pill, ada efek glow/specular saat hover.
- Tipografi besar & bold untuk headline, jarak antar section lega (banyak whitespace/padding).
- Semua komponen visual interaktif diambil dari **React Bits** (https://reactbits.dev/get-started/index) — bukan bikin dari nol.

Terapkan warna & gaya ini konsisten ke SEMUA section baru (Education, Projects, Tech Stack, Footer), jangan cuma di Hero.

---

## 2. Konten dari CV (WAJIB DIPERSINGKAT — jangan copy semua isi CV)

Sumber: CV ATS `Rafi_SMK7_CV_ATS.pdf`. Ambil poin-poin penting saja, ringkas bahasanya, jangan masukkan seluruh isi CV mentah-mentah ke web.

### Identitas
- Nama: **Muhammad Rafi**
- Role: Frontend Developer & Digital Designer *(sudah dipakai di hero, pertahankan)*
- Lokasi: Samarinda, Indonesia
- Kontak: `vnoved@gmail.com`, WhatsApp `+62 896-3041-5126`, GitHub *(isi link GitHub asli)*

### Ringkasan singkat (versi persingkat untuk web, JANGAN pakai versi panjang dari CV)
> Siswa kelas XII PPLG di SMKN 7 Samarinda dengan fokus di Front-End Development. Terbiasa membangun antarmuka web yang interaktif dan responsif, didukung pengalaman kepemimpinan sebagai koordinator OSIS.

*(Ini versi ringkas 2 kalimat — jauh lebih pendek dari ringkasan penuh di CV. Agent boleh menyesuaikan gaya bahasa tapi tetap singkat, maksimal 2–3 kalimat.)*

### Pendidikan (untuk section Education baru)
- **Program**: Pemrograman Perangkat Lunak dan Gim (PPLG) — Kelas XII
- **Sekolah**: SMKN 7 Samarinda
- **Periode**: 07/2024 – 07/2027
- **Poin (persingkat jadi 3–4 poin singkat, bukan paragraf panjang seperti di CV)**:
  1. Mendalami Algoritma & Struktur Data, Pemrograman Berorientasi Objek (PBO), dan Pengembangan Web (HTML, CSS, PHP).
  2. Terlibat langsung dalam proyek front-end secara kolaboratif bersama tim.
  3. Membangun situs web responsif dan aplikasi manajemen tugas sebagai bagian dari portofolio proyek.
  4. Menguasai Tailwind CSS dan terbiasa mendesain antarmuka lewat Figma/Canva.

### Skill (untuk section Tech Stack / LogoLoop)
Hard skill yang ditampilkan sebagai logo:
- HTML5, CSS3, Tailwind CSS, JavaScript, PHP, MySQL, Git/GitHub, VS Code, Figma

*(Soft skill seperti Teamwork, Problem Solving, dll. TIDAK perlu jadi logo — cukup dipakai sebagai konteks di ringkasan/about kalau relevan, bukan di LogoLoop.)*

### Pengalaman OSIS
Sudah ada di Experience section sebelumnya (`PRD-Section-Pengalaman.md`) — tidak berubah, tetap dipakai apa adanya di section itu. Tambahkan saja periode **07/2024 – 12/2026** yang belum tercantum di section tersebut.

---

## 3. Navbar — Perbaikan

- Ubah link menu jadi **shortcut scroll ke tiap section** (anchor/scroll-to, bukan navigasi halaman baru):
  - `Karya` → scroll ke section **Projects**
  - `Tentang` → scroll ke section **Education** (atau "About", sesuaikan sebutan)
  - `Kontak` → scroll ke section **Footer**
  - Tambahkan juga shortcut ke **Pengalaman** dan **Stack** jika muat, atau gabungkan penamaan menu agar tetap ringkas (maks 4–5 item menu, jangan kepanjangan).
- Tombol `Hubungi Saya` di navbar → scroll ke Footer (bagian kontak/CTA kerja sama).
- Pastikan navbar tetap terlihat baik saat halaman di-scroll (sticky/fixed sudah bagus, pertahankan).

---

## 4. Bug Fix — Hero / Landing Page

**Masalah**: saat browser di-fullscreen, gambar di kolom kanan (area hover-reveal) terpotong, dan teks headline "Membangun pengalaman digital yang berkesan." juga terpotong di layar lebar.

**Perbaikan yang perlu dilakukan**:
1. Cek `overflow`, `max-width`, dan unit ukuran (px vs `vw`/`clamp`) pada container hero — kemungkinan container/gambar memakai lebar tetap (`px`) yang tidak scale ke layar besar.
2. Pakai `clamp()` untuk font-size headline (mis. `clamp(2rem, 5vw, 4rem)`) supaya otomatis mengecil/membesar sesuai lebar layar, bukan ukuran tetap yang bisa overflow di layar lebar/fullscreen.
3. Pastikan area gambar kanan (hover-reveal container) punya `overflow: hidden` yang benar dan `object-fit`/mask area disesuaikan dengan container, bukan ukuran absolut yang melebihi viewport saat fullscreen.
4. Test ulang di breakpoint umum: 1366px, 1920px, dan saat fullscreen (biasanya lebih lebar dari browser normal karena address bar hilang) — pastikan tidak ada elemen terpotong di semua kondisi ini.

---

## 5. Bug Fix — Experience Section (OSIS)

**Masalah 1 — Lanyard terlalu kecil / ada zero space**:
- Perbesar sedikit `<Lanyard />` (via ukuran container/CSS `.lanyard-wrapper`, dan/atau sesuaikan `position`/`fov` prop) supaya mengisi ruang kolom kanan lebih maksimal, kurangi jarak kosong (zero space) di sekitar kartu.

**Masalah 2 — Animasi teks terlalu cepat & semua jalan bersamaan (bikin lag)**:
- Root cause: animasi kemungkinan trigger begitu komponen mount (langsung jalan saat halaman load), bukan saat section benar-benar masuk viewport.
- **Perbaikan wajib**: animasi judul, subtitle, dan 4 poin **HARUS baru mulai jalan saat user scroll dan section ini masuk ke viewport** (pakai `IntersectionObserver` atau `ScrollTrigger` dari GSAP dengan `once: true`), bukan auto-run saat page pertama kali dibuka.
- Animasi antar elemen (judul → subtitle → poin 1–4) harus **stagger berurutan** dengan delay yang cukup (jangan render semua sekaligus dalam satu frame — ini penyebab lag). Gunakan delay antar poin ±150–200ms, dan pastikan tidak semua `SplitText`/animasi lain jalan di waktu yang sama dengan animasi hero atau komponen lain yang berat (Lanyard, dsb.) supaya tidak numpuk beban render.
- Perlambat kecepatan animasi sedikit dari implementasi saat ini (durasi & delay dinaikkan) agar terasa lebih smooth, tidak terburu-buru.

---

## 6. Section Baru — Education (di bawah Hero, sebelum/sesudah Experience — urutan menyesuaikan alur cerita: Hero → Experience (OSIS) → Education)

Layout 2 kolom (konsisten dengan pattern section lain):

```
┌─────────────────────────────────────────────────────────┐
│                     PENDIDIKAN                            │
├───────────────────────┬───────────────────────────────────┤
│   KOLOM KIRI            │      KOLOM KANAN                  │
│   - Nama sekolah &      │      - <ProfileCard /> React Bits │
│     jurusan             │        diisi foto sekolah sendiri │
│   - Periode              │        (user yang input foto)     │
│   - 3–4 poin ringkas    │                                     │
│     (animasi scroll,    │                                     │
│     sama pattern dgn    │                                     │
│     Experience section  │                                     │
│     yang sudah diperbaiki)│                                   │
└───────────────────────┴───────────────────────────────────┘
```

- **Kolom kiri**: pakai data Pendidikan yang sudah diringkas di bagian 2 di atas. Animasi teks & poin ikuti pattern yang SUDAH DIPERBAIKI di section Experience (trigger scroll, stagger, tidak lag) — konsisten, jangan bikin mekanisme animasi baru yang beda gaya.
- **Kolom kanan**: komponen `<ProfileCard />` dari React Bits.
  - `avatarUrl`: foto sekolah — user akan mengisi sendiri filenya di `/assets`, agent tinggal siapkan prop-nya mengarah ke path placeholder yang jelas (mis. `/assets/sekolah.jpg`) supaya gampang diganti user.
  - `name`, `title` di card diisi mis. nama sekolah / jurusan (`"SMKN 7 Samarinda"` / `"PPLG"`), atau bisa juga dipakai untuk data diri user (`"Muhammad Rafi"` / `"Siswa PPLG"`) — pilih salah satu yang lebih pas secara konteks section ini (rekomendasi: tampilkan identitas sekolah karena section-nya tentang pendidikan).
  - `enableTilt: true` untuk efek interaktif, `behindGlowEnabled: true` dengan warna glow menyesuaikan palet ungu/pink tema.

---

## 7. Section Baru — Projects (Karya)

- Gunakan komponen **`<AccordionGallery />`** dari React Bits.
- Isi `items`: array project/karya user — masing-masing perlu `image`, `label` (nama project), dan `link` (opsional, ke demo/repo).
- Karena belum ada data project riil dari CV (CV ini fokus ke pendidikan & organisasi, belum ada daftar project eksplisit), agent perlu:
  - Menyiapkan struktur data `items` yang **mudah diisi user nanti** (placeholder image + label seperti `"Project 1"`, `"Project 2"`, dst., dengan komentar/TODO agar user tinggal ganti).
  - Style-kan `accentColor`, `overlayColor` mengikuti palet ungu/pink tema Dreamcore Glass.
- Section ini jadi tujuan scroll dari menu `Karya` di navbar.

---

## 8. Section Baru — Tech Stack

- Gunakan komponen **`<LogoLoop />`** dari React Bits untuk menampilkan skill teknis secara berjalan otomatis (marquee).
- Isi `logos` dengan ikon-ikon untuk: **HTML5, CSS3, Tailwind CSS, JavaScript, PHP, MySQL, Git/GitHub, VS Code, Figma** (pakai `react-icons` seperti contoh di dokumentasi komponen — `SiHtml5`, `SiCss3`, `SiTailwindcss`, `SiJavascript`, `SiPhp`, `SiMysql`, `SiGit`/`SiGithub`, `SiVisualstudiocode`/`SiVscodium`, `SiFigma`).
- `direction="left"`, `speed` sedang (~80–100), `fadeOut: true` dengan `fadeOutColor` sesuai background gelap section ini, `scaleOnHover: true` untuk interaksi kecil saat di-hover.
- Section ini bisa diletakkan sebelum atau sesudah Projects — rekomendasi: **setelah Projects, sebelum Footer**, sebagai penutup ringkas sebelum ajakan kerja sama.

---

## 9. Footer Baru — Ajakan Kerja Sama

- Berisi CTA singkat ajakan kolaborasi/kerja sama.
- Tampilkan 3 channel kontak sebagai ikon/link:
  - **Gmail**: `vnoved@gmail.com` (mailto link)
  - **GitHub**: *(user isi link profil GitHub-nya sendiri — agent siapkan placeholder)*
  - **WhatsApp**: `+62 896-3041-5126` (wa.me link, format: `https://wa.me/6289630415126`)
- Style tetap Dreamcore Glass — bisa berupa card glass kecil berisi ketiga ikon, atau baris ikon sederhana dengan hover glow, konsisten dengan tombol `SpecularButton` yang sudah dipakai di hero (boleh dipakai ulang di footer untuk CTA utama, mis. tombol "Hubungi Saya via WhatsApp").
- Copy singkat, contoh: *"Tertarik berkolaborasi atau punya proyek yang ingin didiskusikan? Hubungi saya."*

---

## 10. Urutan Section Final (top → bottom)

1. Navbar (sticky)
2. Hero (sudah ada, perlu bug fix di bagian 4)
3. Experience — OSIS (sudah ada, perlu bug fix di bagian 5)
4. Education (baru — bagian 6)
5. Projects — AccordionGallery (baru — bagian 7)
6. Tech Stack — LogoLoop (baru — bagian 8)
7. Footer — kontak & kerja sama (baru — bagian 9)

---

## 11. Housekeeping / Cleanup

- Agent diminta **meninjau ulang project** dan menghapus file/komponen/CSS yang tidak lagi terpakai (dead code) — misalnya sisa dependency atau file boilerplate default Vite yang tidak relevan, komponen React Bits yang sempat dicoba tapi tidak jadi dipakai, dsb.
- Pastikan semua dependency baru yang dibutuhkan section baru sudah tercantum: `react-icons` (untuk LogoLoop), serta dependency AccordionGallery/ProfileCard/LogoLoop sesuai catatan masing-masing komponen React Bits (cek ulang apakah ada dependency tambahan yang perlu di-install).
- Rapikan struktur folder komponen (mis. satu folder per komponen React Bits: `LaserFlow/`, `BlurText/`, `SpecularButton/`, `SplitText/`, `Lanyard/`, `ProfileCard/`, `AccordionGallery/`, `LogoLoop/`) agar konsisten dan gampang di-maintain.

---

## 12. Referensi Terkait
- Layout awal hero: `PRD-Landing-Page-Portofolio.md`
- Detail section Experience (OSIS): `PRD-Section-Pengalaman.md`
- Library komponen: React Bits — https://reactbits.dev/get-started/index
