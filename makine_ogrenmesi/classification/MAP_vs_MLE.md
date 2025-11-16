# 🎯 MAP vs MLE

[Ana Sayfaya Dön](../README.md)

## 🤔 Temel Kavramlar

Bir paranın tura gelme olasılığı $\theta$ gibi bir parametreyi tahmin etmeye çalıştığımızı varsayalım.

### MLE (Maximum Likelihood Estimation)
*En Çok Olabilirlik Tahmini*

> "Sadece veriye bak. Bu veriyi üretme olasılığı en yüksek olan parametre ($\theta$) nedir?"

* **Formül:** $\hat{\theta}_{MLE} = \arg\max_{\theta} P(\text{Veri} | \theta)$
* **Örnek:** 10 atışta 8 tura geldiyse, $\hat{\theta}_{MLE} = 8/10 = 0.8$.
* **Problem:** Az veri varsa, aşırı öğrenmeye (overfitting) yatkındır. 10 atış, paranın %80 hileli olduğunu iddia etmek için yeterli değildir.

### MAP (Maximum A Posteriori)
*En Çok Sonsal Tahmin*

> "Veriye bak, AMA bu parametre ($\theta$) hakkındaki önceki bilgilerini (Prior) de hesaba kat."

* **Formül:** $\hat{\theta}_{MAP} = \arg\max_{\theta} P(\theta | \text{Veri})$
* Bayes Teoremi ile: $\hat{\theta}_{MAP} = \arg\max_{\theta} [ P(\text{Veri} | \theta) \times P(\theta) ]$
* **Örnek:** 10 atışta 8 tura geldi (Veri) AMA paraların genelde adil olduğuna ($P(\theta) \approx 0.5$) dair bir *Prior* bilgimiz var.
* **Sonuç:** MAP, bu ikisini dengeler. Tahmin, $0.8$ (MLE) ile $0.5$ (Prior'un zirvesi) arasında bir değer (örn: $0.7$) olur.

## 🔗 Makine Öğrenimindeki Yeri: Regularization

MAP, makine öğreniminde **Regularization** (Düzenlileştirme) işleminin istatistiksel temelidir.

* **L2 Regularization (Ridge):** Model ağırlıklarının (w) **Gaussian Prior** ($P(w) = \mathcal{N}(0, \sigma^2)$) yani "ağırlıkların 0 civarında küçük olmasının daha olası olduğu" ön bilgisiyle MAP tahmini yapmaktır.
* **L1 Regularization (Lasso):** Model ağırlıklarının **Laplace Prior** ($P(w)$) yani "ağırlıkların tam olarak 0 olmasının çok olası olduğu" ön bilgisiyle MAP tahmini yapmaktır.

**Özetle:** MAP = Likelihood (Veri) + Prior (Düzenlileştirme).

## 📊 Simülasyonlar

Veri miktarı arttıkça MAP tahmininin nasıl MLE'ye yakınsadığını (Prior'un etkisinin azaldığını) gösteren simülasyonlar için [`notebooks/3_map_mle_sims.ipynb`](../notebooks/3_map_mle_sims.ipynb) defterini inceleyin.
