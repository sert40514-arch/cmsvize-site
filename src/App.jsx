import React, { useState, useEffect, useRef } from 'react';
import { Turnstile } from "react-turnstile";
import { analyticsService } from './analyticsService';
import {
  ChevronRight,
  Camera,
  ArrowLeft,
  ShieldCheck,
  Globe,
  Users,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  MessageCircle,
  MessageSquare,
  Menu,
  X,
  Star,
  Search,
  BookOpen,
  User,
  ChevronDown,
  MapPin,
  Share2,
  Lock,
  Settings,
  Briefcase,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Save,
  Activity,
  Edit,
  Filter
} from 'lucide-react';// Assets - Using the actual filenames from disk
import TirImg from './assets/tır.png';
import OturumKartiImg from './assets/oturum kartı.png';
import SupportingImg from './assets/1.png';
import insta1Img from './assets/insta1.png';
import insta2Img from './assets/insta2.png';
import insta3Img from './assets/insta3.png';
import insta4Img from './assets/insta4.png';
import logoImg from './assets/logo.png';
import muratImg from './assets/murat.png';
import halilImg from './assets/halil.png';
import heroImg from './assets/hero.png';
import cmsVideo from './assets/Cms.mp4';

// --- CONFIG & DATABASE ---
const WHATSAPP_NUMBER_SAFE = typeof import.meta !== "undefined" && import.meta.env?.VITE_WHATSAPP_NUMBER 
  ? import.meta.env.VITE_WHATSAPP_NUMBER 
  : "905459918268";
const WHATSAPP_NUMBER = WHATSAPP_NUMBER_SAFE;
const STATS_DEFAULTS = { success: 98, clients: 2500, countries: 15 };
const darkBg = "#0B0F1A";

const INITIAL_REVIEWS = [
  { id: 1, name: "Caner T.", visa: "Almanya Ulusal Vize (D Tipi)", flag: "🇩🇪", time: "3 gün önce", text: "Almanya'daki işverenimle anlaştıktan sonra tüm süreci CMSVize yönetti. Dosya hazırlığı o kadar profesyoneldi ki konsoloslukta hiç soru bile sormadılar.", likes: 14 },
  { id: 2, name: "Burak E.", visa: "Polonya D Tipi Ulusal Vize", flag: "🇵🇱", time: "1 hafta önce", text: "Polonya vizesi gibi yoğun bir süreçte CMSVize ekibinin kurumsal ve dürüst desteği için teşekkür ederim. Sayelerinde iş başı tarihim aksamadı.", likes: 14 },
  { id: 3, name: "Ayşe K.", visa: "Litvanya Oturum İzni", flag: "🇱🇹", time: "1 hafta önce", text: "Litvanya çalışma vizem CMSVize'nin titiz yönlendirmeleri sayesinde kısa sürede onaylandı. Randevu alımından evrak çevirisine kadar her şey kusursuzdu.", likes: 14 }
];

