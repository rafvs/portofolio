# PRD — Landing Page Portofolio (Hero Section)

## 1. Ringkasan
Halaman hero portofolio dengan layout dua kolom: kiri berisi teks + tombol CTA, kanan berupa area gambar interaktif yang kosong secara default dan baru menampilkan foto/karya saat di-hover, dengan efek reveal ala **LaserFlow** (tanpa elemen laser beam-nya) dan efek glitch berkala.

Referensi visual: `Screenshot (544).png` (layout) dan halaman React Bits `Laser Flow` (mekanisme reveal).

---

## 2. Tujuan
- Landing page portofolio yang terasa modern, interaktif, dan sedikit "techy".
- Kesan pertama kuat lewat animasi teks saat halaman pertama kali dibuka.
- Area visual (foto/karya) tidak langsung "polos" ditampilkan — baru muncul saat user berinteraksi (hover), menambah rasa eksploratif.
- Tombol dengan efek specular/glossy agar terasa premium.

---

## 3. Struktur Layout (sesuai screenshot referensi)

```
┌─────────────────────────────────────────────────────────┐
│  Navbar: Logo | Work About Contact | [Get Started btn]  │
├───────────────────────┬───────────────────────────────────┤
│   KOLOM KIRI (merah)   │      KOLOM KANAN (biru)            │
│   - Headline (BlurText)│      - Area gambar (LaserFlow-     │
│   - Subheadline        │        style hover reveal, TANPA   │
│   - CTA: [Get Started] │        laser beam)                 │
│          [Learn more]  │      - Kosong saat idle             │
│                         │      - Glitch overlay tiap 6 detik  │
└───────────────────────┴───────────────────────────────────┘
```

- **Kolom kiri**: konten teks & tombol, rata kiri/tengah vertikal.
- **Kolom kanan**: kontainer visual, isi gambar diambil dari folder `/assets`.
- Layout **2 kolom side-by-side**, tinggi hero full viewport (atau mendekati), responsif ke stack vertikal di mobile.

---

## 4. Komponen & Perilaku

### 4.1 Navbar
- Logo/nama (kiri): mis. "Porto Rafi" (sesuaikan nama asli).
- Menu tengah: `Work`, `About`, `Contact`.
- Tombol kanan: `Get Started` — pakai **SpecularButton**.

### 4.2 Animasi Teks Awal (BlurText)
- Saat halaman pertama kali dibuka / di-refresh, headline & subheadline muncul dengan animasi blur-in (dari referensi komponen `BlurText`).
- `animateBy`: `"words"` untuk headline (efek muncul kata per kata).
- `direction`: `"bottom"` (teks masuk dari bawah sedikit sambil blur menghilang), sesuai contoh referensi.
- `delay` antar kata: ±80–110ms agar tidak terlalu lambat.
- Subheadline bisa animasi setelah headline selesai (pakai `onAnimationComplete` dari headline untuk trigger subheadline), atau `delay` awal yang lebih besar.
- Tombol CTA muncul terakhir (fade/slide in ringan) setelah teks selesai animasi.

### 4.3 Area Gambar Interaktif (kanan) — Reveal on Hover
Berdasarkan pola **"Image Example Interactive Reveal Effect"** di dokumentasi LaserFlow, tapi **tanpa render `<LaserFlow />` (tanpa laser beam sama sekali)**. Yang dipakai hanya mekanisme mask reveal berbasis posisi cursor:

- Default (idle, tidak di-hover): area kanan **kosong/transparan** (atau background gelap polos sesuai tema, mis. `#120F17`), gambar tidak terlihat.
- Saat cursor masuk & bergerak di atas area kanan:
  - Gambar (dari `/assets`) muncul mengikuti posisi cursor lewat **radial mask** (`WebkitMaskImage` / `maskImage` dengan `radial-gradient(circle at var(--mx) var(--my), ...)`), sama seperti contoh `revealImgRef` di dokumentasi LaserFlow.
  - `mixBlendMode: 'lighten'` opsional dipertahankan agar gambar menyatu dengan background gelap, atau diganti `normal` jika ingin warna gambar solid — perlu diputuskan saat implementasi.
  - Radius reveal mengikuti radial-gradient bertahap (0px tajam → 240px transparan), memberi efek "sorotan" mengikuti kursor.
- Saat cursor keluar area (`onMouseLeave`): posisi mask dikembalikan ke luar kanvas (`--mx: -9999px`, `--my: -9999px`) sehingga gambar kembali tersembunyi.
- **Tidak ada** shader Three.js / WebGL laser beam yang dirender — cukup CSS mask + mouse tracking (lebih ringan, tidak butuh dependency `three`).

### 4.4 Efek Glitch Berkala (tiap 6 detik)
Independen dari efek hover di atas — ini overlay tambahan di area kanan yang berjalan otomatis meskipun tidak di-hover:

