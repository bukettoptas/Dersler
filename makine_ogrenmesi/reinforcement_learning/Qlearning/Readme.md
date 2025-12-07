<<<<<<< HEAD
# 🤖 Q-Learning Treasure Hunt

**Interactive Q-Learning Demo - Pekiştirmeli Öğrenme**

## 🎮 Canlı Demo

**Hiçbir kurulum gerektirmez! Doğrudan şu linkten oynayın:**

👉 **[Q-Learning Hazine Avı Oyunu](https://bukettoptas.github.io/Dersler/makine_ogrenmesi/reinforcement_learning/Qlearning/qlearning-game.html)**

---

## 📖 Oyun Hakkında

Robot, **Q-Learning algoritması** kullanarak hazineyi bulmayı öğrenir!

### Oyun Elemanları:
- 🤖 **Robot** - AI ajanı (öğrenen varlık)
- 💰 **Hazine** - Ana hedef (+10 puan)
- 💎 **Küçük Ödüller** - Ara ödüller (+2 puan)
- 🔥 **Tuzaklar** - Ceza noktaları (-5 puan)
- 🧱 **Engeller** - Geçilemez alanlar

---

## 🎛️ Özellikler

### Gerçek Zamanlı Gösterim
- ✨ **Q-Değerleri**: Her hücredeki en iyi aksiyon okla gösterilir
- 📊 **Canlı Grafik**: Son 20 episode'un ödül grafiği
- 📈 **İstatistikler**: Episode, toplam ödül, ziyaret edilen durumlar

### Ayarlanabilir Parametreler
- **Learning Rate (α)**: 0.1 - 0.9 (Öğrenme hızı)
- **Discount Factor (γ)**: 0.1 - 0.99 (Gelecek ödül değeri)
- **Exploration Rate (ε)**: 0.0 - 1.0 (Keşif oranı)
- **Hız**: 0.5x - 10x (Simülasyon hızı)

---

## 🧠 Q-Learning Nedir?

Q-Learning, **model-free** bir pekiştirmeli öğrenme algoritmasıdır.

### Temel Formül:

```
Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)]
```

**Nerede:**
- `s` = Mevcut durum
- `a` = Seçilen aksiyon
- `r` = Alınan ödül
- `s'` = Yeni durum
- `α` = Learning rate (öğrenme hızı)
- `γ` = Discount factor (indirim faktörü)

### Nasıl Çalışır?

1. **Başlangıç**: Robot başlangıç noktasında (0,0)
2. **Aksiyon Seçimi**: Epsilon-greedy policy
   - ε olasılıkla rastgele hareket (exploration)
   - (1-ε) olasılıkla en iyi Q-değerine sahip hareket (exploitation)
3. **Q-Değer Güncellemesi**: Her adımda Q-tablosu güncellenir
4. **Öğrenme**: Zamanla robot en iyi yolu öğrenir

---

## 🎓 Eğitim Amaçlı

Bu demo şunları gösterir:
- ✅ Q-Learning'in temel çalışma prensibi
- ✅ Exploration vs Exploitation dengesi
- ✅ Q-tablosunun zamanla nasıl geliştiği
- ✅ Parametrelerin öğrenmeye etkisi

### Deney Önerileri:

1. **Yüksek Exploration (ε=0.9)**
   - Robot çok keşfeder, yavaş öğrenir
   - Grafik dalgalı olur

2. **Düşük Exploration (ε=0.1)**
   - Robot hızlı karar verir ama yerel optimumda kalabilir
   - Grafik daha stabil

3. **Yüksek Learning Rate (α=0.9)**
   - Hızlı öğrenme ama instabil
   - Yeni bilgi eski bilgiyi çabuk siler

4. **Düşük Learning Rate (α=0.1)**
   - Yavaş ama stabil öğrenme
   - Gradual iyileşme

---

## 📚 İlgili Konular

- Reinforcement Learning (Pekiştirmeli Öğrenme)
- Markov Decision Process (MDP)
- Temporal Difference Learning
- Epsilon-Greedy Policy
- Exploration-Exploitation Tradeoff

---

## 🛠️ Teknik Detaylar

- **Teknoloji**: Pure HTML/CSS/JavaScript
- **Bağımlılık**: Yok (Standalone)
- **Tarayıcı Desteği**: Modern tarayıcılar (Chrome, Firefox, Safari, Edge)
- **Mobil Uyumlu**: Evet

---

## 📖 Kullanım

1. **Başlat** butonu ile simülasyonu başlatın
2. **Parametreleri** ayarlayın (istediğiniz zaman)
3. **Grafiği** izleyin - robot öğreniyor mu?
4. **Q-değerlerini** gözlemleyin - oklar hangi yöne işaret ediyor?
5. **Sıfırla** ile yeni bir öğrenme başlatın

---

**Hazırlayan:** Dr. Buket Toptaş  
**Ders:** Makine Öğrenmesi - Reinforcement Learning  
**Üniversite:** 4. Sınıf Yazılım Mühendisliği
=======

>>>>>>> db8a4b6ace06f88138c8f05407f4078e0582199e
