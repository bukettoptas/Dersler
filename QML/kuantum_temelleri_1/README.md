# Kuantum Temelleri — I
> 
> *Hazırlayan: Dr. Buket Toptaş*  
> *Tarih: 2026*
> 
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/bukettoptas/Dersler/blob/main/QML/kuantum_temelleri_1/Quantum_Temelleri_I.ipynb)

---

## Konular

- Moore Yasası ve Kuantum Bilgisayarın Doğuşu
- Temel Semboller ve Terimler
- Dirac Notasyonu (Ket / Bra)
- İç Çarpım ve Dış Çarpım
- Qubit Türleri
- Hilbert Oteli ve Hilbert Uzayı
- Fiziksel ve Mantıksal Qubit'ler

---

## 1. Moore Yasası

Gordon Moore (1965): Entegre devredeki transistör sayısı her **2 yılda 2 katına** çıkar teorisinde bulunmuştur.

Transistörler küçüldükçe atom boyutuna yaklaşıyoruz → klasik fizik kuralları bozuluyor → **kuantum bilgisayar**ın motivasyonu da burada başlıyor. Transistörler atom boyutu sınırına yaklaştıkça kuantum etkileri kaçınılmaz hale geliyor.
---

## 2. Temel Semboller ve Terimler

| Terim | Anlamı |
|-------|--------|
| **Qubit** | Kuantum bilgi birimi — 0, 1 veya her ikisi aynı anda |
| **Süperpozisyon** | Qubit'in aynı anda hem 0 hem 1 olabilmesi |
| **Dolanıklık** | İki qubit'in birbirine bağlı olması |
| **Ölçüm** | Durumu gözlemleme (süperpozisyon çöker) |
| **Genlik** | Katsayı — olasılığın karekökü |
| **Faz** | Karmaşık sayının açısı: e^(iθ) |

| Sembol | Okuma | Anlamı |
|:------:|-------|--------|
| \|ψ⟩ | ket psi | Kuantum durumu (sütun vektör) |
| ⟨ψ\| | bra psi | Eşlenik (satır vektör) |
| ⟨φ\|ψ⟩ | braket | İç çarpım → olasılık |
| ⊗ | tensör | İki qubit'i birleştirme |

---

## 3. Dirac Notasyonu

Paul Dirac'ın icadı — vektörleri pratik yazmak için:

**Ket** = sütun vektör, **Bra** = satır vektör

```
|0⟩ = [1, 0]ᵀ       |1⟩ = [0, 1]ᵀ

|ψ⟩ = α|0⟩ + β|1⟩    (|α|² + |β|² = 1)
```

### Kod Örneği

```python
import numpy as np

ket_0 = np.array([[1], [0]])   # |0⟩
ket_1 = np.array([[0], [1]])   # |1⟩

# Süperpozisyon: |ψ⟩ = (1/√2)|0⟩ + (1/√2)|1⟩
alpha = 1 / np.sqrt(2)
beta  = 1 / np.sqrt(2)
psi = alpha * ket_0 + beta * ket_1

print(f"|ψ⟩ = {psi.flatten()}")
print(f"Normalizasyon: |α|² + |β|² = {abs(alpha)**2 + abs(beta)**2:.1f}")
```

**Çıktı:**
```
|ψ⟩ = [0.70710678 0.70710678]
Normalizasyon: |α|² + |β|² = 1.0
```

---

## 4. İç Çarpım ve Dış Çarpım

**İç çarpım** ⟨φ|ψ⟩ → tek sayı (skaler) → **benzerlik ölçer**

**Dış çarpım** |ψ⟩⟨φ| → matris → **operatör oluşturur**

```python
bra_0 = ket_0.conj().T   # ⟨0|

# İç çarpım
print(f"⟨0|0⟩ = {float((bra_0 @ ket_0)[0,0]):.0f}")   # 1 (aynı)
print(f"⟨0|1⟩ = {float((bra_0 @ ket_1)[0,0]):.0f}")   # 0 (dik)

# Born kuralı: P(0) = |⟨0|ψ⟩|²
psi_plus = (ket_0 + ket_1) / np.sqrt(2)
p0 = abs(bra_0 @ psi_plus)[0,0] ** 2
print(f"P(0) = {p0:.2f} → %50")
```

---

## 5. Qubit Türleri

