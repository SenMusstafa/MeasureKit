# MeasureKit — Ürün ve Geliştirme Yol Haritası

> Bu dosya **ne yapacağımızı** ve **hangi sırayla** yapacağımızı tanımlar.
> Kod örnekleri ve tasarım sistemi detayları için bkz. [app.md](app.md).
> Son güncelleme: 2026-09-15

---

## 1. Vizyon

Telefonun içindeki **her sensörü** ve **her dönüşüm tablosunu** tek bir üründe
toplayan, internetsiz çalışan (döviz hariç), reklamsız bir "ölçüm çantası".

Üç sütun:

| Sütun | Ne yapar | Veri kaynağı |
|---|---|---|
| **Ölç** | Telefon sensörleriyle fiziksel ölçüm | Donanım (accelerometer, magnetometer, mikrofon, kamera, barometre) |
| **Çevir** | Birim ve para birimi dönüşümü | Yerel tablolar + canlı kur API |
| **Hesapla** | Bilimsel + finansal hesaplamalar | Saf fonksiyonlar (offline) |

**Tasarım ilkeleri**
1. Her araç **tek ekranda** çalışır — ayar menüsüne girmeden sonuç verir.
2. Her ölçüm **kaydedilebilir** (Geçmiş) ve **favorilenebilir**.
3. Her sayı **kopyalanabilir** ve **paylaşılabilir**.
4. Kalibrasyon ve doğruluk sınırları kullanıcıya **dürüstçe** söylenir.
5. Offline-first: döviz kurları hariç hiçbir özellik ağa bağımlı değildir.

---

## 2. Mevcut Durum (2026-09-15)

| Alan | Durum |
|---|---|
| Navigasyon iskeleti (`App.tsx`) | ✅ var |
| Tema/renk sistemi (`src/constants/colors.ts`) | ✅ var |
| Araç kataloğu (`src/constants/tools.ts`) | ✅ var (8 araç tanımlı) |
| `HomeScreen` | ✅ çalışır durumda |
| `SoundScreen`, `useDecibel` | 🟡 taslak |
| `CompassScreen`, `LevelScreen`, `ConverterScreen`, `CurrencyScreen` | 🟡 boş placeholder |
| `useCompass`, `useLevel`, `units.ts`, `converter.ts`, store'lar | ❌ **dosya boş** |
| Ruler (AR), Calculator, Time ekranları | ❌ yok (route tanımlı, ekran yok) |
| Test altyapısı | ❌ yok |
| i18n (paket kurulu, kullanılmıyor) | ❌ yok |

**Kritik teknik borç:** proje Expo SDK 54'te, ama `AGENTS.md` SDK 56 şart koşuyor.
Bu, kod yazmadan önce çözülmesi gereken ilk iştir (bkz. Faz 0).

---

## 3. Teknoloji Kararları (Expo SDK 56)

SDK 56 temel sürümler: **React Native 0.85**, **React 19.2.3**, **Node ≥ 20.19**,
Android 7+ / `targetSdk 36`, iOS 16.4+.

| İhtiyaç | Paket | Not |
|---|---|---|
| Pusula, su terazisi, adım, yükseklik | `expo-sensors` | Magnetometer, Accelerometer, DeviceMotion, Barometer, Pedometer, Gyroscope |
| Ses seviyesi (dB) | **`expo-audio`** | SDK 56'nın yeni ses modülü. **`expo-av` kullanmayacağız** — bağımlılıktan çıkarılacak |
| Kamera | `expo-camera` | Açı tabanlı mesafe ölçümü + fotoğraf üstüne ölçüm |
| Gerçek kuzey, yükseklik, GPS mesafe | `expo-location` | |
| Dokunsal geri bildirim | `expo-haptics` | Terazi merkeze gelince, pusula kuzeye kilitlenince |
| Kalıcı veri | `@react-native-async-storage/async-storage` + `zustand/persist` | |
| Dışa aktarma (CSV/PDF) | `expo-file-system`, `expo-sharing`, `expo-print` | Faz 5 |
| Grafik / gösterge çizimi | `react-native-svg` + `react-native-reanimated` | Skia yalnızca dB spektrumu gerekirse |
| Matematik motoru | `mathjs` | Bilimsel hesap makinesi ifade ayrıştırma |
| Dil | `i18next` + `react-i18next` | TR (varsayılan) + EN |

