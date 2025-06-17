# Pipeline CI/CD Next.js dengan Deployment Azure

Repository ini berisi aplikasi Next.js dengan pipeline CI/CD lengkap yang secara otomatis membangun, menguji, dan melakukan deployment ke Azure Web App menggunakan GitHub Actions dan Azure Container Registry. Sistem ini menyediakan alur kerja otomatis yang memastikan kualitas kode melalui pengujian, membangun aplikasi dalam bentuk container, dan melakukan deployment ke lingkungan produksi di Azure.

## Overview Arsitektur

Proyek ini mengimplementasikan arsitektur pipeline tiga tahap yang mengikuti praktik DevOps modern. Tahap pertama berfokus pada menjalankan pengujian otomatis untuk memastikan kualitas dan fungsionalitas kode. Setelah pengujian berhasil dilakukan, tahap build membuat bundle aplikasi dan mengemasnya ke dalam image container Docker. Akhirnya, tahap deployment mengambil aplikasi yang sudah dikemas dan melakukan deployment ke layanan Azure Web App, membuatnya tersedia untuk pengguna akhir.

## Prasyarat

Sebelum mengimplementasikan pipeline ini, Anda perlu menyiapkan beberapa komponen dasar. Langganan Azure sangat penting, yang harus mencakup Azure Container Registry untuk menyimpan image Docker dan layanan Azure Web App untuk hosting aplikasi. Selain itu, Anda memerlukan proyek Supabase yang dikonfigurasi untuk operasi database dan repository GitHub dengan Actions yang diaktifkan untuk menjalankan workflow CI/CD.

## Konfigurasi GitHub Secrets yang Diperlukan

Pipeline bergantung pada beberapa nilai konfigurasi sensitif yang harus disimpan sebagai GitHub Secrets untuk menjaga keamanan. Untuk integrasi Supabase, Anda perlu mengkonfigurasi NEXT_PUBLIC_SUPABASE_URL dengan URL proyek Supabase Anda dan NEXT_PUBLIC_SUPABASE_ANON_KEY dengan kunci anonim Supabase Anda. Azure Container Registry memerlukan tiga secrets: AZURE_REGISTRY_URL yang berisi alamat server login ACR Anda, AZURE_REGISTRY_USERNAME untuk autentikasi, dan AZURE_REGISTRY_PASSWORD untuk akses yang aman. Terakhir, deployment Azure Web App memerlukan AZURE_WEBAPP_PUBLISH_PROFILE, yang berisi profil publikasi yang diunduh dari layanan Azure Web App Anda.

## Alur Kerja Pipeline CI/CD

Job: test (Continuous Integration)

Job test bertanggung jawab untuk memverifikasi kualitas dan fungsionalitas kode.

1. Checkout repository: Kode dari repositori di-checkout ke runner.

2. Setup Node.js: Lingkungan Node.js versi 18 disiapkan.

3. Install dependencies: Dependensi proyek diinstal menggunakan npm ci untuk instalasi yang bersih dan konsisten.

4. Run tests: Suite pengujian dijalankan menggunakan npm run test untuk memverifikasi fungsionalitas kode.



Job: build (Build Container Image)

Job build menunggu penyelesaian job test yang berhasil sebelum melanjutkan, menjaga integritas pipeline. Job ini bertugas membuat bundle aplikasi dan mengemasnya ke dalam Docker image.

1. Checkout repository: Kode dari repositori di-checkout lagi.

2. Setup Node.js: Lingkungan Node.js versi 18 disiapkan.

3. Install dependencies: Dependensi proyek diinstal menggunakan npm ci.

4. Build Next.js app: Aplikasi Next.js dibangun untuk produksi menggunakan npm run build.

5. Check Next.js version: Memverifikasi versi Next.js yang digunakan.

6. Log in to Azure Container Registry: Melakukan login ke Azure Container Registry (ACR) menggunakan AZURE_REGISTRY_USERNAME dan AZURE_REGISTRY_PASSWORD yang disimpan sebagai GitHub Secrets.

7. Build Docker image: Membuat Docker image dari aplikasi dengan tag latest dan URL registri ACR.

8. Push Docker image to ACR: Mendorong (push) Docker image yang baru dibuat ke Azure Container Registry untuk penyimpanan.



Job: deploy (Continuous Deployment)

Job deploy mewakili tahap akhir, menunggu job build selesai dengan sukses sebelum dieksekusi. Job ini bertugas mendeploy Docker image ke Azure Web App.

1. Checkout repo: Kode dari repositori di-checkout.

