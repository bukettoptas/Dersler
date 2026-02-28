# Kuantum Temelleri — II
> 
> *Hazırlayan: Dr. Buket Toptaş*  
> *Tarih: 2026*
> 
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/bukettoptas/Dersler/blob/main/QML/kuantum_temelleri_2/Quantum_Temelleri_II.ipynb)

---

## Konular

- Bloch Küresi
- Süperpozisyon
- Ölçüm ve Born Kuralı
- Dolanıklık (Entanglement)

---

## 1. Bloch Küresi

Tek qubit'in durumunu 3D küre üzerinde görselleştirebiliriz:

```
|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩
```

- **Kuzey kutbu** (θ=0): |0⟩
- **Güney kutbu** (θ=π): |1⟩
- **Ekvator** (θ=π/2): Süperpozisyon durumları (|+⟩, |−⟩, |i⟩, |−i⟩)

### Kod Örneği — 3D Bloch Küresi

```python
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

fig = plt.figure(figsize=(9, 8))
ax = fig.add_subplot(111, projection='3d')

# Küre çiz
u = np.linspace(0, 2*np.pi, 40)
v = np.linspace(0, np.pi, 30)
x = np.outer(np.cos(u), np.sin(v))
y = np.outer(np.sin(u), np.sin(v))
z = np.outer(np.ones_like(u), np.cos(v))
ax.plot_wireframe(x, y, z, color='gray', alpha=0.08)

# Durumları işaretle
states = {'|0⟩':(0,0,1), '|1⟩':(0,0,-1), '|+⟩':(1,0,0), '|−⟩':(-1,0,0)}
for name, pos in states.items():
    ax.scatter(*pos, s=120)
    ax.text(pos[0]*1.3, pos[1]*1.3, pos[2]*1.2, name, fontsize=13, fontweight='bold')
```

---

## 2. Süperpozisyon

Bir qubit aynı anda **hem 0 hem 1** olabilir:

```
|ψ⟩ = α|0⟩ + β|1⟩
```

Bu bir "kararsızlık" değil, gerçek bir fiziksel durum. Ölçüm yapana kadar qubit her iki durumda birden var.

> **Analoji:** Havadaki yazı-tura. Havadayken hem yazı hem tura. Yere düşünce (=ölçüm) birini görürsün.

| Durum | P(0) | P(1) |
|-------|:----:|:----:|
| \|0⟩ | %100 | %0 |
| \|+⟩ = (|0⟩+|1⟩)/√2 | %50 | %50 |
| 0.95\|0⟩ + 0.31\|1⟩ | %90 | %10 |
| \|1⟩ | %0 | %100 |

---

## 3. Ölçüm ve Born Kuralı

Ölçüm süperpozisyonu **çökertir**. Sonuç her zaman kesin: 0 veya 1.

```
P(0) = |α|²      P(1) = |β|²      (Born kuralı)
```

> ⚠️ Ölçümün geri dönüşü yok! Tekrar ölçsen hep aynı sonucu alırsın.

### Kod Örneği — 1000 Ölçüm Simülasyonu

```python
import numpy as np

alpha = np.cos(np.pi/6)   # ≈ 0.87
beta  = np.sin(np.pi/6)   # = 0.50

# 1000 kez ölç
results = np.random.choice([0, 1], size=1000, p=[abs(alpha)**2, abs(beta)**2])

print(f"|0⟩ çıkma sayısı: {np.sum(results==0)}")  # ~750
print(f"|1⟩ çıkma sayısı: {np.sum(results==1)}")  # ~250
```

**Çıktı:**
```
|0⟩ çıkma sayısı: 754   (beklenen: %75)
|1⟩ çıkma sayısı: 246   (beklenen: %25)
```

---

## 4. Dolanıklık (Entanglement)

İki qubit birbirine bağlanır: birini ölçünce diğerinin durumunu **anında** bilirsin.

### Bell Durumu

```
|Φ+⟩ = (|00⟩ + |11⟩) / √2
```

"Ya ikisi de 0, ya ikisi de 1. Başka ihtimal yok."

| Qubit A | Qubit B | Olasılık |
|:-------:|:-------:|:--------:|
| 0 | 0 | %50 ✅ |
| 1 | 1 | %50 ✅ |
| 0 | 1 | %0 ❌ |
| 1 | 0 | %0 ❌ |

### Klasik Korelasyon vs Kuantum Dolanıklık

**Klasik (çorap):** Bir çift çorabı iki kutuya koy. İstanbul'daki kutuyu aç, kırmızı gör → Ankara'da mavi. Ama renk baştan belliydi.

**Kuantum:** Kutuyu açana kadar renk **YOK**. Açtığın an renk belirleniyor — diğer kutu da anında karşıt rengi alıyor. Einstein buna **"ürkütücü uzaktan etki"** dedi.

### Kod Örneği — PennyLane ile Bell Durumu

```python
import pennylane as qml

dev = qml.device('default.qubit', wires=2, shots=1000)

@qml.qnode(dev)
def bell_circuit():
    qml.Hadamard(wires=0)       # Süperpozisyon
    qml.CNOT(wires=[0, 1])      # Dolanıklık
    return qml.counts()

results = bell_circuit()
# → {'00': ~500, '11': ~500}  →  DOLANIKLIK!
```

---

📌 **Tüm kodları çalıştırmak için** → [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/bukettoptas/Dersler/blob/main/QML/kuantum_temelleri_2/Quantum_Temelleri_II.ipynb)
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
