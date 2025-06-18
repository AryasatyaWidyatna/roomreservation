# 🏬 CCWS Room Reservation 🏢

![CI/CD](https://github.com/AryasatyaWidyatna/roomreservation/actions/workflows/ci-cd.yaml/badge.svg)
[![Next.js](https://img.shields.io/badge/Next.js-13-blue)](https://nextjs.org/)
[![Deploy to Azure](https://img.shields.io/badge/Azure-App%20Service-blue)](https://azure.microsoft.com)

Sistem pemesanan ruang yang digunakan di lingkungan **CCWS** untuk mengatur jadwal dan ketersediaan ruangan. Aplikasi ini dibangun menggunakan **Next.js** dan di-*deploy* secara otomatis melalui pipeline **CI/CD GitHub Actions ke Azure App Service**.

📦 **Repository**: [CCWS Room Reservation (GitHub Repo)](https://github.com/AryasatyaWidyatna/roomreservation)
🔗 **Live Demo**: [CCWS Room Reservation (Live Site)](https://ccwsreserve-ftcsf2fefghphxc2.indonesiacentral-01.azurewebsites.net)  

[![Preview](https://raw.githubusercontent.com/AryasatyaWidyatna/roomreservation/main/app/assets/preview.jpg)](https://ccwsreserve-ftcsf2fefghphxc2.indonesiacentral-01.azurewebsites.net)

---
## 📌 Scope & Objectives

- **Lingkup**:
  - Frontend menggunakan Next.js
  - Backend menggunakan Supabase
  - CI/CD menggunakan GitHub Actions
  - Deployment ke Azure App Service dengan Docker container
- **Tujuan**:
  - Otomatisasi build, test, dan deploy
  - Monitoring kesehatan deployment
  - Fleksibilitas untuk dikembangkan lebih lanjut (eks: login, integrasi SSO)

---
## 🏗️ System Architecture

Arsitektur sistem ini dirancang untuk mendukung alur kerja pengembangan web modern berbasis **Next.js**, dengan integrasi ke pipeline **CI/CD** otomatis menggunakan **GitHub Actions** serta deployment ke **Azure Web App Service**.
```mermaid
graph TD
    A[Developer Push Code] --> B[GitHub Repository]
    B --> C[CI/CD Pipeline]

    C --> D[Test Job]
    D --> D1[Checkout Repo]
    D1 --> D2[Setup Node.js v18]
    D2 --> D3[Install Dependencies]
    D3 --> D4[Run Tests]

    D --> E[Build Job]
    E --> E1[Checkout Repo]
    E1 --> E2[Setup Node.js v18]
    E2 --> E3[Install Dependencies]
    E3 --> E4[Build Next.js App]
    E4 --> E5[Login to ACR]
    E5 --> E6[Build & Push Docker Image]

    E --> F[Deploy Job]
    F --> F1[Checkout Repo]
    F1 --> F2[Deploy to Azure Web App]
````
### 🧱 Komponen Utama Arsitektur:

1. **Frontend & Backend (Next.js Fullstack)**

   * Merupakan inti dari aplikasi, yang menggabungkan UI (React), API Routes (Serverless Functions), dan konfigurasi build modern menggunakan **Tailwind CSS**, **Vite**, serta modul modular di `components/`, `lib/`, dan `pages/`.

2. **Version Control: GitHub**

   * Semua perubahan kode dilakukan melalui Git dan disimpan dalam GitHub repository.
   * Setiap `push` ke branch `main` secara otomatis memicu pipeline CI/CD.

3. **CI/CD: GitHub Actions**

   * Pipeline dibagi menjadi tiga job utama:

     * `Test Job`: Mengeksekusi unit test menggunakan Jest/Vitest.
     * `Build Job`: Melakukan build Next.js dan membangun Docker image.
     * `Deploy Job`: Melakukan deployment ke Azure setelah build berhasil.

4. **Containerization: Docker + ACR**

   * Aplikasi dibungkus dalam Docker image.
   * Image didorong ke **Azure Container Registry (ACR)**.

5. **Deployment: Azure App Service**

   * Azure Web App akan menarik image terbaru dari ACR untuk di-deploy secara otomatis.
   * Publish dilakukan via **Publish Profile** yang disimpan aman dalam GitHub Secrets.

---

## 🔄 CI/CD Workflow

### 🧭 Diagram Alur CI/CD

<p align="center">
  <img src="./app/assets/flow.jpg" alt="CI/CD Workflow Diagram" width="700"/>
</p>

> Diagram ini menggambarkan orkestrasi proses Continuous Integration dan Continuous Deployment (CI/CD) pada aplikasi CCWS Room Reservation berbasis Next.js, Supabase, dan Azure.

---

### 🛠️ Tahapan Alur CI/CD

CI/CD pipeline dibangun menggunakan **GitHub Actions** dan terdiri atas tiga tahapan utama: *Test*, *Build*, dan *Deploy*. Pipeline di-trigger secara otomatis setiap kali terjadi push ke branch `main`, memastikan *delivery* yang cepat dan minim error.

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁


#### 1. **CI/CD – Testing Stage**

> *Tujuan: Menjamin kualitas kode dengan menjalankan automated tests*

* ✅ **Framework Testing:** Menggunakan **Jest** dan/atau **Vitest** untuk unit test dan coverage analysis.
* 🔍 **Linting:** ESLint dijalankan untuk memastikan kualitas dan konsistensi coding style.
* 📂 **File yang terlibat:**

  * `jest.config.js`, `jest.setup.js`, `vitest.config.js`
  * `.eslintrc.json`
  * `components/`, `lib/`, `app/`

📌 *Jika terdapat kegagalan di tahap ini, proses akan dihentikan dan deployment tidak dilakukan.*

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁


#### 2. **CI/CD – Build Stage**

> *Tujuan: Membangun dan mengemas aplikasi ke dalam Docker container*

* ⚙️ **Build Tools:**

  * **Next.js**: Membuat static dan server-rendered output
  * **Vite** *(opsional)*: Untuk dev build preview
* 🐳 **Docker Build:**

  * Image dibuat menggunakan `dockerfile` dengan konfigurasi Next.js production build
  * Image disimpan dan didorong ke **Azure Container Registry**
* 📂 **File yang terlibat:**

  * `dockerfile`, `.dockerignore`
  * `next.config.mjs`, `vite.config.ts`
  * `tailwind.config.js`, `babel.config.js`

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

#### 3. **CI/CD – Deployment Stage**

> *Tujuan: Mendeliver image yang telah dibangun ke lingkungan produksi (Azure App Service)*

* ☁️ **Platform:** Azure App Service
* 🔐 **Autentikasi:** Menggunakan *Publish Profile* (`AZURE_WEBAPP_PUBLISH_PROFILE`) yang disimpan sebagai GitHub Secret.
* 🚢 **Deployment:** Menarik image dari Azure Container Registry dan menjalankan container sebagai instance live.
* 📂 **File yang terlibat:**

  * `ci-cd.yaml` di dalam `.github/workflows`
  * Secrets GitHub (`AZURE_REGISTRY_URL`, `AZURE_WEBAPP_PUBLISH_PROFILE`, dll.)

---

### ⚙️ Teknologi yang Terlibat

| Komponen          | Teknologi                      |
| ----------------- | ------------------------------ |
| Source Control    | Git + GitHub                   |
| Build Tool        | Next.js, Vite                  |
| Styling           | Tailwind CSS                   |
| Backend           | Supabase                       |
| Containerization  | Docker                         |
| CI/CD Engine      | GitHub Actions                 |
| Registry          | Azure Container Registry (ACR) |
| Deployment Target | Azure App Service              |

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

### 🔐 Keamanan & Best Practice

* `.env.local` disertakan dalam `.gitignore` untuk mencegah kebocoran secrets.
* Semua secrets disimpan di GitHub Secrets, tidak ditulis langsung dalam workflow.
* Setiap tahap pipeline bersifat *fail-fast*, mencegah perubahan berbahaya ke production.
* Konfigurasi linting & testing ketat untuk menjaga standar kualitas kode.
---

## ⚙️ Alur Kerja Pipeline CI/CD

Pipeline ini dibagi menjadi **tiga tahap utama**: `test`, `build`, dan `deploy`. Masing-masing job memiliki tanggung jawab spesifik dan saling bergantung satu sama lain untuk memastikan integritas sistem sebelum live.

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

### 🧪 **Job: test** (Continuous Integration)

Job `test` bertanggung jawab untuk **memverifikasi kualitas dan fungsionalitas kode** sebelum masuk ke tahap build dan deploy.
1. **Checkout repository**
   Kode dari repositori diambil dan disiapkan untuk eksekusi.
2. **Setup Node.js**
   Menyiapkan environment Node.js versi **18.x**.
3. **Install dependencies**
   Menggunakan `npm ci` untuk instalasi yang bersih dan konsisten dengan `package-lock.json`.
4. **Run tests**
   Menjalankan pengujian menggunakan `npm run test` untuk memastikan fungsionalitas berjalan dengan benar.

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

### 🏗️ **Job: build** (Build Container Image)

Job `build` hanya dijalankan setelah `test` berhasil. Job ini membuat aplikasi production-ready dalam bentuk Docker image.
1. **Checkout repository**
   Kode diambil kembali untuk proses build.
2. **Setup Node.js**
   Menyiapkan environment Node.js versi 18.
3. **Install dependencies**
   Melakukan instalasi dependensi seperti pada tahap test.
4. **Build Next.js app**
   Menjalankan `npm run build` untuk membundel aplikasi dalam mode produksi.
5. **Check Next.js version**
   Memverifikasi versi framework yang digunakan.
6. **Login ke Azure Container Registry (ACR)**
   Autentikasi ke ACR menggunakan `AZURE_REGISTRY_USERNAME` dan `AZURE_REGISTRY_PASSWORD` dari GitHub Secrets.
7. **Build Docker image**
   Membuat image dengan tag `latest` yang ditujukan ke URL registri ACR.
8. **Push image ke ACR**
   Mendorong Docker image ke **Azure Container Registry** untuk siap di-deploy.

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

### 🚀 **Job: deploy** (Continuous Deployment)

Job `deploy` adalah tahap akhir yang dilakukan setelah build sukses. Proses ini akan menjadikan aplikasi live di Azure.

1. **Checkout repository**
   Mengambil ulang kode dari repository.
2. **Deploy to Azure Web App**
   Menggunakan GitHub Action `azure/webapps-deploy@v2`.
   * **app-name**: `CCWSRESERVE`
   * **slot-name**: `Production`
   * **publish-profile**: Menggunakan `AZURE_WEBAPP_PUBLISH_PROFILE` dari GitHub Secrets
   * **images**: `nextjs-app:latest` dari `AZURE_REGISTRY_URL`

---
## ⚙️ Implementasi Pipeline

### 1️⃣ Job `test` – Continuous Integration

#### 📁 Struktur File Terkait

| File/Folder                        | Peran di Job `test`                      |
| ---------------------------------- | ---------------------------------------- |
| `.github/workflows/ci-cd.yaml`     | Mendefinisikan job `test`                |
| `jest.config.js` & `jest.setup.js` | Konfigurasi dan bootstrap unit-test      |
| `vitest.config.js` *(opsional)*    | Alternatif framework test                |
| `.eslintrc.json`                   | Quality-gate linting (jika dipanggil)    |
| `package.json`                     | Script `npm run test`, daftar dependensi |

#### 📝 Cuplikan CI-test

```yaml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with: { node-version: '18' }
    - run: npm ci           # instal dependensi bersih
    - run: npm run test     # jalankan unit-test
```

#### 🚦 Tahap Eksekusi
1. **Checkout repo** – code di-pull ke runner.
2. **Setup Node.js 18** – environment konsisten.
3. **Install dependencies** – `npm ci` memastikan versi luk-in.
4. **Run tests** – menjalankan Jest/Vitest; workflow gagal bila ada tes gagal.

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁


### 2️⃣ Job `build` – Build Container Image
#### 📁 Struktur File Terkait

| File                                     | Fungsi                              |
| ---------------------------------------- | ----------------------------------- |
| `dockerfile`                             | Instruksi pembuatan image prod      |
| `.dockerignore`                          | Mengecilkan konteks build           |
| `next.config.mjs` & `tailwind.config.js` | Konfigurasi build Next.js & styling |
| `package.json`                           | Script `npm run build`              |
| `.github/workflows/ci-cd.yaml`           | Bagian job `build`                  |

#### 📝 Cuplikan CI-build

```yaml
build:
  runs-on: ubuntu-latest
  needs: test
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with: { node-version: '18' }
    - run: npm ci
    - run: npm run build                 # Next.js production build
    - run: npx next --version            # verifikasi versi
    - name: Login ACR
      run: echo "${{ secrets.AZURE_REGISTRY_PASSWORD }}" |
           docker login ${{ secrets.AZURE_REGISTRY_URL }} \
           -u ${{ secrets.AZURE_REGISTRY_USERNAME }} --password-stdin
    - run: docker build -t ${{ secrets.AZURE_REGISTRY_URL }}/nextjs-app:latest .
    - run: docker push  ${{ secrets.AZURE_REGISTRY_URL }}/nextjs-app:latest
```

#### 🚦 Tahap Eksekusi

1. **Dependensi Node** dipasang ulang (aman setelah lint/test).
2. **Build Next.js** – `npm run build` menghasilkan output prod di `.next/`.
3. **Login ke ACR** menggunakan secrets.
4. **Docker build & push** – image bertag `latest` dikirim ke registry.

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

### 3️⃣ Job `deploy` – Continuous Deployment

#### 📁 Struktur File Terkait

| File/Secret                    | Peran                                           |
| ------------------------------ | ----------------------------------------------- |
| `ci-cd.yaml`                   | Bagian job `deploy`                             |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Autentikasi deploy (GitHub Secret)              |
| `AZURE_REGISTRY_URL`           | Lokasi image di ACR                             |
| `dockerfile`                   | Basis container yang akan dijalankan oleh Azure |

#### 📝 Cuplikan YAML

```yaml
deploy:
  runs-on: ubuntu-latest
  needs: build
  steps:
    - uses: actions/checkout@v3
    - uses: azure/webapps-deploy@v2
      with:
        app-name: CCWSRESERVE
        slot-name: Production
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        images: '${{ secrets.AZURE_REGISTRY_URL }}/nextjs-app:latest'
```

#### 🚦 Tahap Eksekusi

1. **Checkout repo** (tidak wajib sebenarnya, tapi berguna untuk log).
2. **Deploy ke Azure Web App** via action resmi:

   * Menargetkan **app** `CCWSRESERVE`, slot **Production**.
   * Menarik image `nextjs-app:latest` dari ACR.
   * Azure menjalankan container & melakukan health check otomatis.

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

### 🧩 Catatan Penting

* **Fail-fast:** Jika `test` gagal, `build` & `deploy` berhenti ➜ menjaga integritas prod.
* **Secrets**: Semua kredensial (ACR & publish profile) disimpan di **GitHub Secrets**, tidak pernah ditulis di kode.
* **Scalability:** Azure Web App mendukung slot deployment & auto-scaling; image dapat dipromosikan tanpa downtime.
---

## ⚠️ Error / Issue GitHub Actions
Dalam proses pengembangan dan penerapan pipeline CI/CD menggunakan GitHub Actions pada proyek ini, terdapat beberapa kendala dan error yang sempat terjadi. Dokumentasi ini bertujuan untuk mencatat permasalahan yang muncul beserta analisis penyebab dan solusi yang dilakukan. Dengan demikian, diharapkan dapat menjadi referensi bagi pengembang lain apabila menghadapi masalah serupa di masa mendatang.
Siap, ini versi lengkapnya dengan penambahan tautan ke GitHub Actions untuk referensi error-nya:

---
### ❌ Error  `sh: 1: jest: not found`

**Deskripsi Masalah:**
Pada eksekusi perdana pipeline, proses `npm run test` gagal dijalankan karena `jest` tidak ditemukan di environment runner. Log error:

```bash
sh: 1: jest: not found
```

📍 [Lihat detail error di GitHub Actions](https://github.com/AryasatyaWidyatna/roomreservation/actions/runs/15559618252/job/43808428239)

**Penyebab:**
Error ini disebabkan oleh belum terinstallnya dependensi project, termasuk `jest`, sebelum menjalankan perintah `npm run test`.

**Solusi:**
✔️ Tambahkan step `npm install` sebelum `npm run test` agar semua dependensi terinstall:

```yaml
- name: Install dependencies
  run: npm install
```

✔️ Pastikan juga `jest` tercantum di `devDependencies` pada `package.json`:

```bash
npm install --save-dev jest
```

**Status:**
✅ Sudah diperbaiki — pipeline berhasil berjalan setelah step `npm install` ditambahkan dan `jest` terinstall dengan benar.

---

### ❌ Error `sh: 1: next: not found`

**Deskripsi Masalah:**
Pipeline gagal saat menjalankan `npm run build` karena perintah `next` tidak dikenali oleh environment runner. Log error:

```bash
sh: 1: next: not found
```

📍 [Lihat detail error di GitHub Actions](https://github.com/AryasatyaWidyatna/roomreservation/actions/runs/15559800186)

**Penyebab:**
Error ini muncul karena dependensi project, termasuk framework **Next.js**, belum terinstall sebelum proses build dijalankan.

**Solusi:**
✔️ Sama seperti error sebelumnya, solusi utamanya adalah menambahkan step `npm install` sebelum step `npm run build`, agar semua dependensi, termasuk `next`, terinstall dengan baik.

```yaml
- name: Install dependencies
  run: npm install
```

✔️ Pastikan juga bahwa `next` ada di `dependencies` atau `devDependencies` di `package.json`:

```bash
npm install next
```

**Status:**
✅ Sudah diperbaiki — error ini tidak muncul lagi setelah `npm install` ditambahkan pada awal proses pipeline.

---
### ❌ Error `SyntaxError: Unexpected token, expected "," (8:22)`

**Deskripsi Masalah:**
Test unit gagal dijalankan karena error parsing syntax oleh Babel saat mengeksekusi file `page.test.jsx`. Log error mengarah ke bagian mock `next/link`:

```js
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => children;
});
```

📍 [Lihat detail error di GitHub Actions](https://github.com/AryasatyaWidyatna/roomreservation/actions/runs/15585385944/job/43890167468)

**Penyebab:**
Jest dan Babel tidak mengenali anotasi tipe TypeScript (`: { children: React.ReactNode }`) karena file `page.test.jsx` masih berformat `.jsx`, bukan `.tsx`, dan tidak dikompilasi dengan dukungan TypeScript.

**Solusi:**
✔️ Ubah syntax menjadi compatible dengan JavaScript biasa, misalnya:

```js
jest.mock('next/link', () => {
  return ({ children }) => children;
});
```

Atau, jika ingin menggunakan TypeScript-style:

1. Ubah ekstensi file menjadi `.tsx`
2. Pastikan Jest dan Babel dikonfigurasi untuk mendukung TypeScript

**Status:**
✅ Sudah diperbaiki dengan menghapus anotasi tipe agar sesuai format JavaScript standar.

---
### ❌ Error `Jest encountered an unexpected token (JSX not enabled)`

**Deskripsi Masalah**  
Saat menjalankan `npm run test`, Jest gagal mem‐parse file **`app/page.jsx`** yang berisi JSX karena preset Babel untuk React belum diaktifkan.

```bash
SyntaxError: Support for the experimental syntax 'jsx' isn't currently enabled (52:5)
...
Add @babel/preset-react to the 'presets' section of your Babel config to enable transformation.
````

📍 [Detail log GitHub Actions](https://github.com/AryasatyaWidyatna/roomreservation/actions/runs/15586049222/job/43892419211)

**Penyebab**
Jest menggunakan Babel untuk mentransformasi file test, tetapi konfigurasi Babel (`babel.config.js`) belum menambahkan **`@babel/preset-react`** sehingga sintaks JSX di file `.jsx` tidak dikenali.

**Solusi**

1. **Pasang preset React**

   ```bash
   npm install --save-dev @babel/preset-react
   ```
2. **Perbarui `babel.config.js`**

   ```js
   module.exports = {
     presets: [
       '@babel/preset-env',
       '@babel/preset-react',   // ➜ tambahkan baris ini
     ],
   };
   ```
3. Pastikan Jest membaca konfigurasi Babel yang sama (file `babel.config.js` berada di root repo).
**Status**
✅ **Fixed** — Setelah preset React ditambahkan dan pipeline dijalankan ulang, Jest berhasil mem-parse file JSX dan semua test lulus.

---

### ❌ Error `React is not defined` saat `next build`

**Deskripsi Masalah**  
Pipeline gagal saat menjalankan `npm run build` karena terjadi error saat proses **prerendering halaman `/not-found`**. Log menunjukkan bahwa **React tidak dikenali**:

```bash
ReferenceError: React is not defined
````

📍 [Detail log GitHub Actions](https://github.com/AryasatyaWidyatna/roomreservation/actions/runs/15587405115/job/43897234064)

**Penyebab**
File `app/_not-found/page.jsx` tidak menyertakan `import React from "react";`. Meskipun dengan Next.js 13+ (App Router), import `React` *tidak wajib* secara eksplisit, **hal ini tetap diperlukan saat JSX digunakan langsung dalam file JS tanpa transpiler seperti SWC aktif**.

> SWC dinonaktifkan karena penggunaan custom `babel.config.js`:
>
> ```
> Disabled SWC as replacement for Babel because of custom Babel configuration
> ```

**Solusi**
Tambahkan baris berikut di paling atas file `app/_not-found/page.jsx`:

```js
import React from 'react';
```

**Status**
✅ **Fixed** — Setelah menambahkan `import React` di file `_not-found`, pipeline berhasil menyelesaikan `next build`.

---

### ❌ Error `ReferenceError: React is not defined` saat `next build`

**Deskripsi Masalah**  
Build gagal pada proses **prerendering** halaman **`/admin/room`**. Log menunjukkan `React is not defined`.

```bash
Error occurred prerendering page "/admin/room"
ReferenceError: React is not defined
````

📍 [Log lengkap GitHub Actions](https://github.com/AryasatyaWidyatna/roomreservation/actions/runs/15590268317/job/43907340149)

**Penyebab**
File **`app/admin/room/page.jsx`** memakai JSX tetapi tidak menyertakan `import React` di awal file. Karena SWC dinonaktifkan (custom `babel.config.js`), Babel mengharuskan import eksplisit.

**Solusi**
Tambahkan baris berikut di paling atas `app/admin/room/page.jsx`:

```js
import React from 'react';
```

**Status**
✅ Fixed — Setelah menambahkan import di atas, proses `next build` berhasil tanpa error.

---
### ❌ Error: `Cannot find module '@/lib/supabaseClient'`

**Deskripsi Masalah:**
Saat menjalankan perintah `npm run test` di GitHub Actions, salah satu file test yaitu `app/login/page.test.jsx` gagal karena tidak dapat menemukan module `'@/lib/supabaseClient'`.

```bash
Cannot find module '@/lib/supabaseClient' from 'app/login/page.test.jsx'
```

📍 [Lihat detail error di GitHub Actions](https://github.com/AryasatyaWidyatna/roomreservation/actions/runs/15697331270)

**Penyebab:**
Import path `'@/lib/supabaseClient'` menggunakan alias `'@'` yang biasanya didefinisikan di `jsconfig.json`. Namun, secara default, environment GitHub Actions dan Jest tidak mengenali alias ini kecuali dikonfigurasi secara eksplisit.

**Solusi:**
Menambahkan konfigurasi `moduleNameMapper` agar Jest dapat mengenali alias `'@'`:

1. Pastikan di `jest.config.js` atau `jest.config.mjs` terdapat:

   ```js
   module.exports = {
     // konfigurasi lainnya...
     moduleNameMapper: {
       '^@/(.*)$': '<rootDir>/$1',
     },
   };
   ```

2. Pastikan juga bahwa struktur direktori proyek sesuai, yakni folder `lib` berada langsung di root repository.

**Status:**
✅ Sudah diperbaiki — pipeline berhasil melewati tahap `test` setelah konfigurasi di atas diterapkan.

---
### ⚠️ Masalah yang Mungkin Dihadapi

Saat melakukan testing, penting untuk **tidak menguji seluruh halaman atau layout secara menyeluruh**, terutama ketika sebagian besar elemen hanya bersifat visual atau statis.

**Contoh kasus:**  
Pada komponen halaman utama terdapat bagian seperti berikut:

```jsx
{/* Glassmorphism Card */}
<div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl">
  ...
  <Link href="/register">
    <button className="group ...">
      Regist sebagai Client
    </button>
  </Link>
</div>
````

Dalam kasus ini, cukup **fokus menguji tombol "Regist sebagai Client"**, karena:

* Tombol tersebut **berpengaruh pada navigasi** ke proses registrasi.
* Bagian lain seperti `<h1>`, `<p>`, atau efek visual (`blur`, `gradient`, dll) bersifat presentasional dan tidak perlu dites fungsionalitasnya.

🚫 *Kesalahan umum:* Melakukan test untuk seluruh struktur `<div>` dan elemen visual secara berlebihan.

✅ *Solusi tepat:*
Lakukan pengujian terhadap komponen yang memicu aksi penting (misal: navigasi, form submission, interaksi user) agar proses testing **lebih efisien dan tidak redundant**.

---
## 🧑‍💻 Local Development

```bash
git clone https://github.com/AryasatyaWidyatna/roomreservation
cd roomreservation
npm install
npm run dev
```

---

## 🙋‍♀️ Developers
* Arayzi Rayyansyah       (5026221194) - Lead
* Dicky Febri Primadhani  (5026221036) - Member
* M. Rafi Novyansyah      (5026221171) - Member
* Arya Satya Widyatna     (5026221207) - Member

---
