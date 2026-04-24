import React, { useState, useEffect, useRef } from 'react';
import {
  ClipboardCheck,
  CreditCard,
  Briefcase,
  ShieldCheck,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Clock,
  Users,
  AlertCircle,
  Menu,
  X,
  Star,
  Zap,
  Globe,
  FileText,
  Package,
  Factory,
  ChevronDown,
  Quote,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
  BadgeCheck,
  TrendingUp,
  Award,
  Heart,
  Mail,
  ExternalLink,
  Search,
  BookOpen,
  User,
  Lock,
  ChevronRight,
  Camera,
  ArrowLeft
} from 'lucide-react';

// Assets - Using the actual filenames from disk
import TirImg from './assets/tır.png';
import OturumKartiImg from './assets/oturum kartı.png';
import SupportingImg from './assets/1.png';
import Insta1 from './assets/insta1.png';
import Insta2 from './assets/insta2.png';
import Insta3 from './assets/insta3.png';
import Insta4 from './assets/insta4.png';
import logoImg from './assets/logo.png';

// --- CONFIG ---
const WHATSAPP_NUMBER = "905459918268";
const darkBg = "#0B0F1A";

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: 'Almanya',
    workField: 'Tır Şoförlüğü (KOD95)',
    message: ''
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeViewers, setActiveViewers] = useState(14);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // New States for Features
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({ job: '', country: '', name: '', phone: '' });

  const [portalLoggedIn, setPortalLoggedIn] = useState(false);

  // Routing State
  const [currentPage, setCurrentPage] = useState('home');

  // Counter State
  const [stats, setStats] = useState({ success: 0, clients: 0, countries: 0 });

  const formRef = useRef(null);

  // SEO & Scroll Logic
  useEffect(() => {
    window.scrollTo(0, 0);
    const titles = {
      home: "CMSVize | Almanya, Polonya, Litvanya, Hollanda ve Fransa Vize Uzmanı",
      kvkk: "KVKK Aydınlatma Metni | CMSVize",
      privacy: "Gizlilik Politikası | CMSVize",
      terms: "Kullanım Şartları | CMSVize",
      blog: "Vize Rehberi & Blog | CMSVize",
      portal: "Müşteri Portalı | CMSVize"
    };
    document.title = titles[currentPage] || "CMSVize | Almanya, Polonya, Litvanya, Hollanda ve Fransa Vize Uzmanı";

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="%23facc15"/><g fill="none" stroke="%230B0F1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11h1"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></g></svg>';
  }, [currentPage]);

  // Stats Counter Logic
  useEffect(() => {
    if (currentPage !== 'home') return;
    const targetSuccess = 98;
    const targetClients = 2500;
    const targetCountries = 15;

    let currentSuccess = 0;
    let currentClients = 0;
    let currentCountries = 0;

    const interval = setInterval(() => {
      let updated = false;
      if (currentSuccess < targetSuccess) { currentSuccess += 1; updated = true; }
      if (currentClients < targetClients) { currentClients += 25; updated = true; }
      if (currentCountries < targetCountries) { currentCountries += 1; updated = true; }

      setStats({ success: currentSuccess, clients: currentClients, countries: currentCountries });

      if (!updated) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [currentPage]);

  // Logic Preserved
  useEffect(() => {
    const vInterval = setInterval(() => {
      setActiveViewers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 5000);
    return () => clearInterval(vInterval);
  }, []);

  const popups = [
    "Ahmet K. – Almanya depo işi başvurusu yaptı",
    "Mehmet Y. – Tır şoförlüğü için başvurdu",
    "Hasan A. – A1 transfer sürecine başladı",
    "Burak S. – Polonya lojistik başvurusu yaptı",
    "Sinan G. – 2 yıllık oturum onaylandı",
    "Yusuf E. – Hollanda fabrika işi başvurusu",
    "Mert A. – Danışman önerisi ile sürece başladı"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomPopup = popups[Math.floor(Math.random() * popups.length)];
      setPopupContent(randomPopup);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getWhatsAppURL = (customData = null) => {
    const data = customData || formData;
    const msg = `Merhaba, CMSVize üzerinden başvuru yapmak istiyorum.
Ad Soyad: ${data.name || '---'}
Telefon: ${data.phone || '---'}
Hedef Ülke: ${data.country || 'Genel'}
İlgilendiğim alan: ${data.workField}

Mesaj: ${data.message || 'Bilgi almak istiyorum.'}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. CRM / Email Integration (Örn: Web3Forms, Formspree veya Kendi Backend'iniz)
      // Bu bölüm gerçek bir API bağlandığında aktif edilebilir:
      // await fetch('https://api.web3forms.com/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      //   body: JSON.stringify({ access_key: "YOUR_ACCESS_KEY", ...formData })
      // });

      // Şimdilik simüle ediyoruz (API bağlandığında burası çalışacak)
      await new Promise(resolve => setTimeout(resolve, 800));

      // 2. WhatsApp Yönlendirmesi (Anında Müşteri İletişimi)
      window.open(getWhatsAppURL(), '_blank');

      setIsSubmitting(false);
      setFormSuccess(true);
    } catch (error) {
      console.error("Form error:", error);
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // --- LEGAL PAGE COMPONENT ---
  const LegalPage = ({ title, content }) => (
    <div className="min-h-screen bg-[#0B0F1A] pt-32 pb-24 px-6 animate-fade-up">
      <div className="max-w-4xl mx-auto space-y-12">
        <nav className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-gray-500">
          <button onClick={() => setCurrentPage('home')} className="hover:text-[#facc15] transition-colors">ANA SAYFA</button>
          <span>/</span>
          <span className="text-gray-300">{title}</span>
        </nav>

        <button
          onClick={() => setCurrentPage('home')}
          className="btn-corporate glass px-6 py-3 flex items-center space-x-3 text-[#facc15] font-black uppercase italic tracking-widest text-xs"
        >
          <ArrowLeft size={16} />
          <span>Geri Dön</span>
        </button>

        <div className="linkedin-faq p-10 rounded-2xl shadow-2xl border border-white/5 bg-[#1B1F23]/50 backdrop-blur-sm">
          <h1 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter text-[#facc15] mb-10 border-b border-white/10 pb-8">
            {title}
          </h1>
          <div className="prose prose-invert max-w-none text-gray-400 font-medium leading-relaxed space-y-8">
            {content}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6 pt-12">
          <p className="text-sm font-black italic text-gray-500 uppercase tracking-widest">Sorularınız mı var?</p>
          <button onClick={scrollToForm} className="btn-corporate bg-[#facc15] text-[#0B0F1A] px-10 py-4 font-black text-sm">BİZE ULAŞIN</button>
        </div>
      </div>
    </div>
  );

  const LegalContent = {
    kvkk: {
      title: "6698 Sayılı KVKK Aydınlatma Metni",
      content: (
        <>
          <p><strong>CMSVize</strong> ("Şirket") olarak, hizmetlerimizden faydalanan danışanlarımızın kişisel verilerinin korunmasına ve güvenliğine büyük önem vermekteyiz. 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, "Veri Sorumlu" sıfatıyla, kişisel verilerinizi aşağıda açıklanan çerçevede işlemekteyiz.</p>

          <h3 className="text-[#facc15] text-2xl font-black italic uppercase mt-12 mb-4 tracking-tighter">1. Veri Sorumlusu</h3>
          <p>KVKK uyarınca kişisel verileriniz; veri sorumlusu olarak CMSVize tarafından, işbu Aydınlatma Metni’nde belirtilen amaçlar kapsamında işlenebilecektir.</p>

          <h3 className="text-[#facc15] text-2xl font-black italic uppercase mt-12 mb-4 tracking-tighter">2. İşlenen Kişisel Veri Kategorileri</h3>
          <p>Vize danışmanlık süreçlerinin yürütülmesi amacıyla aşağıdaki veri kategorileri işlenmektedir:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, T.C. kimlik numarası, doğum tarihi, pasaport numarası ve pasaport geçerlilik tarihi.</li>
            <li><strong>İletişim Bilgileri:</strong> Telefon numarası, e-posta adresi, ikametgah adresi.</li>
            <li><strong>Mesleki Bilgiler:</strong> Mevcut iş durumu, mesleki tecrübe ve yetkinlik belgeleri.</li>
          </ul>

          <h3 className="text-[#facc15] text-2xl font-black italic uppercase mt-12 mb-4 tracking-tighter">3. Kişisel Verilerin İşlenme Amaçları</h3>
          <p>Kişisel verileriniz, aşağıdaki amaçlar doğrultusunda işlenmektedir:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Avrupa ülkeleri (Litvanya, Almanya, Polonya vb.) vize başvuru süreçlerinin takibi ve yönetimi,</li>
            <li>Konsolosluk ve aracı kurumlardan randevu alımı,</li>
            <li>A1 transfer ve çalışma izni süreçlerinin yürütülmesi,</li>
            <li>Hizmetlerimize ilişkin bilgilendirme ve danışmanlık süreçlerinin yürütülmesi,</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi.</li>
          </ul>

          <h3 className="text-[#facc15] text-2xl font-black italic uppercase mt-12 mb-4 tracking-tighter">4. Verilerin Saklanma Süresi</h3>
          <p>Kişisel verileriniz, vize danışmanlık hizmetinin devamı süresince ve hizmet sona erdikten sonra yasal zaman aşımı süreleri (genellikle 10 yıl) veya ilgili mevzuatta öngörülen süreler boyunca saklanır. Süre sona erdiğinde verileriniz KVKK uyarınca silinir veya anonim hale getirilir.</p>

          <h3 className="text-[#facc15] text-2xl font-black italic uppercase mt-12 mb-4 tracking-tighter">5. Veri Sahibi Hakları (Madde 11)</h3>
          <p>KVKK’nın 11. maddesi uyarınca CMSVize'ye başvurarak aşağıdaki haklarınızı kullanabilirsiniz:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
            <li>KVKK çerçevesinde silinmesini veya yok edilmesini isteme,</li>
            <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme.</li>
          </ul>
        </>
      )
    },
    privacy: {
      title: "Gizlilik Politikası",
      content: (
        <>
          <p>CMSVize olarak, kullanıcılarımızın gizliliğine ve verilerinin korunmasına sarsılmaz bir bağlılık duyuyoruz. İşbu Gizlilik Politikası, web sitemizi ziyaret ettiğinizde veya hizmetlerimizden yararlandığınızda verilerinizin nasıl işlendiğini şeffaf bir şekilde açıklar.</p>

          <h3 className="text-[#facc15] text-2xl font-black italic uppercase mt-12 mb-4 tracking-tighter">1. Veri Güvenliği ve SSL Sertifikasyonu</h3>
          <p>Verilerinizin güvenliği, CMSVize'nin en üst önceliğidir. Web sitemiz üzerinden iletilen tüm bilgiler, endüstri standardı olan <strong>256-bit SSL (Secure Sockets Layer)</strong> şifreleme teknolojisi ile korunmaktadır. Sunucularımızda saklanan verileriniz, yetkisiz erişime karşı güçlü güvenlik duvarları ve modern şifreleme protokolleri ile güvence altına alınmıştır.</p>

          <h3 className="text-[#facc15] text-2xl font-black italic uppercase mt-12 mb-4 tracking-tighter">2. Üçüncü Taraflarla Veri Paylaşımı</h3>
          <p>Kişisel verileriniz, yalnızca vize başvurunuzun ve çalışma izni süreçlerinizin tamamlanabilmesi amacıyla; ilgili <strong>Büyükelçilikler, Konsolosluklar, Vize Aracı Kurumları (VFS Global, iDATA vb.)</strong> ve resmi makamlarla, hizmetin gerektirdiği ölçüde sınırlı olarak paylaşılır.</p>

          <h3 className="text-[#facc15] text-2xl font-black italic uppercase mt-12 mb-4 tracking-tighter">3. Ticari Amaçla Satış Garantisi</h3>
          <p><strong>Kurumsal Garanti:</strong> CMSVize, danışanlarına ait hiçbir veriyi üçüncü şahıslara veya kurumlara reklam, pazarlama ya da ticari kazanç amacıyla <u>asla satmaz, kiralamaz ve takas etmez.</u> Verileriniz yalnızca sizin onay verdiğiniz vize süreçleri için kullanılır.</p>

          <h3 className="text-[#facc15] text-2xl font-black italic uppercase mt-12 mb-4 tracking-tighter">4. Çerez (Cookie) Kullanımı</h3>
          <p>Sitemizde, kullanıcı deneyimini optimize etmek, site trafiğini analiz etmek ve hizmetlerimizi iyileştirmek amacıyla teknik çerezler kullanılmaktadır. Bu çerezler kişisel kimlik bilgilerini içermez ve tarayıcı ayarlarınız üzerinden istediğiniz zaman devre dışı bırakılabilir.</p>

          <h3 className="text-[#facc15] text-2xl font-black italic uppercase mt-12 mb-4 tracking-tighter">5. Politika Güncellemeleri</h3>
          <p>Teknolojik gelişmelere ve yasal değişikliklere uyum sağlamak amacıyla bu politikada zaman zaman güncellemeler yapabiliriz. Güncel sürüm her zaman web sitemizde yayınlanacaktır.</p>
        </>
      )
    },
    terms: {
      title: "Kullanım Şartları",
      content: (
        <>
          <p>İşbu Kullanım Şartları, CMSVize web sitesinin ve sunulan danışmanlık hizmetlerinin kullanımına ilişkin kuralları belirlemektedir. Sitemizi ziyaret ederek veya hizmet alarak bu şartları kayıtsız şartsız kabul etmiş sayılırsınız.</p>

          <h3 className="text-[#facc15] text-2xl font-black italic uppercase mt-12 mb-4 tracking-tighter">1. Hizmet Kapsamı ve Sınırları</h3>
          <p>CMSVize, Avrupa vize başvuruları, çalışma izinleri ve iş yerleştirme süreçlerinde profesyonel danışmanlık ve dosya hazırlama desteği sunmaktadır. <strong>Kritik Bilgi:</strong> Vize başvuruları hakkındaki nihai karar verme yetkisi tamamen ilgili ülkenin Büyükelçilikleri, Konsoloslukları ve Göç İdarelerine aittir. CMSVize, vize onayına dair %100 garanti vermez; ancak dosyanın en doğru şekilde hazırlanması ve başarının maksimize edilmesi için uzmanlık sunar.</p>

          <h3 className="text-[#facc15] text-2xl font-black italic uppercase mt-12 mb-4 tracking-tighter">2. Fikri Mülkiyet Hakları</h3>
          <p>Web sitesinde yer alan tüm tasarım, logo, metin, grafik ve görsel içeriklerin mülkiyeti CMSVize'ye aittir. Bu içeriklerin CMSVize'nin yazılı izni olmaksızın kopyalanması, çoğaltılması veya ticari amaçla kullanılması yasaktır ve yasal işlem başlatılmasına neden olabilir.</p>

          <h3 className="text-[#facc15] text-2xl font-black italic uppercase mt-12 mb-4 tracking-tighter">3. Sorumluluk Reddi Beyanı</h3>
          <p>CMSVize, sitede yer alan bilgilerin güncelliği ve doğruluğu için azami gayret göstermektedir. Ancak, vize mevzuatları ve ülkelerin göç politikaları anlık olarak değişebilmektedir. Resmi makamlarca yapılan ani mevzuat değişikliklerinden veya kullanıcı tarafından hatalı beyan edilen bilgilerden kaynaklanan gecikme ve ret durumlarından CMSVize sorumlu tutulamaz.</p>

          <h3 className="text-[#facc15] text-2xl font-black italic uppercase mt-12 mb-4 tracking-tighter">4. Kullanım Kuralları</h3>
          <p>Kullanıcılar, site üzerindeki formları doldururken doğru ve güncel bilgi vermeyi taahhüt ederler. Yanıltıcı bilgi verilmesi durumunda danışmanlık hizmeti tek taraflı olarak askıya alınabilir.</p>

          <h3 className="text-[#facc15] text-2xl font-black italic uppercase mt-12 mb-4 tracking-tighter">5. İletişim ve Uyuşmazlıklar</h3>
          <p>Kullanım şartlarına ilişkin her türlü soru ve uyuşmazlık durumunda Türkiye Cumhuriyeti yasaları ve ilgili mahkemeler yetkilidir.</p>
        </>
      )
    }
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-yellow-400 selection:text-black overflow-x-hidden" style={{ backgroundColor: darkBg }}>
      {/* Visual Layout Surgeon - Enhanced CSS */}
      <style>{`
        @keyframes fade-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .text-gradient { background: linear-gradient(135deg, #fff 0%, #facc15 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        @keyframes pulse-soft { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
        .animate-pulse-soft { animation: pulse-soft 3s infinite ease-in-out; }
        .hero-img-container { position: relative; width: 100%; max-width: 620px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(250, 204, 21, 0.15); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .linkedin-card { background: #1B1F23; border: 1px solid #30363D; border-radius: 4px; }
        .linkedin-faq { background: #1B1F23; border: 1px solid #30363D; }
        .btn-corporate { border-radius: 8px; transition: all 0.3s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .btn-corporate:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 0 20px rgba(250, 204, 21, 0.2), 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
        .input-corporate { border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.2); transition: all 0.3s ease; }
        .input-corporate:focus { border-color: #facc15; box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.2); outline: none; }
        .text-gray-400 { color: #cbd5e1 !important; }
        
        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/5 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <div onClick={() => setCurrentPage('home')} className="flex items-center space-x-3 group cursor-pointer">
            {logoImg ? (
              <img src={logoImg} alt="CMSVize" className="h-10 w-auto object-contain transition-all group-hover:scale-105" />
            ) : (
              <span className="text-[#facc15] font-black italic text-2xl tracking-tighter uppercase">CMSVize</span>
            )}
          </div>

          <div className="hidden lg:flex items-center space-x-10 font-bold text-xs tracking-[0.15em]">
            <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('hizmetler')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-[#facc15] transition-colors">HİZMETLER</button>
            <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('referanslar')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-[#facc15] transition-colors">REFERANSLAR</button>
            <button onClick={() => setCurrentPage('blog')} className={`hover:text-[#facc15] transition-colors ${currentPage === 'blog' ? 'text-[#facc15]' : ''}`}>VİZE REHBERİ</button>
            <button onClick={() => setCurrentPage('portal')} className={`hover:text-[#facc15] transition-colors flex items-center space-x-1 ${currentPage === 'portal' ? 'text-[#facc15]' : ''}`}><User size={14} /><span>PORTAL</span></button>

            <div className="flex items-center space-x-4 border border-white/10 p-1.5 rounded-lg bg-[#131926]">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Başvurum hakkında bilgi almak istiyorum")}`} target="_blank" rel="noreferrer" className="btn-corporate px-6 py-2.5 text-gray-300 hover:text-white font-black flex items-center space-x-2 transition-all hover:bg-white/5 rounded-md">
                <Search size={16} className="text-[#0a66c2]" />
                <span>BAŞVURU TAKİP</span>
              </a>
              <button onClick={scrollToForm} className="btn-corporate bg-[#facc15] text-[#0B0F1A] px-8 py-2.5 font-black rounded-md">
                ÜCRETSİZ BAŞVURU BAŞLAT
              </button>
            </div>
          </div>

          <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`lg:hidden fixed inset-0 bg-[#0B0F1A]/98 backdrop-blur-2xl z-[60] transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-10 p-10">
          <X size={40} className="absolute top-6 right-6 cursor-pointer" onClick={() => setMobileMenuOpen(false)} />
          <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); setTimeout(() => document.getElementById('hizmetler')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-4xl font-black italic tracking-tighter">HİZMETLER</button>
          <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); setTimeout(() => document.getElementById('referanslar')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-4xl font-black italic tracking-tighter">REFERANSLAR</button>
          <button onClick={() => { setCurrentPage('blog'); setMobileMenuOpen(false); }} className={`text-4xl font-black italic tracking-tighter ${currentPage === 'blog' ? 'text-[#facc15]' : ''}`}>VİZE REHBERİ</button>
          <button onClick={() => { setCurrentPage('portal'); setMobileMenuOpen(false); }} className={`text-4xl font-black italic tracking-tighter flex items-center space-x-3 ${currentPage === 'portal' ? 'text-[#facc15]' : ''}`}><User size={30} /><span>PORTAL</span></button>
          <div className="w-full space-y-4 pt-4 border-t border-white/10">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Başvurum hakkında bilgi almak istiyorum")}`} target="_blank" rel="noreferrer" className="w-full glass border border-white/10 py-5 rounded-lg btn-corporate font-black text-xl flex justify-center items-center space-x-2 text-gray-300">
              <Search size={24} className="text-[#0a66c2]" />
              <span>BAŞVURU TAKİP</span>
            </a>
            <button onClick={scrollToForm} className="w-full bg-[#facc15] text-[#0B0F1A] py-6 rounded-lg btn-corporate font-black text-2xl">ÜCRETSİZ BAŞVURU BAŞLAT</button>
          </div>
        </div>
      </div>

      {/* RENDER PAGES */}
      {currentPage === 'home' ? (
        <>
          {/* HERO SECTION */}
          <section className="relative pt-40 lg:pt-56 pb-24 lg:pb-32 px-6">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#facc15]/5 rounded-full blur-[150px] -z-10"></div>
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="space-y-10 animate-fade-up">
                <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-lg text-[#facc15] font-black text-xs tracking-widest uppercase shadow-inner">
                  <Zap size={16} fill="currentColor" />
                  <span>Sınırlı Kontenjan • Bugün sadece 12 kişi kabul ediliyor</span>
                </div>
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-7xl font-black leading-[0.95] tracking-tighter italic uppercase">
                    2 Yıllık Litvanya <br />
                    <span className="text-gradient">Oturum Kartı</span> <br />
                    İle Avrupa'da Çalışma
                  </h1>
                  <p className="text-xl lg:text-2xl text-gray-400 max-w-xl leading-relaxed font-medium">
                    Dil bilmeden Avrupa’da çalışma fırsatı.<br className="hidden lg:block" /> Tüm süreci biz yönetiyoruz, sen sadece yola çık.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-5">
                  <button onClick={scrollToForm} className="btn-corporate bg-[#facc15] text-[#0B0F1A] px-12 py-6 font-black text-xl flex items-center justify-center space-x-3 group">
                    <span>ÜCRETSİZ BAŞVURU BAŞLAT</span>
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                  <button onClick={() => setShowWizard(true)} className="btn-corporate glass px-12 py-6 font-black text-xl flex items-center justify-center space-x-3 hover:bg-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    <BookOpen className="text-[#facc15]" />
                    <span>UYGUNLUK TESTİ</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-4 pt-2">
                  {[
                    { icon: <Truck size={14} />, text: "Tır Şoförlüğü (KOD95)" },
                    { icon: <Zap size={14} />, text: "A1 Transfer İle Giriş" },
                    { icon: <Package size={14} />, text: "Fabrika & Depo İşleri" },
                    { icon: <ShieldCheck size={14} />, text: "2 Yıllık Oturum Garantisi" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest text-[#facc15]">
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-10 pt-10 border-t border-white/5">
                  <div>
                    <p className="text-4xl font-black text-[#facc15] tracking-tighter italic">312+</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mt-2">Başvuru</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black text-[#facc15] tracking-tighter italic">{activeViewers}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mt-2">Aktif</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black text-[#facc15] tracking-tighter italic">2dk</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mt-2">Son Talep</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <div className="hero-img-container">
                  <img src={TirImg} alt="European Truck CMSVize" className="w-full h-full object-cover aspect-[4/5] lg:aspect-auto" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A]/80 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-6 right-6 glass p-5 rounded-lg flex items-center space-x-4 border border-white/20 shadow-2xl animate-pulse-soft">
                    <div className="w-12 h-12 bg-[#facc15] rounded-md flex items-center justify-center shrink-0">
                      <Star size={24} className="text-[#0B0F1A]" fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase italic tracking-tighter">KOD95 + İŞ HAZIR</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Tüm İş Kolları Dahil</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* STATS TICKER */}
          <div className="bg-[#facc15] py-5 border-y-4 border-[#0B0F1A] rotate-[-1deg] relative z-20 scale-105 shadow-2xl">
            <div className="flex animate-scroll whitespace-nowrap">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center space-x-12 px-6 text-[#0B0F1A] font-black italic text-2xl uppercase tracking-tighter">
                  <span>Avrupa'da Kariyer</span> <Star size={24} fill="currentColor" />
                  <span>A1 Transfer & Sigorta</span> <Star size={24} fill="currentColor" />
                  <span>Fabrika & Depo İşleri</span> <Star size={24} fill="currentColor" />
                  <span>2 Yıllık Oturum Kartı</span> <Star size={24} fill="currentColor" />
                </div>
              ))}
            </div>
          </div>

          {/* İSTATİSTİK */}
          <section id="istatistik" className="py-24 bg-white/[0.02]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="text-center space-y-4">
                  <div className="flex justify-center text-[#facc15] mb-2"> <TrendingUp size={48} /> </div>
                  <p className="text-6xl font-black italic text-[#facc15] tracking-tighter">%{stats.success}</p>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Vize Başarı Oranı</p>
                </div>
                <div className="text-center space-y-4 border-y md:border-y-0 md:border-x border-white/5 py-10 md:py-0">
                  <div className="flex justify-center text-[#facc15] mb-2"> <Users size={48} /> </div>
                  <p className="text-6xl font-black italic text-[#facc15] tracking-tighter">{stats.clients}+</p>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Mutlu Müşteri</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="flex justify-center text-[#facc15] mb-2"> <Globe size={48} /> </div>
                  <p className="text-6xl font-black italic text-[#facc15] tracking-tighter">{stats.countries}+</p>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Hedef Ülke</p>
                </div>
              </div>
            </div>
          </section>

          {/* MÜŞTERİ GÖRÜŞLERİ */}
          <section id="referanslar" className="py-32 px-6 bg-[#0B0F1A]">
            <div className="max-w-6xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter">Müşteri <span className="text-[#0a66c2]">Görüşleri</span></h2>
                <p className="text-gray-400 font-medium text-lg">Profesyonel hizmetimizle vizesine kavuşan danışanlarımız.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Caner T.", visa: "Almanya Ulusal Vize (D Tipi)", flag: "🇩🇪", time: "3 gün önce", text: "Almanya'daki işverenimle anlaştıktan sonra tüm süreci CMSVize yönetti. Dosya hazırlığı o kadar profesyoneldi ki konsoloslukta hiç soru bile sormadılar." },
                  { name: "Burak E.", visa: "Polonya D Tipi Ulusal Vize", flag: "🇵🇱", time: "1 hafta önce", text: "Polonya vizesi gibi yoğun bir süreçte CMSVize ekibinin kurumsal ve dürüst desteği için teşekkür ederim. Sayelerinde iş başı tarihim aksamadı." },
                  { name: "Ayşe K.", visa: "Litvanya Oturum İzni", flag: "🇱🇹", time: "1 hafta önce", text: "Litvanya çalışma vizem CMSVize'nin titiz yönlendirmeleri sayesinde kısa sürede onaylandı. Randevu alımından evrak çevirisine kadar her şey kusursuzdu." },
                  { name: "Mert Y.", visa: "Hollanda Nitelikli Çalışan", flag: "🇳🇱", time: "2 hafta önce", text: "Hollanda Yüksek Nitelikli Göçmen vizemi CMSVize desteğiyle aldım. Çok karmaşık görünen bu süreci benim için son derece basitleştirdiler." },
                  { name: "Selin D.", visa: "Fransa Çalışma Vizesi", flag: "🇫🇷", time: "3 hafta önce", text: "Fransa'daki yeni görevim için gereken tüm çalışma izni süreçleri eksiksiz tamamlandı. Danışmanların ilgisi ve tecrübesi muazzamdı." }
                ].map((ref, idx) => (
                  <div key={idx} className="linkedin-card p-5 space-y-4 shadow-xl border border-white/5 hover:border-[#0a66c2]/30 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-5 right-5 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-xl border border-white/10 shadow-lg group-hover:scale-125 transition-transform">
                      {ref.flag}
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-3">
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-black text-xl z-10">{ref.name[0]}</div>
                        <div className="z-10 pr-6">
                          <div className="flex items-center space-x-1">
                            <h4 className="font-bold text-sm text-white">{ref.name}</h4>
                            <BadgeCheck size={16} className="text-[#0a66c2] fill-[#0a66c2]/20" />
                          </div>
                          <p className="text-[11px] text-[#facc15] font-bold leading-tight mt-0.5">{ref.visa}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{ref.time} • 🌐</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-200 leading-relaxed font-normal relative z-10">{ref.text}</div>
                    <div className="flex items-center space-x-1 pt-2 relative z-10">
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 bg-[#0a66c2] rounded-full flex items-center justify-center border-2 border-[#1B1F23]"><ThumbsUp size={10} className="text-white fill-white" /></div>
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#1B1F23]"><Heart size={10} className="text-white fill-white" /></div>
                      </div>
                      <span className="text-[11px] text-gray-400 font-medium ml-1">14 • 3 yorum</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* HİZMETLER */}
          <section id="hizmetler" className="py-32 lg:py-48 px-6">
            <div className="max-w-7xl mx-auto space-y-20">
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                <h2 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter">Genişletilmiş <br /> <span className="text-[#facc15]">Hizmetlerimiz</span></h2>
                <p className="text-xl text-gray-400 font-medium">Her profil için uygun bir Avrupa iş planı hazırlıyoruz.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { icon: <span className="text-3xl">🇩🇪</span>, title: "Almanya İş Fırsatları", desc: "Tır şoförlüğü ve nitelikli çalışan vizesiyle Almanya'nın kapılarını aralıyoruz. Evrak sürecini uçtan uca yönetiyoruz." },
                  { icon: <span className="text-3xl">🇱🇹</span>, title: "Litvanya Oturum & A1", desc: "Dil şartı olmadan Avrupa’ya giriş imkanı sağlayan A1 transfer ve 2 yıllık oturum kartı sürecinizi güvenle tamamlıyoruz." },
                  { icon: <span className="text-3xl">🇵🇱</span>, title: "Polonya Çalışma İzni", desc: "Fabrika, depo ve lojistik alanlarında Polonya çalışma izni başvurularını hızla sonuçlandırıp iş yerleşiminizi sağlıyoruz." },
                  { icon: <span className="text-3xl">🇳🇱</span>, title: "Hollanda Nitelikli Göçmen", desc: "Hollanda yüksek nitelikli çalışan vizelerinde eksiksiz danışmanlık ve başvuru takibi sağlıyoruz." },
                  { icon: <span className="text-3xl">🇫🇷</span>, title: "Fransa Çalışma Vizesi", desc: "Fransa'da uzun dönem çalışma vizesi ve oturum izinleri için resmi kurumlar nezdinde profesyonel destek sunuyoruz." },
                  { icon: <ShieldCheck size={32} />, title: "Tam Kapsamlı Destek", desc: "Hangi ülkeyi seçerseniz seçin, dosya hazırlığından konsolosluk mülakatına kadar her adımda yanınızdayız." }
                ].map((item, i) => (
                  <div key={i} className="glass p-8 rounded-xl group hover:border-[#facc15]/30 transition-all duration-500 shadow-2xl flex flex-col relative overflow-hidden">
                    <div className="w-16 h-16 bg-[#facc15]/10 rounded-full flex items-center justify-center text-[#facc15] mb-8 group-hover:bg-[#facc15] group-hover:text-[#0B0F1A] transition-all border border-white/5">{item.icon}</div>
                    <h3 className="text-2xl font-black italic uppercase mb-4">{item.title}</h3>
                    <p className="text-gray-400 font-medium leading-relaxed mb-6">{item.desc}</p>
                    <button onClick={scrollToForm} className="mt-auto flex items-center space-x-2 text-[#facc15] font-black text-sm uppercase tracking-widest group">
                      <span>Detaylar</span> <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SÜREÇTEN KESİTLER */}
          <section id="surec" className="py-32 px-6 bg-white/[0.01]">
            <div className="max-w-7xl mx-auto space-y-20">
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                <h2 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter">Görsel <span className="text-[#facc15]">Sürecimiz</span></h2>
                <p className="text-xl text-gray-400 font-medium">Yasal evraklarınızdan iş sahasına kadar her an yanınızdayız.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="glass p-5 rounded-xl shadow-2xl">
                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-black/40 p-4 text-center flex items-center justify-center">
                    <img src={OturumKartiImg} className="w-full h-full object-contain" alt="Oturum Kartı" />
                  </div>
                  <p className="mt-4 px-3 text-lg font-black italic uppercase text-center">Resmi Oturum & Çalışma Kartı</p>
                </div>
                <div className="glass p-5 rounded-xl shadow-2xl">
                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-black/40">
                    <img src={TirImg} className="w-full h-full object-cover" alt="Tır Operasyonları" />
                  </div>
                  <p className="mt-4 px-3 text-lg font-black italic uppercase text-center">Uluslararası Lojistik Ağı</p>
                </div>
              </div>
            </div>
          </section>

          {/* INSTAGRAM VİTRİNİ */}
          <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-[#facc15]/10 rounded-2xl flex items-center justify-center mb-2 border border-[#facc15]/20">
                  <Camera size={32} className="text-[#facc15]" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">Bizi Instagram'da <span className="text-[#facc15]">Takip Edin</span></h2>
                <p className="text-gray-400 font-medium text-lg">Güncel vize başarılarımız, duyurular ve yurtdışı yaşam ipuçları için profilimizi ziyaret edin.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                {[
                  {
                    img: Insta1,
                    type: 'REEL',
                    typeIcon: 'reel',
                    tag: '@CMSPrime',
                    label: 'Almanya Vizesi Onaylandı!',
                  },
                  {
                    img: Insta2,
                    type: 'CAROUSEL',
                    typeIcon: 'carousel',
                    tag: '@CMSPrime',
                    label: 'Uzman Danışmanlık & %98 Başarı',
                  },
                  {
                    img: Insta3,
                    type: 'POST',
                    typeIcon: 'post',
                    tag: '@CMSPrime',
                    label: 'Polonya Oturum İzni ✅',
                  },
                  {
                    img: Insta4,
                    type: 'REEL',
                    typeIcon: 'reel',
                    tag: '@CMSPrime',
                    label: 'CMSPrime Ekibi',
                  }
                ].map((post, i) => (
                  <a
                    key={i}
                    href="https://www.instagram.com/cmsprime/"
                    target="_blank"
                    rel="noreferrer"
                    className="aspect-square rounded-xl overflow-hidden relative group block border border-white/10 shadow-xl"
                  >
                    {/* Background Image */}
                    <img src={post.img} alt={post.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10"></div>

                    {/* Type Badge - top right */}
                    <div className="absolute top-3 right-3 z-10">
                      {post.typeIcon === 'reel' && (
                        <div className="bg-black/60 backdrop-blur-sm border border-white/20 px-2 py-1 rounded-md flex items-center space-x-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.53V6.77a4.85 4.85 0 0 1-1.01-.08z"/></svg>
                          <span className="text-white text-[9px] font-black uppercase">Reel</span>
                        </div>
                      )}
                      {post.typeIcon === 'carousel' && (
                        <div className="bg-black/60 backdrop-blur-sm border border-white/20 px-2 py-1 rounded-md flex items-center space-x-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="2" y="7" width="10" height="10" rx="1"/><path d="M14 9h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2"/><path d="M18 10h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1"/></svg>
                          <span className="text-white text-[9px] font-black uppercase">Carousel</span>
                        </div>
                      )}
                      {post.typeIcon === 'post' && (
                        <div className="bg-black/60 backdrop-blur-sm border border-white/20 px-2 py-1 rounded-md flex items-center space-x-1">
                          <Camera size={10} className="text-white" />
                          <span className="text-white text-[9px] font-black uppercase">Post</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                      <p className="text-[#facc15] text-[11px] font-black uppercase leading-tight drop-shadow-lg line-clamp-2">{post.label}</p>
                      <p className="text-white/70 text-[9px] font-bold mt-0.5 tracking-widest">{post.tag}</p>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#facc15]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center border-2 border-[#facc15] rounded-xl">
                      <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Camera size={16} className="text-[#facc15]" />
                        <span className="text-[#facc15] font-black text-xs uppercase">Profili Gör</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* SSS */}
          <section id="sss" className="py-32 px-6 bg-[#0B0F1A]">
            <div className="max-w-4xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter">Sıkça Sorulan <span className="text-[#facc15]">Sorular</span></h2>
                <p className="text-gray-400 font-medium text-lg tracking-tight">Vize ve çalışma süreçlerine dair bilmeniz gerekenler.</p>
              </div>
              <div className="space-y-3">
                {[
                  { q: "Almanya randevu durumu ve bekleme süresi nedir?", a: "Almanya randevu atamaları iDATA üzerinden konsolosluk yoğunluğuna göre değişmektedir. Ortalama 2-6 hafta arası sürebilir." },
                  { q: "Polonya D Tipi vize süresi ne kadardır?", a: "Polonya D Tipi ulusal vize (çalışma vizesi) başvuruları genellikle evrak tesliminden sonra 15 gün içinde sonuçlanmaktadır." },
                  { q: "Litvanya çalışma izni ve A1 süreci nasıl işler?", a: "Litvanya'da resmi çalışma izni ve A1 transferi işlemleri dil şartı aranmaksızın yaklaşık 4-6 hafta süren bir dosya onay sürecidir." },
                  { q: "Vize reddi durumunda nasıl bir yol izlenir?", a: "Red durumunda uzman ekibimiz ret gerekçelerini inceleyerek resmi itiraz (Remonstrasyon) veya eksiksiz yeni bir başvuru sürecini hızlıca başlatır." }
                ].map((faq, idx) => (
                  <div key={idx} className="linkedin-faq overflow-hidden transition-all duration-300 rounded-lg">
                    <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full p-6 flex items-center justify-between text-left hover:bg-white/[0.02]">
                      <span className={`text-lg font-bold transition-colors ${activeFaq === idx ? 'text-[#facc15]' : 'text-gray-200'}`}>{faq.q}</span>
                      <ChevronDown className={`transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-[#facc15]' : 'text-gray-500'}`} />
                    </button>
                    <div className={`transition-all duration-500 overflow-hidden ${activeFaq === idx ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="p-6 pt-0 text-gray-400 font-normal border-t border-white/5 bg-white/[0.01] leading-relaxed">{faq.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FORM SECTION */}
          <section ref={formRef} className="py-32 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-0 rounded-xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5 relative">
                <div className="bg-[#131926] p-10 lg:p-20 relative">
                  {isSubmitting && <div className="absolute inset-0 bg-[#131926]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-[#facc15] border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black italic uppercase text-[#facc15] tracking-widest text-sm">Yönlendiriliyorsunuz...</p>
                  </div>}
                  <h2 className="text-5xl font-black italic uppercase tracking-tighter italic mb-10">Hemen <span className="text-[#facc15]">Başvur</span></h2>
                  {formSuccess ? (
                    <div className="flex flex-col items-center justify-center text-center space-y-6 py-16 animate-fade-up">
                      <div className="w-24 h-24 bg-[#0a66c2]/20 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={48} className="text-[#0a66c2]" />
                      </div>
                      <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#0a66c2]">Başvurunuz Başarıyla Alındı!</h3>
                      <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-sm">Uzmanlarımız en kısa sürede vermiş olduğunuz bilgiler üzerinden size dönüş yapacaktır.</p>
                      <button onClick={() => setFormSuccess(false)} className="mt-8 btn-corporate glass border border-white/10 px-8 py-4 text-white hover:border-[#0a66c2]/50 hover:bg-[#0a66c2]/10 transition-all font-bold text-sm tracking-widest uppercase">Yeni Başvuru Yap</button>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">AD SOYAD</label>
                        <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/5 px-8 py-5 text-lg font-bold input-corporate focus:border-[#facc15] transition-colors" placeholder="Ahmet Yılmaz" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">TELEFON</label>
                          <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 px-8 py-5 text-lg font-bold input-corporate focus:border-[#facc15] transition-colors" placeholder="+90" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">HEDEF ÜLKE</label>
                          <select name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-white/5 px-8 py-5 text-lg font-bold input-corporate focus:border-[#facc15] transition-colors">
                            <option className="bg-[#0B0F1A]">Almanya</option>
                            <option className="bg-[#0B0F1A]">Polonya</option>
                            <option className="bg-[#0B0F1A]">Litvanya</option>
                            <option className="bg-[#0B0F1A]">Hollanda</option>
                            <option className="bg-[#0B0F1A]">Fransa</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">ÇALIŞMAK İSTEDİĞİNİZ ALAN</label>
                        <select name="workField" value={formData.workField} onChange={handleInputChange} className="w-full bg-white/5 px-8 py-5 text-lg font-bold input-corporate focus:border-[#facc15] text-[#facc15] transition-colors">
                          <option className="bg-[#0B0F1A]">Tır Şoförlüğü (KOD95)</option>
                          <option className="bg-[#0B0F1A]">A1 Transfer Süreci</option>
                          <option className="bg-[#0B0F1A]">Fabrika / Depo / Lojistik</option>
                          <option className="bg-[#0B0F1A]">Fark Etmez / Danışman Önerisi</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">EK NOT</label>
                        <textarea name="message" value={formData.message} onChange={handleInputChange} className="w-full bg-white/5 px-8 py-5 text-lg font-bold input-corporate focus:border-[#facc15] transition-colors" rows="3" placeholder="Tecrübelerinizden bahsedin..."></textarea>
                      </div>

                      <div className="flex items-start space-x-3 pt-2 pb-2">
                        <input type="checkbox" required id="terms" className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#0a66c2] focus:ring-[#0a66c2] cursor-pointer" />
                        <label htmlFor="terms" className="text-[11px] text-gray-400 leading-relaxed cursor-pointer font-medium">Danışmanlık hizmet şartlarını okudum ve vize karar merciinin ilgili Konsolosluklar olduğunu kabul ediyorum.</label>
                      </div>

                      <button type="submit" className="w-full bg-[#facc15] text-[#0B0F1A] py-6 btn-corporate font-black text-2xl uppercase italic tracking-tighter">BAŞVURUYU TAMAMLA</button>
                    </form>
                  )}
                </div>
                <div className="bg-[#facc15] p-12 lg:p-20 text-[#0B0F1A] flex flex-col justify-between">
                  <div className="space-y-12">
                    <h3 className="text-4xl lg:text-6xl font-black italic uppercase leading-[0.9] tracking-tighter">AVRUPA <br /> KAPISI <br /> AÇILIYOR</h3>
                    <div className="space-y-6 font-black text-2xl italic tracking-tighter">
                      <p className="flex items-center space-x-4"> <Star fill="currentColor" /> <span>HERKES İÇİN İŞ İMKANI</span> </p>
                      <p className="flex items-center space-x-4"> <Star fill="currentColor" /> <span>2500€+ MAAŞ FIRSATI</span> </p>
                      <p className="flex items-center space-x-4"> <Star fill="currentColor" /> <span>AİLE BİRLEŞİMİ</span> </p>
                    </div>
                  </div>
                  <div className="space-y-4 pt-10 border-t border-black/10">
                    <p className="text-3xl font-black tracking-tighter flex items-center space-x-3"> <Phone /> <span>+90 545 991 82 68</span> </p>
                    <p className="text-sm font-black uppercase tracking-widest flex items-center space-x-3"> <MapPin /> <span>Merkez, Aksaray / Vilnius</span> </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DYNAMIC MAP SECTION */}
          <section className="py-24 px-6 bg-[#080C14] border-t border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a66c2]/10 via-[#0B0F1A]/0 to-transparent"></div>
            <div className="max-w-7xl mx-auto space-y-16 relative z-10">
              <div className="text-center space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">Aktif <span className="text-[#facc15]">Avrupa Ağı</span></h2>
                <p className="text-gray-400 font-medium">Uzmanlık alanımızdaki 5 ülkede kesintisiz hizmet.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { country: "Almanya", flag: "🇩🇪", desc: "Tır & Nitelikli" },
                  { country: "Polonya", flag: "🇵🇱", desc: "Lojistik & Depo" },
                  { country: "Litvanya", flag: "🇱🇹", desc: "A1 & 2 Yıllık Oturum" },
                  { country: "Hollanda", flag: "🇳🇱", desc: "High-Skilled" },
                  { country: "Fransa", flag: "🇫🇷", desc: "Çalışma İzni" }
                ].map((item, i) => (
                  <div key={i} className="glass p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 w-40 hover:scale-105 hover:border-[#facc15]/30 transition-all cursor-pointer group">
                    <div className="text-4xl group-hover:-translate-y-2 transition-transform drop-shadow-2xl">{item.flag}</div>
                    <div className="text-center">
                      <p className="font-black text-white text-sm uppercase">{item.country}</p>
                      <p className="text-[10px] text-[#facc15] font-bold mt-1 tracking-widest">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : currentPage === 'blog' ? (
        <div className="pt-40 pb-32 px-6 max-w-5xl mx-auto min-h-screen">
          <h2 className="text-5xl font-black italic uppercase mb-12 tracking-tighter">Vize <span className="text-[#facc15]">Rehberi</span></h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-xl hover:border-[#0a66c2]/50 transition-all cursor-pointer">
              <span className="text-xs font-black text-[#facc15] bg-[#facc15]/10 px-3 py-1 rounded-md uppercase tracking-widest">Güncel 2026</span>
              <h3 className="text-2xl font-black italic mt-4 mb-3">Avrupa'da Tır Şoförü Olmak: KOD95 Nedir?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Sürücülerin Avrupa standartlarında çalışabilmesi için alması gereken eğitimler ve A1 transferi detayları.</p>
            </div>
            <div className="glass p-8 rounded-xl hover:border-[#0a66c2]/50 transition-all cursor-pointer">
              <span className="text-xs font-black text-[#0a66c2] bg-[#0a66c2]/20 px-3 py-1 rounded-md uppercase tracking-widest">Oturum İzni</span>
              <h3 className="text-2xl font-black italic mt-4 mb-3">Litvanya 2 Yıllık Oturum Kartı Avantajları</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Schengen bölgesinde serbest dolaşım ve çalışma hakkı tanıyan bu özel izne nasıl başvurulur?</p>
            </div>
          </div>
        </div>
      ) : currentPage === 'portal' ? (
        <div className="pt-40 pb-32 px-6 max-w-xl mx-auto min-h-screen flex flex-col items-center justify-center">
          <div className="glass p-12 rounded-2xl w-full text-center space-y-8 border-t-4 border-[#facc15]">
            <Lock className="text-[#facc15] w-16 h-16 mx-auto" />
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Müşteri <span className="text-[#facc15]">Portalı</span></h2>
              <p className="text-gray-400 mt-2 text-sm">Vize başvuru sürecinizi adım adım takip edin.</p>
            </div>
            {!portalLoggedIn ? (
              <form onSubmit={(e) => { e.preventDefault(); setPortalLoggedIn(true); }} className="space-y-4">
                <input required placeholder="T.C. Kimlik / Pasaport No" className="w-full bg-black/50 border border-white/10 px-6 py-4 rounded-lg font-bold focus:border-[#facc15] outline-none" />
                <input required type="password" placeholder="Şifre" className="w-full bg-black/50 border border-white/10 px-6 py-4 rounded-lg font-bold focus:border-[#facc15] outline-none" />
                <button className="w-full bg-[#facc15] text-black font-black py-4 rounded-lg text-lg hover:scale-[1.02] transition-transform">GİRİŞ YAP</button>
              </form>
            ) : (
              <div className="space-y-8 text-left bg-black/40 p-6 rounded-xl border border-white/5">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <h3 className="font-black text-lg">Sn. Ahmet Yılmaz</h3>
                  <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-bold uppercase">Aktif Dosya</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <CheckCircle2 className="text-green-500" />
                    <div className="flex-1"><p className="text-sm font-bold">1. Evraklar Toplandı</p><p className="text-xs text-gray-500">Tamamlandı</p></div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <CheckCircle2 className="text-green-500" />
                    <div className="flex-1"><p className="text-sm font-bold">2. Tercümeler ve Noter</p><p className="text-xs text-gray-500">Tamamlandı</p></div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 rounded-full border-2 border-[#facc15] flex items-center justify-center bg-[#facc15]/20 animate-pulse"></div>
                    <div className="flex-1"><p className="text-sm font-bold text-[#facc15]">3. Konsolosluk Randevusu</p><p className="text-xs text-gray-500">Bekleniyor (Tahmini: 14 Gün)</p></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <LegalPage
          title={LegalContent[currentPage].title}
          content={LegalContent[currentPage].content}
        />
      )}

      {/* FOOTER */}
      <footer className="py-24 border-t border-white/5 bg-[#0B0F1A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-16">
            <div className="space-y-6">
              <div onClick={() => setCurrentPage('home')} className="flex items-center space-x-3 group cursor-pointer">
                {logoImg ? (
                  <img src={logoImg} alt="CMSVize" className="h-14 w-auto object-contain transition-all group-hover:scale-105" />
                ) : (
                  <span className="text-[#facc15] font-black italic text-2xl tracking-tighter uppercase">CMSVize</span>
                )}
              </div>
              <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs uppercase tracking-tighter italic">Avrupa'da kariyer ve yaşam için profesyonel vize ve danışmanlık köprünüz.</p>
              <div className="flex space-x-4 pt-4">
                <a href="https://www.instagram.com/cmsprime/" target="_blank" rel="noreferrer" className="w-10 h-10 glass flex items-center justify-center rounded-lg hover:text-[#0B0F1A] hover:bg-[#facc15] hover:border-[#facc15] transition-all group">
                  <Camera size={18} className="text-[#facc15] group-hover:text-[#0B0F1A]" />
                </a>
                <a href="#" className="w-10 h-10 glass flex items-center justify-center rounded-lg hover:text-[#facc15] transition-all"><Globe size={18} /></a>
                <a href="#" className="w-10 h-10 glass flex items-center justify-center rounded-lg hover:text-[#facc15] transition-all"><Share2 size={18} /></a>
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-[#facc15] font-black text-xs tracking-[0.2em] uppercase">Hızlı Bağlantılar</h4>
              <ul className="space-y-4 font-bold text-sm text-gray-400">
                <li><button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('hizmetler')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-colors">Hizmetlerimiz</button></li>
                <li><button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('surec')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-colors">Süreç Yönetimi</button></li>
                <li><button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('referanslar')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-colors">Başarı Hikayeleri</button></li>
                <li><button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('sss')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-colors">Sıkça Sorulan Sorular</button></li>
              </ul>
            </div>
            <div className="space-y-6 lg:col-span-2 lg:flex lg:space-y-0 lg:gap-16">
              <div className="space-y-6">
                <h4 className="text-[#facc15] font-black text-xs tracking-[0.2em] uppercase">Yasal</h4>
                <ul className="space-y-4 font-bold text-sm text-gray-400">
                  <li><button onClick={() => setCurrentPage('kvkk')} className="hover:text-white transition-colors uppercase tracking-tighter italic text-left">KVKK Aydınlatma Metni</button></li>
                  <li><button onClick={() => setCurrentPage('privacy')} className="hover:text-white transition-colors uppercase tracking-tighter italic text-left">Gizlilik Politikası</button></li>
                  <li><button onClick={() => setCurrentPage('terms')} className="hover:text-white transition-colors uppercase tracking-tighter italic text-left">Kullanım Şartları</button></li>
                </ul>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-gray-400 font-light text-xs tracking-wide">Mesai: Hafta İçi 09:00 - 18:00</p>
                  <p className="text-gray-400 font-light text-xs tracking-wide mt-1">bilgi@cmsvize.com</p>
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-[#facc15] font-black text-xs tracking-[0.2em] uppercase">İletişim</h4>
                <ul className="space-y-4 font-bold text-sm text-gray-400">
                  <li className="flex items-center space-x-2"><Phone size={14} /> <span>+90 545 991 82 68</span></li>
                  <li className="flex items-center space-x-2"><Mail size={14} /> <span>bilgi@cmsvize.com</span></li>
                  <li className="flex items-center space-x-2"><MapPin size={14} /> <span>Aksaray, Türkiye</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">© 2026 CMSVize Danışmanlık. Tüm hakları saklıdır.</p>
            <div className="flex space-x-6 text-[10px] font-black text-gray-600 uppercase tracking-widest"><span>Designed for Excellence</span></div>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT - ENHANCED */}
      <a href={getWhatsAppURL()} target="_blank" rel="noreferrer" className="fixed bottom-10 right-10 z-50 group flex items-center">
        <div className="mr-4 bg-white text-[#0B0F1A] px-4 py-2 rounded-lg shadow-2xl font-black text-sm italic tracking-tight opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 border border-gray-200">
          Size nasıl yardımcı olabiliriz?
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-white border-b-[6px] border-b-transparent"></div>
        </div>
        <div className="relative transition-transform duration-300 group-hover:scale-[1.05]">
          <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-25 scale-125"></div>
          <div className="relative bg-[#25D366] px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.5)] flex items-center space-x-3">
            <MessageCircle size={28} className="text-white" fill="currentColor" />
            <span className="text-white font-black italic tracking-wide">Danışmana Yaz</span>
          </div>
        </div>
      </a>

      {/* FAKE LIVE POPUP */}
      <div className={`fixed bottom-10 left-10 z-50 glass px-8 py-5 rounded-lg flex items-center space-x-5 transition-all duration-700 shadow-2xl border border-white/10 ${showPopup ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <div className="w-12 h-12 bg-[#facc15]/20 rounded-md flex items-center justify-center text-[#facc15]"><Users size={24} /></div>
        <div>
          <p className="text-base font-black italic tracking-tighter">{popupContent}</p>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Hızlı Başvuru</p>
        </div>
        <button onClick={() => setShowPopup(false)} className="ml-4 text-gray-500 hover:text-white transition-colors"> <X size={20} /> </button>
      </div>

      {/* WIZARD MODAL (UYGUNLUK TESTİ) */}
      <div className={`fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 transition-all duration-500 ${showWizard ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className={`bg-[#0B0F1A] border border-white/10 p-10 lg:p-16 rounded-2xl w-full max-w-2xl relative shadow-2xl transition-all duration-500 delay-100 ${showWizard ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}>
          <X size={32} className="absolute top-6 right-6 cursor-pointer text-gray-500 hover:text-white transition-colors" onClick={() => setShowWizard(false)} />

          <div className="mb-10">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#facc15]">Avrupa Uygunluk Testi</h3>
            <p className="text-gray-400 mt-2 font-medium">Sadece 3 adımda size en uygun vize rotasını çizelim.</p>
            <div className="flex space-x-2 mt-6">
              {[1, 2, 3].map(step => (
                <div key={step} className={`h-2 flex-1 rounded-full transition-all duration-500 ${wizardStep >= step ? 'bg-[#facc15]' : 'bg-white/10'}`}></div>
              ))}
            </div>
          </div>

          {wizardStep === 1 && (
            <div className="space-y-6 animate-fade-up">
              <h4 className="text-xl font-bold">1. Mesleğiniz veya uzmanlığınız nedir?</h4>
              <div className="grid grid-cols-2 gap-4">
                {['Tır Şoförü', 'Fabrika / Üretim', 'Depo / Lojistik', 'Diğer (Belirtiniz)'].map(job => (
                  <button key={job} onClick={() => { setWizardData({ ...wizardData, job }); setWizardStep(2); }} className="glass border border-white/10 py-6 rounded-lg font-bold hover:bg-[#facc15] hover:text-black hover:border-[#facc15] transition-all text-sm">{job}</button>
                ))}
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="space-y-6 animate-fade-up">
              <h4 className="text-xl font-bold">2. Hangi ülkeyi hedefliyorsunuz?</h4>
              <div className="grid grid-cols-2 gap-4">
                {['Almanya', 'Polonya', 'Litvanya', 'Hollanda', 'Fransa'].map(country => (
                  <button key={country} onClick={() => { setWizardData({ ...wizardData, country }); setWizardStep(3); }} className="glass border border-white/10 py-6 rounded-lg font-bold hover:bg-[#facc15] hover:text-black hover:border-[#facc15] transition-all text-sm">{country}</button>
                ))}
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-6 animate-fade-up">
              <h4 className="text-xl font-bold">3. Raporunuz hazırlandı!</h4>
              <p className="text-gray-400 text-sm leading-relaxed">Size özel ücretsiz değerlendirme sonucunu iletebilmemiz ve uzmanlarımızın incelemesi için lütfen bilgilerinizi girin.</p>
              <div className="space-y-4">
                <input placeholder="Adınız Soyadınız" onChange={(e) => setWizardData({ ...wizardData, name: e.target.value })} className="w-full bg-black/50 border border-white/10 px-6 py-4 rounded-lg font-bold focus:border-[#facc15] outline-none transition-colors" />
                <input placeholder="Telefon Numaranız" onChange={(e) => setWizardData({ ...wizardData, phone: e.target.value })} className="w-full bg-black/50 border border-white/10 px-6 py-4 rounded-lg font-bold focus:border-[#facc15] outline-none transition-colors" />
                <button onClick={() => {
                  setShowWizard(false); setWizardStep(1);
                  const msg = `Merhaba, Uygunluk Testini çözdüm.\n\nMeslek: ${wizardData.job}\nÜlke: ${wizardData.country}\nİsim: ${wizardData.name}\nTelefon: ${wizardData.phone}`;
                  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
                }} className="w-full bg-[#facc15] text-black font-black py-5 rounded-lg text-xl hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2 mt-4">
                  <span>SONUCU İSTE</span>
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { display: flex; width: fit-content; animation: scroll 30s linear infinite; }
      `}</style>
    </div>
  );
};

export default App;