/**
 * main.jsx — Entry point aplikasi portfolio (React + Vite).
 *
 * File ini adalah pintu masuk pertama yang dieksekusi browser.
 * Cara kerjanya:
 *   1. `createRoot` membuat "root" React pada elemen <div id="root">
 *      yang sudah disediakan di index.html.
 *   2. `.render(...)` me-render komponen <App /> ke dalam root tersebut
 *      sehingga seluruh halaman portfolio mulai digambar.
 *   3. `StrictMode` adalah wrapper bawaan React yang menjalankan
 *      double-invoke pada render & efek saat development untuk
 *      mendeteksi bug (misal efek samping yang tidak dibersihkan).
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Gaya global: reset, variabel CSS, utilitas dasar
import App from './App.jsx' // Komponen utama berisi seluruh halaman

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)