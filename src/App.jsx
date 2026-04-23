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
  X
} from 'lucide-react';

// --- STYLES ---
const glassStyle = "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl";
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

  const formRef = useRef(null);

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
      
      setTimeout(() => setShowPopup(false), 4000);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappMsg = `Merhaba, site üzerinden başvuru yapıyorum.
Ad: ${formData.name}
Telefon: ${formData.phone}
Ülke: ${formData.country}
Mesaj: ${formData.message}`;
    
    const encodedMsg = encodeURIComponent(whatsappMsg);
    window.open(`https://wa.me/905000000000?text=${encodedMsg}`, '_blank');
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-yellow-400 selection:text-black" style={{ backgroundColor: darkBg }}>
      {/* Global CSS for Animations */}
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.6s ease-out forwards;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        .glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .glass-hover:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.2); }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#facc15] rounded-lg flex items-center justify-center">
              <Truck size={24} className="text-[#0B0F1A]" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">CMS<span className="text-[#facc15]">Vize</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 font-medium text-sm">
            <a href="#nasil" className="hover:text-[#facc15] transition-colors">Nasıl Çalışır?</a>
            <a href="#hizmetler" className="hover:text-[#facc15] transition-colors">Hizmetler</a>
            <a href="#guven" className="hover:text-[#facc15] transition-colors">Güven Bloğu</a>
            <button onClick={scrollToForm} className="bg-[#facc15] text-[#0B0F1A] px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)]">
              Hemen Başvur
            </button>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass absolute top-full left-0 w-full p-6 space-y-4 animate-fade-up">
            <a href="#nasil" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg">Nasıl Çalışır?</a>
            <a href="#hizmetler" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg">Hizmetler</a>
            <a href="#guven" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg">Güven Bloğu</a>
            <button onClick={scrollToForm} className="w-full bg-[#facc15] text-[#0B0F1A] py-3 rounded-xl font-bold">
              Hemen Başvur
            </button>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#facc15]/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center space-x-2 bg-[#facc15]/10 border border-[#facc15]/20 px-4 py-2 rounded-full text-[#facc15] font-semibold text-sm">
              <Clock size={16} />
              <span>Sınırlı kontenjan • Başvurular hızla doluyor</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
              2 Yıllık Litvanya <br />
              <span className="text-[#facc15]">Oturum Kartı</span> ile Avrupa’da Çalış
            </h1>
            
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
              A1 Transfer + KOD95 ile yüksek maaşlı Avrupa işi. Tüm süreç bizden, siz sadece yola odaklanın.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={scrollToForm} className="bg-[#facc15] text-[#0B0F1A] px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-[0_10px_30px_rgba(250,204,21,0.2)] flex items-center justify-center space-x-3 group">
                <span>HEMEN BAŞVUR</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="https://wa.me/905000000000" 
                target="_blank"
                className="glass px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 hover:bg-white/10 transition-all border border-white/10"
              >
                <MessageCircle className="text-green-400" />
                <span>WhatsApp Yaz</span>
              </a>
            </div>

            {/* Fake Social Proof */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div>
                <p className="text-2xl font-black text-[#facc15]">312+</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Başarılı Başvuru</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#facc15]">17</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Şu an inceliyor</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#facc15]">2 dk</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Son Başvuru</p>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up delay-200">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-[#facc15]/10 border border-white/10">
              <img 
                src="/hero.png" 
                alt="European Truck Driver" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent opacity-60"></div>
            </div>
            {/* Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#facc15] rounded-full blur-[80px] -z-10 opacity-30"></div>
            <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl flex items-center space-x-4 animate-bounce">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="text-green-400" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-tighter">Oturum Kartı Hazır</p>
                <p className="text-xs text-gray-400">Haftalık Teslimat: 12 Adet</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
              Süreç Nasıl <span className="text-[#facc15]">İşler?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Evraklardan işe yerleştirmeye kadar tüm adımları sizin için profesyonel ekibimiz yönetir.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <ClipboardCheck size={32} />, title: "Başvuru", desc: "Ön görüşme ve yetkinlik analizi yapılır." },
              { icon: <CreditCard size={32} />, title: "Evrak Hazırlık", desc: "Litvanya dosyalarınız titizlikle hazırlanır." },
              { icon: <ShieldCheck size={32} />, title: "Oturum Kartı", desc: "2 yıllık oturum kartınızın onayı alınır." },
              { icon: <Briefcase size={32} />, title: "İşe Yerleştirme", desc: "Avrupa'nın köklü lojistik firmalarında işe başlarsınız." }
            ].map((step, idx) => (
              <div key={idx} className="glass p-8 rounded-3xl group hover:border-[#facc15]/50 transition-all duration-300 relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#facc15] text-[#0B0F1A] rounded-full flex items-center justify-center font-black text-xl italic">
                  {idx + 1}
                </div>
                <div className="text-[#facc15] mb-6 transform group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HİZMETLER */}
      <section id="hizmetler" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="glass p-1 rounded-2xl overflow-hidden aspect-[3/4] relative">
                  <img src="https://images.unsplash.com/photo-1586339949216-35c2747cc36d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700" alt="Residency" />
                </div>
                <div className="glass p-1 rounded-2xl overflow-hidden aspect-square relative">
                  <img src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700" alt="Trucking" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="glass p-1 rounded-2xl overflow-hidden aspect-square relative">
                  <img src="https://images.unsplash.com/photo-1501700489910-fb21338f2824?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700" alt="Training" />
                </div>
                <div className="glass p-1 rounded-2xl overflow-hidden aspect-[3/4] relative">
                  <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700" alt="Logistics" />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
                Uzman Olduğumuz <br />
                <span className="text-[#facc15]">Hizmetler</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  { title: "Litvanya Oturum Kartı", desc: "Bürokrasiyle boğuşmayın. 2 yıllık çalışma ve oturum izninizi biz alalım." },
                  { title: "KOD95 Sertifikası", desc: "Avrupa'da tır sürmek için zorunlu olan mesleki yeterlilik belgesi eğitimleri." },
                  { title: "Tır Şoförlüğü İş Yerleştirme", desc: "Aylık 2500€ - 3500€ arası maaşlarla Avrupa'da güvenilir iş imkanları." },
                  { title: "Evrak & Süreç Takibi", desc: "Pasaporttan sigortaya, A1 transferden vizeye tüm süreç 7/24 takibimizde." }
                ].map((item, idx) => (
                  <div key={idx} className="flex space-x-6 group">
                    <div className="mt-1">
                      <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-[#facc15] group-hover:bg-[#facc15] group-hover:text-[#0B0F1A] transition-all">
                        <CheckCircle2 size={24} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GÜVEN BLOĞU */}
      <section id="guven" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-blue-600/5 blur-[120px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto glass p-12 md:p-20 rounded-[4rem] text-center space-y-12 relative z-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight italic uppercase italic">
              Neden <span className="text-[#facc15]">CMSVize?</span>
            </h2>
            <p className="text-xl text-gray-400">
              Avrupa birliği kanunlarına tam uyumlu, şeffaf ve %100 yasal süreç yönetimi ile hayallerinizi riske atmıyoruz.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-[#facc15] flex justify-center"><ShieldCheck size={48} /></div>
              <h3 className="text-2xl font-bold italic uppercase tracking-tighter italic">Yasal Süreç</h3>
              <p className="text-gray-400">Litvanya ve AB yasalarına %100 uyumlu, resmi prosedürler.</p>
            </div>
            <div className="space-y-4">
              <div className="text-[#facc15] flex justify-center"><Users size={48} /></div>
              <h3 className="text-2xl font-bold italic uppercase tracking-tighter italic">Deneyimli Ekip</h3>
              <p className="text-gray-400">500'den fazla şoförü Avrupa'ya başarıyla yerleştirmiş uzman danışmanlar.</p>
            </div>
            <div className="space-y-4">
              <div className="text-[#facc15] flex justify-center"><ArrowRight size={48} /></div>
              <h3 className="text-2xl font-bold italic uppercase tracking-tighter italic">Hızlı Sonuç</h3>
              <p className="text-gray-400">Minimum bekleme süresi, maksimum verim ile kısa sürede yola çıkın.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BAŞVURU FORMU */}
      <section ref={formRef} className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-0 rounded-[3rem] overflow-hidden shadow-3xl shadow-[#facc15]/5 border border-white/10">
            {/* Form Side */}
            <div className="bg-white/5 p-8 md:p-12">
              <h2 className="text-4xl font-black mb-8 italic uppercase italic tracking-tighter">
                Şimdi <span className="text-[#facc15]">Başvur</span>
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Ad Soyad</label>
                  <input 
                    required
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Adınız Soyadınız" 
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl focus:border-[#facc15] outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Telefon</label>
                    <input 
                      required
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+90" 
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl focus:border-[#facc15] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Hedef Ülke</label>
                    <select 
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl focus:border-[#facc15] outline-none transition-all appearance-none"
                    >
                      <option className="bg-[#0B0F1A]">Almanya</option>
                      <option className="bg-[#0B0F1A]">Litvanya</option>
                      <option className="bg-[#0B0F1A]">Polonya</option>
                      <option className="bg-[#0B0F1A]">Hollanda</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Mesajınız (Opsiyonel)</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4" 
                    placeholder="Deneyimlerinizden bahsedin..." 
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl focus:border-[#facc15] outline-none transition-all"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-[#facc15] text-[#0B0F1A] py-5 rounded-2xl font-black text-xl hover:scale-[1.02] transition-all shadow-xl shadow-[#facc15]/20"
                >
                  BAŞVURUYU TAMAMLA
                </button>
              </form>
            </div>
            
            {/* Info Side */}
            <div className="bg-[#facc15] p-12 text-[#0B0F1A] flex flex-col justify-between">
              <div className="space-y-8">
                <h3 className="text-3xl font-black italic uppercase italic leading-tight">
                  TIR ŞOFÖRÜ OLARAK <br /> AVRUPA'YA İLK ADIM
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <CheckCircle2 size={28} />
                    <span className="font-bold text-lg">2500€+ Başlangıç Maaşı</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <CheckCircle2 size={28} />
                    <span className="font-bold text-lg">Eşim & Çocuklar İçin Aile Birleşimi</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <CheckCircle2 size={28} />
                    <span className="font-bold text-lg">Modern Araç Filoları</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-12 border-t border-[#0B0F1A]/10">
                <div className="flex items-center space-x-3">
                  <Phone size={20} />
                  <span className="font-black tracking-tighter">+90 (500) 000 00 00</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin size={20} />
                  <span className="font-bold opacity-80 uppercase tracking-tighter text-sm">Maslak, İstanbul / Vilnius, Litvanya</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#facc15] rounded-md flex items-center justify-center">
              <Truck size={18} className="text-[#0B0F1A]" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">CMS<span className="text-[#facc15]">Vize</span></span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 CMSVize. Tüm hakları saklıdır. Avrupa Tır Şoförlüğü & Oturum Hizmetleri.</p>
          <div className="flex space-x-6 text-sm font-bold text-gray-400">
            <a href="#" className="hover:text-[#facc15]">KVKK</a>
            <a href="#" className="hover:text-[#facc15]">Gizlilik</a>
            <a href="#" className="hover:text-[#facc15]">İletişim</a>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <a 
        href="https://wa.me/905000000000" 
        target="_blank"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] p-5 rounded-full shadow-2xl hover:scale-110 transition-all group"
      >
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20"></div>
        <MessageCircle size={32} className="text-white relative z-10" />
        <span className="absolute right-full mr-4 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Size Nasıl Yardımcı Olabilirim?
        </span>
      </a>

      {/* FAKE LIVE POPUP */}
      <div className={`fixed bottom-8 left-8 z-50 glass px-6 py-4 rounded-2xl flex items-center space-x-4 transition-all duration-500 ${showPopup ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
          <AlertCircle size={20} />
        </div>
        <div>
          <p className="text-sm font-bold">{popupContent}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">ŞİMDİ</p>
        </div>
        <button onClick={() => setShowPopup(false)} className="text-gray-500 hover:text-white">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default App;