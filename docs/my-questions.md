- **Q:** Şunlar arasındaki farklar nelerdir?:
    - `main.tsx`
    - `App.tsx`
    - `Index.tsx`

- **A:** (Cevaplandı)
    - **`main.tsx` (Giriş Noktası):** Uygulamanın "motorunun" çalıştığı yerdir. React'i web sayfasına (DOM) bağlar ve genel ayarları (CSS, i18n gibi) yükler.
    - **`App.tsx` (Omurga):** Uygulamanın ana iskeletidir. Sayfalar arası geçişleri (Router), tema sağlayıcılarını ve global katmanları yönetir. İçerik göstermekten ziyade, "neyin nerede gösterileceğini" belirler.
    - **`Index.tsx` (Sayfa):** Kullanıcının gördüğü belirli bir sayfadır (örneğin Anakart). `App.tsx` tarafından çağrılır ve ekrana o sayfaya özgü içerikleri (Hero bölümü, Makale listesi vb.) basar.

- **Q:** useTranslation nedir? falanca dosyada bir function mıdır?
t = useTranslation() ile ne yapılıyor? sadece bir kısaltma mı?

- **A:** . useTranslation Nedir?
Evet, teknik olarak react-i18next kütüphanesi içinde tanımlanmış bir JavaScript fonksiyonudur. Ancak React dünyasında use ile başladığı için buna bir Hook diyoruz.

Neden sadece normal fonksiyondan farkı ne? Normal fonksiyonlar sadece işlem yapar. useTranslation gibi Hook'lar ise bileşeni React'in yaşam döngüsüne bağlar. i18n sistemindeki bir değişikliği (mesela dilin TR'den EN'ye geçmesini) dinler ve o değişiklik olduğunda bileşeni otomatik olarak re-render eder (tekrar çizdirir). Böylece sayfa yenilenmeden metinler değişir.

2. const { t } = useTranslation() Satırı Ne Yapar?
Bu sadece bir kısaltma değildir; bir fonksiyon çağrısı ve ardından gelen objeyi parçalamadır (Destructuring).

useTranslation() çağrıldığında: Geriye içinde birçok özellik olan bir obje döndürür: t fonksiyonu, i18n objesi, ready durumu vb.
{ t } kısmı: "Bana bu objenin içindeki sadece t adlı fonksiyonu ver" demektir.
t nedir?: Bu, i18next'in çekirdek çeviri motoruna erişmeni sağlayan asıl işlevsel fonksiyondur.
Özetle Mantık Akışı:
useTranslation (Fonksiyon) çalışır.
Sana o anki dil ayarlarını bilen t (Metin bulucu fonksiyon) aracını teslim eder.
Sen 
t('anahtar')
 dediğinde, bu araç gidip senin 
tr.json
 veya 
en.json
 dosyandan o anahtarı bulup ekrana basar.
Eğer const t = useTranslation() deseydin (süslü parantez olmadan), t değişkeni bir obje olurdu ve metin yazmak için şuna benzer bir kullanım yapman gerekirdi: t.t('welcome'). Süslü parantez {t} bu yüzden hayat kurtarıcıdır.

- **Q** const CategoryFilter
const { t }
const allCategories
neden her şey const?
- **A** Modern JavaScript (ES6+) ve React dünyasında her şeyin const olması bir tesadüf değil, bir güvenlik ve temiz kod stratejisidir. İşte nedenleri:

1. "Değişmezlik" (Immutability) İlkesi
const (constant), bir değişkenin yeniden atanmasını (re-assignment) engeller.

Eğer let kullansaydın, bir başkası (veya sen yanlışlıkla) aşağıda allCategories = "Hata!" diyebilirdi.
const kullandığında JavaScript motoru buna izin vermez. Bu da kodun daha tahmin edilebilir olmasını sağlar.
2. React'in Çalışma Mantığı
React bileşenleri her render edildiğinde (sayfa her güncellendiğinde) fonksiyon baştan aşağı tekrar çalışır.

