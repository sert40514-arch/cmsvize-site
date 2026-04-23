import React, { useState, useEffect, useRef } from 'react';
import { 
  Truck, 
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
  BadgeCheck
} from 'lucide-react';

// Assets - Using the actual filenames from disk
import TirImg from './assets/tır.png';
import OturumKartiImg from './assets/oturum kartı.png';
import SupportingImg from './assets/1.png';

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

  const formRef = useRef(null);

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    window.open(getWhatsAppURL(), '_blank');
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-yellow-400 selection:text-black overflow-x-hidden" style={{ backgroundColor: darkBg }}>
      {/* Visual Layout Surgeon - Premium CSS */}
      <style>{`
        @keyframes fade-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .text-gradient { background: linear-gradient(135deg, #fff 0%, #facc15 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        @keyframes pulse-soft { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
        .animate-pulse-soft { animation: pulse-soft 3s infinite ease-in-out; }
        .hero-img-container { position: relative; width: 100%; max-width: 620px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(250, 204, 21, 0.15); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .linkedin-card { background: #1B1F23; border: 1px solid #30363D; border-radius: 4px; }
        
        /* Modern Button Styles */
        .btn-corporate {
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .btn-corporate:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          filter: brightness(1.1);
        }
        .btn-corporate:active { transform: translateY(0); }

        /* Modern Input Styles */
        .input-corporate {
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
        }
        .input-corporate:focus {
          border-color: #facc15;
          box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.1);
          outline: none;
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/5 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-[#facc15] rounded-lg flex items-center justify-center transition-all group-hover:rotate-6">
              <Truck size={24} className="text-[#0B0F1A]" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">
              CMS<span className="text-[#facc15]">Vize</span>
            </span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-10 font-bold text-xs tracking-[0.15em]">
            <a href="#hizmetler" className="hover:text-[#facc15] transition-colors">HİZMETLER</a>
            <a href="#referanslar" className="hover:text-[#facc15] transition-colors">REFERANSLAR</a>
            <a href="#surec" className="hover:text-[#facc15] transition-colors">SÜREÇ</a>
            <a href="#sss" className="hover:text-[#facc15] transition-colors">SSS</a>
            <button onClick={scrollToForm} className="btn-corporate bg-[#facc15] text-[#0B0F1A] px-8 py-3 font-black">
              HEMEN BAŞVUR
            </button>
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
          <a href="#hizmetler" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black italic tracking-tighter">HİZMETLER</a>
          <a href="#referanslar" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black italic tracking-tighter">REFERANSLAR</a>
          <a href="#surec" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black italic tracking-tighter">SÜREÇ</a>
          <a href="#sss" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black italic tracking-tighter">SSS</a>
          <button onClick={scrollToForm} className="w-full bg-[#facc15] text-[#0B0F1A] py-6 rounded-lg btn-corporate font-black text-2xl">BAŞVUR</button>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-40 lg:pt-56 pb-24 lg:pb-32 px-6">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#facc15]/5 rounded-full blur-[150px] -z-10"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* LEFT: Text Content */}
          <div className="space-y-10 animate-fade-up">
            <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-lg text-[#facc15] font-black text-xs tracking-widest uppercase shadow-inner">
              <Zap size={16} fill="currentColor" />
              <span>Sınırlı Kontenjan • Son Başvurular</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-black leading-[0.95] tracking-tighter italic uppercase">
                2 Yıllık Litvanya <br />
                <span className="text-gradient">Oturum Kartı</span> <br />
                İle Avrupa'da Çalışma
              </h1>
              <p className="text-xl lg:text-2xl text-gray-400 max-w-xl leading-relaxed font-medium">
                Tır Şoförlüğü (KOD95) • Fabrika & Depo İşleri • A1 Transfer İle Hızlı Giriş. Her profil için uygun Avrupa iş planı hazırlıyoruz.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <button onClick={scrollToForm} className="btn-corporate bg-[#facc15] text-[#0B0F1A] px-12 py-6 font-black text-xl flex items-center justify-center space-x-3 group">
                <span>HEMEN BAŞVUR</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              <a 
                href={getWhatsAppURL()} 
                target="_blank"
                className="btn-corporate glass px-12 py-6 font-black text-xl flex items-center justify-center space-x-3 hover:bg-white/10"
              >
                <MessageCircle className="text-green-500" fill="currentColor" />
                <span>BİLGİ AL</span>
              </a>
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

          {/* RIGHT: Visual */}
          <div className="flex justify-center lg:justify-end animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="hero-img-container">
              <img 
                src={TirImg} 
                alt="European Truck CMSVize" 
                className="w-full h-full object-cover aspect-[4/5] lg:aspect-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A]/80 via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute bottom-6 left-6 right-6 glass p-5 rounded-lg flex items-center space-x-4 border border-white/20 shadow-2xl animate-pulse-soft">
                <div className="w-12 h-12 bg-[#facc15] rounded-md flex items-center justify-center shrink-0">
                  <Star size={24} className="text-[#0B0F1A]" fill="currentColor" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase italic tracking-tighter">AVRUPA KAPISI ARALANIYOR</p>
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
          {[1,2,3,4].map(i => (
            <div key={i} className="flex items-center space-x-12 px-6 text-[#0B0F1A] font-black italic text-2xl uppercase tracking-tighter">
              <span>Avrupa'da Kariyer</span> <Star size={24} fill="currentColor" />
              <span>A1 Transfer & Sigorta</span> <Star size={24} fill="currentColor" />
              <span>Fabrika & Depo İşleri</span> <Star size={24} fill="currentColor" />
              <span>2 Yıllık Oturum Kartı</span> <Star size={24} fill="currentColor" />
            </div>
          ))}
        </div>
      </div>

      {/* HİZMETLER */}
      <section id="hizmetler" className="py-32 lg:py-48 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter">
              Genişletilmiş <br /> <span className="text-[#facc15]">Hizmetlerimiz</span>
            </h2>
            <p className="text-xl text-gray-400 font-medium">
              Her profil için uygun bir Avrupa iş planı hazırlıyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-xl group hover:border-[#facc15]/30 transition-all duration-500 shadow-2xl flex flex-col">
              <div className="w-16 h-16 bg-[#facc15]/10 rounded-lg flex items-center justify-center text-[#facc15] mb-8 group-hover:bg-[#facc15] group-hover:text-[#0B0F1A] transition-all">
                <Globe size={32} />
              </div>
              <h3 className="text-2xl font-black italic uppercase mb-4">A1 Transfer İle Giriş</h3>
              <p className="text-gray-400 font-medium leading-relaxed mb-6">Dil şartı olmadan Avrupa’ya giriş imkanı sağlayan A1 transfer sürecini sizin için uçtan uca yönetiyoruz.</p>
              <button onClick={scrollToForm} className="mt-auto flex items-center space-x-2 text-[#facc15] font-black text-sm uppercase tracking-widest group">
                <span>Detaylar</span> <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="glass p-8 rounded-xl group hover:border-[#facc15]/30 transition-all duration-500 shadow-2xl flex flex-col">
              <div className="w-16 h-16 bg-[#facc15]/10 rounded-lg flex items-center justify-center text-[#facc15] mb-8 group-hover:bg-[#facc15] group-hover:text-[#0B0F1A] transition-all">
                <Factory size={32} />
              </div>
              <h3 className="text-2xl font-black italic uppercase mb-4">Farklı İş Kollarında Çalışma</h3>
              <p className="text-gray-400 font-medium leading-relaxed mb-6">Tır şoförlüğü dışında depo, üretim ve lojistik alanlarında geniş iş fırsatları ve yerleştirme imkanları sunuyoruz.</p>
              <button onClick={scrollToForm} className="mt-auto flex items-center space-x-2 text-[#facc15] font-black text-sm uppercase tracking-widest group">
                <span>İş İmkanları</span> <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="glass p-8 rounded-xl group hover:border-[#facc15]/30 transition-all duration-500 shadow-2xl flex flex-col">
              <div className="w-16 h-16 bg-[#facc15]/10 rounded-lg flex items-center justify-center text-[#facc15] mb-8 group-hover:bg-[#facc15] group-hover:text-[#0B0F1A] transition-all">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black italic uppercase mb-4">2 Yıllık Oturum Kartı</h3>
              <p className="text-gray-400 font-medium leading-relaxed mb-6">Litvanya hükümeti onaylı, tüm Avrupa'da serbest dolaşım ve çalışma hakkı tanıyan oturum kartı süreciniz güvenli ellerde.</p>
              <button onClick={scrollToForm} className="mt-auto flex items-center space-x-2 text-[#facc15] font-black text-sm uppercase tracking-widest group">
                <span>Başvuru Yap</span> <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* REFERANSLAR (LinkedIn Style) */}
      <section id="referanslar" className="py-32 px-6 bg-[#0B0F1A]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter">
              Başarı <span className="text-[#facc15]">Hikayeleri</span>
            </h2>
            <p className="text-gray-400 font-medium text-lg">Müşterilerimizin CMSVize deneyimleri.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Ahmet Yılmaz", visa: "Almanya C Tipi Vize", time: "1 hafta önce", text: "CMSVize ekibi sayesinde Almanya vizemi sorunsuz bir şekilde aldım. Başvuru sürecindeki her soruma hızlıca yanıt verdiler. Kesinlikle tavsiye ediyorum!" },
              { name: "Mehmet Demir", visa: "Litvanya Oturum Kartı", time: "2 hafta önce", text: "2 yıllık oturum kartım elime ulaştı. Şimdi aile birleşimi sürecini başlatıyoruz. CMSVize uzmanlığına güvenebilirsiniz." },
              { name: "Selin Kaya", visa: "Polonya Çalışma İzni", time: "1 ay önce", text: "Lojistik alanında Polonya'da işe başladım. Evrak takibi ve iş yerleştirme süreci beklediğimden çok daha profesyonel ilerledi." }
            ].map((ref, idx) => (
              <div key={idx} className="linkedin-card p-4 space-y-4 shadow-xl">
                <div className="flex justify-between items-start">
                  <div className="flex space-x-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-black text-xl">
                      {ref.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <h4 className="font-bold text-sm text-white">{ref.name}</h4>
                        <BadgeCheck size={16} className="text-blue-500 fill-blue-500/20" />
                      </div>
                      <p className="text-[11px] text-gray-400 leading-tight">{ref.visa}</p>
                      <p className="text-[10px] text-gray-500">{ref.time} • 🌐</p>
                    </div>
                  </div>
                  <MoreHorizontal size={20} className="text-gray-500 cursor-pointer" />
                </div>
                <div className="text-sm text-gray-200 leading-relaxed font-normal">{ref.text}</div>
                <div className="flex items-center space-x-1 pt-2">
                  <div className="flex -space-x-1">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border border-[#1B1F23]">
                      <ThumbsUp size={8} className="text-white fill-white" />
                    </div>
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border border-[#1B1F23]">
                      <Star size={8} className="text-white fill-white" />
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400">12 • 4 yorum</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-around text-gray-400 font-bold">
                  <div className="flex items-center space-x-1.5 hover:bg-white/5 px-2 py-1.5 rounded-sm cursor-pointer transition-colors">
                    <ThumbsUp size={18} />
                    <span className="text-xs">Beğen</span>
                  </div>
                  <div className="flex items-center space-x-1.5 hover:bg-white/5 px-2 py-1.5 rounded-sm cursor-pointer transition-colors">
                    <MessageSquare size={18} />
                    <span className="text-xs">Yorum</span>
                  </div>
                  <div className="flex items-center space-x-1.5 hover:bg-white/5 px-2 py-1.5 rounded-sm cursor-pointer transition-colors">
                    <Share2 size={18} />
                    <span className="text-xs">Paylaş</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SÜREÇTEN KESİTLER */}
      <section id="surec" className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter">
              Görsel <span className="text-[#facc15]">Sürecimiz</span>
            </h2>
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

      {/* GÜVEN BLOĞU */}
      <section id="guven" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter italic">Neden <span className="text-[#facc15]">CMSVize?</span></h2>
            <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">Her profil için uygun Avrupa iş planı hazırlıyoruz. Şeffaf ve %100 yasal süreç.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <ShieldCheck size={48} />, title: "Resmi Süreç", desc: "Tüm süreçlerimiz sözleşmeli ve AB yasalarına tam uyumludur." },
              { icon: <Users size={48} />, title: "Kişisel Danışmanlık", desc: "Profilinize en uygun iş kolunu ve vize türünü birlikte seçiyoruz." },
              { icon: <Briefcase size={48} />, title: "İş Garantisi", desc: "Oturum kartınızla birlikte Avrupa'nın köklü firmalarında yeriniz hazır." }
            ].map((item, idx) => (
              <div key={idx} className="space-y-6 p-10 glass rounded-xl hover:bg-white/[0.06] transition-all border-none shadow-xl">
                <div className="text-[#facc15] flex justify-center">{item.icon}</div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter italic">{item.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SSS (FAQ) SECTION */}
      <section id="sss" className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <h2 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter">
              Sıkça Sorulan <span className="text-[#facc15]">Sorular</span>
            </h2>
            <p className="text-xl text-gray-400 font-medium">Süreçlerimiz hakkında merak edilen tüm detaylar.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "Vize randevusu ne kadar sürer?", a: "Vize randevu süreçleri seçilen ülkeye ve dönemsel yoğunluğa bağlı olarak 1-4 hafta arasında değişmektedir. CMSVize olarak en erken randevu için tüm süreci optimize ediyoruz." },
              { q: "Red durumunda ne yapılır?", a: "Vize reddi durumunda uzman ekibimiz ret gerekçelerini titizlikle inceleyerek itiraz sürecini başlatır veya eksikleri gidererek yeni bir başvuru planı hazırlar." },
              { q: "Gerekli evraklar nelerdir?", a: "Temel olarak pasaport, biyometrik fotoğraf, adli sicil kaydı ve ikametgah belgesi gerekmektedir. Mesleki belgeler ve ek evrak listesi seçtiğiniz iş koluna göre size özel olarak iletilmektedir." },
              { q: "Oturum kartı süreci ne kadar sürer?", a: "Litvanya oturum kartı süreci evrakların tesliminden itibaren ortalama 4-6 hafta sürmektedir." }
            ].map((faq, idx) => (
              <div key={idx} className="glass rounded-lg overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-colors group"
                >
                  <span className={`text-xl font-black italic uppercase tracking-tighter transition-colors ${activeFaq === idx ? 'text-[#facc15]' : 'text-white'}`}>{faq.q}</span>
                  <ChevronDown className={`text-[#facc15] transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 scale-125' : ''}`} />
                </button>
                <div className={`transition-all duration-500 overflow-hidden ${activeFaq === idx ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-8 pt-0 text-gray-400 font-medium text-lg leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section ref={formRef} className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-0 rounded-xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5">
            <div className="bg-[#131926] p-10 lg:p-20">
              <h2 className="text-5xl font-black italic uppercase tracking-tighter italic mb-10">Hemen <span className="text-[#facc15]">Başvur</span></h2>
              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">AD SOYAD</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/5 px-8 py-5 text-lg font-bold input-corporate focus:border-[#facc15]" placeholder="Ahmet Yılmaz" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">TELEFON</label>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 px-8 py-5 text-lg font-bold input-corporate focus:border-[#facc15]" placeholder="+90" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">HEDEF ÜLKE</label>
                    <select name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-white/5 px-8 py-5 text-lg font-bold input-corporate focus:border-[#facc15]">
                      <option className="bg-[#0B0F1A]">Almanya</option>
                      <option className="bg-[#0B0F1A]">Litvanya</option>
                      <option className="bg-[#0B0F1A]">Polonya</option>
                      <option className="bg-[#0B0F1A]">Fransa / Hollanda</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">ÇALIŞMAK İSTEDİĞİNİZ ALAN</label>
                  <select name="workField" value={formData.workField} onChange={handleInputChange} className="w-full bg-white/5 px-8 py-5 text-lg font-bold input-corporate focus:border-[#facc15] text-[#facc15]">
                    <option className="bg-[#0B0F1A]">Tır Şoförlüğü (KOD95)</option>
                    <option className="bg-[#0B0F1A]">A1 Transfer Süreci</option>
                    <option className="bg-[#0B0F1A]">Fabrika / Depo / Lojistik</option>
                    <option className="bg-[#0B0F1A]">Fark Etmez / Danışman Önerisi</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">EK NOT</label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange} className="w-full bg-white/5 px-8 py-5 text-lg font-bold input-corporate focus:border-[#facc15]" rows="3" placeholder="Tecrübelerinizden bahsedin..."></textarea>
                </div>
                <button type="submit" className="w-full bg-[#facc15] text-[#0B0F1A] py-6 btn-corporate font-black text-2xl uppercase italic tracking-tighter">BAŞVURUYU TAMAMLA</button>
              </form>
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

      {/* FOOTER */}
      <footer className="py-24 border-t border-white/5 bg-[#0B0F1A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="w-10 h-10 bg-[#facc15] rounded-md flex items-center justify-center">
                  <Truck size={22} className="text-[#0B0F1A]" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase italic">
                  CMS<span className="text-[#facc15]">Vize</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs uppercase tracking-tighter italic">
                Avrupa'da kariyer ve yaşam için profesyonel vize ve danışmanlık köprünüz.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-[#facc15] font-black text-xs tracking-[0.2em] uppercase">Hızlı Bağlantılar</h4>
              <ul className="space-y-4 font-bold text-sm text-gray-400">
                <li><a href="#hizmetler" className="hover:text-white transition-colors">Hizmetlerimiz</a></li>
                <li><a href="#surec" className="hover:text-white transition-colors">Süreç Yönetimi</a></li>
                <li><a href="#referanslar" className="hover:text-white transition-colors">Başarı Hikayeleri</a></li>
                <li><a href="#sss" className="hover:text-white transition-colors">Sıkça Sorulan Sorular</a></li>
              </ul>
            </div>
            <div className="space-y-6 lg:col-span-2 lg:flex lg:space-y-0 lg:gap-16">
              <div className="space-y-6">
                <h4 className="text-[#facc15] font-black text-xs tracking-[0.2em] uppercase">Yasal</h4>
                <ul className="space-y-4 font-bold text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors uppercase tracking-tighter italic">KVKK Aydınlatma Metni</a></li>
                  <li><a href="#" className="hover:text-white transition-colors uppercase tracking-tighter italic">Gizlilik Politikası</a></li>
                  <li><a href="#" className="hover:text-white transition-colors uppercase tracking-tighter italic">Kullanım Şartları</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-[#facc15] font-black text-xs tracking-[0.2em] uppercase">İletişim</h4>
                <ul className="space-y-4 font-bold text-sm text-gray-400">
                  <li className="flex items-center space-x-2"><Phone size={14} /> <span>+90 545 991 82 68</span></li>
                  <li className="flex items-center space-x-2"><MapPin size={14} /> <span>Aksaray, Türkiye</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">
              © 2026 CMSVize Danışmanlık. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">
              <span>Made with ❤️ for Global Careers</span>
            </div>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <a href={getWhatsAppURL()} target="_blank" className="fixed bottom-10 right-10 z-50 group transition-transform hover:scale-110">
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-25 scale-150"></div>
        <div className="relative bg-[#25D366] p-5 rounded-full shadow-2xl transition-all duration-500">
          <MessageCircle size={36} className="text-white" fill="currentColor" />
        </div>
      </a>

      {/* FAKE LIVE POPUP */}
      <div className={`fixed bottom-10 left-10 z-50 glass px-8 py-5 rounded-lg flex items-center space-x-5 transition-all duration-700 shadow-2xl border border-white/10 ${showPopup ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <div className="w-12 h-12 bg-[#facc15]/20 rounded-md flex items-center justify-center text-[#facc15]">
          <Users size={24} />
        </div>
        <div>
          <p className="text-base font-black italic tracking-tighter">{popupContent}</p>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Hızlı Başvuru</p>
        </div>
        <button onClick={() => setShowPopup(false)} className="ml-4 text-gray-500 hover:text-white transition-colors"> <X size={20} /> </button>
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