const SITE_DATABASE = {
  stats: STATS_DEFAULTS,
  team: [
    { id: 1, name: "CANSU AVCI SERT", title: "CEO", desc: "Şirketin vizyon ve stratejilerini yönetir.", isVisible: false, img: "" },
    { id: 2, name: "MURAT SERT", title: "Co-Founder / Systems Architect", desc: "Sistem mimarisi ve operasyonları koordine eder.", isVisible: true, img: muratImg },
    { id: 3, name: "HALİL İBRAHİM ÖRKCÜ", title: "Senior Visa Strategist", desc: "Vize başvuru süreçlerini ve stratejilerini planlar.", isVisible: true, img: halilImg }
  ],
  reviews: INITIAL_REVIEWS
};

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: 'Almanya',
    workField: 'Tır Şoförlüğü (KOD95)',
    message: '',
    hp: '' // Honeypot
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
  const [portalUser, setPortalUser] = useState('');
  const [portalPass, setPortalPass] = useState('');

  const handlePortalLogin = (e) => {
    e.preventDefault();
    if (portalUser === 'cmsvize' && portalPass === 'cms2026cms681001') {
      setPortalLoggedIn(true);
    } else {
      alert('Hatalı Bilgi');
    }
  };

  // Routing State
  const [currentPage, setCurrentPage] = useState('home');

  // Admin States
  const [adminLoggedIn, setAdminLoggedIn] = useState(() => {
    try {
      const auth = localStorage.getItem('cms_admin_auth');
      if (auth) {
        const { authenticated, loginTime } = JSON.parse(auth);
        const hours24 = 24 * 60 * 60 * 1000;
        if (authenticated && (Date.now() - loginTime < hours24)) {
          return true;
        } else {
          localStorage.removeItem('cms_admin_auth');
        }
      }
    } catch (e) {
      console.error("Auth parse error:", e);
    }
    return false;
  });
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  
  // Counter State (for animated numbers on Home)
  const [stats, setStats] = useState({ success: 0, clients: 0, countries: 0 });
  
  // Centralized Content State
  const [siteContent, setSiteContent] = useState(() => {
    const saved = localStorage.getItem('cms_admin_stats');
    if (saved) return JSON.parse(saved);
    return SITE_DATABASE;
  });

  // Leads State
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('cms_admin_leads');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: "Ahmet Yılmaz", phone: "5551234567", country: "Almanya", service: "Tır Şoförü", date: "2026-04-24", status: "İşleme Alındı", note: "Evraklar eksiksiz ulaştı.", isNew: false },
      { id: 2, name: "Ayşe Kaya", phone: "5329876543", country: "Polonya", service: "Fabrika / Üretim", date: "2026-04-25", status: "Yeni Başvuru", note: "CV inceleniyor.", isNew: false }
    ];
  });

  // Settings State
  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('cms_admin_settings');
    if (saved) return JSON.parse(saved);
    return {
      whatsapp: "905459918268",
      instagram: "cmsprime",
      desc: "Avrupa'da kariyer ve yaşam için profesyonel vize ve danışmanlık köprünüz."
    };
  });

  const [adminTab, setAdminTab] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState('');
  const [totalViews, setTotalViews] = useState(12450); // Simulation for Analytics
  
  // Tracking Module States
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState(false);

  // Security & Bot Protection
  const [isTurnstileVerified, setIsTurnstileVerified] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [submittedTrackingId, setSubmittedTrackingId] = useState('');
  
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Simulation: Increase views on load
  useEffect(() => {
    setTotalViews(prev => prev + Math.floor(Math.random() * 10) + 1);
  }, []);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('cms_admin_stats', JSON.stringify(siteContent)); }, [siteContent]);
  useEffect(() => { localStorage.setItem('cms_admin_leads', JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem('cms_admin_settings', JSON.stringify(siteSettings)); }, [siteSettings]);

  // Data Integrity Guard
  useEffect(() => {
    if (!siteContent?.stats) {
      setSiteContent(prev => ({
        ...prev,
        stats: STATS_DEFAULTS
      }));
    }
  }, [siteContent]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUser === 'cms_master_admin' && adminPass === 'CMS_vize_2026_@Admin_!Secure') {
      const authData = { authenticated: true, loginTime: Date.now() };
      localStorage.setItem('cms_admin_auth', JSON.stringify(authData));
      setAdminLoggedIn(true);
      setCurrentPage('admin-dashboard');
    } else {
      alert('Güvenlik İhlali: Kimlik doğrulanamadı.');
      setCurrentPage('home');
      window.location.pathname = '/';
    }
  };

  const formRef = useRef(null);

  // Path Detection for Direct Navigation
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin-panel-cms') {
      if (adminLoggedIn) {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('admin-login');
      }
    } else if (path === '/portal') {
      setCurrentPage('portal');
    } else if (path === '/blog') {
      setCurrentPage('blog');
    }
  }, []);

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
    const targetSuccess = siteContent.stats.success;
    const targetClients = siteContent.stats.clients;
    const targetCountries = siteContent.stats.countries;

    let currentSuccess = 0;
    let currentClients = 0;
    let currentCountries = 0;

    const interval = setInterval(() => {
      let updated = false;
      if (currentSuccess < targetSuccess) { currentSuccess += 1; updated = true; }
      if (currentClients < targetClients) { currentClients += Math.ceil(targetClients / 100); updated = true; }
      if (currentCountries < targetCountries) { currentCountries += 1; updated = true; }
      
      // Cap them
      if (currentSuccess > targetSuccess) currentSuccess = targetSuccess;
      if (currentClients > targetClients) currentClients = targetClients;
      if (currentCountries > targetCountries) currentCountries = targetCountries;

      setStats({ success: currentSuccess, clients: currentClients, countries: currentCountries });

      if (currentSuccess === targetSuccess && currentClients === targetClients && currentCountries === targetCountries) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [currentPage, siteContent.stats]);

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
    const { name, value } = e.target;
    if (name === 'phone') {
      const cleaned = value.replace(/[^\d+]/g, '');
      setFormData({ ...formData, phone: cleaned });
    } else if (name === 'name') {
      const cleaned = value.replace(/[^a-zA-Z\sğüşıöçĞÜŞİÖÇ]/g, '');
      setFormData({ ...formData, name: cleaned });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const isSpammy = (text) => {
    if (!text) return false;
    const spamPatterns = ['asdasd', 'qweqwe', 'testtest', 'adminadmin', 'deneme', 'aaabbb', 'qwerty', '123123'];
    const cleaned = text.toLowerCase().replace(/\s/g, '');
    if (spamPatterns.some(p => cleaned.includes(p))) return true;
    if (/(.)\1{4,}/.test(cleaned)) return true; // 5+ repeats
    return false;
  };

  const validateName = (name) => {
    const trimmed = name.trim();
    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) return false;
    if (parts.some(p => p.length < 2)) return false;
    if (isSpammy(trimmed)) return false;
    return true;
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[^\d]/g, '');
    if (cleaned.length < 10 || cleaned.length > 15) return false;
    const fakePatterns = ['123456', '111111', '000000', '987654', '123123'];
    if (fakePatterns.some(p => cleaned.includes(p))) return false;
    if (/(.)\1{4,}/.test(cleaned)) return false;
    return true;
  };

  const validateMessage = (msg) => {
    if (!msg) return true; // Optional
    if (msg.length < 10) return false;
    if (isSpammy(msg)) return false;
    return true;
  };

  const checkRateLimit = () => {
    const now = Date.now();
    const history = JSON.parse(localStorage.getItem('cms_sub_history') || '[]');
    const fiveMins = 5 * 60 * 1000;
    const recent = history.filter(t => now - t < fiveMins);
    
    if (recent.length >= 2) return { ok: false, msg: "Çok kısa sürede fazla başvuru yaptınız. Lütfen biraz sonra tekrar deneyin." };
    const last = recent[recent.length - 1];
    if (last && now - last < 10000) return { ok: false, msg: "İşleminiz devam ediyor, lütfen bekleyin." };
    
    return { ok: true };
  };

  const isPhoneValid = validatePhone(formData.phone);
  const isNameValid = validateName(formData.name);

  // --- Admin Logic Helpers ---
  const getDashboardStats = () => {
    const total = leads.length;
    const todayStr = new Date().toISOString().split('T')[0];
    const today = leads.filter(l => l.date === todayStr).length;
    const pending = leads.filter(l => ["Yeni Başvuru", "Arandı", "Evrak Bekleniyor"].includes(l.status)).length;
    const completed = leads.filter(l => l.status === "Tamamlandı").length;
    const cancelled = leads.filter(l => l.status === "İptal").length;

    const countries = leads.reduce((acc, lead) => { acc[lead.country] = (acc[lead.country] || 0) + 1; return acc; }, {});
    const topCountry = Object.entries(countries).sort((a,b) => b[1] - a[1])[0]?.[0] || "---";

    const services = leads.reduce((acc, lead) => { acc[lead.service] = (acc[lead.service] || 0) + 1; return acc; }, {});
    const topService = Object.entries(services).sort((a,b) => b[1] - a[1])[0]?.[0] || "---";

    return { total, today, pending, completed, cancelled, topCountry, topService };
  };

  const getLeadQuality = (lead) => {
    if (!lead.name || !lead.phone || lead.name.length < 5) return { label: "Şüpheli Lead", color: "text-red-500 bg-red-500/10" };
    const nameParts = lead.name.trim().split(/\s+/);
    if (nameParts.length < 2 || nameParts.some(p => p.length < 2)) return { label: "Şüpheli Lead", color: "text-red-500 bg-red-500/10" };
    if (isSpammy(lead.name) || (lead.note && isSpammy(lead.note))) return { label: "Spam!", color: "text-red-600 bg-red-600/20 animate-pulse" };
    
    // Warm lead criteria: Proper name + Proper phone + Valid country + Note detail
    if (lead.name.length > 8 && lead.phone.length >= 10 && lead.country && lead.note && lead.note.length > 25) {
      return { label: "Sıcak Lead", color: "text-green-400 bg-green-400/10" };
    }
    return { label: "Normal Lead", color: "text-blue-400 bg-blue-400/10" };
  };

  // Lead Filtering States
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name?.toLowerCase().includes(leadSearch.toLowerCase()) || l.phone?.includes(leadSearch);
    const matchesStatus = leadStatusFilter === 'All' || l.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getWhatsAppURL = (customData = null) => {
    const data = customData || formData;
    const msg = `Merhaba, CMSVize üzerinden başvuru yapmak istiyorum.
Ad Soyad: ${data.name || '---'}
Telefon: ${data.phone || '---'}
Hedef Ülke: ${data.country || 'Genel'}
İlgilendiğim alan: ${data.workField}

Mesaj: ${data.message || 'Bilgi almak istiyorum.'}`;
    const whatsappPhone = siteSettings?.whatsapp || WHATSAPP_NUMBER_SAFE;
    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(msg)}`;
  };

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      console.warn("Audio context not supported or blocked");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.hp) return; // Honeypot trap

    if (!isNameValid) {
      showToast("Lütfen gerçek ad ve soyadınızı yazın.");
      return;
    }

    if (!isPhoneValid) {
      showToast("Lütfen geçerli bir telefon numarası girin.");
      return;
    }

    if (!validateMessage(formData.message)) {
      showToast("Lütfen daha açıklayıcı bir not yazın.");
      return;
    }

    const rate = checkRateLimit();
    if (!rate.ok) {
      showToast(rate.msg);
      return;
    }

    if (!turnstileToken) {
      showToast("Lütfen güvenlik doğrulamasını tamamlayın.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 10000); // 10s disable

    try {
      const verifyRes = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: turnstileToken })
      });
      
      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        setIsSubmitting(false);
        showToast("Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyin.");
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      const trackingId = `CMS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedTrackingId(trackingId);

      const now = new Date();
      const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toISOString().split('T')[0];

      const newLead = {
        id: Date.now(),
        trackingId: trackingId,
        name: formData.name,
        phone: formData.phone,
        country: formData.country,
        service: formData.workField,
        date: dateStr,
        time: timeStr,
        source: "Site Formu",
        status: "Yeni Başvuru",
        note: formData.message || "Hızlı başvuru formu",
        isNew: true
      };
      setLeads([newLead, ...leads]);
      
      // Update rate limit history
      const subHistory = JSON.parse(localStorage.getItem('cms_sub_history') || '[]');
      subHistory.push(Date.now());
      localStorage.setItem('cms_sub_history', JSON.stringify(subHistory.slice(-10)));

      playNotificationSound();
      showToast('Başvurunuz Alındı!');

      setIsSubmitting(false);
      setFormSuccess(true);
    } catch (error) {
      console.error("Form error:", error);
      setIsSubmitting(false);
      showToast("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      country: 'Almanya',
      workField: 'Tır Şoförlüğü (KOD95)',
      message: '',
      hp: ''
    });
    setFormSuccess(false);
    setIsTurnstileVerified(false);
    setTurnstileToken(null);
    setSubmittedTrackingId('');
    
    // Turnstile reset
    if (window.turnstile) {
      try {
        window.turnstile.reset();
      } catch (e) {
        console.warn("Turnstile reset error:", e);
      }
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

  const handleTrack = (e) => {
    e.preventDefault();
    setTrackingError(false);
    setTrackingResult(null);
    
    const found = leads.find(l => 
      l.phone?.includes(trackingCode) || 
      l.id.toString() === trackingCode || 
      l.name?.toLowerCase().includes(trackingCode.toLowerCase())
    );

    if (found) {
      setTrackingResult(found);
    } else {
      setTrackingError(true);
    }
  };

  const getStatusProgress = (status) => {
    const steps = {
      "Yeni Başvuru": 20,
      "Arandı": 40,
      "Evrak Bekleniyor": 60,
      "İşleme Alındı": 80,
      "Tamamlandı": 100,
      "İptal": 0
    };
    return steps[status] || 0;
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
      {!currentPage.startsWith('admin') && (
        <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/5 h-20 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
            <div onClick={() => setCurrentPage('home')} className="flex items-center space-x-3 group cursor-pointer">
              {logoImg ? <img src={logoImg} alt="Logo" className="h-10 w-auto" /> : <span>CMSVize</span>}
            </div>

            <div className="hidden lg:flex items-center space-x-10 font-bold text-xs tracking-[0.15em]">
              <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('hizmetler')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-[#facc15] transition-colors">HİZMETLER</button>
              <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('referanslar')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-[#facc15] transition-colors">REFERANSLAR</button>
              <button onClick={() => setCurrentPage('blog')} className={`hover:text-[#facc15] transition-colors ${currentPage === 'blog' ? 'text-[#facc15]' : ''}`}>VİZE REHBERİ</button>
              <button onClick={() => setCurrentPage('portal')} className={`hover:text-[#facc15] transition-colors flex items-center space-x-1 ${currentPage === 'portal' ? 'text-[#facc15]' : ''}`}><User size={14} /><span>PORTAL</span></button>

              <div className="flex items-center space-x-4 border border-white/10 p-1.5 rounded-lg bg-[#131926]">
                <button onClick={() => setShowTrackingModal(true)} className="btn-corporate px-6 py-2.5 text-gray-300 hover:text-white font-black flex items-center space-x-2 transition-all hover:bg-white/5 rounded-md">
                  <Search size={16} className="text-[#0a66c2]" />
                  <span>BAŞVURU TAKİP</span>
                </button>
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
      )}

      {/* MOBILE MENU */}
      {!currentPage.startsWith('admin') && mobileMenuOpen && (
        <div className={`lg:hidden fixed inset-0 bg-[#0B0F1A]/98 backdrop-blur-2xl z-[60] transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="flex flex-col items-center justify-center h-full space-y-10 p-10">
            <X size={40} className="absolute top-6 right-6 cursor-pointer" onClick={() => setMobileMenuOpen(false)} />
            <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); setTimeout(() => document.getElementById('hizmetler')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-4xl font-black italic tracking-tighter">HİZMETLER</button>
            <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); setTimeout(() => document.getElementById('referanslar')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-4xl font-black italic tracking-tighter">REFERANSLAR</button>
            <button onClick={() => { setCurrentPage('blog'); setMobileMenuOpen(false); }} className={`text-4xl font-black italic tracking-tighter ${currentPage === 'blog' ? 'text-[#facc15]' : ''}`}>VİZE REHBERİ</button>
            <button onClick={() => { setCurrentPage('portal'); setMobileMenuOpen(false); }} className={`text-4xl font-black italic tracking-tighter flex items-center space-x-3 ${currentPage === 'portal' ? 'text-[#facc15]' : ''}`}><User size={30} /><span>PORTAL</span></button>
            <div className="w-full space-y-4 pt-4 border-t border-white/10">
              <button onClick={() => { setShowTrackingModal(true); setMobileMenuOpen(false); }} className="w-full glass border border-white/10 py-5 rounded-lg btn-corporate font-black text-xl flex justify-center items-center space-x-2 text-gray-300">
                <Search size={24} className="text-[#0a66c2]" />
                <span>BAŞVURU TAKİP</span>
              </button>
              <button onClick={scrollToForm} className="w-full bg-[#facc15] text-[#0B0F1A] py-6 rounded-lg btn-corporate font-black text-2xl">ÜCRETSİZ BAŞVURU BAŞLAT</button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER PAGES */}
      {currentPage === 'home' ? (
        <>
          {/* HERO SECTION */}
          <section className="relative pt-40 lg:pt-56 pb-24 lg:pb-32 px-6">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#facc15]/5 rounded-full blur-[150px] -z-10"></div>
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="space-y-10 animate-fade-up">
                <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-lg text-[#facc15] font-black text-xs tracking-widest uppercase shadow-inner">
                  <Star size={16} fill="currentColor" />
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
                    <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                  <button onClick={() => setShowWizard(true)} className="btn-corporate glass px-12 py-6 font-black text-xl flex items-center justify-center space-x-3 hover:bg-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    <BookOpen className="text-[#facc15]" />
                    <span>UYGUNLUK TESTİ</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-4 pt-2">
                  {[
                    { icon: <Camera size={14} />, text: "Tır Şoförlüğü (KOD95)" },
                    { icon: <Star size={14} />, text: "A1 Transfer İle Giriş" },
                    { icon: <Camera size={14} />, text: "Fabrika & Depo İşleri" },
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
                  <video 
                    src={cmsVideo} 
                    className="w-full h-full object-cover aspect-[4/5] lg:aspect-auto" 
                    controls 
                    playsInline
                  >
                    Tarayıcınız video etiketini desteklemiyor.
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A]/80 via-transparent to-transparent opacity-60 pointer-events-none"></div>
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
                  <div className="flex justify-center text-[#facc15] mb-2"> <Star size={48} /> </div>
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
                {(siteContent?.reviews || []).map((ref, idx) => (
                  <div key={ref.id || idx} className="linkedin-card p-5 space-y-4 shadow-xl border border-white/5 hover:border-[#0a66c2]/30 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-5 right-5 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-xl border border-white/10 shadow-lg group-hover:scale-125 transition-transform">
                      {ref.flag}
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-3">
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-black text-xl z-10">{ref.name[0]}</div>
                        <div className="z-10 pr-6">
                          <div className="flex items-center space-x-1">
                            <h4 className="font-bold text-sm text-white">{ref.name}</h4>
                            <CheckCircle2 size={16} className="text-[#0a66c2]" />
                          </div>
                          <p className="text-[11px] text-[#facc15] font-bold leading-tight mt-0.5">{ref.visa}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{ref.time} • 🌐</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-200 leading-relaxed font-normal relative z-10">{ref.text}</div>
                    <div className="flex items-center space-x-1 pt-2 relative z-10">
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 bg-[#0a66c2] rounded-full flex items-center justify-center border-2 border-[#1B1F23]"><Star size={10} className="text-white fill-white" /></div>
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#1B1F23]"><Star size={10} className="text-white fill-white" /></div>
                      </div>
                      <span className="text-[11px] text-gray-400 font-medium ml-1">{ref.likes || 0} • <MessageSquare size={10} className="inline ml-1" /> {ref.comments || 0}</span>
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
                      <span>Detaylar</span> <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
                    img: insta1Img,
                    type: 'REEL',
                    typeIcon: 'reel',
                    tag: '@CMSPrime',
                    label: 'Almanya Vizesi Onaylandı!',
                  },
                  {
                    img: insta2Img,
                    type: 'CAROUSEL',
                    typeIcon: 'carousel',
                    tag: '@CMSPrime',
                    label: 'Uzman Danışmanlık & %98 Başarı',
                  },
                  {
                    img: insta3Img,
                    type: 'POST',
                    typeIcon: 'post',
                    tag: '@CMSPrime',
                    label: 'Polonya Oturum İzni ✅',
                  },
                  {
                    img: insta4Img,
                    type: 'POST',
                    typeIcon: 'post',
                    tag: '7/24 Kesintisiz Destek',
                    label: 'AVRUPA GENELİNDE HİZMET',
                  }
                ].map((post, i) => (
                  <a
                    key={i}
                    href="https://www.instagram.com/cmsprime/"
                    target="_blank"
                    rel="noreferrer"
                    className="aspect-square rounded-xl overflow-hidden relative group block border border-white/10 shadow-xl"
                  >
                    {/* Background Image with Safe Render */}
                    {post.img ? (
                      <img src={post.img} alt={post.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="absolute inset-0 bg-gray-800"></div>
                    )}

                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:via-black/20 transition-all duration-300"></div>

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

          {/* EKİBİMİZ */}
          <section id="ekip" className="py-32 px-6">
            <div className="max-w-6xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter">CMSPRİME <span className="text-[#facc15]">EKİBİ</span></h2>
                <p className="text-gray-400 font-medium text-lg tracking-tight">Vize ve kariyer yolculuğunuzda size rehberlik eden profesyoneller.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {siteContent?.team?.filter(m => m.isVisible !== false).map((member) => (
                  <div key={member.id} className="glass p-6 rounded-2xl group hover:border-[#facc15]/30 transition-all duration-500 shadow-2xl relative overflow-hidden">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden mb-8 relative bg-black/40">
                      {member.img ? (
                        <img src={member.img} alt={member.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <User size={48} className="text-gray-500" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent opacity-60"></div>
                    </div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">{member.name}</h3>
                    <p className="text-[#facc15] font-black text-xs uppercase tracking-widest mt-2">{member.title}</p>
                    {member.desc && <p className="text-gray-400 mt-4 text-sm font-medium leading-relaxed">{member.desc}</p>}
                  </div>
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
                    <p className="font-black italic uppercase text-[#facc15] tracking-widest text-sm">İşleminiz Yapılıyor...</p>
                  </div>}
                  <h2 className="text-5xl font-black italic uppercase tracking-tighter italic mb-10">Hemen <span className="text-[#facc15]">Başvur</span></h2>
                  {formSuccess ? (
                    <div className="flex flex-col items-center justify-center text-center space-y-6 py-16 animate-fade-up">
                      <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={48} className="text-green-500" />
                      </div>
                      <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">BAŞVURUNUZ BAŞARIYLA ALINDI!</h3>
                      <div className="space-y-4">
                        <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-sm">Uzmanlarımız en kısa sürede vermiş olduğunuz bilgiler üzerinden size dönüş yapacaktır.</p>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-3">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Takip Numaranız</p>
                            <p className="text-2xl font-black italic text-[#facc15] tracking-tighter">{submittedTrackingId}</p>
                          </div>
                          <div className="pt-3 border-t border-white/5">
                            <p className="text-[11px] font-bold text-gray-300">Ortalama dönüş süresi: 15–30 dakika</p>
                          </div>
                        </div>
                      </div>
                      <button onClick={resetForm} className="mt-8 btn-corporate bg-white/5 border border-white/10 px-8 py-4 text-white hover:bg-white/10 transition-all font-bold text-sm tracking-widest uppercase">Yeni Başvuru Yap</button>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">AD SOYAD</label>
                        <input 
                          required 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          className={`w-full bg-white/5 px-8 py-5 text-lg font-bold input-corporate transition-colors ${formData.name && !isNameValid ? 'border-red-500 bg-red-500/5' : 'focus:border-[#facc15]'}`} 
                          placeholder="Ad Soyad" 
                        />
                        {formData.name && !isNameValid && (
                          <p className="text-red-500 text-[10px] font-bold ml-2 animate-pulse">Lütfen gerçek ad ve soyadınızı yazın.</p>
                        )}
                      </div>
                      <input type="text" name="hp" value={formData.hp} onChange={handleInputChange} style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">TELEFON</label>
                          <input 
                            required 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            className={`w-full bg-white/5 px-8 py-5 text-lg font-bold input-corporate transition-colors ${formData.phone && !isPhoneValid ? 'border-red-500 bg-red-500/5' : 'focus:border-[#facc15]'}`} 
                            placeholder="+90 5xx..." 
                          />
                          {formData.phone && !isPhoneValid && (
                            <p className="text-red-500 text-[10px] font-bold ml-2 animate-pulse">Lütfen geçerli bir telefon numarası girin.</p>
                          )}
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
                        <textarea name="message" value={formData.message} onChange={handleInputChange} className={`w-full bg-white/5 px-8 py-5 text-lg font-bold input-corporate transition-colors ${formData.message && !validateMessage(formData.message) ? 'border-red-500 bg-red-500/5' : 'focus:border-[#facc15]'}`} rows="3" placeholder="Tecrübelerinizden bahsedin..."></textarea>
                        {formData.message && !validateMessage(formData.message) && (
                          <p className="text-red-500 text-[10px] font-bold ml-2 animate-pulse">Lütfen daha açıklayıcı bir not yazın (Min 10 karakter).</p>
                        )}
                      </div>

                      <div className="flex items-start space-x-3 pt-2 pb-2">
                        <input type="checkbox" required id="terms" className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#0a66c2] focus:ring-[#0a66c2] cursor-pointer" />
                        <label htmlFor="terms" className="text-[11px] text-gray-400 leading-relaxed cursor-pointer font-medium">Danışmanlık hizmet şartlarını okudum ve vize karar merciinin ilgili Konsolosluklar olduğunu kabul ediyorum.</label>
                      </div>

                      <div className="py-2 flex flex-col items-center space-y-4 min-h-[100px]">
                        {typeof Turnstile !== 'undefined' ? (
                          <Turnstile 
                            sitekey="0x4AAAAAADCs4Dto3zUFJEGb" 
                            onVerify={(token) => {
                              setTurnstileToken(token);
                              setIsTurnstileVerified(true);
                            }} 
                            theme="dark"
                          />
                        ) : (
                          <div className="text-[10px] text-gray-500 italic uppercase font-black animate-pulse">Bot Doğrulaması Yükleniyor...</div>
                        )}
                        <div className="text-center space-y-1">
                          <p className="text-[10px] text-gray-500 font-medium italic">“Bilgileriniz yalnızca danışmanlık ön değerlendirmesi için kullanılır.”</p>
                          <p className="text-[10px] text-gray-500 font-medium italic">“Otomatik WhatsApp yönlendirmesi yapılmaz.”</p>
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Uzman ekibimiz başvurunuzu inceleyerek sizinle iletişime geçer.</p>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={!isPhoneValid || !isNameValid || !isTurnstileVerified}
                        className={`w-full py-6 btn-corporate font-black text-2xl uppercase italic tracking-tighter transition-all ${isPhoneValid && isNameValid && isTurnstileVerified ? 'bg-[#facc15] text-[#0B0F1A] hover:scale-[1.02]' : 'bg-gray-800 text-gray-500 cursor-not-allowed grayscale'}`}
                      >
                        BAŞVURUYU TAMAMLA
                      </button>
                    </form>
                  )}
                </div>
                <div className="bg-[#facc15] p-10 lg:p-16 text-[#0B0F1A] flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="space-y-10 relative z-10">
                    <h3 className="text-5xl lg:text-7xl font-black italic uppercase leading-[0.85] tracking-tighter">AVRUPA <br /> KAPISI <br /> AÇILIYOR</h3>
                    
                    <div className="space-y-4">
                      {[
                        { title: "2 Yıllık Oturum Fırsatı", desc: "Litvanya üzerinden tüm AB'de geçerli kart." },
                        { title: "Schengen Bölgesi Serbestlik", desc: "27 ülkede vizesiz hareket ve çalışma imkanı." },
                        { title: "İş & Kariyer Planlaması", desc: "Profilinize uygun garantili iş yerleşimi." }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-black/5 border border-black/10 p-5 rounded-xl space-y-1 hover:bg-black/10 transition-all cursor-default">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 size={18} fill="currentColor" className="text-black" />
                            <p className="font-black text-lg uppercase italic tracking-tighter">{item.title}</p>
                          </div>
                          <p className="text-xs font-bold opacity-70 ml-7 leading-tight">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-black text-[#facc15] py-3 px-6 rounded-lg text-center transform -rotate-1 shadow-xl">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Ücretsiz Ön Değerlendirme • Hızlı Dönüş • Profesyonel Süreç</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-10 border-t border-black/10 mt-10 relative z-10">
                    <a href="tel:+905459918268" className="text-3xl font-black tracking-tighter flex items-center space-x-3 hover:translate-x-2 transition-transform"> <Phone /> <span>+90 545 991 82 68</span> </a>
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

          {/* SEO / GÜVEN İÇERİĞİ */}
          <section className="py-24 px-6 border-t border-white/5 bg-white/[0.01]">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="space-y-6 text-center">
                <h2 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter text-white">Avrupa Vize ve Oturum Danışmanlığında <br className="hidden md:block" /> <span className="text-[#facc15]">Profesyonel Süreç Yönetimi</span></h2>
                <div className="w-20 h-1 bg-[#facc15] mx-auto"></div>
              </div>
              <div className="space-y-6">
                <p className="text-gray-300 text-lg leading-relaxed font-medium">
                  CMSVize; Almanya, Polonya ve Litvanya başta olmak üzere Avrupa’da iş, oturum, aile birleşimi ve danışmanlık süreçlerinde başvuru sahiplerine profesyonel yol haritası sunar. Aksaray merkezli yapımız ve Avrupa odaklı danışmanlık modelimizle, süreci daha anlaşılır, planlı ve güvenilir hale getiriyoruz.
                </p>
                <div className="glass p-6 rounded-xl border-l-4 border-[#facc15]">
                  <p className="text-xs text-gray-500 font-bold leading-relaxed italic">
                    <span className="text-[#facc15] uppercase tracking-widest block mb-2 font-black">Yasal Uyarı & Bilgilendirme:</span>
                    CMSVize danışmanlık hizmeti sunar. Nihai karar yetkisi ilgili konsolosluklara, resmi kurumlara ve yetkili mercilere aittir. Başvuru süreci boyunca sunulan her türlü bilgi, ilgili ülkelerin güncel göç yasaları ve resmi prosedürleri çerçevesinde değerlendirilir.
                  </p>
                </div>
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
      ) : currentPage === 'admin-login' ? (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B0F1A]">
          <div className="max-w-md w-full glass p-10 rounded-2xl border-t-4 border-[#facc15] shadow-2xl">
            <div className="flex justify-center mb-8">
              <ShieldCheck className="text-[#facc15] w-20 h-20" />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-center mb-2">Admin <span className="text-[#facc15]">Panel</span></h2>
            <p className="text-gray-400 text-center text-sm mb-8">Yetkili personel girişi gereklidir.</p>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">KULLANICI ADI</label>
                <input required value={adminUser} onChange={(e) => setAdminUser(e.target.value)} className="w-full bg-black/50 border border-white/10 px-6 py-4 rounded-lg font-bold focus:border-[#facc15] outline-none" placeholder="cms_master_admin" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">GÜVENLİK ANAHTARI</label>
                <input required type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full bg-black/50 border border-white/10 px-6 py-4 rounded-lg font-bold focus:border-[#facc15] outline-none" placeholder="••••••••••••" />
              </div>
              <button type="submit" className="w-full bg-[#facc15] text-black font-black py-5 rounded-lg text-lg hover:scale-[1.02] transition-transform mt-4">SİSTEME GİRİŞ YAP</button>
            </form>
          </div>
        </div>
      ) : currentPage === 'admin-dashboard' && adminLoggedIn ? (
        <div className="min-h-screen bg-[#080C14] text-white">
          <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-72 bg-[#0B0F1A] border-r border-white/5 p-8 flex flex-col justify-between">
              <div className="space-y-10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#facc15] rounded-lg flex items-center justify-center">
                    <ShieldCheck className="text-[#0B0F1A]" />
                  </div>
                  <span className="font-black italic text-xl tracking-tighter">CMS <span className="text-[#facc15]">ADMIN</span></span>
                </div>
                <nav className="space-y-2">
                  <button onClick={() => setAdminTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'dashboard' ? 'bg-[#facc15] text-black' : 'text-gray-400 hover:bg-white/5'}`}>
                    <Activity size={18} /> <span>Dashboard</span>
                  </button>
                  <button onClick={() => setAdminTab('stats')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'stats' ? 'bg-[#facc15] text-black' : 'text-gray-400 hover:bg-white/5'}`}>
                    <Star size={18} /> <span>Dinamik Veriler</span>
                  </button>
                  <button onClick={() => setAdminTab('team')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'team' ? 'bg-[#facc15] text-black' : 'text-gray-400 hover:bg-white/5'}`}>
                    <Users size={18} /> <span>Ekip Yönetimi</span>
                  </button>
                  <button onClick={() => setAdminTab('reviews')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'reviews' ? 'bg-[#facc15] text-black' : 'text-gray-400 hover:bg-white/5'}`}>
                    <MessageSquare size={18} /> <span>Müşteri Yorumları</span>
                  </button>
                  <button onClick={() => setAdminTab('leads')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'leads' ? 'bg-[#facc15] text-black' : 'text-gray-400 hover:bg-white/5'}`}>
                    <Briefcase size={18} /> <span>Başvurular</span>
                  </button>
                  <button onClick={() => setAdminTab('settings')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'settings' ? 'bg-[#facc15] text-black' : 'text-gray-400 hover:bg-white/5'}`}>
                    <Settings size={18} /> <span>Site Ayarları</span>
                  </button>
                </nav>
              </div>
              <button onClick={() => { 
                localStorage.removeItem('cms_admin_auth');
                setAdminLoggedIn(false); 
                setCurrentPage('home'); 
                window.location.pathname = '/'; 
              }} className="w-full border border-white/10 p-4 rounded-lg font-bold text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center space-x-2">
                <X size={18} /> <span>Güvenli Çıkış</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-12 relative">
              {toastMessage && (
                <div className="absolute top-6 right-6 bg-green-500 text-white font-bold px-6 py-3 rounded-lg shadow-2xl flex items-center space-x-2 animate-fade-up z-50">
                  <CheckCircle2 size={20} />
                  <span>{toastMessage}</span>
                </div>
              )}
              
              <div className="max-w-5xl space-y-12">
                <div className="flex justify-between items-end border-b border-white/5 pb-8">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter">
                      {adminTab === 'dashboard' && 'Genel Durum'}
                      {adminTab === 'stats' && 'Dinamik Veriler'}
                      {adminTab === 'team' && 'Ekip Yönetimi'}
                      {adminTab === 'leads' && 'Başvuru Yönetimi'}
                      {adminTab === 'settings' && 'Site Ayarları'}
                      <span className="text-[#facc15] ml-2">Paneli</span>
                    </h1>
                  </div>
                </div>

                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sistem Durumu</p>
                  <div className="flex flex-col items-end">
                    <p className="text-green-500 font-bold flex items-center justify-end space-x-2"> <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> <span>Çevrimiçi</span> </p>
                    <div className="bg-[#facc15]/10 text-[#facc15] px-2 py-0.5 rounded border border-[#facc15]/20 text-[9px] font-black uppercase mt-1 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-[#facc15] rounded-full"></span>
                      <span>Analytics Bekleniyor</span>
                    </div>
                  </div>
                </div>

                {adminTab === 'dashboard' && (
                  <div className="space-y-8 animate-fade-up">
                    {/* Real-time Data Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="glass p-6 rounded-xl border-t-4 border-[#facc15] relative overflow-hidden group">
                        <Users className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 group-hover:scale-110 transition-transform" />
                        <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Toplam Başvuru</p>
                        <p className="text-4xl font-black italic mt-2 text-white">{getDashboardStats().total}</p>
                        <div className="mt-4 flex items-center text-[#facc15] text-xs font-bold">
                          <span>Bugün: {getDashboardStats().today} Yeni</span>
                        </div>
                      </div>
                      <div className="glass p-6 rounded-xl border-t-4 border-blue-500 relative overflow-hidden group">
                        <Activity className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 group-hover:scale-110 transition-transform" />
                        <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest">İşlemdeki Başvurular</p>
                        <p className="text-4xl font-black italic mt-2 text-white">{getDashboardStats().pending}</p>
                        <div className="mt-4 flex items-center text-blue-400 text-xs font-bold">
                          <span>Yanıt Bekleyenler Dahil</span>
                        </div>
                      </div>
                      <div className="glass p-6 rounded-xl border-t-4 border-green-500 relative overflow-hidden group">
                        <CheckCircle2 className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 group-hover:scale-110 transition-transform" />
                        <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Tamamlanan</p>
                        <p className="text-4xl font-black italic mt-2 text-white">{getDashboardStats().completed}</p>
                        <div className="mt-4 flex items-center text-green-400 text-xs font-bold">
                          <span>Başarıyla Sonuçlananlar</span>
                        </div>
                      </div>
                    </div>

                    {/* Analytics Placeholder Section */}
                    <div className="glass p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0a66c2]/5 to-transparent"></div>
                      <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                          <Activity size={32} className="text-gray-600" />
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter">Analytics Bağlantısı Bekleniyor</h3>
                        <p className="text-gray-500 text-sm max-w-md font-medium">Gerçek ziyaretçi ve davranış verileri için GA4 veya Vercel Analytics bağlantısı yapılması gerekmektedir. Şu an demo veri gösterilmemektedir.</p>
                        <button className="text-[10px] font-black uppercase tracking-widest border border-white/10 px-4 py-2 rounded-lg text-gray-500 hover:bg-white/5 transition-all">Sistemi Bağla</button>
                      </div>
                    </div>

                    {/* Quality Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass p-6 rounded-xl space-y-4">
                        <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Popüler Hedef Ülke</p>
                        <p className="text-2xl font-black italic text-[#facc15]">{getDashboardStats().topCountry}</p>
                        <p className="text-[10px] text-gray-400 italic">En çok başvuru alan ülke.</p>
                      </div>
                      <div className="glass p-6 rounded-xl space-y-4">
                        <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Popüler Hizmet Alanı</p>
                        <p className="text-2xl font-black italic text-blue-400">{getDashboardStats().topService}</p>
                        <p className="text-[10px] text-gray-400 italic">En çok talep gören iş alanı.</p>
                      </div>
                    </div>
                  </div>
                )}

                {adminTab === 'stats' && (
                  <div className="space-y-8 animate-fade-up">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="glass p-8 rounded-xl space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Vize Başarı Oranı (%)</p>
                        <input 
                          type="number" 
                          value={siteContent?.stats?.success || 0} 
                          onChange={(e) => setSiteContent({...siteContent, stats: {...siteContent.stats, success: parseInt(e.target.value) || 0}})}
                          className="w-full bg-black/30 border border-white/10 px-4 py-3 rounded-lg text-2xl font-black text-[#facc15] outline-none focus:border-[#facc15]"
                        />
                      </div>
                      <div className="glass p-8 rounded-xl space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Mutlu Müşteri Sayısı</p>
                        <input 
                          type="number" 
                          value={siteContent?.stats?.clients || 0} 
                          onChange={(e) => setSiteContent({...siteContent, stats: {...siteContent.stats, clients: parseInt(e.target.value) || 0}})}
                          className="w-full bg-black/30 border border-white/10 px-4 py-3 rounded-lg text-2xl font-black text-[#facc15] outline-none focus:border-[#facc15]"
                        />
                      </div>
                      <div className="glass p-8 rounded-xl space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Hedef Ülke Sayısı</p>
                        <input 
                          type="number" 
                          value={siteContent?.stats?.countries || 0} 
                          onChange={(e) => setSiteContent({...siteContent, stats: {...siteContent.stats, countries: parseInt(e.target.value) || 0}})}
                          className="w-full bg-black/30 border border-white/10 px-4 py-3 rounded-lg text-2xl font-black text-[#facc15] outline-none focus:border-[#facc15]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <button onClick={() => showToast('İstatistik verileri başarıyla güncellendi!')} className="bg-[#facc15] text-[#0B0F1A] font-black px-8 py-3 rounded-lg flex items-center space-x-2 hover:scale-105 transition-all">
                        <Save size={18} /> <span>DEĞİŞİKLİKLERİ KAYDET</span>
                      </button>
                    </div>
                  </div>
                )}

                {adminTab === 'team' && (
                  <div className="space-y-6 animate-fade-up">
                    <div className="flex justify-end mb-4">
                      <button onClick={() => {
                        const newMember = { id: Date.now(), name: "YENİ ÜYE", title: "Unvan", desc: "", isVisible: true, img: "" };
                        setSiteContent({...siteContent, team: [...siteContent.team, newMember]});
                      }} className="bg-white/10 hover:bg-[#facc15] text-white hover:text-[#0B0F1A] font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
                        <Plus size={16} /> <span>Yeni Üye Ekle</span>
                      </button>
                    </div>
                    {siteContent?.team?.map((member, idx) => (
                      <div key={member.id} className={`glass p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8 border ${member.isVisible ? 'border-white/10' : 'border-red-500/30 opacity-75'}`}>
                        <div className="w-24 h-24 bg-gray-800 rounded-lg overflow-hidden shrink-0 relative group">
                          {member.img ? <img src={member.img} alt={member.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-500"><User size={30} /></div>}
                        </div>
                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">İSİM SOYİSİM</label>
                            <input value={member.name} onChange={(e) => { const newTeam = [...siteContent.team]; newTeam[idx].name = e.target.value; setSiteContent({...siteContent, team: newTeam}); }} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#facc15]" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">UNVAN / POZİSYON</label>
                            <input value={member.title} onChange={(e) => { const newTeam = [...siteContent.team]; newTeam[idx].title = e.target.value; setSiteContent({...siteContent, team: newTeam}); }} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#facc15] text-[#facc15]" />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">KISA AÇIKLAMA (OPSİYONEL)</label>
                            <input value={member.desc || ''} onChange={(e) => { const newTeam = [...siteContent.team]; newTeam[idx].desc = e.target.value; setSiteContent({...siteContent, team: newTeam}); }} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300 outline-none focus:border-[#facc15]" placeholder="Kişi hakkında kısa bilgi..." />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0 pt-4 md:pt-0 w-full md:w-auto justify-end">
                          <button onClick={() => { const newTeam = [...siteContent.team]; newTeam[idx].isVisible = !newTeam[idx].isVisible; setSiteContent({...siteContent, team: newTeam}); }} className={`p-3 rounded-lg flex items-center justify-center transition-all ${member.isVisible ? 'bg-green-500/20 text-green-400 hover:bg-green-500/40' : 'bg-red-500/20 text-red-400 hover:bg-red-500/40'}`} title="Sitede Göster / Gizle">
                            {member.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                          <button onClick={() => { if(window.confirm('Bu personeli silmek istediğinize emin misiniz?')) { const newTeam = siteContent.team.filter(m => m.id !== member.id); setSiteContent({...siteContent, team: newTeam}); } }} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <button onClick={() => showToast('Ekip bilgileri güncellendi!')} className="bg-[#facc15] text-[#0B0F1A] font-black px-8 py-3 rounded-lg flex items-center space-x-2 hover:scale-105 transition-all">
                        <Save size={18} /> <span>DEĞİŞİKLİKLERİ KAYDET</span>
                      </button>
                    </div>
                  </div>
                )}

                {adminTab === 'leads' && (
                  <div className="space-y-6 animate-fade-up">
                    {/* Search & Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass p-4 rounded-xl border border-white/5">
                      <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                          type="text" 
                          placeholder="İsim veya telefon ara..." 
                          value={leadSearch}
                          onChange={(e) => setLeadSearch(e.target.value)}
                          className="w-full bg-black/30 border border-white/10 pl-12 pr-4 py-3 rounded-lg text-sm font-bold outline-none focus:border-[#facc15]" 
                        />
                      </div>
                      <div className="flex items-center space-x-3 w-full md:w-auto">
                        <Filter size={18} className="text-gray-500" />
                        <select 
                          value={leadStatusFilter}
                          onChange={(e) => setLeadStatusFilter(e.target.value)}
                          className="flex-1 md:w-48 bg-black/30 border border-white/10 px-4 py-3 rounded-lg text-xs font-bold outline-none focus:border-[#facc15]"
                        >
                          <option value="All">Tüm Durumlar</option>
                          <option value="Yeni Başvuru">Yeni Başvuru</option>
                          <option value="Arandı">Arandı</option>
                          <option value="Evrak Bekleniyor">Evrak Bekleniyor</option>
                          <option value="İşleme Alındı">İşleme Alındı</option>
                          <option value="Tamamlandı">Tamamlandı</option>
                          <option value="İptal">İptal</option>
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <th className="p-4">Müşteri Bilgisi</th>
                            <th className="p-4">Hizmet / Ülke</th>
                            <th className="p-4">Kalite Skor</th>
                            <th className="p-4">Durum</th>
                            <th className="p-4">Tarih</th>
                            <th className="p-4 text-right">İşlem</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
                            <tr key={lead.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${lead.isNew ? 'bg-[#facc15]/5' : ''}`}>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  {lead.isNew && <span className="bg-[#facc15] text-black text-[8px] font-black px-1.5 py-0.5 rounded animate-pulse">YENİ</span>}
                                  <p className="font-bold text-white uppercase tracking-tight">{lead.name}</p>
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-[10px] text-gray-500 font-mono tracking-tighter">{lead.trackingId || 'ID YOK'}</p>
                                  <span className="text-gray-700">•</span>
                                  <p className="text-[10px] text-gray-400 font-mono">{lead.phone}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <p className="text-[#facc15] font-bold text-sm">{lead.service}</p>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{lead.country}</p>
                              </td>
                              <td className="p-4">
                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-tighter ${getLeadQuality(lead).color}`}>
                                  {getLeadQuality(lead).label}
                                </span>
                              </td>
                              <td className="p-4">
                                <select 
                                  value={lead.status}
                                  onChange={(e) => { 
                                    const newLeads = leads.map(l => l.id === lead.id ? {...l, status: e.target.value, isNew: false} : l);
                                    setLeads(newLeads); 
                                    showToast('Durum güncellendi'); 
                                  }}
                                  className="bg-[#0B0F1A] border border-white/10 text-xs font-bold px-3 py-2 rounded-lg outline-none focus:border-[#facc15]"
                                >
                                  <option value="Yeni Başvuru">Yeni Başvuru</option>
                                  <option value="Arandı">Arandı</option>
                                  <option value="Evrak Bekleniyor">Evrak Bekleniyor</option>
                                  <option value="İşleme Alındı">İşleme Alındı</option>
                                  <option value="Tamamlandı">Tamamlandı</option>
                                  <option value="İptal">İptal</option>
                                </select>
                              </td>
                              <td className="p-4 text-[11px] text-gray-400 font-medium">
                                <div className="flex flex-col">
                                  <span>{lead.date}</span>
                                  <span className="text-[9px] text-gray-600 font-mono uppercase tracking-widest mt-0.5">{lead.time || '--:--'}</span>
                                </div>
                              </td>
                              <td className="p-4 text-right space-x-2">
                                <button onClick={() => setSelectedLead(lead)} className="inline-flex p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all" title="Detaylar">
                                  <Eye size={16} />
                                </button>
                                <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Merhaba ${lead.name}, CMSVize'den ulaşıyoruz. Başvurunuzla ilgili...`)}`} target="_blank" rel="noreferrer" className="inline-flex p-2 bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-lg transition-all" title="WhatsApp'tan Yaz">
                                  <MessageSquare size={16} />
                                </a>
                                <button onClick={() => { if(window.confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) { setLeads(leads.filter(l => l.id !== lead.id)); } }} className="inline-flex p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan="6" className="p-20 text-center text-gray-600 font-black uppercase tracking-widest">
                                <div className="flex flex-col items-center space-y-4">
                                  <Search size={40} className="opacity-20" />
                                  <span>Henüz Veri Yok</span>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {adminTab === 'reviews' && (
                  <div className="space-y-6 animate-fade-up">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-gray-500 font-medium text-sm">Site üzerindeki müşteri geri bildirimlerini buradan yönetin.</p>
                      <button onClick={() => {
                        const newReview = { id: Date.now(), name: "YENİ MÜŞTERİ", visa: "Vize Türü", flag: "🌍", time: "Yeni", text: "Yorum içeriği...", likes: 0 };
                        setSiteContent({...siteContent, reviews: [newReview, ...(siteContent.reviews || [])]});
                      }} className="bg-white/10 hover:bg-[#facc15] text-white hover:text-[#0B0F1A] font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
                        <Plus size={16} /> <span>Yeni Yorum Ekle</span>
                      </button>
                    </div>
                    <div className="space-y-6">
                      {(siteContent?.reviews || []).map((review, idx) => (
                        <div key={review.id} className="glass p-6 rounded-xl space-y-6 border border-white/5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">MÜŞTERİ İSMİ</label>
                              <input value={review.name} onChange={(e) => { const newR = [...siteContent.reviews]; newR[idx].name = e.target.value; setSiteContent({...siteContent, reviews: newR}); }} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#facc15]" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">VİZE / ÜLKE (BAYRAK DAHİL)</label>
                              <div className="flex space-x-2">
                                <input value={review.flag} onChange={(e) => { const newR = [...siteContent.reviews]; newR[idx].flag = e.target.value; setSiteContent({...siteContent, reviews: newR}); }} className="w-12 bg-black/50 border border-white/10 px-2 py-2 rounded-lg text-center font-bold outline-none focus:border-[#facc15]" placeholder="🇩🇪" />
                                <input value={review.visa} onChange={(e) => { const newR = [...siteContent.reviews]; newR[idx].visa = e.target.value; setSiteContent({...siteContent, reviews: newR}); }} className="flex-1 bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#facc15] text-[#facc15]" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">BEĞENİ SAYISI / ZAMAN</label>
                              <div className="flex space-x-2">
                                <input type="number" value={review.likes} onChange={(e) => { const newR = [...siteContent.reviews]; newR[idx].likes = parseInt(e.target.value) || 0; setSiteContent({...siteContent, reviews: newR}); }} className="w-20 bg-black/50 border border-white/10 px-2 py-2 rounded-lg text-center font-bold outline-none focus:border-[#facc15]" />
                                <input value={review.time} onChange={(e) => { const newR = [...siteContent.reviews]; newR[idx].time = e.target.value; setSiteContent({...siteContent, reviews: newR}); }} className="flex-1 bg-black/50 border border-white/10 px-4 py-2 rounded-lg text-sm outline-none focus:border-[#facc15]" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">MÜŞTERİ YORUMU</label>
                            <textarea value={review.text} onChange={(e) => { const newR = [...siteContent.reviews]; newR[idx].text = e.target.value; setSiteContent({...siteContent, reviews: newR}); }} className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-lg text-sm text-gray-300 outline-none focus:border-[#facc15] min-h-[80px]" />
                          </div>
                          <div className="flex justify-end">
                            <button onClick={() => { if(window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) { const newR = siteContent.reviews.filter(r => r.id !== review.id); setSiteContent({...siteContent, reviews: newR}); } }} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition-all text-xs font-bold flex items-center space-x-2">
                              <Trash2 size={14} /> <span>Yorumu Kaldır</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <button onClick={() => showToast('Yorumlar başarıyla kaydedildi!')} className="bg-[#facc15] text-[#0B0F1A] font-black px-8 py-3 rounded-lg flex items-center space-x-2 hover:scale-105 transition-all">
                        <Save size={18} /> <span>YORUMLARI YAYINLA</span>
                      </button>
                    </div>
                  </div>
                )}
                {adminTab === 'settings' && (
                  <div className="space-y-8 animate-fade-up max-w-2xl">
                    <div className="glass p-8 rounded-xl space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">WhatsApp Numarası (Uluslararası Format)</label>
                        <input 
                          value={siteSettings?.whatsapp || ''} 
                          onChange={(e) => setSiteSettings({...siteSettings, whatsapp: e.target.value})}
                          className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-lg font-bold text-white outline-none focus:border-[#facc15]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Instagram Kullanıcı Adı</label>
                        <input 
                          value={siteSettings?.instagram || ''} 
                          onChange={(e) => setSiteSettings({...siteSettings, instagram: e.target.value})}
                          className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-lg font-bold text-white outline-none focus:border-[#facc15]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Site Kısa Açıklaması (Footer SEO)</label>
                        <textarea 
                          value={siteSettings?.desc || ''} 
                          onChange={(e) => setSiteSettings({...siteSettings, desc: e.target.value})}
                          className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-lg text-sm text-gray-300 outline-none focus:border-[#facc15] min-h-[100px]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <button onClick={() => showToast('Site ayarları kaydedildi!')} className="bg-[#facc15] text-[#0B0F1A] font-black px-8 py-3 rounded-lg flex items-center space-x-2 hover:scale-105 transition-all">
                        <Save size={18} /> <span>AYARLARI KAYDET</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
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
              <form onSubmit={handlePortalLogin} className="space-y-4">
                <input 
                  required 
                  placeholder="T.C. Kimlik / Pasaport No" 
                  value={portalUser}
                  onChange={(e) => setPortalUser(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 px-6 py-4 rounded-lg font-bold focus:border-[#facc15] outline-none" 
                />
                <input 
                  required 
                  type="password" 
                  placeholder="Şifre" 
                  value={portalPass}
                  onChange={(e) => setPortalPass(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 px-6 py-4 rounded-lg font-bold focus:border-[#facc15] outline-none" 
                />
                <button type="submit" className="w-full bg-[#facc15] text-black font-black py-4 rounded-lg text-lg hover:scale-[1.02] transition-transform">GİRİŞ YAP</button>
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
      {!currentPage.startsWith('admin') && (
        <footer className="py-24 border-t border-white/5 bg-[#0B0F1A]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-16">
              <div className="space-y-6">
                <div onClick={() => setCurrentPage('home')} className="flex items-center space-x-3 group cursor-pointer">
                  {logoImg ? <img src={logoImg} alt="Logo" className="h-14 w-auto" /> : <span>CMSVize</span>}
                </div>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs uppercase tracking-tighter italic">
                  {siteSettings?.desc || "Avrupa'da kariyer ve yaşam için profesyonel vize ve danışmanlık köprünüz."}
                </p>
                <div className="flex space-x-4 pt-4">
                  <a href={`https://www.instagram.com/${siteSettings?.instagram || "cmsprime"}/`} target="_blank" rel="noreferrer" className="w-10 h-10 glass flex items-center justify-center rounded-lg hover:text-[#0B0F1A] hover:bg-[#facc15] hover:border-[#facc15] transition-all group">
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
              <div className="space-y-6">
                <h4 className="text-[#facc15] font-black text-xs tracking-[0.2em] uppercase">Yasal</h4>
                <ul className="space-y-4 font-bold text-sm text-gray-400">
                  <li><button onClick={() => setCurrentPage('kvkk')} className="hover:text-white transition-colors uppercase tracking-tighter italic text-left">KVKK Aydınlatma Metni</button></li>
                  <li><button onClick={() => setCurrentPage('privacy')} className="hover:text-white transition-colors uppercase tracking-tighter italic text-left">Gizlilik Politikası</button></li>
                  <li><button onClick={() => setCurrentPage('terms')} className="hover:text-white transition-colors uppercase tracking-tighter italic text-left">Kullanım Şartları</button></li>
                </ul>
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
            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">© 2026 CMSVize Danışmanlık. Tüm hakları saklıdır.</p>
              <div className="flex space-x-6 text-[10px] font-black text-gray-600 uppercase tracking-widest"><span>Designed for Excellence</span></div>
            </div>
          </div>
        </footer>
      )}

      {/* WHATSAPP FLOAT - ENHANCED */}
      {!currentPage.startsWith('admin') && (
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
      )}

      {/* LEAD DETAILS MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-[#0B0F1A] border border-white/10 p-10 rounded-2xl w-full max-w-lg relative shadow-2xl animate-scale-up">
            <X size={24} className="absolute top-6 right-6 cursor-pointer text-gray-500 hover:text-white" onClick={() => setSelectedLead(null)} />
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${getLeadQuality(selectedLead).color}`}>
                    {getLeadQuality(selectedLead).label}
                  </span>
                  <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">ID: {selectedLead.trackingId || `#${selectedLead.id}`}</span>
                  <span className="bg-white/5 text-gray-400 text-[9px] px-2 py-1 rounded uppercase tracking-widest font-black">{selectedLead.source || 'BİLİNMİYOR'}</span>
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">{selectedLead.name}</h3>
                <p className="text-[#facc15] font-bold text-lg">{selectedLead.service} - {selectedLead.country}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Telefon</p>
                  <p className="font-bold text-white">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Tarih</p>
                  <p className="font-bold text-white">{selectedLead.date}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Müşteri Notu</p>
                <div className="bg-white/5 p-4 rounded-xl text-gray-400 text-sm italic border border-white/5">
                  {selectedLead.note || "Herhangi bir not eklenmemiş."}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <a href={`tel:${selectedLead.phone}`} className="bg-white/5 border border-white/10 hover:border-[#facc15] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all">
                  <Phone size={18} /> <span>HEMEN ARA</span>
                </a>
                <a href={`https://wa.me/${selectedLead.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Merhaba ${selectedLead.name}, CMSVize'den ulaşıyoruz.`)}`} target="_blank" rel="noreferrer" className="bg-[#25D366] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 hover:scale-[1.02] transition-transform">
                  <MessageSquare size={18} /> <span>WHATSAPP</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAKE LIVE POPUP */}
      {!currentPage.startsWith('admin') && (
        <div className={`fixed bottom-10 left-10 z-50 glass px-8 py-5 rounded-lg flex items-center space-x-5 transition-all duration-700 shadow-2xl border border-white/10 ${showPopup ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
          <div className="w-12 h-12 bg-[#facc15]/20 rounded-md flex items-center justify-center text-[#facc15]"><Users size={24} /></div>
          <div>
            <p className="text-base font-black italic tracking-tighter">{popupContent}</p>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Hızlı Başvuru</p>
          </div>
          <button onClick={() => setShowPopup(false)} className="ml-4 text-gray-500 hover:text-white transition-colors"> <X size={20} /> </button>
        </div>
      )}

      {/* WIZARD MODAL (UYGUNLUK TESTİ) */}
      {!currentPage.startsWith('admin') && (
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
                    
                    // Admin Panele Kaydet
                    const newLead = {
                      id: Date.now(),
                      name: wizardData.name,
                      phone: wizardData.phone,
                      country: wizardData.country,
                      service: `Wizard: ${wizardData.job}`,
                      date: new Date().toISOString().split('T')[0],
                      status: "Yeni Başvuru",
                      note: "Uygunluk testinden geldi.",
                      isNew: true
                    };
                    setLeads([newLead, ...leads]);
                    playNotificationSound();
                    showToast('Yeni Başvuru (Wizard) Alındı!');

                    setShowWizard(false); 
                    setWizardStep(1);
                    setFormSuccess(true); // Wizard sonrası da başarı ekranına gitsin veya form success göstersin
                    scrollToForm();
                  }} className="w-full bg-[#facc15] text-black font-black py-5 rounded-lg text-xl hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2 mt-4">
                    <span>SONUCU İSTE</span>
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { display: flex; width: fit-content; animation: scroll 30s linear infinite; }
      `}</style>

      {/* TRACKING MODAL */}
      {showTrackingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0B0F1A]/90 backdrop-blur-xl animate-fade-in">
          <div className="glass max-w-lg w-full p-8 lg:p-12 rounded-3xl border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] relative animate-fade-up">
            <button 
              onClick={() => { setShowTrackingModal(false); setTrackingResult(null); setTrackingError(false); setTrackingCode(''); }}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            <div className="space-y-8">
              <div className="text-center space-y-2">
                <Search className="w-12 h-12 text-[#facc15] mx-auto mb-4" />
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Başvuru <span className="text-[#facc15]">Sorgulama</span></h3>
                <p className="text-gray-400 text-sm">Pasaport numaranız veya takip kodunuzu girin.</p>
              </div>

              {!trackingResult && !trackingError ? (
                <form onSubmit={handleTrack} className="space-y-4">
                  <input 
                    autoFocus
                    placeholder="Örn: 545... veya Takip No" 
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    className="w-full bg-black/50 border-2 border-white/10 px-6 py-5 rounded-xl font-bold text-xl focus:border-[#facc15] outline-none transition-all placeholder:text-gray-700"
                  />
                  <button type="submit" className="w-full bg-[#facc15] text-black font-black py-5 rounded-xl text-lg hover:scale-[1.02] transition-transform">SORGULA</button>
                </form>
              ) : trackingResult ? (
                <div className="space-y-8 animate-fade-up">
                  <div className="bg-black/40 p-6 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Müşteri</span>
                      <span className="text-[#facc15] font-black text-xs uppercase italic">{trackingResult.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Güncel Durum</span>
                      <span className={`font-black text-sm uppercase ${trackingResult.status === 'İptal' ? 'text-red-500' : 'text-green-500'}`}>{trackingResult.status}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="pt-4 space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span>Süreç İlerlemesi</span>
                        <span>%{getStatusProgress(trackingResult.status)}</span>
                      </div>
                      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="h-full bg-gradient-to-r from-[#facc15] to-yellow-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                          style={{ width: `${getStatusProgress(trackingResult.status)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => { setTrackingResult(null); setTrackingCode(''); }} className="glass py-4 rounded-xl font-bold text-sm hover:bg-white/5 transition-all">YENİ SORGULAMA</button>
                    <a 
                      href={`https://wa.me/${WHATSAPP_NUMBER_SAFE}?text=${encodeURIComponent(`Merhaba, Başvurumun durumu (${trackingResult.status}) hakkında detaylı bilgi almak istiyorum. İsim: ${trackingResult.name}`)}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-[#25D366] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 hover:scale-[1.02] transition-transform"
                    >
                      <MessageCircle size={18} />
                      <span>DESTEK AL</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-up">
                  <div className="bg-red-500/10 p-8 rounded-2xl border border-red-500/20">
                    <p className="text-red-500 font-bold">Kayıt bulunamadı, lütfen danışmanınızla iletişime geçin.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setTrackingError(false)} className="glass py-4 rounded-xl font-bold text-sm">TEKRAR DENE</button>
                    <a 
                      href={`https://wa.me/${WHATSAPP_NUMBER_SAFE}?text=${encodeURIComponent(`Merhaba, Başvurumu sorguladım ancak kayıt bulunamadı. Yardımcı olur musunuz? Sorgulanan Kod: ${trackingCode}`)}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-[#25D366] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2"
                    >
                      <MessageCircle size={18} />
                      <span>WHATSAPP DESTEK</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;