- Setiap **6 detik**, sebuah gambar dari `/assets` (bisa gambar yang sama atau bergantian/random dari beberapa file) muncul sebentar di atas area kanan dengan efek **glitch/distorsi**, lalu menghilang lagi.
- Contoh implementasi efek glitch:
  - RGB channel split / chromatic aberration singkat.
  - Clip-path horizontal strip yang bergeser acak (efek "sobek").
  - Flicker opacity cepat sebelum settle atau langsung fade out.
- Durasi tampil efek glitch: ±400–800ms per siklus, lalu gambar hilang sampai siklus 6 detik berikutnya.
- Berjalan sebagai `setInterval` 6000ms, independen dari state hover (boleh tetap jalan walau user sedang hover, atau di-pause saat hover — **perlu keputusan**: rekomendasi → **pause saat user sedang hover** agar tidak tabrakan visual dengan reveal manual).

### 4.5 Tombol (SpecularButton)
- Dipakai untuk `Get Started` (navbar) dan `Get Started` / `Learn more` (hero).
- Style dasar mengikuti referensi: `baseColor`, `lineColor`, `intensity`, `followMouse` aktif agar cahaya specular mengikuti kursor saat mendekati tombol.
- Tombol sekunder (`Learn more`) bisa pakai varian outline / `tintOpacity` lebih rendah agar terlihat sebagai tombol sekunder.

---

## 5. Copy / Konten Teks (Bahasa Indonesia — tema Portofolio)

> Catatan: ini draft, silakan sesuaikan nama & detail personal sebelum dipakai.

**Navbar**
- Logo: `Nama Kamu` (mis. "Porto Rafi")
- Menu: `Karya` · `Tentang` · `Kontak`
- Tombol navbar: `Hubungi Saya`

**Headline (hero, animasi BlurText)**
> Membangun pengalaman digital yang berkesan.

**Subheadline**
> Saya [Nama], seorang [profesi/role — mis. Frontend Developer & Digital Designer] yang senang mengubah ide menjadi produk digital yang interaktif dan enak dipakai. Jelajahi karya saya di bawah ini.

**CTA**
- Tombol utama: `Lihat Karya`
- Tombol sekunder: `Tentang Saya`

**Micro-copy di area gambar (opsional, muncul kecil saat idle sebelum di-hover)**
> Arahkan kursor untuk melihat karya

---

## 6. Aset & Dependensi

| Kebutuhan | Sumber |
|---|---|
| Gambar reveal on-hover | `/assets/*.jpg` atau `.png` (foto/karya) |
| Gambar glitch overlay (tiap 6 detik) | Bisa dari file yang sama di `/assets`, atau set gambar lain khusus glitch |
| Font | Sesuai desain existing (sans-serif modern, terlihat di screenshot) |
| Dependency npm | `motion` (untuk BlurText), `ogl` (untuk SpecularButton) — **`three` TIDAK dibutuhkan** karena LaserFlow shader tidak dipakai |

---

## 7. Yang TIDAK Dipakai dari Referensi
- ❌ Shader/canvas laser beam dari `<LaserFlow />` (Three.js WebGL) — dihapus total.
- ❌ Props LaserFlow terkait beam (`horizontalBeamOffset`, `wispDensity`, `fogIntensity`, dll.) — tidak relevan lagi karena laser tidak dirender.
- ✅ Yang dipertahankan hanya pola **CSS mask reveal + mouse tracking** dari contoh "Interactive Reveal Effect".

---

## 8. Responsive
- Desktop: 2 kolom side-by-side (kiri teks, kanan gambar), sesuai screenshot.
- Tablet/Mobile: stack vertikal — teks di atas, area gambar di bawah (interaksi hover diganti/ditambah tap-to-reveal untuk touch device, karena tidak ada mouse hover di mobile).

---

## 9. Ringkasan Alur Interaksi

1. User buka/refresh halaman → headline & subheadline animasi blur-in kata per kata → tombol muncul.
2. Area kanan default kosong/gelap.
3. User hover di area kanan → gambar muncul mengikuti kursor via radial mask reveal.
4. User keluar dari area → gambar kembali tersembunyi.
5. Setiap 6 detik (independen dari hover, idealnya pause saat sedang di-hover) → gambar dari `/assets` muncul singkat dengan efek glitch/distorsi lalu hilang lagi.
6. Tombol `Get Started` / `Lihat Karya` menggunakan efek specular light yang mengikuti kursor.

---

## 10. Open Questions (perlu konfirmasi sebelum implementasi)
1. Nama, profesi, dan role yang dipakai di copy — final text-nya apa?
2. Gambar glitch tiap 6 detik: satu gambar tetap, atau bergantian acak dari beberapa file di `/assets`?
3. Saat glitch overlay muncul, apakah menimpa area yang sama dengan hover-reveal, atau di posisi/ukuran berbeda?
4. Warna tema (background, aksen) — ikut palet ungu/pink seperti di screenshot React Bits, atau disesuaikan?
5. Untuk mobile: hover diganti tap, atau gambar langsung ditampilkan tanpa interaksi?