**AR ölçüm hakkında dürüst uyarı:** ARKit/ARCore düzlem takibi Expo Go içinde
çalışmaz ve `expo-camera` bunu sağlamaz. İki aşamalı plan:
- **Faz 2 (Expo Go'da çalışır):** *trigonometrik* ölçüm — telefonun eğim açısı +
  bilinen göz/el yüksekliği ile mesafe ve yükseklik hesabı. Hata payı ~%5, açıkça belirtilir.
- **Faz 6 (development build gerekir):** gerçek AR düzlem takibi, native modül ile.

---

## 4. Özellik Kataloğu

### 4.1 Ölçüm Araçları (sensör)

| # | Araç | Ölçtüğü | Sensör | Notlar |
|---|---|---|---|---|
| 1 | **Pusula** | Manyetik + gerçek kuzey, 0–360°, kerteriz | Magnetometer + Location | Manyetik sapma düzeltmesi, kalibrasyon uyarısı (8-figürü), enlem/boylam/rakım göstergesi |
| 2 | **Su Terazisi** | Tek eksen eğim (−90°..+90°) | Accelerometer | Yatay/dikey mod, sıfırlama (kalibre), merkezde haptic |
| 3 | **Yüzey Düzlüğü** | İki eksen (X/Y) + bileşke eğim | Accelerometer | Kabarcık görünümü, "düz" toleransı ayarlanabilir (0.1°–2°) |
| 4 | **Eğim / Şev** | Derece ↔ yüzde (%) ↔ oran (1:N) | Accelerometer | Çatı eğimi, rampa eğimi, yol şevi ön ayarları |
| 5 | **Diyagonal / Açı Ölçer** | İki nokta arası açı, köşe açısı | Accelerometer + dokunmatik | Telefonu kenara dayayarak açı; kare kontrolü (90° doğrulama) |
| 6 | **Uzunluk (Trigonometrik)** | Mesafe, yükseklik, genişlik | Kamera + DeviceMotion | Göz yüksekliği girilir, iki kez nişan alınır |
| 7 | **Ses Seviyesi** | dB(A) anlık / ort. / tepe | Mikrofon (`expo-audio`) | Kalibrasyon ofseti, gürültü sınıflandırması (sessiz→zararlı), süre grafiği |
| 8 | **Titreşim** | RMS ivme, baskın frekans | Accelerometer @100Hz | Yüzey titreşimi, makine dengesizliği |
| 9 | **Yükseklik / Basınç** | Rakım, hPa, hava tahmini eğilimi | Barometer + Location | Deniz seviyesi referansı ayarlanabilir |
| 10 | **Işık Ölçer** | lux | LightSensor | Yalnız Android — iOS'ta gizlenir |
| 11 | **Metal / Manyetik Alan** | µT toplam alan | Magnetometer | Kablo/boru bulma; kalibre gerektirmez |
| 12 | **GPS Mesafe & Alan** | İki nokta arası, yürünen yol, çokgen alan | Location | Haversine + shoelace; arazi alanı hesabı |
| 13 | **Adım / Mesafe** | Adım sayısı, adımla mesafe | Pedometer | Adım uzunluğu kalibrasyonu |
| 14 | **Zamanlayıcı Araçları** | Kronometre, geri sayım, tempo (BPM) | — | Arka planda çalışır |

### 4.2 Birim Dönüştürücü Kategorileri

Her kategori `src/utils/units.ts` içinde **tek bir temel birime katsayı** olarak
tanımlanır (sıcaklık ve yakıt tüketimi hariç — bunlar fonksiyon ister).

| Kategori | Temel birim | Örnek birimler |
|---|---|---|
| Uzunluk | metre | mm, cm, m, km, inç, ft, yard, mil, deniz mili, mikron, ışık yılı, parsek |
| Alan | m² | mm², cm², m², hektar, dönüm, ar, ft², yard², acre, mil² |
| Hacim | litre | ml, l, m³, cm³, ft³, galon (US/UK), pint, kuart, fincan, yemek/çay kaşığı, varil |
| Ağırlık/Kütle | kilogram | mg, g, kg, ton, ons, lb, stone, karat, okka |
| Sıcaklık | — (fonksiyon) | °C, °F, K, Rankine, Réaumur |
| Hız | m/s | m/s, km/s, mph, knot, ft/s, mach |
| Zaman | saniye | ns, ms, s, dk, saat, gün, hafta, ay, yıl, on yıl, yüzyıl |
| Basınç | pascal | Pa, kPa, bar, psi, atm, mmHg, torr |
| Enerji | joule | J, kJ, kcal, kWh, BTU, eV, beygir-saat |
| Güç | watt | W, kW, MW, BG (hp), BTU/h |
| Veri | bayt | bit, B, KB/KiB, MB/MiB, GB/GiB, TB, PB |
| Veri Hızı | bit/s | bps, Kbps, Mbps, Gbps, MB/s |
| Açı | derece | derece, radyan, grad, dakika, saniye, tam tur |
| Yakıt Tüketimi | — (fonksiyon) | L/100km, km/L, mpg (US/UK) |
| Kuvvet | newton | N, kN, kgf, lbf, dyne |
| Tork | N·m | N·m, kgf·m, lbf·ft |
| Yoğunluk | kg/m³ | kg/m³, g/cm³, lb/ft³ |
| Frekans | hertz | Hz, kHz, MHz, GHz, RPM |
| Ayakkabı / Giysi Bedeni | — (tablo) | TR/EU, US, UK, JP — kadın/erkek/çocuk |
| Mutfak Ölçüleri | gram | Malzeme bazlı: un, şeker, su, süt, tereyağı (fincan ↔ gram) |
| Sayı Tabanı | — | 2, 8, 10, 16, 36 tabanı |
| Kağıt Boyutu | mm | A/B/C serileri, Letter, Legal |
| Radyasyon, Aydınlatma, Manyetik Alan | SI | Gy, Sv, lux, lümen, tesla, gauss |

### 4.3 Döviz ve Kıymetli Maden

- 150+ para birimi, **çapraz kur** (TRY↔JPY gibi).
- Kaynak: ücretsiz, anahtarsız API (`frankfurter.app` birincil, `open.er-api.com` yedek).
- **Offline kural:** son başarılı kur seti AsyncStorage'a yazılır; ağ yoksa
  "‼️ 3 saat önceki kur" rozeti gösterilir — sessizce eski veri gösterilmez.
- Altın (gram/çeyrek/yarım/tam), gümüş, Bitcoin/ETH opsiyonel ikinci sekme.
- Kur listesi favorilenebilir; ana ekranda 3 kurluk özet kartı.

### 4.4 Finans Hesaplamaları

| Hesap | Girdi | Çıktı |
|---|---|---|
| **Kredi / Taksit** | Tutar, vade, faiz oranı | Aylık taksit, toplam geri ödeme, **tam amortisman tablosu** |
| **Mevduat / Vadeli** | Anapara, vade, brüt faiz, stopaj | Net getiri, vade sonu bakiye |
| **Bileşik Faiz** | Anapara, düzenli katkı, yıllık getiri, süre | Yıl yıl büyüme + grafik |
| **KDV / Vergi** | Tutar, oran | KDV dahil/hariç ayrıştırma (%1, %10, %20 ön ayar) |
| **Kâr Marjı & İskonto** | Maliyet, satış, indirim | Marjı %, kâr, indirimli fiyat, çoklu indirim zinciri |
| **Enflasyon / Alım Gücü** | Tutar, yıl aralığı, oran | Bugünkü değer / gelecekteki değer |
| **Yüzde Araçları** | — | X'in %Y'si, artış/azalış %, oran değişimi |
| **Bahşiş & Hesap Bölüşme** | Tutar, kişi, % | Kişi başı tutar |
| **Yatırım Getirisi (ROI/CAGR)** | Başlangıç, bitiş, süre | ROI %, CAGR % |
| **Araç/Konut Kredisi karşılaştırma** | 2 senaryo | Yan yana toplam maliyet farkı |

> **Yasal not:** Tüm finans ekranlarının altında "Bu sonuçlar bilgilendirme
> amaçlıdır, yatırım tavsiyesi değildir." satırı bulunacak (App Store/Play
> finans kategorisi incelemesi için gerekli).