const { t }: useTranslation fonksiyonu her render'da sana yeni bir t aracı verir. O render süresince t'nin başka bir şeye dönüşmesini istemezsin.
const allCategories: Bu dizi, o anki render için hesaplanır ve biter. Bir sonraki render'da zaten her şey sıfırdan tekrar hesaplanacak. Arada bu değeri elinle değiştirmene gerek yoktur.
3. Niyet Belirtme (Intent)
Kod yazarken const seçmek diğer yazılımcılara şunu söyler: "Bak arkadaşım, ben bu değişkene bir değer verdim ve bu değer bu kapsam içinde (scope) asla değişmeyecek." Eğer gerçekten değişecek bir değere ihtiyacın varsa (mesela bir sayaç gibi), o zaman let kullanılır. Ama modern React'te "değişen" değerler için let yerine useState gibi Hook'lar kullanılır.

Özetle:
const CategoryFilter: Bileşenin kendisidir. Bir bileşeni başka bir şeye dönüştürmek istemezsin (Function Expression).
const { t }: Bir "hook"tan gelen sabittir.
const allCategories: O render anına özel hesaplanmış sabit bir "view" (görünüm) verisidir.
Modern kural şudur: Önce her şeye const yaz. Eğer gerçekten değeri manuel olarak değiştirmen (re-assign) gerekiyorsa o zaman let'e çevir. (Ama React'te %99 const yeterlidir).


- **Q** dangerouslySetInnerHTML nedir? (done)
- **A**
    - **Nedir?:** React'te bir HTML elementinin içine doğrudan "ham HTML" (string formatında) basmak için kullanılan bir özelliktir. Tarayıcıdaki `innerHTML` özelliğinin React karşılığıdır.
    - **Neden "Dangerous" (Tehlikeli)?:** Eğer bu metin dışarıdan (bir kullanıcıdan veya güvensiz bir API'den) geliyorsa, içine kötü amaçlı script'ler (`<script>alert('hack')</script>`) gizlenebilir. Bu da **XSS (Cross-Site Scripting)** saldırılarına yol açar.
    - **Neden Kullanırız?:** Bazen bir CMS'den veya senin durumunda olduğu gibi legacy (eski) bir sistemden hazır HTML tag'leri içeren metinler gelir. Bunları düz yazı olarak değil, HTML olarak göstermek zorunda kalırsın. 
    - **Modern Alternatif:** Bizim yaptığımız gibi **Markdown** kullanmak ve `react-markdown` gibi bir kütüphaneyle render etmek çok daha güvenlidir çünkü bu kütüphaneler tehlikeli tag'leri otomatik olarak temizler.

- **Q** vite nedir? ne için kullanılır? (done)
- **A**
    - **Tanım:** Vite (Fransızca "hızlı" demek), modern web projeleri için geliştirilmiş yeni nesil bir **Build Tool** (İnşa Aracı) ve **Development Server**'dır (Geliştirme Sunucusu).
    - **Ne İşe Yarar?:**
        1. **Hız:** Eski araçlara (Webpack gibi) göre çok daha hızlı çalışır. Sen bir dosyayı kaydedip tarayıcıda değişikliği gördüğün o "HMR" (Hot Module Replacement) işlemi Vite ile neredeyse anlıktır.
        2. **Modülerlik:** Tarayıcının modern "ES Modules" özelliğini kullanır. Yani sadece üzerinde çalıştığın dosyayı derler, tüm projeyi en baştan paketlemekle uğraşmaz.
        3. **Hazır Ayarlar:** TypeScript, CSS (Tailwind/PostCSS) ve JSX gibi teknolojilerin konfigürasyonunu senin yerine "out-of-the-box" (hazır) olarak sunar.
    - **Özet:** Projeni geliştirirken sana süper hızlı bir ortam sunan, yayına alırken de kodunu optimize edip küçülten (bundle) bir "orkestra şefidir".
