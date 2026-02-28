# Kuantum Kapıları

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/bukettoptas/Dersler/blob/main/QML/kuantum_kapilari/Quantum_Kapilari.ipynb)

---

## 📌 Konular

- Kuantum Kapısı Nedir?
- Pauli Kapıları (X, Y, Z)
- Hadamard Kapısı
- Rotasyon Kapıları (Rx, Ry, Rz)
- CNOT ve Çok-Qubit Kapıları
- Kapı Özet Tablosu

---

## 1. Kuantum Kapısı Nedir?

Qubit'e uygulanan **dönüşüm**. Klasik AND/OR/NOT'un kuantum karşılığı.

**Temel fark:** Kuantum kapıları her zaman **terslenebilir** (unitary). Girişten çıkışı, çıkıştan girişi bulabilirsin. Bilgi kaybolmaz.

---

## 2. Pauli Kapıları

### X Kapısı (NOT)

|0⟩ ↔ |1⟩ çevirir. Bloch küresinde X ekseni etrafında 180° döndürme.

```
X = [[0, 1],      X|0⟩ = |1⟩
     [1, 0]]      X|1⟩ = |0⟩
```

### Z Kapısı (Faz Çevirme)

|1⟩'in fazını çevirir. Olasılıklar değişmez, faz değişir.

```
Z = [[1,  0],     Z|0⟩ =  |0⟩
     [0, -1]]     Z|1⟩ = -|1⟩
```

### Kod Örneği

```python
import numpy as np

X = np.array([[0,1],[1,0]])
Z = np.array([[1,0],[0,-1]])

ket0 = np.array([[1],[0]])
ket1 = np.array([[0],[1]])

print(f"X|0⟩ = {(X @ ket0).flatten()}")   # [0, 1] = |1⟩
print(f"X|1⟩ = {(X @ ket1).flatten()}")   # [1, 0] = |0⟩
print(f"Z|0⟩ = {(Z @ ket0).flatten()}")   # [1, 0] = |0⟩
print(f"Z|1⟩ = {(Z @ ket1).flatten()}")   # [0,-1] = -|1⟩
```

---

## 3. Hadamard Kapısı

Kuantumun en önemli kapısı. **Süperpozisyon** oluşturur.

```
H = (1/√2) [[1,  1],      H|0⟩ = |+⟩ = (|0⟩+|1⟩)/√2
             [1, -1]]      H|1⟩ = |−⟩ = (|0⟩-|1⟩)/√2
```

> ⚠️ H kendi tersidir: **HH = I**. İki kez uygularsan başa dönersin!

### Kod Örneği

```python
import pennylane as qml

dev = qml.device('default.qubit', wires=1, shots=1000)

@qml.qnode(dev)
def hadamard_test():
    qml.Hadamard(wires=0)
    return qml.counts()

print(hadamard_test())
# → {'0': ~500, '1': ~500}  →  %50/%50 süperpozisyon
```

---

## 4. Rotasyon Kapıları (Rx, Ry, Rz)

Bloch küresinde belirli bir açıyla döndürme. **QML'nin temel yapı taşları!**

Variasyonel devrelerde `Ry(θ)` parametresi eğitimle optimize edilir — sinir ağındaki ağırlıklar gibi.

| θ | Ry(θ)\|0⟩ | Açıklama |
|:---:|-----------|---------|
| 0° | \|0⟩ | Değişmez |
| 90° | (\|0⟩+\|1⟩)/√2 | Eşit süperpozisyon |
| 180° | \|1⟩ | Tam çevirme (= X kapısı) |
| 360° | \|0⟩ | Tam tur, başa döner |

### Kod Örneği

```python
import pennylane as qml
import numpy as np

dev = qml.device('default.qubit', wires=1)

@qml.qnode(dev)
def ry_circuit(theta):
    qml.RY(theta, wires=0)
    return qml.probs(wires=0)

# Farklı açıları dene
for deg in [0, 90, 180, 360]:
    rad = np.radians(deg)
    p = ry_circuit(rad)
    print(f"Ry({deg}°)|0⟩ → P(0)={p[0]:.2f}, P(1)={p[1]:.2f}")
```

**Çıktı:**
```
Ry(0°)|0⟩   → P(0)=1.00, P(1)=0.00
Ry(90°)|0⟩  → P(0)=0.50, P(1)=0.50
Ry(180°)|0⟩ → P(0)=0.00, P(1)=1.00
Ry(360°)|0⟩ → P(0)=1.00, P(1)=0.00
```

---

## 5. CNOT Kapısı

En önemli 2-qubit kapısı. **Dolanıklık** oluşturur.

- Kontrol qubit = 0 → hedefi değiştirme
- Kontrol qubit = 1 → hedefi çevir (X uygula)

| Giriş | Çıkış | |
|:-----:|:-----:|---|
| \|00⟩ | \|00⟩ | |
| \|01⟩ | \|01⟩ | |
| \|10⟩ | \|11⟩ | ← çevrildi |
| \|11⟩ | \|10⟩ | ← çevrildi |

### H + CNOT = Bell Durumu (Dolanıklık)

```python
import pennylane as qml

dev = qml.device('default.qubit', wires=2, shots=1000)

@qml.qnode(dev)
def bell():
    qml.Hadamard(wires=0)       # Süperpozisyon
    qml.CNOT(wires=[0, 1])      # Dolanıklık
    return qml.counts()

print(bell())
# → {'00': ~500, '11': ~500}  →  DOLANIKLIK!
```

---

## 6. Kapı Özet Tablosu

| Kapı | Qubit | Etki | QML'de Kullanım |
|------|:-----:|------|-----------------|
| X | 1 | Bit çevirme | Durum hazırlama |
| Z | 1 | Faz çevirme | Oracle (Grover) |
| H | 1 | Süperpozisyon | Başlangıç hazırlama |
| **Ry(θ)** | 1 | θ döndürme | **Variasyonel parametre** |
| **CNOT** | 2 | Koşullu çevirme | **Dolanıklık katmanı** |

> QML'de en çok kullanılanlar: **Ry(θ)** (parametreli) + **CNOT** (dolanıklık)

---

📌 **Tüm kodları çalıştırmak için** → [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/bukettoptas/Dersler/blob/main/QML/kuantum_kapilari/Quantum_Kapilari.ipynb)
