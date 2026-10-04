export type StoryChoice = {
  id: string;
  label: string;
  text: string;
  trust: number;
  fame: number;
  savings: number;
  branch: string;
};

export type StoryChapter = {
  id: string;
  title: string;
  year: number;
  location: string;
  intro: string;
  scene: string;
  visual: string;
  mood: string;
  unlock: { rank?: string; day?: number };
  choices: StoryChoice[];
};

export const STORY_CAMPAIGN: StoryChapter[] = [
  {
    id: "first-shift",
    title: "Peronun Çocuğu",
    year: 1987,
    location: "Esenler Otogarı · İstanbul",
    intro: "Sabahın ilk ışığında otogar uyanırken sen kapıda bekliyorsun. Cebinde az para, elinde küçük bir çanta ve kafanda tek bir soru var: Buradan kendi şirketimi çıkarabilir miyim?",
    scene: "Patron Hasan Usta seni baştan aşağı süzüyor. “Çıraklık kolay değil. Burada insan tanırsın, yol tanırsın, para tanırsın. Ama önce sözünün ağırlığını öğrenirsin.” Tam o sırada perona gelen yaşlı bir yolcu biletinin yanlış kesildiğini söylüyor.",
    visual: "/story/esenler-morning.svg",
    mood: "Sabah telaşı · İlk izlenim", 
    unlock: { day: 1 },
    choices: [
      { id: "help", label: "Yolcuyla ilgilen", text: "Kâr yok. Ama ilk kez biri adını hatırlıyor.", trust: 3, fame: 2, savings: 120, branch: "temiz" },
      { id: "rush", label: "Gişeye dön, patronu dinle", text: "Patronun işini aksatmadın. İlk güven puanın geldi.", trust: 4, fame: 0, savings: 160, branch: "patron" },
      { id: "solve", label: "İkisini birden çözmeye çalış", text: "Koşturdun, yoruldun ama peron seni fark etti.", trust: 2, fame: 3, savings: 90, branch: "denge" },
    ],
  },
  {
    id: "missing-bag",
    title: "Kayıp Valiz",
    year: 1987,
    location: "Esenler · Gece",
    intro: "Üçüncü haftanda artık seni tanıyanlar var. Bir gece seferinden önce bir valiz kayboluyor. Patronun ilk kez bütün sorumluluğu sana bırakıyor.",
    scene: "Valizin içinde para olduğu söyleniyor. Bir abi kulağına eğilip “Boş ver, yarın bulunur” diyor. Diğer tarafta yaşlı bir kadın, valizin oğlundan kaldığını anlatıyor.",
    visual: "/story/terminal-night.svg",
    mood: "Gece vardiyası · Güven sınavı", 
    unlock: { day: 3 },
    choices: [
      { id: "search", label: "Emanet deposunu tek tek ara", text: "Saatler sürdü. Valiz bulundu.", trust: 4, fame: 3, savings: 80, branch: "temiz" },
      { id: "report", label: "Patrona hemen bildir", text: "Deftere olay kaydı açıldı. Sana güven arttı.", trust: 5, fame: 1, savings: 130, branch: "patron" },
      { id: "ignore", label: "Seferi aksatma", text: "Para kazandın ama yolcunun gözündeki hayal kırıklığını gördün.", trust: -1, fame: 2, savings: 250, branch: "para" },
    ],
  },
  {
    id: "first-betrayal",
    title: "İlk Kırılma",
    year: 1987,
    location: "Esenler · Yazıhane",
    intro: "Bir ay sonra artık işin ritmini biliyorsun. Fakat aynı peronda senden hızlı yükselen biri var. Metin Abi seni kenara çekip patronun defterinde bir açığı gösteriyor.",
    scene: "“Bu açık kimin üstüne kalacak?” diyor. Cevap verirsen birinin canı sıkılacak. Susarsan senin sicilin temiz kalacak. İlk kez para değil, taraf seçiyorsun.",
    visual: "/story/terminal-night.svg",
    mood: "Yazıhane · İlk kırılma", 
    unlock: { day: 5 },
    choices: [
      { id: "truth", label: "Defteri patrona göster", text: "Kolay değildi. Patron sana artık çocuk gibi bakmıyor.", trust: 6, fame: 3, savings: -100, branch: "temiz" },
      { id: "silent", label: "Kimseye karışma", text: "Kendini korudun ama Metin Abi senden uzaklaştı.", trust: 0, fame: -1, savings: 220, branch: "sessiz" },
      { id: "network", label: "İki tarafla da konuş", text: "Arayı buldun. Kulislerde adın duyulmaya başladı.", trust: 2, fame: 5, savings: 80, branch: "kulis" },
    ],
  },
  {
    id: "first-opportunity",
    title: "İlk Direksiyon",
    year: 1988,
    location: "İstanbul → Bursa",
    intro: "Aylar sonra kaptanın yanında ilk kez sefere çıkma fırsatı doğuyor. Artık otogarın dışındaki Türkiye'yi görüyorsun.",
    scene: "Bursa yolunda yağmur başlıyor. Kaptan yorgun. Muavin senden karar bekliyor. Bu yolculuk sana yalnızca para değil, şehirlerin nasıl çalıştığını öğretecek.",
    visual: "/story/bursa-rain.svg",
    mood: "Yol · İlk gerçek sorumluluk", 
    unlock: { day: 10 },
    choices: [
      { id: "safe", label: "Güvenliği öne al", text: "Sefer biraz gecikti ama yolcular seni konuştu.", trust: 5, fame: 4, savings: 500, branch: "güven" },
      { id: "fast", label: "Zamanı kurtarmaya çalış", text: "Daha hızlı vardınız. Patron memnun.", trust: 2, fame: 1, savings: 900, branch: "hız" },
      { id: "listen", label: "Kaptanın tecrübesini dinle", text: "Yol boyunca not aldın. Sonra o notlar şirketinin ilk operasyon defteri oldu.", trust: 4, fame: 5, savings: 650, branch: "öğren" },
    ],
  },
  {
    id: "own-name",
    title: "Tabela",
    year: 1989,
    location: "İstanbul · Küçük Yazıhane",
    intro: "Yıllardır başkasının tabelasının altında çalıştın. Şimdi küçük bir masa kiralayabilecek kadar birikimin var.",
    scene: "Elinde iki seçenek var: eski bir yazıhaneyi ucuza devralmak ya da daha küçük başlayıp kendi adını tabelaya yazmak. İlk kez verdiğin karar doğrudan senin şirketinin adını taşıyacak.",
    visual: "/story/boardroom.svg",
    mood: "Küçük yazıhane · İlk imza", 
    unlock: { day: 18 },
    choices: [
      { id: "small", label: "Küçük ama kendi tabelam", text: "Büyüme yavaş. Ama ilk kez tabelada senin soyadın var.", trust: 6, fame: 7, savings: -6000, branch: "marka" },
      { id: "takeover", label: "Eski yazıhaneyi devral", text: "Borç aldın. Fakat hazır müşteri ve iki hatla başladın.", trust: 2, fame: 4, savings: -9000, branch: "borç" },
      { id: "wait", label: "Biraz daha biriktir", text: "Fırsatı kaçırmadın; daha güçlü bir başlangıç için bekledin.", trust: 3, fame: 5, savings: 2500, branch: "temkin" },
    ],
  },
  {
    id: "the-competitor",
    title: "Karşı Peron",
    year: 1990,
    location: "İstanbul · Terminal",
    intro: "Kendi firman artık peronda. Fakat yanında yeni bir tabela beliriyor. Rakibin ucuz biletle geliyor.",
    scene: "Patronluk sandığın kadar yalnız değil. Bir taraf fiyat kırmanı, bir taraf hizmete yatırım yapmanı istiyor. Karar ilk gerçek pazar savaşını başlatacak.",
    visual: "/story/boardroom.svg",
    mood: "Karşı peron · İlk rekabet", 
    unlock: { day: 25 },
    choices: [
      { id: "price", label: "Fiyatla cevap ver", text: "Yolcu arttı. Marj daraldı.", trust: -1, fame: 4, savings: 3500, branch: "fiyat" },
      { id: "service", label: "Hizmeti yükselt", text: "Rakip bugün kazandı. Sen markayı yarına kurdun.", trust: 6, fame: 7, savings: -2500, branch: "marka" },
      { id: "network", label: "Rakiple ortak rota öner", text: "Beklenmedik bir ortaklık kapısı açıldı.", trust: 4, fame: 5, savings: 1000, branch: "ortaklık" },
    ],
  },
  {
    id: "first-capital",
    title: "Büyümek mi, Sahip Kalmak mı?",
    year: 1991,
    location: "İstanbul · Yönetim Masası",
    intro: "Şirket büyüdü. Artık her karar bir otobüs satın almaktan daha büyük.",
    scene: "Bir yatırımcı masaya oturuyor. “Sana para veririm. Ama şirketin bir kısmını bana bırak.” İlk kez şirketinin geleceğiyle kendi kontrolün arasında seçim yapıyorsun.",
    visual: "/story/boardroom.svg",
    mood: "Yönetim masası · Sermaye", 
    unlock: { day: 40 },
    choices: [
      { id: "bootstrapped", label: "Kendi paramla büyü", text: "Kontrol sende kaldı. Büyüme yavaş ama bağımsız.", trust: 5, fame: 5, savings: 6000, branch: "bağımsız" },
      { id: "investor", label: "Yatırımcıyı içeri al", text: "Sermaye geldi. Artık başka bir göz de masada.", trust: 2, fame: 8, savings: 12000, branch: "sermaye" },
      { id: "ipo", label: "Halka arzı hedefle", text: "Hemen değil. Ama artık hedefin belli: şirketini piyasaya açmak.", trust: 4, fame: 10, savings: 3000, branch: "halkaarz" },
    ],
  },
  {
    id: "first-ipo",
    title: "Zil Çalıyor",
    year: 1992,
    location: "İstanbul · Borsa",
    intro: "Yıllar önce çay taşıdığın peronda başlayan hikâye şimdi borsaya geliyor.",
    scene: "Ekranda şirketinin adı beliriyor. İlk kez şirketinin değeri senin cebindeki paradan daha önemli. Bir karar daha var: büyümeyi hızlandırmak mı, kontrolü korumak mı?",
    visual: "/story/boardroom.svg",
    mood: "Borsa · Zil çalıyor", 
    unlock: { day: 60 },
    choices: [
      { id: "growth", label: "Yeni şehirler", text: "Sermayeyi filoya ve ağ genişlemesine yatır.", trust: 3, fame: 8, savings: 10000, branch: "ulusal" },
      { id: "control", label: "Kontrolü koru", text: "Daha yavaş büyü. Yönetimde ağırlığını kaybetme.", trust: 7, fame: 5, savings: 5000, branch: "kontrol" },
      { id: "brand", label: "Markaya yatırım", text: "Şirketi sadece büyük değil, unutulmaz yap.", trust: 5, fame: 10, savings: 4000, branch: "marka" },
    ],
  },
];