| Tür | Şirket | Avantaj | Dezavantaj |
|-----|--------|---------|------------|
| **Süperiletken** | IBM, Google | Hızlı kapı (~ns) | Soğutma (15 mK) |
| **İyon Tuzağı** | IonQ | Yüksek doğruluk | Yavaş (~μs) |
| **Fotonik** | Xanadu | Oda sıcaklığı | Kapılar zor |
| **Topolojik** | Microsoft | Gürültüye dayanıklı | Henüz deneysel |

---

## 6. Hilbert Oteli ve Hilbert Uzayı

### Hilbert Oteli
Matematiksel sonsuzluk kavramını açıklamak için kullanılan düşünce deneyidir. Sonsuz sayıda odaya sahip bir oteldir ve tüm odalar dolu olsa bile yeni müşterilere yer açılabilir. Örneğin, her misafir bir sonraki numaralı odaya taşındığında (1→2, 2→3 …), 1 numaralı oda boşalır. Bu, sayılabilir sonsuzluk fikrini sezgisel olarak anlamayı sağlar. Daha ileri versiyonlarda otel, sonsuz otobüsler dolusu misafiri bile alabilir; bu da farklı sonsuzluk türlerinin karşılaştırılmasına olanak verir.

Sonsuz odalı otel, tüm odalar dolu:

- **Yeni 1 misafir →** herkes n→n+1'e kayar → Oda 1 boşalır → **∞ + 1 = ∞**
- **Sonsuz otobüs →** herkes n→2n'e kayar → tek odalar boşalır → **∞ + ∞ = ∞**

### Hilbert Uzayı

Hilbert uzayı, bildiğimiz sonlu boyutlu vektör uzaylarının daha genel ve güçlü hâlidir; farkı, sadece sayılardan oluşan vektörleri değil, fonksiyonlar ve sinyaller gibi sonsuz boyutlu nesneleri de aynı “vektör mantığıyla” ele alabilmesidir. Normal bir vektör uzayında açı, uzunluk ve iç çarpım gibi kavramlar her zaman tanımlı değildir; oysa Hilbert uzayında bunların hepsi vardır ve bu sayede fonksiyonlar arasında da tıpkı vektörlerdeki gibi mesafe ölçebilir, açı hesaplayabilir ve projeksiyon yapabilirsin. “Cauchy dizisi” denen şey ise basitçe, elemanları birbirine gittikçe yaklaşan bir dizinin gerçekten bir limite ulaşıp ulaşmadığını sorar; Hilbert uzayı bunu garanti eder, yani “tam”dır. Bu özellik, Fourier analizinden makine öğrenimindeki kernel yöntemlerine kadar birçok hesaplamanın güvenilir ve tutarlı olmasını sağlar.
Üç temel özelliğe sahiptir:
1. **Vektör uzayı** → süperpozisyon mümkün
2. **İç çarpım** → olasılık hesaplanır (Born kuralı)
3. **Tamlık** → yakınsak dizilerin limiti uzayda kalır (delik yok)

**Boyut = 2ⁿ** (üstel büyüme):

| Qubit | Boyut | Not |
|:-----:|:-----:|-----|
| 1 | 2 | ℂ² |
| 3 | 8 | ℂ⁸ |
| 10 | 1.024 | Bin boyut |
| 50 | ~10¹⁵ | Klasik simülasyon imkansız! |

---

## 7. Fiziksel ve Mantıksal Qubit'ler

| | Fiziksel Qubit | Mantıksal Qubit |
|---|---|---|
| Tanım | Donanımdaki gerçek qubit | Hata düzeltme ile korunan soyut qubit |
| Gürültü | Var (hatalı) | Düzeltilmiş |
| Oran | — | ~1000 fiziksel = 1 mantıksal |

---

📌 **Kodları çalıştırmak için** → [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/bukettoptas/Dersler/blob/main/QML/kuantum_temelleri_1/Quantum_Temelleri_I.ipynb)
---

## Sorun Bildirme

Bir hata buldunuz mu? [Issue açın](https://github.com/bukettoptas/Dersler/issues)

---

## Geliştirici

**[Adınız]**
- GitHub: [@bukettoptas](https://github.com/bukettoptas)
- LinkedIn: [buket-toptaş-142b6677](https://www.linkedin.com/in/buket-topta%C5%9F-142b6677/)
- Email: buketecrinozturk@gmail.com

---

## 🙏 Teşekkürler

- Açık kaynak katkıcılara
- Geri bildirim sağlayan herkese

---
### ⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐

**Made with ❤️ for QML learners**
