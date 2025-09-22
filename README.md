
# Water Bender App

Water Bender App adalah aplikasi mobile berbasis React Native untuk monitoring kedalaman air secara real-time dan historis. Aplikasi ini digunakan untuk menampilkan data sensor air, grafik kedalaman air, serta menyediakan fitur login dan registrasi pengguna. Dikembangkan untuk kebutuhan monitoring di lingkungan pertambangan atau industri yang membutuhkan pemantauan level air.

## Fitur Utama

- **Dashboard**: Menampilkan grafik kedalaman air harian, bulanan, dan periode tertentu.
- **Login & Registrasi**: Autentikasi pengguna dengan penyimpanan data menggunakan Redux dan Redux Persist.
- **Visualisasi Data**: Grafik interaktif menggunakan `react-native-gifted-charts`.
- **Multi Platform**: Mendukung Android dan iOS.

## Struktur Project

- `src/screens/`: Berisi halaman utama seperti Dashboard, Login, Register, dan Splash.
- `src/components/`: Komponen UI custom seperti Button, Modal, Header, dsb.
- `src/redux/`: State management menggunakan Redux Toolkit dan Persist.
- `src/tools/`: Konstanta, helper, dan utilitas aplikasi.
- `src/assets/`: Asset gambar dan font.

## Instalasi

### Prasyarat

- Node.js >= 18
- npm atau yarn
- Android Studio (untuk build Android) / Xcode (untuk build iOS)
- Sudah melakukan [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd water_bender_app
   ```
2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```
3. **Jalankan Metro Bundler**
   ```bash
   npm start
   # atau
   yarn start
   ```
4. **Build dan jalankan aplikasi**
   - Untuk Android:
     ```bash
     npm run android
     # atau
     yarn android
     ```
   - Untuk iOS:
     ```bash
     npm run ios
     # atau
     yarn ios
     ```

## Konfigurasi Tambahan

- Pastikan emulator/simulator sudah berjalan sebelum menjalankan aplikasi.
- Untuk build iOS, jalankan `pod install` di folder `ios/` setelah install dependencies.

## Troubleshooting

Jika mengalami kendala, silakan cek dokumentasi [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting) atau hubungi pengembang.

## Lisensi

Proyek ini dikembangkan oleh PT. Kalimantan Prima Persada untuk kebutuhan internal monitoring.
