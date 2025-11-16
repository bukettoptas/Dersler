# 🎲 Naive Bayes

[Ana Sayfaya Dön](../README.md)

## 🤔 Temel Mantık

Naive Bayes, Bayes Teoremine dayanan olasılıksal bir sınıflandırıcıdır. Adındaki "Naive" (saf) ifadesi, özelliklerin (örn. metindeki kelimelerin) sınıf verildiğinde birbirinden **koşulsal olarak bağımsız** olduğunu varsaymasından gelir.

Bu "saf" varsayım sayesinde, $P(\text{email} | \text{spam})$ gibi karmaşık bir olasılığı, basit olasılıkların çarpımı olarak hesaplayabiliriz:

$P(\text{"para", "bedava"} | \text{spam}) \approx P(\text{"para"} | \text{spam}) \times P(\text{"bedava"} | \text{spam})$

## 🧮 Bayes Teoremi

Amacımız, veriye (email) bakarak sınıfın (spam) olasılığını bulmaktır: $P(\text{Sınıf} | \text{Veri})$.

$$
P(\text{Sınıf} | \text{Veri}) = \frac{P(\text{Veri} | \text{Sınıf}) \times P(\text{Sınıf})}{P(\text{Veri})}
$$

* $P(\text{Sınıf} | \text{Veri})$: **Posterior** (Aradığımız olasılık).
* $P(\text{Veri} | \text{Sınıf})$: **Likelihood** (Olabilirlik).
* $P(\text{Sınıf})$: **Prior** (Önsel olasılık).

## ⚠️ Problem: Sıfır Olasılık ve Laplace Smoothing

Eğer "toplantı" kelimesi eğitim setindeki *hiçbir* spam e-postada geçmiyorsa, $P(\text{"toplantı"} | \text{spam}) = 0$ olur. Bu durum, "naive" varsayımdaki tüm olasılık çarpımını sıfırlar.

**Çözüm: Laplace (Add-k) Smoothing**
Sıfır olasılığı önlemek için her kelime sayısına $\alpha$ (genellikle 1) eklenir.

**Normalde:**
$P(w_i | \text{Sınıf}) = \frac{\text{Sınıf içindeki } w_i \text{ sayısı}}{\text{Sınıf içindeki toplam kelime sayısı}}$

**Laplace ile ($\alpha=1$):**
$P(w_i | \text{Sınıf}) = \frac{(\text{Sınıf içindeki } w_i \text{ sayısı} + 1)}{(\text{Sınıf içindeki toplam kelime sayısı} + |V|)}$
($|V|$ = toplam eşsiz kelime sayısı / vocabulary size)
