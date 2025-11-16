# 🎯 K-En Yakın Komşu (KNN)

[Ana Sayfaya Dön](../Readme)

## 🤔 Temel Mantık

K-En Yakın Komşu (KNN), bir veri noktasını sınıflandırırken, o noktaya en yakın $k$ adet komşusunun etiketlerine başvuran, tembel öğrenme (lazy learning) ailesinden bir algoritmadır.

> "Bir veri noktasının sınıfı, onun 'çevresi' tarafından belirlenir."

## ⚡ Performans ve Karmaşıklık

| Aşama | Karmaşıklık | Açıklama |
| :--- | :--- | :--- |
| Eğitim | $O(1)$ | Veri sadece hafızada saklanır. Hesaplama yapılmaz. |
| Test (1 örnek) | $O(n \cdot d)$ | $n$: eğitim verisi sayısı, $d$: özellik boyutu. Test noktası ile $n$ adet eğitim noktası arasındaki mesafenin hesaplanması gerekir. |

## ⚠️ Önemli Hususlar: KNN Tuzakları

### 1. Ölçek Problemi (Feature Scaling)

KNN, Öklid gibi mesafe metriklerine dayanır. Eğer özellikler farklı ölçeklerdeyse (örn: Maaş [10.000-100.000] ve Yaş [20-60]), büyük ölçekli özellik (Maaş), mesafe hesaplamalarını domine eder.

**Çözüm:** KNN kullanmadan önce tüm özellikler `StandardScaler` (Z-skoru) veya `MinMaxScaler` (0-1 normalizasyonu) ile **mutlaka** ölçeklendirilmelidir.

### 2. Yüksek Boyut Laneti (Curse of Dimensionality)

Özellik boyutu ($d$) arttıkça, noktalar arasındaki mesafeler anlamsızlaşmaya başlar. Yüksek boyutlu bir uzayda, tüm noktalar birbirinden "neredeyse eşit" uzaklıkta görünür. Bu durum, "en yakın" komşu kavramını işlevsiz hale getirir.