### 4.5 Çapraz Özellikler

- **Geçmiş:** her ölçüm/dönüşüm zaman damgalı kaydedilir, aranabilir, CSV'ye aktarılır.
- **Favoriler:** araçlar ve sık kullanılan birim çiftleri.
- **Paylaş / Kopyala:** tek dokunuşla sonuç kopyalama, ekran görüntülü paylaşım.
- **Tema:** koyu (varsayılan) / açık / sistem.
- **Dil:** TR / EN.
- **Erişilebilirlik:** ekran okuyucu etiketleri, dinamik yazı boyutu, renk körlüğü
  için kabarcık göstergelerinde şekil farkı (sadece renk ayrımı yok).
- **Widget / Hızlı Eylem:** (Faz 6) ana ekran kısayolları.

---

## 5. Mimari

```
src/
  components/        Paylaşılan görsel parçalar (Gauge, Bubble, NumPad, ResultCard…)
  constants/         colors.ts, tools.ts, typography.ts
  hooks/             useCompass, useLevel, useDecibel, useBarometer, useLocation…
  screens/           Her araç için bir ekran
  stores/            zustand: favorites, history, settings, rates
  utils/
    units/           Kategori başına tablo dosyası (length.ts, mass.ts …) + index
    converter.ts     Saf dönüşüm motoru
    finance.ts       Saf finans fonksiyonları
    sensors.ts       Filtreleme: low-pass, kayan ortalama, açı normalizasyonu
  i18n/              tr.json, en.json
```

