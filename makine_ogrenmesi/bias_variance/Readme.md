# 🎓 Makine Öğrenmesi Model Doğrulama

> **Makine Öğrenmesi'nin Temel Taşı: Linear Regresyon Ders Notları**
> 
> *Hazırlayan: Dr. Buket Toptaş*  
> *Tarih: 2025*

### Online Demo
Hiçbir kurulum gerektirmez! Doğrudan şu linkten erişin:

👉 [Model Doğrulama](https://bukettoptas.github.io/Dersler/makine_ogrenmesi/bias_variance/bias_variance.html)

## 🎯 Giriş

Linear Regresyon, **makine öğrenmesinin alfabesi**dir. İki değişken arasındaki doğrusal ilişkiyi modelleyen bu algoritma, karmaşık modellerin temelini oluşturur.

### 🎓 Bu Derste Öğrenecekleriniz

- ✅ Linear regresyonun matematiksel temelleri
- ✅ Python ve Sklearn ile uygulama
- ✅ Model performansını değerlendirme
- ✅ Overfitting ve underfitting kavramları
- ✅ Gerçek dünya problemlerini çözme

### 📋 Ön Koşullar

```python
# Gerekli kütüphaneler
numpy>=1.21.0
matplotlib>=3.4.0
scikit-learn>=1.0.0
pandas>=1.3.0
seaborn>=0.11.0
```

---

## 🔍 Linear Regresyon Nedir?

Linear regresyon, **bağımlı değişken (y)** ile bir veya daha fazla **bağımsız değişken (x)** arasındaki **doğrusal ilişkiyi** modelleyen istatistiksel bir yöntemdir.

### 📐 Basit Formül

```
y = mx + b
```

Burada:
- **y**: Tahmin etmek istediğimiz değer (bağımlı değişken)
- **x**: Bildiğimiz değer (bağımsız değişken)
- **m**: Eğim (slope) - x değişince y ne kadar değişir?
- **b**: Kesim noktası (intercept) - x=0 olduğunda y'nin değeri

### 🎯 Örnek Senaryo: Dondurma Satışları

> Ahmet Amca bir sahil kasabasında dondurma satıyor. Sıcaklık arttıkça satışları da artıyor. Yarın hava 35°C olacaksa, kaç dondurma hazırlamalı?

| Sıcaklık (°C) | Satış (Adet) |
|---------------|--------------|
| 20            | 30           |
| 22            | 35           |
| 25            | 45           |
| 28            | 55           |
| 30            | 60           |
| 32            | 70           |
| 35            | 80           |

**Soru:** 35°C'de kaç dondurma satılır?

---

## 📊 Matematiksel Temel

### En Küçük Kareler Yöntemi (Ordinary Least Squares - OLS)

Linear regresyon, **hata karelerinin toplamını minimize eden** en iyi doğruyu bulur.

#### Eğim (m) Hesaplama

```
m = Σ[(xi - x̄)(yi - ȳ)] / Σ[(xi - x̄)²]
```

#### Kesim (b) Hesaplama

```
b = ȳ - m × x̄
```

Burada:
- `x̄` = Ortalama x değeri
- `ȳ` = Ortalama y değeri
- `Σ` = Toplam sembolü

### 🧮 Adım Adım Hesaplama

```python
import numpy as np

# Veri
sicaklik = np.array([20, 22, 25, 28, 30, 32, 35])
satis = np.array([30, 35, 45, 55, 60, 70, 80])

# Ortalamalar
x_mean = np.mean(sicaklik)  # 27.43
y_mean = np.mean(satis)      # 53.57

# Eğim (m)
numerator = np.sum((sicaklik - x_mean) * (satis - y_mean))
denominator = np.sum((sicaklik - x_mean) ** 2)
m = numerator / denominator  # 3.42

# Kesim (b)
b = y_mean - m * x_mean      # -40.14

print(f"Denklem: y = {m:.2f}x + {b:.2f}")
# Output: y = 3.42x + -40.14
```

**Sonuç:** Her 1°C artışta satış ~3.42 adet artıyor!

---

## 🎯 Performans Metrikleri

### 1. R² (R-Squared) - Determinasyon Katsayısı

**Ne ölçer?** Modelin veriyi ne kadar iyi açıkladığı

```python
r2 = r2_score(y_true, y_pred)
```

**Yorumlama:**
- **R² = 1.0**: Mükemmel model (tüm varyansı açıklıyor)
- **R² = 0.8-0.9**: Çok iyi
- **R² = 0.6-0.7**: İyi
- **R² < 0.5**: Zayıf
- **R² < 0**: Modeliniz ortalamanın altında!

### 2. MSE (Mean Squared Error)

**Ne ölçer?** Hataların karelerinin ortalaması

```python
mse = mean_squared_error(y_true, y_pred)
```

**Özellikler:**
- Büyük hataları daha çok cezalandırır
- Asla negatif olamaz
- Orijinal birimle aynı değil (kare)

### 3. RMSE (Root Mean Squared Error)

**Ne ölçer?** MSE'nin karekökü (orijinal birimle)

```python
rmse = np.sqrt(mean_squared_error(y_true, y_pred))
```

**Avantajları:**
- Orijinal birimle çalışır (yorumlaması kolay)
- Outlier'lara duyarlı

### 4. MAE (Mean Absolute Error)

**Ne ölçer?** Hataların mutlak değerlerinin ortalaması

```python
from sklearn.metrics import mean_absolute_error
mae = mean_absolute_error(y_true, y_pred)
```

**Avantajları:**
- Outlier'lara daha az duyarlı
- Basit yorumlama

## 🚀 İleri Seviye Konular

### 1. Polynomial Regression (Polinom Regresyon)

Doğrusal olmayan ilişkiler için:

```python
from sklearn.preprocessing import PolynomialFeatures

# Polinom özellikleri oluştur (derece=2)
poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(X)

# Model
model = LinearRegression()
model.fit(X_poly, y)

# x² ve xy terimleri otomatik eklendi!
```

### 2. Regularization (Ridge & Lasso)

Overfitting'i önlemek için:

```python
from sklearn.linear_model import Ridge, Lasso

# Ridge (L2 Regularization)
ridge = Ridge(alpha=1.0)
ridge.fit(X_train, y_train)

# Lasso (L1 Regularization)
lasso = Lasso(alpha=0.1)
lasso.fit(X_train, y_train)
```

### 3. Feature Scaling

Özellikleri normalize etme:

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = LinearRegression()
model.fit(X_scaled, y)
```

### 4. Cross-Validation

Modeli güvenilir şekilde değerlendirme:

```python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(model, X, y, cv=5, scoring='r2')
print(f"Ortalama R²: {scores.mean():.4f} (±{scores.std():.4f})")
```

---
## 🐛 Sorun Bildirme

Bir hata buldunuz mu? [Issue açın](https://github.com/bukettoptas/Dersler/makine_ogrenmesi/issues)

---

## 👨‍💻 Geliştirici

**[Adınız]**
- GitHub: [@bukettoptas](https://github.com/bukettoptas)
- LinkedIn: [buket-toptaş-142b6677](https://www.linkedin.com/in/buket-topta%C5%9F-142b6677/)
- Email: buketecrinozturk@gmail.com

---

## 🙏 Teşekkürler

- Makine öğrenmesi topluluğuna
- Açık kaynak katkıcılara
- Geri bildirim sağlayan herkese

---
<div align="center">

### ⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐

**Made with ❤️ for ML learners**

</div>
