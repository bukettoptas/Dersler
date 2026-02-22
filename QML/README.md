# 🔬 Kuantum Makine Öğrenmesi (QML)

Bu klasör, Kuantum Hesaplama ve Kuantum Makine Öğrenmesi dersine ait materyalleri içerir.

## 📂 Klasör Yapısı

```
QML/
├── README.md                    # Bu dosya
├── temel_kavramlar/             # Kuantum hesaplamanın temelleri
│   ├── README.md
│   ├── Bloch_Riemann_Kuresi_Sunum.pptx
│   ├── Kuantum_Kapilari_Sunum.pptx
│   ├── Fiziksel_vs_Mantiksal_Qubit.pptx
│   └── QML_Giris_Colab.ipynb
├── kuantum_kapilari/            # Kapı detayları ve uygulamaları
│   ├── README.md
│   └── Kuantum_Kapilari_Colab.ipynb
└── surface_code/                # Kuantum hata düzeltme
    ├── README.md
    ├── SurfaceCode.jsx          # İnteraktif görselleştirme (React)
    └── surface_code_demo.ipynb  # Python demo notebook
```

## 🎯 Konu Sıralaması

| # | Konu | Klasör | Açıklama |
|---|------|--------|----------|
| 1 | Temel Kavramlar | `temel_kavramlar/` | Qubit, süperpozisyon, Bloch küresi, Dirac notasyonu |
| 2 | Kuantum Kapıları | `kuantum_kapilari/` | Pauli, Hadamard, CNOT, döndürme kapıları, evrensel set |
| 3 | Fiziksel vs Mantıksal Qubit | `temel_kavramlar/` | Gürültü, decoherence, hata düzeltme kavramları |
| 4 | Surface Code | `surface_code/` | Kuantum hata düzeltme kodu, interaktif demo |
| 5 | QML Giriş | `temel_kavramlar/` | Qiskit ile kuantum makine öğrenmesi temelleri |

## 🛠️ Gereksinimler

```bash
pip install qiskit qiskit-aer qiskit-machine-learning pylatexenc matplotlib numpy
```

## 📚 Kaynaklar

- [Qiskit Textbook](https://qiskit.org/textbook)
- [IBM Quantum Experience](https://quantum.cloud.ibm.com)
- Nielsen & Chuang, *Quantum Computation and Quantum Information*
- [Surface Code Primer (Google AI)](https://ai.google/research/pubs/pub46906)

## 📝 Notlar

- Sunumlar (.pptx) Türkçe olarak hazırlanmıştır
- Colab not defterleri Google Colab'da doğrudan çalıştırılabilir
- Surface Code React bileşeni `npx create-react-app` ile çalıştırılabilir
