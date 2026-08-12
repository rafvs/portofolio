# PRD — Section "Pengalaman" (Landing Page Portofolio)

Section ini diletakkan **di bawah hero** yang sudah dijelaskan di `PRD-Landing-Page-Portofolio.md`. Bentuknya juga 2 kolom: kiri teks pengalaman (animasi saat di-scroll), kanan kartu 3D **Lanyard** dengan foto dari `/assets`.

---

## 1. Tujuan
Menampilkan pengalaman organisasi (OSIS) dengan cara yang tidak generik — teks muncul dengan animasi saat scroll masuk ke section ini, dan sisi kanan diisi elemen visual interaktif berupa kartu ID/lanyard 3D yang bisa di-drag, bukan sekadar foto statis.

---

## 2. Layout

```
┌─────────────────────────────────────────────────────────┐
│                     PENGALAMAN                           │
├───────────────────────┬───────────────────────────────────┤
│   KOLOM KIRI           │      KOLOM KANAN                   │
│   - Judul/role (animasi SplitText saat scroll)             │
│   - Nama organisasi    │      - <Lanyard /> 3D, kartu       │
│   - 4 poin deskripsi   │        tergantung, foto dari       │
│     (animasi stagger,  │        /assets di sisi depan kartu │
│     muncul satu-satu   │      - Bisa di-drag/di-swing user  │
│     saat scroll)       │                                     │
└───────────────────────┴───────────────────────────────────┘
```

- Section muncul setelah hero, dipisahkan jarak (padding) yang cukup agar terasa sebagai bagian baru.
- Trigger animasi: **saat section masuk viewport (scroll into view)**, bukan saat page load — beda dengan hero yang animasi begitu halaman dibuka.
- Desktop: 2 kolom sejajar. Mobile: stack — teks dulu di atas, kartu Lanyard di bawah (canvas 3D Lanyard butuh tinggi viewport cukup besar, perlu penyesuaian tinggi container khusus di mobile).

---

## 3. Kolom Kiri — Teks Pengalaman (Animasi)

Sumber teks (dari input kamu):

- **Peran**: Koordinator OSIS
- **Organisasi**: OSIS (Organisasi Siswa Intra Sekolah)
- **Poin-poin**:
  1. Memimpin dan bertanggung jawab penuh sebagai penanggung jawab pada Seksi Bidang Dokumentasi dan Publikasi.
  2. Mengoordinasikan anggota tim secara komunikatif guna memastikan seluruh dokumentasi kegiatan sekolah berjalan lancar dan terpublikasi dengan baik.
  3. Mengembangkan kemampuan analisis dan kepemimpinan dalam mengidentifikasi serta membantu menyelesaikan berbagai permasalahan organisasi secara terstruktur dan solutif.
  4. Menjaga efektivitas kerja sama tim lintas seksi untuk mencapai target program kerja organisasi secara sukses.

### Komponen animasi: **SplitText (judul) + Stagger per-poin (deskripsi)**
- Judul/role ("Koordinator OSIS") pakai `SplitText` dengan `splitType="words"`, trigger scroll (`threshold`, `rootMargin` sesuai default agar animasi jalan pas section mulai terlihat).
- Nama organisasi ("Organisasi Siswa Intra Sekolah") jadi subtitle kecil di bawah judul, animasi menyusul (delay lebih besar / dipicu lewat `onLetterAnimationComplete` dari judul).
- **4 poin** — **diputuskan animasi per-poin (per `<li>` utuh), BUKAN per-kata/per-huruf.** Artinya `SplitText` tidak dipakai di bagian poin; cukup animasi fade + translateY sederhana yang di-stagger antar `<li>`, setiap poin muncul sebagai satu blok teks utuh, satu per satu, saat section masuk viewport.
- Implementasi: pakai `IntersectionObserver` (atau GSAP `ScrollTrigger` biasa tanpa `SplitText`) pada container `<ul>`, lalu animasikan tiap `<li>` dengan `gsap.fromTo` / CSS transition, `stagger` antar item ±120–150ms.
- Urutan animasi: judul → subtitle/organisasi → poin 1 → poin 2 → poin 3 → poin 4 (tiap poin utuh, bukan huruf/kata per huruf).

---

## 4. Kolom Kanan — Kartu 3D (Lanyard)

- Menggunakan komponen `<Lanyard />` (Three.js + physics, kartu tergantung dan bisa di-drag/diayun user).
- **Foto**: sudah disiapkan & diberi nama sendiri oleh user di folder `/assets` — satu untuk `frontImage` (sisi depan kartu) dan satu untuk `backImage` (sisi belakang kartu). Saat implementasi tinggal arahkan kedua prop ini ke path file yang sudah dinamai tersebut, tidak perlu foto baru.
- `imageFit="cover"` supaya foto mengisi kartu tanpa distorsi/stretch.
- `gravity` & `position` pakai default dulu (`[0, -40, 0]` dan `[0, 0, 30]`), disesuaikan lagi setelah lihat hasil render agar kartu tidak terlalu besar/kecil relatif ke kolom kanan.
- Butuh file `card.glb` dan `lanyard.png` dari repo React Bits (aset model 3D-nya), plus setup `vite.config.js` (`assetsInclude: ['**/*.glb']`).
- Interaksi: user bisa **hover** (cursor berubah jadi "grab") dan **drag** kartu untuk mengayunkannya — physics simulation otomatis mengembalikan posisi kartu.

---

## 5. Dependensi Tambahan

| Kebutuhan | Keterangan |
|---|---|
| `gsap`, `@gsap/react` | Untuk `SplitText` |
| `three`, `meshline`, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier` | Untuk `Lanyard` (3D + physics) |
| `card.glb`, `lanyard.png` | Aset model 3D dari repo React Bits, wajib ada di project |
| Foto dari `/assets` | Untuk `frontImage` (dan opsional `backImage`) di kartu Lanyard |

> Catatan: dependency section ini (`three`, dsb.) terpisah dari hero — hero versi final **tidak** memakai `three` (laser dihapus), tapi section Pengalaman ini justru butuh `three` untuk Lanyard. Jadi `three` tetap ada di project, hanya dipakai di sini, bukan di hero.

---

## 6. Alur Interaksi

1. User scroll ke bawah dari hero, masuk ke section "Pengalaman".
2. Begitu section mulai terlihat di viewport → judul & subtitle animasi split-text, disusul 4 poin muncul satu-satu (stagger fade+slide).
3. Kartu Lanyard di kanan sudah aktif dari awal (fisika berjalan, kartu tergantung natural), foto profil terlihat di sisi depan kartu.
4. User bisa iseng men-drag kartu → kartu berayun mengikuti fisika, lalu kembali natural saat dilepas.

---

## 7. Keputusan Final
- ✅ `frontImage` & `backImage` sudah disiapkan & dinamai user di `/assets` — tinggal dipasang ke prop `Lanyard`.
- ✅ Animasi 4 poin: **per-poin (fade+slide per `<li>` utuh)**, bukan split per kata/huruf.

## 8. Open Questions (sisa)
1. Apakah section ini butuh judul besar di atas seperti "Pengalaman" / "Pengalaman Organisasi" sebagai heading section, terpisah dari judul "Koordinator OSIS"?