**Kurallar**
1. `utils/` içindeki her şey **saf fonksiyon** — React'e, sensöre, ağa dokunmaz.
   Testler yalnızca burayı hedefler.
2. Sensör okuma **yalnızca hook'larda**. Ekran ham sensöre erişmez.
3. Ekranlar durum tutmaz; kalıcı durum zustand store'larında.
4. Her sensör hook'u şunu döner: `{ value, accuracy, isCalibrated, error, recalibrate() }`.
5. Ham sensör verisi **her zaman** low-pass filtreden geçer (α ≈ 0.15);
   ekranda zıplayan sayı olmayacak.

**Veri modeli (AsyncStorage)**

```ts
type HistoryEntry = {
  id: string;          // uuid
  toolId: string;      // 'compass' | 'converter' | ...
  label: string;       // "12.4 m" | "100 USD → 4.210 TRY"
  payload: object;     // araca özel ham veri
  createdAt: number;   // epoch ms
};
```

---

## 6. Fazlar

### Faz 0 — Temel Sağlamlaştırma  `[önce bu]`
- [ ] Expo SDK 54 → **56** yükseltmesi (`npx expo install expo@^56 --fix`)
- [ ] `expo-av` kaldır → `expo-audio`'ya geç (`useDecibel` yeniden yazılır)
- [ ] `app.json`: splash/ikon yolları mevcut asset isimleriyle eşleştir,
      izin metinlerini iOS + Android için tamamla
- [ ] ESLint + Prettier + TypeScript `strict: true`
- [ ] Jest + `@testing-library/react-native` kurulumu
- [ ] `npx expo-doctor` temiz çıktı

### Faz 1 — Dönüştürücü Çekirdeği (offline, test edilebilir)
- [ ] `utils/units/*` — 4.2'deki tüm kategoriler
- [ ] `converter.ts` — katsayı + fonksiyon tabanlı dönüşüm, hassasiyet/yuvarlama
- [ ] `ConverterScreen`: kategori seçici, çift alan, ters çevir, özel NumPad
- [ ] Birim arama, son kullanılanlar, favori birim çifti
- [ ] **Test:** her kategori için gidiş-dönüş ve bilinen referans değerler

