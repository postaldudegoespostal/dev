**readme yazmayı öğrenemedim**

bura benim dev projesi olacak. temel mimariyi kurdum, github reposunu anlık çeken sistemi yazdım falan fistan.

front-end'i tabi ai'ya yaptıracağım basic bi single page yapıp işin içinden çıkmak istemedim, discord'daki real-time intellij idea integration'ını buraya taşımayı düşünüyorum,
benim kod yazdığım her an sitede anlık olarak hangi projede hangi dosyayı kaç dakikadır editliyorum bla bla hepsi gözükecek. saat sabahın 5'i valla nası yapcam ben de bilmiyom ama yapcaz bi şekil

blog yazısı sistemi falan olacak 0 tl harcıcam bu arada projeye. dümdüz AI'dan typescript yazdırıp single github page yapmak istemedim, biraz bildiğim şeyleri kullanmak lazım, zaten proje tabi ki,
OPEN-CLOSED olacak istediğim kadar geliştireceğim artık zamanla.

**update**

backend tarafında çoğu şey bitti sayılır. backend'i yüzde 95 kendim yazdım, sadece wakatime api'sini bağlarken ai'dan yardım aldım (bir de ufak tefek logic işleri)
backend'e bakıp "burada şunu bunu yanlış yapmışsın, ilerde bunun yüzünden başın ağrıyacak" diyen bir masterhand olmadığı için yanımda artık zamanla göreceğiz.
geriye sadece front-end tarafında içeriği doldurmak kaldı temel şeyler genel olarak çalışıyor, bir sorun yok gibi duruyor.

ileride AI integrasyonu yapabilirim bilmiyom. sunucu noktasında 0 lira harcayarak yapıyorum projeyi dolayısıyla fuck ai..


**CHANGELOG:**
email yollamaya eklendi - ratelimit eklendi

yalandan hata yönetimi eklendi

anlık stat düzeltildi

blogpost CRUD'ları admin only yapıldı, memory'de credential'lar encrpyted.

yalandan caching eklendi.

(baya bi şey ekledim de burayı updatelemeyi unutmuşum aklıma gelenleri yazayım)

quiz system

spa controller

hardcoded şeyleri kaldırdım

quizdeki cevaba özel yönlendirme var bakarsınız xd

var işte baya bi şey amk

---

## TODO

### Yorum Sistemi
Giscus ile GitHub Discussions tabanlı yorum sistemi kurulacak, böylece kendi DB'de spam yönetimi yerine GitHub'ın moderasyon altyapısından faydalanılacak (React/Giscus).

### GitHub Verilerini Zenginleştirme
Repolardan README.md çekilip Markdown'dan HTML'e parse edilecek ve dil dağılımı hesaplanıp cache'lenecek (Java Spring/Markdown Parser/Redis).

### Canlı Ziyaretçi Sayacı
Websocket veya Server-Sent Events ile o an sitede kaç kişinin olduğu real-time gösterilecek (Spring WebSocket/SSE).
