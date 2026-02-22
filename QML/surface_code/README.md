# 🛡️ Surface Code — Kuantum Hata Düzeltme

## Surface Code Nedir?

Surface Code, kuantum hata düzeltme kodlarının en popüler ve en pratik olanıdır. Bir **emülatör veya yazılım değildir** — fiziksel qubit'lerin 2 boyutlu bir ızgara üzerinde nasıl düzenleneceğini ve hataların nasıl tespit edilip düzeltileceğini belirleyen bir **mimari plandır**.

### Temel Fikir

```
Ölç ── Veri ── Ölç ── Veri ── Ölç
 |      |      |      |      |
Veri ── Ölç ── Veri ── Ölç ── Veri
 |      |      |      |      |
Ölç ── Veri ── Ölç ── Veri ── Ölç
```

- **Veri qubitleri**: Gerçek hesaplama bilgisini taşır
- **Ölçüm qubitleri**: Komşu veri qubitlerini kontrol eder (bilgiyi bozmadan!)

### Nasıl Çalışır?

1. Veri qubitleri hesap yapar
2. Ölçüm qubitleri sürekli komşularını kontrol eder
3. Tutarsızlık varsa → **sendrom** (hata sinyali)
4. Klasik bilgisayar sendromu analiz eder
5. Düzeltme komutu gönderilir

**Kritik nokta**: Ölçüm qubitleri asıl bilgiyi ölçmez — sadece "komşular arasında fark var mı?" diye bakar. Bu sayede süperpozisyon bozulmaz!

### Sayılarla

| Parametre | Değer |
|-----------|-------|
| Hata eşiği | ~%1 |
| 1 mantıksal qubit için | ~1.000 fiziksel qubit |
| RSA-2048 kırmak için | ~20 milyon mantıksal = ~20 milyar fiziksel |
| Bugün mevcut | ~1.000 fiziksel qubit (IBM) |

## 📂 Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `SurfaceCode.jsx` | İnteraktif React görselleştirmesi — hata ekleme, sendrom ölçümü, düzeltme animasyonu |
| `surface_code_demo.ipynb` | Python/Qiskit ile Surface Code temel kavramları, sendrom hesaplama, görselleştirme |

## 🚀 React Bileşenini Çalıştırma

```bash
# Yeni React projesi oluştur
npx create-react-app surface-code-demo
cd surface-code-demo

# SurfaceCode.jsx dosyasını src/ klasörüne kopyala
cp SurfaceCode.jsx src/

# App.js'i düzenle:
# import SurfaceCode from './SurfaceCode';
# function App() { return <SurfaceCode />; }

npm start
```

Veya doğrudan [Claude Artifacts](https://claude.ai) üzerinden JSX olarak çalıştırılabilir.

## 🔗 Kaynaklar

- [Surface Codes: Towards practical large-scale quantum computation](https://arxiv.org/abs/1208.0928)
- [Google Quantum AI - Quantum Error Correction](https://quantumai.google/research/error-correction)
- [IBM Qiskit - Quantum Error Correction](https://qiskit.org/textbook/ch-quantum-hardware/error-correction-repetition-code.html)
