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
  Factory
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

  const formRef = useRef(null);

  // Logic Preserved & Enhanced
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
        .glow-y:hover { box-shadow: 0 0 30px rgba(250, 204, 21, 0.2); transform: translateY(-3px); }
        .text-gradient { background: linear-gradient(135deg, #fff 0%, #facc15 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        @keyframes pulse-soft { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
        .animate-pulse-soft { animation: pulse-soft 3s infinite ease-in-out; }
        .hero-img-container { position: relative; width: 100%; max-width: 620px; border-radius: 32px; overflow: hidden; border: 1px solid rgba(250, 204, 21, 0.15); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/5 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-11 h-11 bg-[#facc15] rounded-xl flex items-center justify-center transition-all group-hover:rotate-12 group-hover:shadow-[0_0_15px_#facc15]">
              <Truck size={26} className="text-[#0B0F1A]" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">
              CMS<span className="text-[#facc15]">Vize</span>
            </span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-10 font-bold text-xs tracking-[0.15em]">
            <a href="#surec" className="hover:text-[#facc15] transition-colors">SÜREÇ</a>
            <a href="#hizmetler" className="hover:text-[#facc15] transition-colors">HİZMETLER</a>
            <a href="#guven" className="hover:text-[#facc15] transition-colors">GÜVEN</a>
            <button onClick={scrollToForm} className="bg-[#facc15] text-[#0B0F1A] px-8 py-3 rounded-full font-black hover:scale-105 transition-all shadow-xl glow-y">
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
          <a href="#surec" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black italic tracking-tighter">SÜREÇ</a>
          <a href="#hizmetler" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black italic tracking-tighter">HİZMETLER</a>
          <a href="#guven" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black italic tracking-tighter">GÜVEN</a>
          <button onClick={scrollToForm} className="w-full bg-[#facc15] text-[#0B0F1A] py-6 rounded-2xl font-black text-2xl">BAŞVUR</button>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-40 lg:pt-56 pb-24 lg:pb-32 px-6">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#facc15]/5 rounded-full blur-[150px] -z-10"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* LEFT: Text Content */}
          <div className="space-y-10 animate-fade-up">
            <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full text-[#facc15] font-black text-xs tracking-widest uppercase shadow-inner">
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
              <button onClick={scrollToForm} className="bg-[#facc15] text-[#0B0F1A] px-12 py-6 rounded-[24px] font-black text-xl hover:scale-105 transition-all shadow-2xl glow-y flex items-center justify-center space-x-3 group">
                <span>HEMEN BAŞVUR</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              <a 
                href={getWhatsAppURL()} 
                target="_blank"
                className="glass px-12 py-6 rounded-[24px] font-black text-xl flex items-center justify-center space-x-3 hover:bg-white/10 transition-all border border-white/15"
              >
                <MessageCircle className="text-green-500" fill="currentColor" />
                <span>BİLGİ AL</span>
              </a>
            </div>

            {/* KAPSAM BAR (The Upgrade) */}
            <div className="flex flex-wrap gap-4 pt-2">
              {[
                { icon: <Truck size={14} />, text: "Tır Şoförlüğü (KOD95)" },
                { icon: <Zap size={14} />, text: "A1 Transfer İle Giriş" },
                { icon: <Package size={14} />, text: "Fabrika & Depo İşleri" },
                { icon: <ShieldCheck size={14} />, text: "2 Yıllık Oturum Garantisi" }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#facc15]">
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
              
              <div className="absolute bottom-6 left-6 right-6 glass p-5 rounded-2xl flex items-center space-x-4 border border-white/20 shadow-2xl animate-pulse-soft">
                <div className="w-12 h-12 bg-[#facc15] rounded-xl flex items-center justify-center shrink-0">
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

      {/* HİZMETLER (Expanded) */}
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
            {/* Card 1: A1 Transfer (New) */}
            <div className="glass p-8 rounded-[32px] group hover:border-[#facc15]/30 transition-all duration-500 shadow-2xl flex flex-col">
              <div className="w-16 h-16 bg-[#facc15]/10 rounded-2xl flex items-center justify-center text-[#facc15] mb-8 group-hover:bg-[#facc15] group-hover:text-[#0B0F1A] transition-all">
                <Globe size={32} />
              </div>
              <h3 className="text-2xl font-black italic uppercase mb-4">A1 Transfer İle Giriş</h3>
              <p className="text-gray-400 font-medium leading-relaxed mb-6">Dil şartı olmadan Avrupa’ya giriş imkanı sağlayan A1 transfer sürecini sizin için uçtan uca yönetiyoruz.</p>
              <button onClick={scrollToForm} className="mt-auto flex items-center space-x-2 text-[#facc15] font-black text-sm uppercase tracking-widest">
                <span>Detaylar</span> <ArrowRight size={16} />
              </button>
            </div>

            {/* Card 2: Farklı İş Kolları (New) */}
            <div className="glass p-8 rounded-[32px] group hover:border-[#facc15]/30 transition-all duration-500 shadow-2xl flex flex-col">
              <div className="w-16 h-16 bg-[#facc15]/10 rounded-2xl flex items-center justify-center text-[#facc15] mb-8 group-hover:bg-[#facc15] group-hover:text-[#0B0F1A] transition-all">
                <Factory size={32} />
              </div>
              <h3 className="text-2xl font-black italic uppercase mb-4">Farklı İş Kollarında Çalışma</h3>
              <p className="text-gray-400 font-medium leading-relaxed mb-6">Tır şoförlüğü dışında depo, üretim ve lojistik alanlarında geniş iş fırsatları ve yerleştirme imkanları sunuyoruz.</p>
              <button onClick={scrollToForm} className="mt-auto flex items-center space-x-2 text-[#facc15] font-black text-sm uppercase tracking-widest">
                <span>İş İmkanları</span> <ArrowRight size={16} />
              </button>
            </div>

            {/* Card 3: Oturum Kartı (Existing Refined) */}
            <div className="glass p-8 rounded-[32px] group hover:border-[#facc15]/30 transition-all duration-500 shadow-2xl flex flex-col">
              <div className="w-16 h-16 bg-[#facc15]/10 rounded-2xl flex items-center justify-center text-[#facc15] mb-8 group-hover:bg-[#facc15] group-hover:text-[#0B0F1A] transition-all">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black italic uppercase mb-4">2 Yıllık Oturum Kartı</h3>
              <p className="text-gray-400 font-medium leading-relaxed mb-6">Litvanya hükümeti onaylı, tüm Avrupa'da serbest dolaşım ve çalışma hakkı tanıyan oturum kartı süreciniz güvenli ellerde.</p>
              <button onClick={scrollToForm} className="mt-auto flex items-center space-x-2 text-[#facc15] font-black text-sm uppercase tracking-widest">
                <span>Başvuru Yap</span> <ArrowRight size={16} />
              </button>
            </div>
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
            <div className="glass p-5 rounded-[32px] shadow-2xl">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-black/40 p-4">
                <img src={OturumKartiImg} className="w-full h-full object-contain" alt="Oturum Kartı" />
              </div>
              <p className="mt-4 px-3 text-lg font-black italic uppercase text-center">Resmi Oturum & Çalışma Kartı</p>
            </div>
            <div className="glass p-5 rounded-[32px] shadow-2xl">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-black/40">
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
              <div key={idx} className="space-y-6 p-10 glass rounded-[40px] hover:bg-white/[0.06] transition-all border-none shadow-xl">
                <div className="text-[#facc15] flex justify-center">{item.icon}</div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter italic">{item.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section ref={formRef} className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-0 rounded-[48px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5">
            <div className="bg-[#131926] p-10 lg:p-20">
              <h2 className="text-5xl font-black italic uppercase tracking-tighter italic mb-10">Hemen <span className="text-[#facc15]">Başvur</span></h2>
              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">AD SOYAD</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl focus:border-[#facc15] outline-none text-lg font-bold" placeholder="Ahmet Yılmaz" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">TELEFON</label>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl focus:border-[#facc15] outline-none text-lg font-bold" placeholder="+90" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">HEDEF ÜLKE</label>
                    <select name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl focus:border-[#facc15] outline-none text-lg font-bold">
                      <option className="bg-[#0B0F1A]">Almanya</option>
                      <option className="bg-[#0B0F1A]">Litvanya</option>
                      <option className="bg-[#0B0F1A]">Polonya</option>
                      <option className="bg-[#0B0F1A]">Fransa / Hollanda</option>
                    </select>
                  </div>
                </div>

                {/* WORK FIELD SELECT (Mini Upgrade) */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">ÇALIŞMAK İSTEDİĞİNİZ ALAN</label>
                  <select name="workField" value={formData.workField} onChange={handleInputChange} className="w-full bg-white/5 border border-[#facc15]/30 px-8 py-5 rounded-2xl focus:border-[#facc15] outline-none text-lg font-bold text-[#facc15]">
                    <option className="bg-[#0B0F1A]">Tır Şoförlüğü (KOD95)</option>
                    <option className="bg-[#0B0F1A]">A1 Transfer Süreci</option>
                    <option className="bg-[#0B0F1A]">Fabrika / Depo / Lojistik</option>
                    <option className="bg-[#0B0F1A]">Fark Etmez / Danışman Önerisi</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">EK NOT</label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl focus:border-[#facc15] outline-none text-lg font-bold" rows="3" placeholder="Tecrübelerinizden bahsedin..."></textarea>
                </div>
                <button type="submit" className="w-full bg-[#facc15] text-[#0B0F1A] py-6 rounded-2xl font-black text-2xl hover:scale-[1.02] transition-all shadow-2xl uppercase italic tracking-tighter">BAŞVURUYU TAMAMLA</button>
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
      <footer className="py-20 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#facc15] rounded-xl flex items-center justify-center">
              <Truck size={22} className="text-[#0B0F1A]" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">CMS<span className="text-[#facc15]">Vize</span></span>
          </div>
          <p className="text-gray-500 font-medium">© 2026 CMSVize. Tüm hakları saklıdır. Avrupa Kariyer & Danışmanlık.</p>
          <div className="flex space-x-8 text-xs font-black tracking-widest text-gray-500 uppercase">
            <a href="#" className="hover:text-[#facc15]">KVKK</a>
            <a href="#" className="hover:text-[#facc15]">Gizlilik</a>
            <a href="#" className="hover:text-[#facc15]">İletişim</a>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <a href={getWhatsAppURL()} target="_blank" className="fixed bottom-10 right-10 z-50 group">
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-25 scale-150"></div>
        <div className="relative bg-[#25D366] p-5 rounded-full shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12">
          <MessageCircle size={36} className="text-white" fill="currentColor" />
        </div>
      </a>

      {/* FAKE LIVE POPUP */}
      <div className={`fixed bottom-10 left-10 z-50 glass px-8 py-5 rounded-[2.5rem] flex items-center space-x-5 transition-all duration-700 shadow-2xl border border-white/10 ${showPopup ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <div className="w-12 h-12 bg-[#facc15]/20 rounded-2xl flex items-center justify-center text-[#facc15]">
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