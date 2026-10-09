# Portfolio — Anik G Fauzul

Website portfolio statis (HTML/CSS/JS murni, tanpa build). Semua yang perlu di-upload ada di folder ini.

## Struktur

```
website/
├─ index.html            ← semua konten teks
├─ assets/css/style.css  ← desain & layout responsif
├─ assets/js/main.js     ← animasi, interaksi, data studi kasus (PROJECTS)
├─ assets/video/         ← video hero + 6 video layanan (sudah dikompres)
└─ assets/img/           ← foto, karya, logo klien, ikon, og.jpg (gambar share)
```

## Preview di komputer

Jalankan dari folder `PORTFOLIO V2`, lalu buka http://localhost:5173

```bash
npx serve website -l 5173
```

Alternatif tanpa Node: `python -m http.server 5173 --directory website` (video di Safari butuh server yang mendukung range request, jadi `npx serve` lebih aman).

## Online-kan

Pilih salah satu — semuanya gratis untuk situs statis:

- **Netlify Drop** — buka app.netlify.com/drop lalu seret folder `website`.
- **Vercel** — `npx vercel website`.
- **GitHub Pages** — push isi folder `website` ke repo, aktifkan Pages.
- **Hosting cPanel** — upload isi folder `website` ke `public_html`.

Setelah punya domain, ganti `content="assets/img/og.jpg"` di `index.html` menjadi URL lengkap (mis. `https://domainkamu.com/assets/img/og.jpg`) agar preview link di WhatsApp/Instagram muncul.

## Mengubah konten

- **Teks, layanan, timeline, kontak** → langsung di `index.html`.
- **Isi pop-up studi kasus** (deskripsi, scope, link, galeri) → objek `PROJECTS` di awal `assets/js/main.js`.
- **Level skill** → atribut `data-level` dan `style="--v:.9"` pada tiap `.tool` di `index.html`.
- Teks deskripsi proyek ditulis ulang dari PDF portfolio — cek lagi agar sesuai dengan peran kamu di tiap proyek.

## Catatan teknis

- Library dimuat dari CDN (GSAP 3.14.2, Lenis 1.3.21, Matter.js 0.20.0, Three.js 0.185.1) dan font dari Google Fonts, jadi butuh koneksi internet. Jika CDN gagal, situs tetap tampil tanpa animasi.
- Laptop 3D di kartu "Website Design" ada di `assets/js/laptop3d.js` (Three.js baru diunduh saat kartu mendekati layar). Isi layarnya gambar `assets/img/laju/screen.webp` (tangkapan lajuorder.com) — ganti file itu kalau tampilan situsnya berubah. Kalau WebGL tidak tersedia, yang tampil gambar statis `poster.webp`.
- Ponsel memakai crop video potret khusus (`hero-m.mp4`); tablet & desktop memakai versi 1280×720.
- Pengunjung dengan setelan "kurangi gerakan" (reduced motion) mendapat versi statis tanpa autoplay.
