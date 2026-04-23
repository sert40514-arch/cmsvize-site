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
  Globe
} from 'lucide-react';

// Assets
import TirImg from './assets/tır.png';
import OturumKartiImg from './assets/oturum kartı.png';
import ServiceOneImg from './assets/1.png';

// --- CONFIG ---
const WHATSAPP_NUMBER = "905459918268";
const accentColor = "#facc15"; // Yellow
const darkBg = "#0B0F1A";

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: 'Almanya',
    message: ''
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeViewers, setActiveViewers] = useState(14);

  const formRef = useRef(null);

  // Dynamic social proof logic
  useEffect(() => {
    const vInterval = setInterval(() => {
      setActiveViewers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 5000);
    return () => clearInterval(vInterval);
  }, []);

  // Fake Live Popups
  const popups = [
    "Ahmet K. – Almanya başvurusu yaptı",
    "Mehmet T. – KOD95 sürecine başladı",
    "Caner Y. – Litvanya oturum kartını aldı",
    "Burak S. – Polonya iş yerleştirmesi tamamlandı",
    "Sinan G. – 2 yıllık oturum onaylandı",
    "Yusuf E. – Fransa tır şoförlüğü başvurusu",
    "Mert A. – Hollanda için evraklarını teslim etti"
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
      {/* Global Optimization Styles */}
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .glow-button:hover {
          box-shadow: 0 0 20px rgba(250, 204, 21, 0.4);
          transform: translateY(-2px);
        }
        .glass { 
          background: rgba(255, 255, 255, 0.03); 
          backdrop-filter: blur(12px); 
          border: 1px solid rgba(255, 255, 255, 0.08); 
        }
        .text-gradient {
          background: linear-gradient(to right, #fff, #facc15);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .animate-pulse-soft { animation: pulse-soft 3s infinite ease-in-out; }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-11 h-11 bg-[#facc15] rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
              <Truck size={26} className="text-[#0B0F1A]" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">
              CMS<span className="text-[#facc15]">Vize</span>
            </span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-10 font-bold text-sm tracking-wide">
            <a href="#hizmetler" className="hover:text-[#facc15] transition-colors">HİZMETLER</a>
            <a href="#nasil" className="hover:text-[#facc15] transition-colors">SÜREÇ</a>
            <a href="#guven" className="hover:text-[#facc15] transition-colors">GÜVEN</a>
            <button onClick={scrollToForm} className="bg-[#facc15] text-[#0B0F1A] px-8 py-3 rounded-full font-black hover:scale-105 transition-all shadow-xl glow-button">
              BAŞVUR
            </button>
          </div>

          <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`lg:hidden fixed inset-0 bg-[#0B0F1A]/95 backdrop-blur-xl z-40 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="flex flex-col items-center justify-center h-full space-y-8 p-6">
            <X size={40} className="absolute top-6 right-6 cursor-pointer" onClick={() => setMobileMenuOpen(false)} />
            <a href="#hizmetler" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black italic">HİZMETLER</a>
            <a href="#nasil" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black italic">SÜREÇ</a>
            <a href="#guven" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black italic">GÜVEN</a>
            <button onClick={scrollToForm} className="w-full bg-[#facc15] text-[#0B0F1A] py-5 rounded-2xl font-black text-2xl shadow-2xl">
              HEMEN BAŞVUR
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 lg:pt-48 pb-20 px-6 min-h-[90vh] flex items-center">
        {/* Ambient Lights */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#facc15]/5 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Left */}
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-[#facc15] font-bold text-xs tracking-widest uppercase animate-pulse-soft">
              <Zap size={16} fill="currentColor" />
              <span>Sınırlı Kontenjan • Son 12 Yer</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight">
              2 Yıllık Litvanya <br />
              <span className="text-gradient">Oturum Kartı</span> <br />
              İle Avrupa'da Çalış
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-400 max-w-xl leading-relaxed">
              KOD95 + A1 Transfer + İş Yerleştirme. Avrupa’nın en büyük lojistik firmalarında tır şoförü olarak yüksek maaşla çalışmaya hemen başlayın.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <button onClick={scrollToForm} className="bg-[#facc15] text-[#0B0F1A] px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl glow-button flex items-center justify-center space-x-3 group">
                <span>HEMEN BAŞVUR</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              <a 
                href={getWhatsAppURL()} 
                target="_blank"
                className="glass px-10 py-5 rounded-2xl font-black text-xl flex items-center justify-center space-x-3 hover:bg-white/10 transition-all border border-white/10"
              >
                <MessageCircle className="text-green-500" fill="currentColor" />
                <span>WHATSAPP YAZ</span>
              </a>
            </div>

            {/* Social Proof Counters */}
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/5">
              <div>
                <p className="text-3xl font-black text-[#facc15]">312+</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mt-1">Başvuru</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#facc15]">{activeViewers}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mt-1">İnceleyen</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#facc15]">2 dk</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mt-1">Son Talep</p>
              </div>
            </div>
          </div>

          {/* Image Right - Fixed Layout */}
          <div className="relative lg:block animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group">
              <img 
                src={TirImg} 
                alt="European Truck CMSVize" 
                className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent opacity-40"></div>
            </div>
            
            {/* Trust Badge Floating */}
            <div className="absolute -bottom-10 -right-4 lg:-right-10 glass p-6 rounded-3xl flex items-center space-x-4 animate-pulse-soft z-20">
              <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center border border-green-500/30">
                <ShieldCheck size={32} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm font-black uppercase italic tracking-tighter">Oturum Kartı Garantili</p>
                <p className="text-xs text-gray-400 font-bold">AB Yasalarına %100 Uygun</p>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#facc15]/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="bg-[#facc15] py-4 overflow-hidden whitespace-nowrap border-y-4 border-[#0B0F1A] rotate-[-1deg] relative z-20 scale-105">
        <div className="flex animate-scroll space-x-12 items-center">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center space-x-6 text-[#0B0F1A] font-black italic text-xl">
              <span>AVRUPA'DA TIR ŞOFÖRLÜĞÜ</span>
              <Star size={24} fill="currentColor" />
              <span>2 YILLIK OTURUM KARTI</span>
              <Star size={24} fill="currentColor" />
              <span>HIZLI İŞ YERLEŞTİRME</span>
              <Star size={24} fill="currentColor" />
            </div>
          ))}
        </div>
      </div>

      {/* HİZMETLER */}
      <section id="hizmetler" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-5">
              <div className="space-y-5 pt-12">
                <div className="glass p-2 rounded-3xl overflow-hidden aspect-[3/4]">
                  <img src={OturumKartiImg} className="w-full h-full object-cover rounded-2xl" alt="Oturum Kartı" />
                </div>
                <div className="glass p-2 rounded-3xl overflow-hidden aspect-square">
                  <img src={ServiceOneImg} className="w-full h-full object-cover rounded-2xl" alt="Lojistik" />
                </div>
              </div>
              <div className="space-y-5">
                <div className="glass p-2 rounded-3xl overflow-hidden aspect-square">
                  <img src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700" alt="Tır Filosu" />
                </div>
                <div className="glass p-2 rounded-3xl overflow-hidden aspect-[3/4]">
                  <img src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700" alt="Eğitim" />
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-10">
              <h2 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter">
                Uzman Olduğumuz <br />
                <span className="text-[#facc15]">Hizmetler</span>
              </h2>
              
              <div className="space-y-8">
                {[
                  { title: "Litvanya Oturum Kartı", desc: "Tüm bürokratik süreci biz yönetiyoruz. 2 yıllık çalışma ve oturum izninizi hızlıca alıyoruz." },
                  { title: "KOD95 Sertifikasyonu", desc: "Avrupa'da tır sürmek için zorunlu olan profesyonel sürücü belgelerini eksiksiz sağlıyoruz." },
                  { title: "Garantili İş Yerleştirme", desc: "Litvanya, Almanya ve Polonya merkezli dev lojistik firmalarında işiniz hazır." },
                  { title: "Tam Destek & Danışmanlık", desc: "Pasaporttan vizeye, konaklamadan sigortaya kadar her adımda yanınızdayız." }
                ].map((item, idx) => (
                  <div key={idx} className="flex space-x-6 group cursor-default">
                    <div className="mt-1">
                      <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-[#facc15] group-hover:bg-[#facc15] group-hover:text-[#0B0F1A] transition-all duration-500">
                        <CheckCircle2 size={28} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black mb-2 tracking-tight">{item.title}</h4>
                      <p className="text-gray-400 text-lg leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil" className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter">
              4 Adımda <span className="text-[#facc15]">Yola Çıkın</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-xl font-medium">
              Süreçlerimiz şeffaf, hızlı ve tamamen sonuç odaklıdır.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <ClipboardCheck size={36} />, title: "Ön Başvuru", desc: "Görüşme sağlanır ve profiliniz incelenir." },
              { icon: <Globe size={36} />, title: "Evrak Dosyası", desc: "Litvanya için gerekli tüm dosyalar hazırlanır." },
              { icon: <CreditCard size={36} />, title: "Oturum Onayı", desc: "2 yıllık çalışma kartınız tarafımıza teslim edilir." },
              { icon: <Truck size={36} />, title: "İş Başı", desc: "Avrupa'daki yeni işinize yerleşip çalışmaya başlarsınız." }
            ].map((step, idx) => (
              <div key={idx} className="glass p-10 rounded-[2.5rem] group hover:border-[#facc15]/40 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#facc15]/5 rounded-bl-full -z-10 group-hover:bg-[#facc15]/10 transition-colors"></div>
                <div className="text-[#facc15] mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tighter italic uppercase">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">{step.desc}</p>
                <div className="mt-8 text-[#facc15]/20 font-black text-6xl italic group-hover:text-[#facc15]/40 transition-colors">
                  0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GÜVEN BLOĞU */}
      <section id="guven" className="py-32 px-6">
        <div className="max-w-7xl mx-auto glass p-12 lg:p-24 rounded-[4rem] text-center space-y-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#facc15]/5 to-transparent -z-10"></div>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-block bg-[#facc15]/10 px-6 py-2 rounded-full text-[#facc15] font-black text-sm tracking-widest uppercase">
              GÜVEN & ŞEFFAFLIK
            </div>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tight italic uppercase italic">
              Neden <span className="text-[#facc15]">CMSVize?</span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-400 font-medium">
              Sadece vize değil, gelecek inşa ediyoruz. 500+ başarılı yerleştirme ile Avrupa'nın en güvenilir danışmanlık köprüsüyüz.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-6 group">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-[#facc15] mx-auto group-hover:bg-[#facc15] group-hover:text-[#0B0F1A] transition-all duration-500">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-3xl font-black italic uppercase italic tracking-tighter">Resmi Süreç</h3>
              <p className="text-gray-400 text-lg">Litvanya ve AB yasalarına %100 uyumlu, resmi sözleşmeli süreçler.</p>
            </div>
            <div className="space-y-6 group">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-[#facc15] mx-auto group-hover:bg-[#facc15] group-hover:text-[#0B0F1A] transition-all duration-500">
                <Users size={40} />
              </div>
              <h3 className="text-3xl font-black italic uppercase italic tracking-tighter">Uzman Kadro</h3>
              <p className="text-gray-400 text-lg">Lojistik ve vize konusunda 10 yılı aşkın saha tecrübesine sahip ekip.</p>
            </div>
            <div className="space-y-6 group">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-[#facc15] mx-auto group-hover:bg-[#facc15] group-hover:text-[#0B0F1A] transition-all duration-500">
                <ArrowRight size={40} />
              </div>
              <h3 className="text-3xl font-black italic uppercase italic tracking-tighter">Hızlı Sonuç</h3>
              <p className="text-gray-400 text-lg">Minimum bürokrasi ile ortalama 4-6 hafta içinde oturum kartı teslimi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BAŞVURU FORMU */}
      <section ref={formRef} className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-0 rounded-[4rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/5">
            {/* Form Side */}
            <div className="bg-[#131926] p-10 lg:p-20">
              <div className="mb-12">
                <h2 className="text-5xl font-black italic uppercase italic tracking-tighter mb-4">
                  Şimdi <span className="text-[#facc15]">Başvur</span>
                </h2>
                <p className="text-gray-400 font-bold tracking-wide">Ücretsiz ön değerlendirme için formu doldurun.</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Ad Soyad</label>
                  <input 
                    required
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Örn: Ahmet Yılmaz" 
                    className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl focus:border-[#facc15] outline-none transition-all text-lg font-bold"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Telefon</label>
                    <input 
                      required
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+90" 
                      className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl focus:border-[#facc15] outline-none transition-all text-lg font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Hedef Ülke</label>
                    <div className="relative">
                      <select 
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl focus:border-[#facc15] outline-none transition-all appearance-none text-lg font-bold cursor-pointer"
                      >
                        <option className="bg-[#0B0F1A]">Almanya</option>
                        <option className="bg-[#0B0F1A]">Litvanya</option>
                        <option className="bg-[#0B0F1A]">Polonya</option>
                        <option className="bg-[#0B0F1A]">Fransa</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Ek Not (Opsiyonel)</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="3" 
                    placeholder="Tır şoförlüğü tecrübenizden bahsedin..." 
                    className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl focus:border-[#facc15] outline-none transition-all text-lg font-bold"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-[#facc15] text-[#0B0F1A] py-6 rounded-2xl font-black text-2xl hover:scale-[1.02] transition-all shadow-2xl glow-button uppercase tracking-tighter italic"
                >
                  WHATSAPP İLE BAŞVUR
                </button>
              </form>
            </div>
            
            {/* Info Side */}
            <div className="bg-[#facc15] p-12 lg:p-20 text-[#0B0F1A] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="space-y-12 relative z-10">
                <h3 className="text-4xl lg:text-5xl font-black italic uppercase italic leading-[1.1] tracking-tighter">
                  AVRUPA'NIN <br /> YOLLARI <br /> SİZİ BEKLİYOR
                </h3>
                <div className="space-y-8">
                  <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 bg-[#0B0F1A] text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                      <Zap size={24} fill="currentColor" />
                    </div>
                    <span className="font-black text-xl italic tracking-tight">2500€ - 3500€ MAAŞ</span>
                  </div>
                  <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 bg-[#0B0F1A] text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                      <CheckCircle2 size={24} />
                    </div>
                    <span className="font-black text-xl italic tracking-tight">AİLE BİRLEŞİMİ HAKKI</span>
                  </div>
                  <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 bg-[#0B0F1A] text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                      <Truck size={24} fill="currentColor" />
                    </div>
                    <span className="font-black text-xl italic tracking-tight">MODERN ARAÇ FİLOLARI</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-16 border-t border-[#0B0F1A]/10 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#0B0F1A] rounded-full text-[#facc15] shrink-0">
                    <Phone size={24} />
                  </div>
                  <span className="text-3xl font-black tracking-tighter">+90 545 991 82 68</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#0B0F1A] rounded-full text-[#facc15] shrink-0">
                    <MapPin size={24} />
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest italic">Maslak, İstanbul / Vilnius, Litvanya</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-white/5 px-6 relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#facc15] rounded-xl flex items-center justify-center shadow-lg">
              <Truck size={22} className="text-[#0B0F1A]" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">
              CMS<span className="text-[#facc15]">Vize</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">© 2026 CMSVize Danışmanlık. Avrupa Tır Şoförlüğü & Oturum Hizmetleri.</p>
          <div className="flex space-x-10 text-xs font-black tracking-[0.2em] text-gray-500">
            <a href="#" className="hover:text-[#facc15] transition-colors uppercase">KVKK</a>
            <a href="#" className="hover:text-[#facc15] transition-colors uppercase">GİZLİLİK</a>
            <a href="#" className="hover:text-[#facc15] transition-colors uppercase">İLETİŞİM</a>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT BUTTON - PREMIUM */}
      <a 
        href={getWhatsAppURL()} 
        target="_blank"
        className="fixed bottom-10 right-10 z-50 group"
      >
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-25 scale-150"></div>
        <div className="relative bg-[#25D366] p-5 rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.4)] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12 border-4 border-white/10">
          <MessageCircle size={36} className="text-white" fill="currentColor" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
            <span className="text-[10px] font-black text-white">1</span>
          </div>
        </div>
        <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 glass px-6 py-3 rounded-2xl text-sm font-black text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-2xl translate-x-4 group-hover:translate-x-0">
          Size nasıl yardımcı olabilirim? 🚛
        </div>
      </a>

      {/* FAKE LIVE POPUP - ENHANCED */}
      <div className={`fixed bottom-10 left-10 z-50 glass px-8 py-5 rounded-[2rem] flex items-center space-x-5 transition-all duration-700 shadow-2xl border border-white/10 ${showPopup ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <div className="relative">
          <div className="w-14 h-14 bg-[#facc15]/20 rounded-2xl flex items-center justify-center text-[#facc15] shadow-inner">
            <Users size={28} />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0B0F1A] animate-pulse"></div>
        </div>
        <div>
          <p className="text-base font-black italic tracking-tight">{popupContent}</p>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">ŞİMDİ ONAYLANDI</p>
          </div>
        </div>
        <button onClick={() => setShowPopup(false)} className="text-gray-500 hover:text-white transition-colors ml-4">
          <X size={20} />
        </button>
      </div>

      {/* Smooth Scroll behavior & Custom Animations */}
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: 200%;
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;