2. Deploy to Azure Web App: Menggunakan action azure/webapps-deploy@v2 untuk melakukan deployment.

  app-name: Menentukan nama Azure Web App yang akan dituju, yaitu CCWSRESERVE.

  slot-name: Menentukan slot deployment yang akan digunakan, yaitu Production.

  publish-profile: Menggunakan AZURE_WEBAPP_PUBLISH_PROFILE dari GitHub Secrets untuk autentikasi deployment.

  images: Mengacu pada Docker image yang akan di-deploy, yaitu nextjs-app:latest dari AZURE_REGISTRY_URL. Ini membuat aplikasi live dan dapat diakses oleh pengguna.

## Konfigurasi Docker

Aplikasi menggunakan konfigurasi Docker yang efisien yang dibangun di atas base image Node.js 18 Alpine, yang memberikan jejak yang lebih kecil sambil mempertahankan fungsionalitas penuh. Dockerfile menetapkan direktori kerja, menyalin file package untuk instalasi dependensi, menjalankan npm ci untuk instalasi package yang dioptimalkan, dan menyalin seluruh kodebase aplikasi. Variabel lingkungan untuk integrasi Supabase dikonfigurasi langsung di dalam image, aplikasi dibangun untuk produksi, port 3000 diekspos untuk lalu lintas web, dan container dimulai menggunakan perintah npm start.

Setup Docker ini menawarkan beberapa keuntungan termasuk penggunaan Alpine Linux untuk mengurangi ukuran image dan permukaan serangan, instalasi dependensi yang dioptimalkan melalui npm ci, variabel lingkungan yang telah dikonfigurasi untuk fungsionalitas langsung, dan ekspos port yang tepat untuk akses aplikasi web.

## Struktur Proyek

Repository mengikuti struktur standar dengan direktori .github/workflows yang berisi file ci-cd.yml yang mendefinisikan workflow GitHub Actions. Direktori root mencakup Dockerfile untuk containerisasi, package.json dan package-lock.json untuk manajemen dependensi Node.js, dan semua file dan direktori aplikasi Next.js standar.

## Pengembangan Lokal

Untuk bekerja dengan aplikasi secara lokal, mulailah dengan melakukan clone repository ke mesin pengembangan Anda dan navigasi ke direktori proyek. Instal semua dependensi menggunakan npm install, kemudian buat file .env.local dengan variabel lingkungan yang diperlukan termasuk NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY. Anda kemudian dapat memulai server pengembangan menggunakan npm run dev, menjalankan pengujian dengan npm test, atau membangun untuk produksi menggunakan npm run build diikuti dengan npm start.

Untuk pengembangan Docker lokal, bangun image menggunakan docker build -t nextjs-app, jalankan container dengan docker run -p 3000:3000 nextjs-app, dan akses aplikasi di http://localhost:3000 di browser web Anda.

## Monitoring dan Troubleshooting

GitHub Actions menyediakan monitoring komprehensif melalui tab Actions di repository Anda, di mana Anda dapat melacak status pipeline dan memeriksa log detail untuk setiap job. Azure Web App menawarkan monitoring kinerja melalui Azure Portal, Application Insights untuk pelacakan error runtime dan metrik kinerja, dan log deployment yang dapat diakses melalui pusat deployment Web App.

Masalah umum termasuk kegagalan build, yang biasanya menunjukkan secrets yang hilang atau salah dikonfigurasi, kegagalan Docker push yang menunjukkan masalah kredensial ACR, dan kegagalan deployment yang mungkin menunjukkan masalah konfigurasi Web App atau referensi image yang salah.

## Kinerja dan Keamanan

Pipeline dioptimalkan untuk kecepatan melalui penggunaan npm ci untuk instalasi dependensi yang lebih cepat, keamanan melalui manajemen GitHub Secrets, keandalan melalui dependensi job yang berurutan, dan konsistensi melalui pembersihan cache npm. Langkah-langkah keamanan termasuk menyimpan data sensitif sebagai GitHub Secrets, menggunakan Alpine Linux untuk mengurangi permukaan serangan, memanfaatkan ACR untuk penyimpanan image yang aman, dan memanfaatkan fitur keamanan bawaan Azure Web App.

## Kontribusi

Kontributor harus membuat branch fitur dari main, mengimplementasikan perubahan mereka, memastikan semua pengujian lulus secara lokal, push ke branch mereka, dan membuat Pull Request. Pipeline CI/CD akan secara otomatis menguji semua perubahan, memberikan umpan balik tentang kualitas kode dan fungsionalitas sebelum penggabungan.

## Dukungan

Untuk troubleshooting masalah GitHub Actions, periksa tab Actions dan log workflow di repository Anda. Masalah terkait Azure harus ditangani melalui Azure Portal dan dokumentasi resmi. Masalah spesifik Next.js dapat diselesaikan menggunakan dokumentasi resmi Next.js, sedangkan masalah Supabase harus diselidiki melalui dashboard dan dokumentasi Supabase.