### Faz 2 — Sensör Araçları
- [ ] `useLevel` + `LevelScreen` (tek eksen) ve **Yüzey Düzlüğü** (iki eksen)
- [ ] `useCompass` + `CompassScreen` (manyetik sapma, kalibrasyon akışı)
- [ ] Eğim/Şev ve Diyagonal açı ölçer
- [ ] `useDecibel` (expo-audio) + kalibrasyon ofseti + süre grafiği
- [ ] Trigonometrik uzunluk ölçümü (kamera + eğim)
- [ ] Barometre / rakım, ışık, manyetik alan
- [ ] Her ekranda: sonuç kaydet, kopyala, doğruluk uyarısı

### Faz 3 — Para Birimi ve Finans
- [ ] `ratesStore` — çek, önbellekle, bayatlık rozeti
- [ ] `CurrencyScreen` — arama, favori kurlar, çapraz kur
- [ ] `finance.ts` — 4.4'teki tüm hesaplar (saf fonksiyon + test)
- [ ] Amortisman tablosu ekranı + grafik
- [ ] Yasal uyarı bileşeni

### Faz 4 — Hesap Makinesi ve Zaman
- [ ] Bilimsel hesap makinesi (`mathjs`), geçmiş şeridi
- [ ] Sayı tabanı ve programcı modu
- [ ] Saat dilimleri, kronometre, geri sayım, tempo

### Faz 5 — Cilalama
- [ ] Geçmiş + Favoriler ekranlarının tamamlanması, CSV/PDF dışa aktarma
- [ ] i18n (TR/EN), açık tema, erişilebilirlik geçişi
- [ ] Boş durumlar, hata durumları, sensör yoksa zarif gizleme
- [ ] Onboarding: izin açıklamaları ve kalibrasyon turu

### Faz 6 — Yayın ve İleri Özellikler
- [ ] EAS Build (dev + production profilleri), EAS Update
- [ ] Gerçek AR ölçüm (development build, native modül)
- [ ] Widget / hızlı eylemler
- [ ] Mağaza materyalleri: ekran görüntüleri, gizlilik politikası, veri güvenliği formu
- [ ] Gizlilik: **hiçbir ölçüm verisi cihazdan çıkmaz** — yalnız kur API'sine anonim istek

---

## 7. Doğruluk ve Kalibrasyon Politikası

Ölçüm uygulamasının en büyük riski **yanlış sayıya duyulan güven**.

| Araç | Tipik hata | Kullanıcıya söylenen |
|---|---|---|
| Su terazisi | ±0.2° (kalibre sonrası) | "Düz bir yüzeyde sıfırlayın" |
| Pusula | ±5–15° (metal/mıknatıs yakınında daha kötü) | Kalibrasyon uyarısı + "manyetik parazit" tespiti |
| dB ölçer | ±3–5 dB (mikrofon kalibre edilmemişse) | "Profesyonel ölçüm yerine geçmez" |
| Trigonometrik uzunluk | ~%5 | Göz yüksekliği girişi zorunlu |
| Barometrik rakım | ±10 m (hava basıncı değişimi) | Deniz seviyesi referansı ayarı |

Her sensör ekranında bir **ⓘ** butonu: nasıl çalıştığı, hata payı, nasıl kalibre edilir.

---

## 8. Test Stratejisi

| Katman | Araç | Kapsam hedefi |
|---|---|---|
| `utils/` (birim, finans, sensör matematiği) | Jest | **%90+** — pazarlık yok |
| Hook'lar | Jest + sensör mock'ları | Mutlu yol + izin reddi |
| Ekranlar | Testing Library | Render + temel etkileşim |
| Cihaz | Manuel kontrol listesi | Her faz sonunda gerçek telefonda |

Referans testleri: `1 inç = 25.4 mm`, `100 °C = 212 °F`, `1 mil = 1609.344 m`,
`1 deniz mili = 1852 m`, 120 ay/%2.5 aylık kredi taksiti bilinen değerle karşılaştırma.

---

## 9. Sonraki Adım

**Faz 0.** SDK 56 yükseltmesi yapılmadan yeni kod yazmak, sonra iki kez yazmak demektir.
