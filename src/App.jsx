import { useState, useEffect, useRef } from 'react';
import { Turnstile } from "react-turnstile";
import { supabase } from './lib/supabase';
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
  Filter,
  ClipboardList,
  Folder,
  Send
} from 'lucide-react';

// Custom Icons
const InstagramIcon = ({ size = 18, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// Assets - Using the actual filenames from disk
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
import litvanyaPdf from './assets/CMSVize_Litvanya_Rehberi_2026_PRO.pdf';
import { GlowCard } from './components/ui/spotlight-card';

// --- CONFIG & DATABASE ---
const WHATSAPP_NUMBER_SAFE = typeof import.meta !== "undefined" && import.meta.env?.VITE_WHATSAPP_NUMBER 
  ? import.meta.env.VITE_WHATSAPP_NUMBER 
  : "905459918268";
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

const POPUPS = [
  "Ahmet K. – Almanya depo işi başvurusu yaptı",
  "Mehmet Y. – Tır şoförlüğü için başvurdu",
  "Hasan A. – A1 transfer sürecine başladı",
  "Burak S. – Polonya lojistik başvurusu yaptı",
  "Sinan G. – 2 yıllık oturum onaylandı",
  "Yusuf E. – Hollanda fabrika işi başvurusu",
  "Mert A. – Danışman önerisi ile sürece başladı"
];

const App = () => {
  // --- CORE STATES ---
  const [currentPage, setCurrentPage] = useState(() => {
    if (window.location.pathname === '/admin-panel-cms') return 'admin-login';
    return 'home';
  });

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
  const [activeFaq, setActiveFaq] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Counter States
  const [counts, setCounts] = useState({ success: 0, approval: 0, years: 0, privacy: 0 });
  const [stats, setStats] = useState({ success: 0, clients: 0, countries: 0 });

  // PDF Lead Magnet States
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfFormData, setPdfFormData] = useState({
    name: '', phone: '', targetCountry: 'Litvanya', workField: '', note: '', terms: false, hp: ''
  });
  const [isPdfSubmitting, setIsPdfSubmitting] = useState(false);
  const [pdfFormSuccess, setPdfFormSuccess] = useState(false);

  // New States for Features
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({ job: '', country: '', name: '', phone: '' });

  const [portalLoggedIn, setPortalLoggedIn] = useState(false);
  const [portalUser, setPortalUser] = useState('');
  const [portalPass, setPortalPass] = useState('');

  // Admin States
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminTab, setAdminTab] = useState('dashboard');

  // Content & Data States
  const [siteContent, setSiteContent] = useState(SITE_DATABASE);
  const [leads, setLeads] = useState([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [isTestimonialsLoading, setIsTestimonialsLoading] = useState(true);
  const [showNewReviewForm, setShowNewReviewForm] = useState(false);
  const [newReviewData, setNewReviewData] = useState({
    name: '', country: 'Almanya', visa_type: '', comment: '', likes: 0, comments_count: 0, time_ago: '3 gün önce', is_active: true
  });

  // Blog States
  const [blogPosts, setBlogPosts] = useState([]);
  const [isBlogLoading, setIsBlogLoading] = useState(true);
  const [showNewBlogForm, setShowNewBlogForm] = useState(false);
  const [newBlogData, setNewBlogData] = useState({
    title: '', slug: '', summary: '', content: '', category: 'Vize Rehberi', cover_image: '', is_published: true
  });
  const [selectedBlogSlug, setSelectedBlogSlug] = useState(null);
  
  const [siteSettings, setSiteSettings] = useState({
    title: "CMSVize | Avrupa Kapısı Açılıyor",
    phone: "905459918268",
    whatsapp: "905459918268"
  });

  // Toast & Tracking States
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState(false);

  // Security States
  const [isTurnstileVerified, setIsTurnstileVerified] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [submittedTrackingId, setSubmittedTrackingId] = useState('');
  const [cookieConsent, setCookieConsent] = useState(() => localStorage.getItem('cookieConsent'));
  const [scrolled, setScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    if (currentPage === 'home' && statsVisible) {
      const timer = setInterval(() => {
        setCounts(prev => ({
          success: Math.min(prev.success + 11, 500),
          approval: Math.min(prev.approval + 2, 95),
          years: Math.min(prev.years + 1, 3),
          privacy: Math.min(prev.privacy + 5, 100)
        }));
      }, 30);
      return () => clearInterval(timer);
    }
  }, [currentPage, statsVisible]);

  // Navbar Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Scroll Reveal
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          if (entry.target.id === 'stats-section') setStatsVisible(true);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [currentPage]);

  // Fetch data from Supabase
  const fetchAllData = async () => {
    setIsLoadingLeads(true);
    setIsTestimonialsLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formattedLeads = data.map(item => ({
          id: item.id,
          trackingId: item.tracking_code || `CMS-${item.id}`,
          name: item.full_name || '---',
          phone: item.phone || '---',
          country: item.target_country || '---',
          service: item.service_type || '---',
          date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : '---',
          time: item.created_at ? new Date(item.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '---',
          status: item.status || 'Yeni Başvuru',
          note: item.note || '---',
          source: item.source || "Site Formu",
          lead_quality: item.lead_quality || "Yeni",
          isNew: false
        }));
        setLeads(formattedLeads);
      }

      const { data: testData, error: testError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: false });
        
      if (!testError && testData) {
        setTestimonials(testData);
      } else if (testError) {
        console.error("TESTIMONIALS ERROR:", testError);
        setTestimonials([
          { id: 1, name: "Caner T.", visa_type: "Almanya Ulusal Vize (D Tipi)", country: "Almanya", time_ago: "3 gün önce", comment: "Almanya'daki işverenimle anlaştıktan sonra tüm süreci CMSVize yönetti. Dosya hazırlığı o kadar profesyoneldi ki konsoloslukta hiç soru bile sormadılar.", likes: 14, comments_count: 0, is_active: true },
          { id: 2, name: "Burak E.", visa_type: "Polonya D Tipi Ulusal Vize", country: "Polonya", time_ago: "1 hafta önce", comment: "Polonya vizesi gibi yoğun bir süreçte CMSVize ekibinin kurumsal ve dürüst desteği için teşekkür ederim. Sayelerinde iş başı tarihim aksamadı.", likes: 14, comments_count: 0, is_active: true },
          { id: 3, name: "Ayşe K.", visa_type: "Litvanya Oturum İzni", country: "Litvanya", time_ago: "1 hafta önce", comment: "Litvanya çalışma vizem CMSVize'nin titiz yönlendirmeleri sayesinde kısa sürede onaylandı. Randevu alımından evrak çevirisine kadar her şey kusursuzdu.", likes: 14, comments_count: 0, is_active: true }
        ]);
      }

      const { data: blogData, error: blogError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('id', { ascending: false });
        
      if (!blogError && blogData) {
        setBlogPosts(blogData);
      }

      /* 
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
        
      if (!settingsError && settingsData) {
        setSiteSettings({
          title: settingsData.title || "CMSVize",
          phone: settingsData.phone || "",
          whatsapp: settingsData.whatsapp || ""
        });
        if (settingsData.title) document.title = settingsData.title;
      }
      */
    } catch (err) {
      console.error("Error fetching data from Supabase:", err);
    } finally {
      setIsLoadingLeads(false);
      setIsTestimonialsLoading(false);
      setIsBlogLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAllData();
  }, []);

  const handlePortalLogin = (e) => {
    e.preventDefault();
    const portalUserEnv = import.meta.env.VITE_PORTAL_USER || 'cmsvize';
    const portalPassEnv = import.meta.env.VITE_PORTAL_PASS || 'cms2026cms681001';
    if (portalUser === portalUserEnv && portalPass === portalPassEnv) {
      setPortalLoggedIn(true);
    } else {
      alert('Hatalı Bilgi');
    }
  };

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
    if(e) e.preventDefault();
    const adminUserEnv = import.meta.env.VITE_ADMIN_USER || 'cms_master_admin';
    const adminPassEnv = import.meta.env.VITE_ADMIN_PASS || 'CMS_vize_2026_@Admin_!Secure';
    if (adminUser === adminUserEnv && adminPass === adminPassEnv) {
      localStorage.setItem('adminAuth', 'true');
      setAdminLoggedIn(true);
      setCurrentPage('admin-dashboard');
    } else {
      alert('Güvenlik İhlali: Kimlik doğrulanamadı.');
      setCurrentPage('home');
      window.location.pathname = '/';
    }
  };

  const formRef = useRef(null);

  // Path Detection and Auth Check
  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    const isLoggedIn = auth === 'true';
    if (isLoggedIn) {
      setAdminLoggedIn(true);
    }

    const path = window.location.pathname;
    if (path === '/admin-panel-cms') {
      if (isLoggedIn) {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('admin-login');
      }
    } else if (path === '/portal') {
      setCurrentPage('portal');
    } else if (path === '/blog') {
      setCurrentPage('blog');
    } else if (path.startsWith('/blog/')) {
      setCurrentPage('blog_detail');
      setSelectedBlogSlug(path.replace('/blog/', ''));
    } else if (path === '/cerez-politikasi') {
      setCurrentPage('cookies');
    } else if (path === '/rehberler') {
      setCurrentPage('guides_main');
    } else if (path === '/rehberler/litvanya') {
      setCurrentPage('guide_litvanya');
    } else if (path === '/rehberler/almanya') {
      setCurrentPage('guide_almanya');
    } else if (path === '/rehberler/polonya') {
      setCurrentPage('guide_polonya');
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
      blog: "Vize Rehberi & Blog | Avrupa İş İlanları 2026",
      portal: "Müşteri Portalı | CMSVize",
      cookies: "Çerez Politikası | CMSVize",
      guides_main: "Avrupa Ülke Rehberleri | Yaşam ve Çalışma Şartları 2026",
      guide_litvanya: "Litvanya Yaşam Rehberi & İş İlanları 2026 | CMSVize",
      guide_almanya: "Almanya Çalışma Rehberi & KOD95 Vizesi 2026 | CMSVize",
      guide_polonya: "Polonya Çalışma Rehberi & D Tipi Vize 2026 | CMSVize"
    };

    const descriptions = {
      home: "CMSVize ile Avrupa'da yeni bir hayat! Litvanya, Polonya, Almanya ve Fransa vize süreçleri, çalışma izinleri ve oturum kartı başvurularında profesyonel danışmanlık.",
      guide_litvanya: "2026 Litvanya yaşam maliyetleri, maaşlar ve 2 yıllık oturum kartı süreci hakkında her şey. Litvanya'da çalışmak ve yaşamak için rehberimizi inceleyin.",
      guide_almanya: "Almanya'da tır şoförlüğü, KOD95 belgesi ve nitelikli çalışan vizesi süreci. 2026 Almanya maaşları ve yaşam şartları güncel rehber.",
      guide_polonya: "Polonya D tipi ulusal vize, çalışma izinleri ve iş ilanları. 2026 Polonya yaşam maliyeti ve vize başvuru adımları.",
      blog: "Avrupa vize süreçleri, Litvanya oturum kartı güncel mevzuatları ve yurtdışı iş ilanları hakkında en güncel blog yazıları."
    };

    const keywords = {
      home: "vize danışmanlığı, avrupa iş ilanları, litvanya oturum kartı, polonya çalışma izni, almanya tır şoförü vizesi, schengen vizesi",
      guide_litvanya: "litvanya iş ilanları, litvanya oturum izni, litvanya maaşlar 2026, litvanya yaşam maliyeti, vilnius iş imkanları",
      guide_almanya: "almanya tır şoförü maaşları, almanya kod95 vizesi, almanya çalışma izni, almanya nitelikli çalışan vizesi",
      guide_polonya: "polonya çalışma vizesi, polonya d tipi vize, polonya iş ilanları 2026, polonya oturum izni"
    };

    document.title = titles[currentPage] || "CMSVize | Almanya, Polonya, Litvanya, Hollanda ve Fransa Vize Uzmanı";
    
    // Dynamic Meta Tags
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = descriptions[currentPage] || descriptions.home;

    let metaKeys = document.querySelector('meta[name="keywords"]');
    if (!metaKeys) {
      metaKeys = document.createElement('meta');
      metaKeys.name = "keywords";
      document.head.appendChild(metaKeys);
    }
    metaKeys.content = keywords[currentPage] || keywords.home;

    // Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + (currentPage === 'home' ? '' : `/${currentPage.replace('_', '/')}`);

    // JSON-LD Schema Injection
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "CMSVize Danışmanlık",
      "image": window.location.origin + "/assets/logo.png",
      "url": window.location.origin,
      "telephone": "+905459918268",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Zafer Mahallesi, Bankalar Caddesi No:12",
        "addressLocality": "Aksaray",
        "addressCountry": "TR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 38.3687,
        "longitude": 34.0254
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "sameAs": [
        "https://www.instagram.com/cmsprime/"
      ]
    };

    if (currentPage === 'home') {
      schemaData.description = descriptions.home;
    }

    let schemaScript = document.getElementById('json-ld-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'json-ld-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.text = JSON.stringify(schemaData);

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
      if (currentSuccess < targetSuccess) { currentSuccess += 1; }
      if (currentClients < targetClients) { currentClients += Math.ceil(targetClients / 100); }
      if (currentCountries < targetCountries) { currentCountries += 1; }
      
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

  useEffect(() => {
    const interval = setInterval(() => {
      const randomPopup = POPUPS[Math.floor(Math.random() * POPUPS.length)];
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
    // Memory-only rate limiting for this session
    if (!window.cms_sub_history) window.cms_sub_history = [];
    const recent = window.cms_sub_history.filter(t => now - t < 600000);
    if (recent.length >= 5) {
      return { ok: false, msg: "Çok fazla başvuru denemesi. Lütfen 10 dakika sonra tekrar deneyin." };
    }
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

  const filteredLeads = (leads || []).filter(l => {
    const searchLow = (leadSearch || '').toLowerCase();
    const matchesSearch = l.name?.toLowerCase().includes(searchLow) || l.phone?.includes(leadSearch);
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
    } catch {
      console.warn("Audio context not supported or blocked");
    }
  };

  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault();
    
    console.log("SUBMIT STARTED");
    console.log("FORM DATA", formData);
    console.log("TURNSTILE TOKEN", turnstileToken);
    console.log("SUPABASE URL", import.meta.env.VITE_SUPABASE_URL);
    console.log("SUPABASE KEY EXISTS", !!import.meta.env.VITE_SUPABASE_ANON_KEY);

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

    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      showToast("Supabase ortam değişkenleri eksik.");
      return;
    }

    setIsSubmitting(true);

    try {
      const trackingId = `CMS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedTrackingId(trackingId);

      const applicationData = {
        tracking_code: trackingId,
        full_name: formData.name,
        phone: formData.phone,
        target_country: formData.country,
        service_type: formData.workField,
        note: formData.message || "Hızlı başvuru",
        status: "Yeni Başvuru",
        lead_quality: "Yeni",
        source: "Site Formu"
      };

      const { error } = await supabase
        .from("applications")
        .insert([applicationData]);

      console.log("SUPABASE INSERT RESPONSE", { error });

      if (error) {
        throw error;
      }

      console.log("APPLICATION INSERT SUCCESS");
      console.log("SHOWING SUCCESS SCREEN");

      // Scroll to form to ensure success message is visible
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Refresh leads in background
      try {
        await fetchAllData();
      } catch (f) {
        console.warn("Background fetch failed:", f);
      }

      // Finally set success state at the very end to avoid premature unmounting
      setFormSuccess(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error("SUPABASE INSERT ERROR:", error);
      setIsSubmitting(false);
      showToast("Başvuru kaydedilemedi. Lütfen tekrar deneyin.");
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

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    if (pdfFormData.hp) return;
    
    const nameClean = pdfFormData.name.trim();
    if (nameClean.length < 3) { showToast("Ad soyad en az 3 karakter olmalıdır."); return; }
    if (/^\d+$/.test(nameClean)) { showToast("Ad soyad sadece rakamlardan oluşamaz."); return; }
    if (/(.)\1{4,}/.test(nameClean)) { showToast("Lütfen geçerli bir ad soyad girin."); return; }
    
    const phoneClean = pdfFormData.phone.replace(/[^\d]/g, '');
    if (phoneClean.length < 10) { showToast("Telefon numarası en az 10 rakamdan oluşmalıdır."); return; }
    if (/(.)\1{4,}/.test(phoneClean)) { showToast("Lütfen geçerli bir telefon numarası girin."); return; }
    
    if (!pdfFormData.terms) { showToast("Lütfen KVKK/Şartlar kutucuğunu işaretleyin."); return; }

    setIsPdfSubmitting(true);

    try {
      const trackingId = `PDF-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const applicationData = {
        tracking_code: trackingId,
        full_name: pdfFormData.name,
        phone: pdfFormData.phone,
        target_country: pdfFormData.targetCountry || "Litvanya",
        service_type: pdfFormData.workField || "Belirtilmedi",
        note: pdfFormData.note || "PDF Rehber Talebi",
        status: "Yeni Başvuru",
        lead_quality: "Sıcak Lead",
        source: "Litvanya PDF Rehberi"
      };

      const { error } = await supabase.from("applications").insert([applicationData]);
      if (error) throw error;

      await fetchAllData();
      
      setPdfFormSuccess(true);
      showToast('Rehberiniz hazırlanıyor...');
      setTimeout(() => {
        window.open(litvanyaPdf, '_blank');
        setShowPdfModal(false);
        setPdfFormSuccess(false);
        setPdfFormData({ name: '', phone: '', targetCountry: 'Litvanya', workField: '', note: '', terms: false, hp: '' });
      }, 2500);
      
    } catch (err) {
      console.error("PDF Lead Error:", err);
      showToast("Rehber gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsPdfSubmitting(false);
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

  const handleTrack = async (e) => {
    e.preventDefault();
    setTrackingError(false);
    setTrackingResult(null);
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .or(`tracking_code.ilike.%${trackingCode}%,phone.ilike.%${trackingCode}%,full_name.ilike.%${trackingCode}%`)
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setTrackingResult({
          id: data.id,
          trackingId: data.tracking_code || `CMS-${data.id}`,
          name: data.full_name || '---',
          phone: data.phone || '---',
          country: data.target_country || '---',
          service: data.service_type || '---',
          status: data.status || 'Yeni Başvuru',
          date: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : '---',
        });
      } else {
        setTrackingError(true);
      }
    } catch (err) {
      console.error("Tracking error:", err);
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

return (
    <div className="min-h-screen text-white font-sans selection:bg-yellow-400 selection:text-black overflow-x-hidden" style={{ backgroundColor: darkBg }}>
      {/* Visual Layout Surgeon - Enhanced CSS */}
      <style>{`
        @keyframes fade-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .glass { background: rgba(255, 255, 255, 0.04); backdrop-filter: blur(40px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); }
        .text-gradient { background: linear-gradient(135deg, #fff 0%, #facc15 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        /* Scroll Reveal */
        .reveal-on-scroll { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-left { opacity: 0; transform: translateX(-30px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-active { opacity: 1 !important; transform: translate(0, 0) !important; }
        
        /* Hero Sequence */
        .hero-slide-in { opacity: 0; transform: translateX(-30px); animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideIn { to { opacity: 1; transform: translateX(0); } }

        /* Mobile Performance Optimization - Critical Fixes */
        @media (max-width: 768px) {
          body { overflow-x: hidden; }
          img, video { max-width: 100%; height: auto; }
          .container { padding: 0 16px; }
          section { padding: 40px 16px; }

          .top-bar { display: none !important; }
          .glass { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important; }
          .reveal-on-scroll, .reveal-left { transition: opacity 0.5s ease-out !important; transform: none !important; }
          .hero-slide-in { animation: none !important; opacity: 1 !important; transform: none !important; }
          .animate-fade-up { animation: none !important; opacity: 1 !important; transform: none !important; }
          .shimmer { animation: none !important; }

          
          /* GlowCard (Spotlight) Aggressive Mobile Disable */
          [data-glow] {
            background-image: none !important;
            background-attachment: initial !important;
            filter: none !important;
            backdrop-filter: none !important;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3) !important;
          }
          [data-glow]::before,
          [data-glow]::after {
            display: none !important;
          }
          [data-glow] [data-glow] {
            display: none !important;
          }

          * { background-attachment: scroll !important; }
          
          .hero-title { font-size: clamp(28px, 8vw, 48px) !important; }

          /* Navbar & Logo Fix */
          nav { top: 0 !important; height: 64px !important; }
          .nav-logo-container { width: 72px !important; height: 72px !important; flex-shrink: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; }
          .nav-logo { max-width: 64px !important; width: 64px !important; height: auto !important; object-fit: contain !important; }
          
          /* Footer Logo Fix */
          .footer-logo { max-width: 120px !important; height: auto !important; }
        }


        .hero-img-container { position: relative; width: 100%; max-width: 620px; border-radius: 24px; overflow: hidden; border: 2px solid rgba(250, 204, 21, 0.2); box-shadow: 0 0 50px rgba(250, 204, 21, 0.1); transition: all 0.5s ease; }
        .hero-img-container:hover { border-color: rgba(250, 204, 21, 0.4); box-shadow: 0 0 70px rgba(250, 204, 21, 0.2); }
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

      {/* TOP CONTACT BAR */}
      {!currentPage.startsWith('admin') && (
        <div className="top-bar fixed top-0 left-0 w-full z-[60] bg-[#05070A] border-b border-white/5 h-10 flex items-center overflow-hidden px-6">
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center text-[9px] md:text-xs font-bold tracking-[0.05em] text-gray-300">
            <div className="flex items-center space-x-3 md:space-x-6">
              <span className="flex items-center space-x-1"><Phone size={12} className="text-[#facc15]" /> <span>+90 545 991 82 68</span></span>
              <span className="hidden sm:flex items-center space-x-1"><Mail size={12} className="text-[#facc15]" /> <span>info@cmsvize.com</span></span>
              <span className="hidden lg:flex items-center space-x-1"><Clock size={12} className="text-[#facc15]" /> <span>Pzt-Cum 09:00-18:00</span></span>
            </div>
            <div className="flex items-center space-x-3 md:space-x-6">
              <span className="flex items-center space-x-1"><MapPin size={12} className="text-[#facc15]" /> <span>TR Ofis: Aksaray</span></span>
              <span className="hidden xs:flex items-center space-x-1"><MapPin size={12} className="text-[#facc15]" /> <span>LT Ofis: Vilnius</span></span>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      {!currentPage.startsWith('admin') && (
        <nav className={`fixed top-10 left-0 w-full z-50 transition-all duration-300 h-20 flex items-center ${scrolled ? 'bg-[#0B0F1A]/80 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.3)] border-b border-white/5' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
            <div onClick={() => setCurrentPage('home')} className="nav-logo-container flex items-center group cursor-pointer">
              <img src={logoImg} alt="CMSVize - Avrupa Vize ve Çalışma İzni Danışmanlığı" className="nav-logo h-[50px] w-auto object-contain transition-transform group-hover:scale-105" loading="lazy" decoding="async" />
            </div>

            <div className="hidden lg:flex items-center space-x-10 font-bold text-xs tracking-[0.15em]">
              <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('hizmetler')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-[#facc15] transition-colors uppercase tracking-widest">HİZMETLER</button>
              <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('referanslar')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-[#facc15] transition-colors uppercase tracking-widest">REFERANSLAR</button>
              <button onClick={() => setCurrentPage('guides_main')} className={`hover:text-[#facc15] transition-colors uppercase tracking-widest ${['guides_main', 'guide_litvanya', 'guide_almanya', 'guide_polonya'].includes(currentPage) ? 'text-[#facc15]' : ''}`}>VİZE REHBERİ</button>
              <button onClick={() => setCurrentPage('portal')} className={`hover:text-[#facc15] transition-colors flex items-center space-x-1 uppercase tracking-widest ${currentPage === 'portal' ? 'text-[#facc15]' : ''}`}><User size={14} /><span>PORTAL</span></button>

              <div className="flex items-center space-x-4 border border-white/10 p-1.5 rounded-lg bg-[#131926]">
                <button onClick={() => setShowTrackingModal(true)} className="btn-corporate px-6 py-2.5 text-gray-300 hover:text-white font-black flex items-center space-x-2 transition-all hover:bg-white/5 rounded-md">
                  <Search size={16} className="text-[#0a66c2]" />
                  <span>BAŞVURU TAKİP</span>
                </button>
                <button onClick={scrollToForm} className="btn-corporate bg-[#facc15] text-[#0B0F1A] px-8 py-2.5 font-black rounded-md">
                  BAŞVURU BAŞLAT
                </button>
              </div>
            </div>

            <button className="lg:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </nav>
      )}

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0B0F1A] flex flex-col p-8 md:p-12 animate-fade-in lg:hidden overflow-y-auto">
          <div className="flex justify-between items-center mb-12">
            <img src={logoImg} alt="CMSVize - Mobil Menü" className="h-12 w-auto object-contain" />
            <X size={32} className="cursor-pointer text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)} />
          </div>

          <div className="flex flex-col space-y-6 flex-grow">
            <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); setTimeout(() => document.getElementById('hizmetler')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-3xl font-black italic tracking-tighter text-left hover:text-[#facc15] transition-colors border-b border-white/5 pb-4">HİZMETLER</button>
            <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); setTimeout(() => document.getElementById('referanslar')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-3xl font-black italic tracking-tighter text-left hover:text-[#facc15] transition-colors border-b border-white/5 pb-4">REFERANSLAR</button>
            <button onClick={() => { setCurrentPage('guides_main'); setMobileMenuOpen(false); }} className="text-3xl font-black italic tracking-tighter text-left hover:text-[#facc15] transition-colors border-b border-white/5 pb-4">VİZE REHBERİ</button>
            <button onClick={() => { setCurrentPage('blog'); setMobileMenuOpen(false); }} className="text-3xl font-black italic tracking-tighter text-left hover:text-[#facc15] transition-colors border-b border-white/5 pb-4">BLOG</button>
            <button onClick={() => { setCurrentPage('portal'); setMobileMenuOpen(false); }} className="text-3xl font-black italic tracking-tighter text-left hover:text-[#facc15] transition-colors border-b border-white/5 pb-4">PORTAL</button>
            <button onClick={() => { setShowTrackingModal(true); setMobileMenuOpen(false); }} className="text-3xl font-black italic tracking-tighter text-left hover:text-[#facc15] transition-colors border-b border-white/5 pb-4 flex items-center space-x-2">
              <Search size={28} className="text-[#0a66c2]" />
              <span>BAŞVURU TAKİP</span>
            </button>
          </div>
          
          <div className="mt-12">
            <button 
              onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); setTimeout(() => document.getElementById('basvuru')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              className="w-full bg-[#facc15] text-[#0B0F1A] py-6 rounded-xl font-black italic text-2xl uppercase tracking-tighter shadow-xl"
            >
              BAŞVURU BAŞLAT
            </button>
          </div>
        </div>
      )}

      {/* RENDER PAGES */}
      {currentPage === 'home' ? (
        <>
          {/* HERO SECTION */}
          <section className="relative pt-32 lg:pt-48 pb-16 lg:pb-32 px-4 md:px-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#facc15]/5 rounded-full blur-[150px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0a66c2]/5 rounded-full blur-[120px] -z-10"></div>
            
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-center">
                {/* Sol Kolon: İçerik */}
                <div className="lg:col-span-7 space-y-8 md:space-y-10">
                  <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full text-[#facc15] font-black text-[10px] md:text-xs tracking-widest uppercase shadow-inner hero-slide-in">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#facc15] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#facc15]"></span>
                    </span>
                    <span>Sınırlı Kontenjan • Bugün sadece 12 kişi kabul ediliyor</span>
                  </div>

                  <div className="space-y-6">
                    <h1 className="hero-title text-4xl lg:text-7xl font-black leading-[1.05] tracking-tighter italic uppercase hero-slide-in" style={{ animationDelay: '0.3s' }}>
                      2 Yıllık Litvanya <br />
                      <span className="text-[#facc15]">Oturum Kartı</span> <br />
                      <span className="text-2xl lg:text-5xl block mt-2 normal-case font-black opacity-90">ile Avrupa’da Çalışma Fırsatı</span>
                    </h1>
                    <p className="text-lg lg:text-2xl text-gray-400 max-w-2xl leading-relaxed font-medium hero-slide-in" style={{ animationDelay: '0.6s' }}>
                      Dil bilmeden Avrupa’da çalışma fırsatı. Tüm süreci uzman ekibimiz yönetir, siz sadece yola çıkarsınız.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 hero-slide-in" style={{ animationDelay: '0.9s' }}>
                    <button onClick={scrollToForm} className="w-full sm:w-auto btn-corporate bg-[#facc15] text-[#0B0F1A] px-10 py-5 font-black text-lg md:text-xl flex items-center justify-center space-x-3 group shadow-[0_10px_30px_rgba(250,204,21,0.2)]">
                      <span>ÜCRETSİZ BAŞVURU BAŞLAT</span>
                      <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                    <button onClick={() => setShowWizard(true)} className="w-full sm:w-auto btn-corporate glass px-10 py-5 font-black text-lg md:text-xl flex items-center justify-center space-x-3 hover:bg-white/10 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                      <BookOpen className="text-[#facc15]" />
                      <span>UYGUNLUK TESTİ</span>
                    </button>
                  </div>

                  {/* Güven Rakamları / Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/5">
                    {[
                      { label: "2 Yıl", text: "Oturum Kartı" },
                      { label: "6–12 Hf", text: "Ortalama Süre" },
                      { label: "27 Ülke", text: "Schengen Hakları" },
                      { label: "Ücretsiz", text: "Ön Değerlendirme" }
                    ].map((m, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-2xl font-black text-[#facc15] tracking-tighter italic">{m.label}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black leading-tight">{m.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sağ Kolon: Video / Görsel Alanı */}
                <div className="hidden lg:flex lg:col-span-5 justify-end animate-fade-up" style={{ animationDelay: '0.2s' }}>
                  <div className="w-full max-w-[500px] relative group">
                    <div className="absolute -inset-4 bg-[#facc15]/10 rounded-[32px] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="hero-img-container relative bg-[#0B0F1A] z-10 flex items-center justify-center">
                      <img src={SupportingImg} alt="CMSVize Hero" className="w-full h-full object-contain aspect-[4/5] lg:aspect-[4/5] shadow-2xl rounded-2xl" loading="lazy" />
                      <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-xl border border-white/10 backdrop-blur-md z-20 flex items-center justify-between pointer-events-none group-hover:translate-y-[-5px] transition-transform duration-500">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#facc15]">Resmi Süreç</p>
                          <p className="text-sm font-black text-white italic">Litvanya Operasyonlarımız</p>
                        </div>
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full border-2 border-[#131926] bg-[#0a66c2] flex items-center justify-center text-[10px] font-bold shadow-lg">LT</div>
                          <div className="w-8 h-8 rounded-full border-2 border-[#131926] bg-red-600 flex items-center justify-center text-[10px] font-bold shadow-lg">EU</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* GÜVEN İSTATİSTİKLERİ */}
          <section id="stats-section" className="py-20 bg-black border-y border-white/5 relative overflow-hidden reveal-on-scroll">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                <div className="space-y-2">
                  <p className="text-5xl lg:text-7xl font-black text-[#facc15] tracking-tighter italic">{counts.success}+</p>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white">Başarılı <br />Başvuru</p>
                </div>
                <div className="space-y-2">
                  <p className="text-5xl lg:text-7xl font-black text-[#facc15] tracking-tighter italic">%{counts.approval}+</p>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white">Onay <br />Oranı</p>
                </div>
                <div className="space-y-2">
                  <p className="text-5xl lg:text-7xl font-black text-[#facc15] tracking-tighter italic">{counts.years}+ YIL</p>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white">Sektör <br />Deneyimi</p>
                </div>
                <div className="space-y-2">
                  <p className="text-5xl lg:text-7xl font-black text-[#facc15] tracking-tighter italic">{counts.privacy}%</p>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white">Gizlilik <br />Güvencesi</p>
                </div>
              </div>
            </div>
          </section>

          {/* NEDEN BİZ? */}
          <section className="py-24 px-6 bg-[#0B0F1A] reveal-on-scroll">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">Neden <span className="text-[#facc15]">CMSVize?</span></h2>
                <div className="w-20 h-1.5 bg-[#facc15] mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  "Türkiye & Litvanya'da Fiziksel Ofis",
                  "%95+ Onay Oranı ile Kanıtlanmış Başarı",
                  "Anahtar Teslim Süreç Yönetimi",
                  "7/24 WhatsApp Destek Hattı",
                  "KVKK Uyumlu Veri Güvenliği",
                  "Uzman Hukuki Danışmanlık Desteği"
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-4 glass p-6 rounded-2xl border border-white/5 hover:border-[#facc15]/30 transition-all">
                    <div className="w-10 h-10 bg-[#facc15]/20 rounded-full flex items-center justify-center text-[#facc15] flex-shrink-0">
                      <CheckCircle2 size={24} />
                    </div>
                    <span className="font-bold text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>


          {/* STATS TICKER */}
          <div className="bg-[#facc15] border-y-4 border-[#0B0F1A] rotate-[-1deg] relative z-20 scale-105 shadow-2xl">
            <div style={{ overflow: 'hidden', width: '100%', padding: '20px 0' }}>
              <div
                className="cms-marquee-track"
                style={{ animation: 'cms-marquee-left 24s linear infinite', display: 'flex', width: 'max-content' }}
              >
                {[1, 2].map(i => (
                  <div key={i} style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
                    <div className="flex items-center space-x-12 px-6 text-[#0B0F1A] font-black italic text-2xl uppercase tracking-tighter">
                      <span>Avrupa'da Kariyer</span> <Star size={24} fill="currentColor" />
                      <span>A1 Transfer &amp; Sigorta</span> <Star size={24} fill="currentColor" />
                      <span>Fabrika &amp; Depo İşleri</span> <Star size={24} fill="currentColor" />
                      <span>2 Yıllık Oturum Kartı</span> <Star size={24} fill="currentColor" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PDF LEAD MAGNET SECTION */}
          <section className="py-24 px-6 bg-gradient-to-b from-[#0B0F1A] to-[#131926] relative overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#facc15]/10 via-transparent to-transparent opacity-50"></div>
            <div className="max-w-5xl mx-auto glass p-10 lg:p-16 rounded-3xl border border-[#facc15]/20 shadow-[0_0_50px_-12px_rgba(250,204,21,0.15)] relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="space-y-6 flex-1 text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-[#facc15]/10 border border-[#facc15]/20 px-4 py-1.5 rounded-full text-[#facc15] font-black text-[10px] tracking-widest uppercase">
                  <Star size={12} fill="currentColor" />
                  <span>ÜCRETSİZ PREMIUM İÇERİK</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter leading-tight">
                  2026 Litvanya 2 Yıllık <br />
                  <span className="text-[#facc15]">Oturum Kartı Rehberi</span>
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed font-medium max-w-xl">
                  Litvanya oturum kartı süreci, gerekli belgeler, Schengen hakları ve başvuru adımlarını içeren kapsamlı rehberi ücretsiz alın.
                </p>
                <div className="flex flex-wrap gap-3 pt-2 justify-center lg:justify-start">
                  <span className="bg-black/50 border border-white/10 px-3 py-1 rounded text-xs font-bold text-gray-400">PDF Formatında</span>
                  <span className="bg-black/50 border border-white/10 px-3 py-1 rounded text-xs font-bold text-gray-400">Anında İndirilebilir</span>
                  <span className="bg-black/50 border border-white/10 px-3 py-1 rounded text-xs font-bold text-gray-400">Güncel 2026 Mevzuatı</span>
                </div>
              </div>
              <div className="w-full lg:w-auto flex-shrink-0">
                <button 
                  onClick={() => setShowPdfModal(true)} 
                  className="w-full lg:w-auto btn-corporate bg-[#facc15] text-[#0B0F1A] px-12 py-6 rounded-xl font-black text-xl flex items-center justify-center space-x-3 group relative overflow-hidden shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:shadow-[0_0_50px_rgba(250,204,21,0.5)] transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  <BookOpen size={24} />
                  <span>ÜCRETSİZ REHBERİ AL</span>
                </button>
              </div>
            </div>
          </section>

          {/* PDF LEAD MODAL */}
          {showPdfModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-[#0B0F1A]/90 backdrop-blur-md" onClick={() => !isPdfSubmitting && setShowPdfModal(false)}></div>
              <div className="bg-[#131926] border border-[#facc15]/30 rounded-2xl p-8 max-w-md w-full relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-fade-up max-h-[90vh] overflow-y-auto">
                <button onClick={() => !isPdfSubmitting && setShowPdfModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 rounded-full p-2 transition-colors">
                  <X size={20} />
                </button>
                
                <div className="text-center space-y-4 mb-8">
                  <div className="w-16 h-16 bg-[#facc15]/10 border border-[#facc15]/20 rounded-full flex items-center justify-center mx-auto text-[#facc15]">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Rehberi <span className="text-[#facc15]">İndir</span></h3>
                  <p className="text-sm text-gray-400 font-medium">Lütfen rehbere erişmek için bilgilerinizi eksiksiz doldurun.</p>
                </div>

                {pdfFormSuccess ? (
                  <div className="text-center space-y-6 py-8">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-black italic text-white uppercase">Rehberiniz Hazırlanıyor...</h4>
                      <p className="text-sm text-gray-400">Dosya birazdan yeni sekmede açılacaktır.</p>
                    </div>
                    <div className="w-8 h-8 border-4 border-[#facc15] border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
                  </div>
                ) : (
                  <form onSubmit={handlePdfSubmit} className="space-y-5">
                    <input type="text" name="hp" value={pdfFormData.hp} onChange={(e) => setPdfFormData({...pdfFormData, hp: e.target.value})} style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">AD SOYAD</label>
                      <input 
                        required 
                        value={pdfFormData.name} 
                        onChange={(e) => setPdfFormData({...pdfFormData, name: e.target.value.replace(/[^a-zA-Z\sğüşıöçĞÜŞİÖÇ]/g, '')})} 
                        className="w-full bg-black/40 px-5 py-3.5 text-sm font-bold border border-white/10 rounded-lg focus:border-[#facc15] outline-none transition-colors" 
                        placeholder="Ad Soyad" 
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">TELEFON</label>
                      <input 
                        required 
                        value={pdfFormData.phone} 
                        onChange={(e) => setPdfFormData({...pdfFormData, phone: e.target.value.replace(/[^\d+]/g, '')})} 
                        className="w-full bg-black/40 px-5 py-3.5 text-sm font-bold border border-white/10 rounded-lg focus:border-[#facc15] outline-none transition-colors" 
                        placeholder="05xx xxx xx xx" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">HEDEF ÜLKE</label>
                        <select 
                          value={pdfFormData.targetCountry} 
                          onChange={(e) => setPdfFormData({...pdfFormData, targetCountry: e.target.value})} 
                          className="w-full bg-black/40 px-3 py-3.5 text-sm font-bold border border-white/10 rounded-lg focus:border-[#facc15] outline-none transition-colors text-white"
                        >
                          <option className="bg-[#0B0F1A]">Litvanya</option>
                          <option className="bg-[#0B0F1A]">Almanya</option>
                          <option className="bg-[#0B0F1A]">Polonya</option>
                          <option className="bg-[#0B0F1A]">Hollanda</option>
                          <option className="bg-[#0B0F1A]">Fransa</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">ÇALIŞMAK İSTEDİĞİ ALAN</label>
                        <select
                          value={pdfFormData.workField} 
                          onChange={(e) => setPdfFormData({...pdfFormData, workField: e.target.value})} 
                          className="w-full bg-black/40 px-3 py-3.5 text-sm font-bold border border-white/10 rounded-lg focus:border-[#facc15] outline-none transition-colors text-[#facc15]" 
                        >
                          <option className="bg-[#0B0F1A]" value="">Seçiniz...</option>
                          <option className="bg-[#0B0F1A]">Tır Şoförlüğü</option>
                          <option className="bg-[#0B0F1A]">Fabrika / Depo</option>
                          <option className="bg-[#0B0F1A]">A1 Transfer</option>
                          <option className="bg-[#0B0F1A]">Fark Etmez</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">EK NOT (Opsiyonel)</label>
                      <textarea 
                        value={pdfFormData.note} 
                        onChange={(e) => setPdfFormData({...pdfFormData, note: e.target.value})} 
                        className="w-full bg-black/40 px-5 py-3.5 text-sm font-bold border border-white/10 rounded-lg focus:border-[#facc15] outline-none transition-colors resize-none" 
                        rows="2" 
                        placeholder="Eklemek istedikleriniz..."
                      ></textarea>
                    </div>

                    <div className="flex items-start space-x-3 pt-2">
                      <input 
                        type="checkbox" 
                        id="pdfTerms" 
                        required
                        checked={pdfFormData.terms}
                        onChange={(e) => setPdfFormData({...pdfFormData, terms: e.target.checked})}
                        className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#facc15] focus:ring-[#facc15] cursor-pointer accent-[#facc15]" 
                      />
                      <label htmlFor="pdfTerms" className="text-[10px] text-gray-400 leading-relaxed cursor-pointer font-medium">
                        Danışmanlık hizmet şartlarını okudum, KVKK metnini onaylıyorum ve vize karar merciinin ilgili Konsolosluklar olduğunu kabul ediyorum.
                      </label>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isPdfSubmitting || !pdfFormData.terms || pdfFormData.name.length < 3 || pdfFormData.phone.length < 10}
                      className="w-full btn-corporate bg-[#facc15] text-[#0B0F1A] py-4 rounded-xl font-black text-lg mt-4 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all"
                    >
                      {isPdfSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[#0B0F1A] border-t-transparent rounded-full animate-spin"></div>
                          <span>İŞLENİYOR...</span>
                        </>
                      ) : (
                        <>
                          <BookOpen size={20} />
                          <span>PDF REHBERİ İNDİR</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* İSTATİSTİK */}
          <section id="istatistik" className="py-24 bg-white/[0.02] reveal-on-scroll">
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
          <section id="referanslar" className="py-32 px-6 bg-[#0B0F1A] reveal-on-scroll">
            <div className="max-w-6xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter">Müşteri <span className="text-[#0a66c2]">Görüşleri</span></h2>
                <p className="text-gray-400 font-medium text-lg">Profesyonel hizmetimizle vizesine kavuşan danışanlarımız.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {((testimonials || []).filter(t => t.is_active)).map((ref, idx) => (
                  <div key={ref.id || idx} className="linkedin-card p-5 space-y-4 shadow-xl border border-white/5 hover:border-[#0a66c2]/30 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-5 right-5 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-xl border border-white/10 shadow-lg group-hover:scale-125 transition-transform" title={ref.country}>
                      {ref.country === 'Almanya' ? '🇩🇪' : ref.country === 'Polonya' ? '🇵🇱' : ref.country === 'Litvanya' ? '🇱🇹' : ref.country === 'Hollanda' ? '🇳🇱' : ref.country === 'Belçika' ? '🇧🇪' : '🌍'}
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-3">
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-black text-xl z-10">{ref.name[0]}</div>
                        <div className="z-10 pr-6">
                          <div className="flex items-center space-x-1">
                            <h4 className="font-bold text-sm text-white">{ref.name}</h4>
                            <CheckCircle2 size={16} className="text-[#0a66c2]" />
                          </div>
                          <p className="text-[11px] text-[#facc15] font-bold leading-tight mt-0.5">{ref.visa_type}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{ref.time_ago} • 🌐</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-200 leading-relaxed font-normal relative z-10">{ref.comment}</div>
                    <div className="flex items-center space-x-1 pt-2 relative z-10">
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 bg-[#0a66c2] rounded-full flex items-center justify-center border-2 border-[#1B1F23]"><Star size={10} className="text-white fill-white" /></div>
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#1B1F23]"><Star size={10} className="text-white fill-white" /></div>
                      </div>
                      <span className="text-[11px] text-gray-400 font-medium ml-1">{ref.likes || 0} • <MessageSquare size={10} className="inline ml-1" /> {ref.comments_count || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* HİZMETLER */}
          <section id="hizmetler" className="py-32 lg:py-48 px-6 reveal-on-scroll">
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
                  { icon: <Users size={32} />, title: "Aile Birleşimi", desc: "Avrupa'daki yakınınızın yanına yerleşmek için gereken tüm vize ve oturum süreçlerini uzmanlıkla yönetiyoruz." },
                  { icon: <Star size={32} />, title: "AB Mavi Kart", desc: "Yüksek nitelikli çalışanlar için Avrupa Birliği Mavi Kart başvuru sürecinde teknik ve idari destek sağlıyoruz." },
                  { icon: <Briefcase size={32} />, title: "Şirket Kurulumu & Yatırımcı", desc: "Avrupa'da şirket kurmak, şube açmak veya yatırım yoluyla oturum almak isteyen iş insanlarına rehberlik ediyoruz." },
                  { icon: <ShieldCheck size={32} />, title: "Hukuki Danışmanlık & İtiraz", desc: "Vize reddi durumlarında itiraz süreçleri ve resmi makamlarla olan tüm hukuki yazışmalarınızı yürütüyoruz." },
                  { icon: <ShieldCheck size={32} />, title: "Tam Kapsamlı Destek", desc: "Hangi ülkeyi seçerseniz seçin, dosya hazırlığından konsolosluk mülakatına kadar her adımda yanınızdayız." }
                ].map((item, i) => (
                  <GlowCard 
                    key={i} 
                    customSize={true} 
                    className="group hover:border-[#facc15]/30 transition-all duration-500 shadow-2xl flex flex-col relative overflow-hidden hover:-translate-y-2"
                  >
                    <div className="w-16 h-16 bg-[#facc15]/10 rounded-full flex items-center justify-center text-[#facc15] mb-8 group-hover:bg-[#facc15] group-hover:text-[#0B0F1A] transition-all border border-white/5">{item.icon}</div>
                    <h3 className="text-2xl font-black italic uppercase mb-4">{item.title}</h3>
                    <p className="text-gray-400 font-medium leading-relaxed mb-6">{item.desc}</p>
                    <button onClick={scrollToForm} className="mt-auto flex items-center space-x-2 text-[#facc15] font-black text-sm uppercase tracking-widest group">
                      <span>Detaylar</span> <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </GlowCard>
                ))}
              </div>
            </div>
          </section>

          {/* NASIL ÇALIŞIR - BAŞVURU SÜRECİ */}
          <section className="py-32 px-6 bg-[#05070A] relative overflow-hidden reveal-on-scroll">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#facc15]/30 to-transparent"></div>
            
            <div className="max-w-7xl mx-auto space-y-20">
              <div className="text-center space-y-4">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#facc15]">NASIL ÇALIŞIR?</h2>
                <h3 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter">Başvurudan Avrupa'ya — <span className="text-[#facc15]">5 Basit Adım</span></h3>
                <div className="w-24 h-1.5 bg-[#facc15] mx-auto rounded-full"></div>
              </div>

              <div className="relative">
                {/* Bağlantı Çizgisi (Desktop) */}
                <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-[#facc15]/0 via-[#facc15]/20 to-[#facc15]/0 -translate-y-1/2"></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 relative z-10">
                  {[
                    { num: "01", icon: <ClipboardList size={32} />, title: "ÜCRETSİZ BAŞVURU", desc: "Formu doldurun, uzman ekibimiz 24 saat içinde sizi arasın." },
                    { num: "02", icon: <Folder size={32} />, title: "EVRAK HAZIRLAMA", desc: "Gerekli belgeler listelenir, eksikler tamamlanır. Tüm süreç rehberlik eşliğinde." },
                    { num: "03", icon: <Send size={32} />, title: "BAŞVURU GÖNDERİMİ", desc: "Eksiksiz dosyanız resmi makamlara iletilir. Siz hiçbir şey yapmak zorunda değilsiniz." },
                    { num: "04", icon: <Clock size={32} />, title: "ONAY SÜRECİ", desc: "Başvurunuz işleme alınır. Anlık durum takibi yapabilirsiniz." },
                    { num: "05", icon: <Globe size={32} />, title: "AVRUPA'YA UÇUŞ! 🎉", desc: "Vizeniz/kartınız onaylanır. Avrupa maceranız başlıyor!" }
                  ].map((step, i) => (
                    <div key={i} className="group relative">
                      <div className="glass p-10 rounded-[2.5rem] border border-white/5 hover:border-[#facc15]/60 transition-all duration-700 h-full flex flex-col items-center text-center space-y-8 hover:shadow-[0_20px_50px_rgba(250,204,21,0.15)] group-hover:-translate-y-4">
                        <div className="absolute -top-5 -right-5 bg-gradient-to-br from-[#facc15] to-[#ca8a04] text-[#0B0F1A] w-12 h-12 rounded-2xl font-black flex items-center justify-center text-lg shadow-2xl group-hover:scale-125 transition-transform duration-500">
                          {step.num}
                        </div>
                        <div className="w-20 h-20 bg-[#facc15]/10 rounded-[2rem] flex items-center justify-center text-[#facc15] group-hover:bg-[#facc15] group-hover:text-[#0B0F1A] transition-all duration-700 border border-[#facc15]/20 shadow-inner group-hover:shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                          {step.icon}
                        </div>
                        <h4 className="text-xl font-black italic uppercase tracking-tighter group-hover:text-[#facc15] transition-colors">{step.title}</h4>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed opacity-80 group-hover:opacity-100">{step.desc}</p>
                      </div>
                      
                      {/* Ok İşareti (Desktop) */}
                      {i < 4 && (
                        <>
                          <div className="hidden lg:flex absolute top-1/2 -right-10 -translate-y-1/2 z-20 text-[#facc15]/20 group-hover:text-[#facc15] group-hover:translate-x-2 transition-all duration-700">
                            <ChevronRight size={32} strokeWidth={3} />
                          </div>
                          <div className="flex lg:hidden justify-center items-center py-4 text-[#facc15]/40 animate-pulse">
                            <ChevronDown size={32} strokeWidth={3} />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-12 text-center space-y-8">
                <p className="text-xl text-gray-300 font-bold italic uppercase tracking-tighter">Hemen Başlamak İster Misiniz?</p>
                <button onClick={scrollToForm} className="btn-corporate bg-[#facc15] text-[#0B0F1A] px-12 py-5 rounded-2xl font-black text-xl uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_10px_40px_rgba(250,204,21,0.2)]">
                  ÜCRETSİZ BAŞVURU BAŞLAT
                </button>
              </div>
            </div>
          </section>

          {/* SÜREÇTEN KESİTLER */}
          <section id="surec" className="py-32 px-6 bg-white/[0.01] reveal-on-scroll">
            <div className="max-w-7xl mx-auto space-y-20">
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                <h2 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter">Görsel <span className="text-[#facc15]">Sürecimiz</span></h2>
                <p className="text-xl text-gray-400 font-medium">Yasal evraklarınızdan iş sahasına kadar her an yanınızdayız.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <GlowCard customSize={true} className="p-8 shadow-2xl bg-black/40 border-white/10">
                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-black/40 p-4 text-center flex items-center justify-center">
                    <img src={OturumKartiImg} className="w-full h-full object-contain" alt="Oturum Kartı" loading="lazy" decoding="async" />
                  </div>
                  <p className="mt-4 px-3 text-lg font-black italic uppercase text-center">Resmi Oturum & Çalışma Kartı</p>
                </GlowCard>
                <GlowCard customSize={true} className="p-5 shadow-2xl">
                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-black/40">
                    <img src={TirImg} className="w-full h-full object-cover" alt="Tır Operasyonları" loading="lazy" decoding="async" />
                  </div>
                  <p className="mt-4 px-3 text-lg font-black italic uppercase text-center">Uluslararası Lojistik Ağı</p>
                </GlowCard>
              </div>
            </div>
          </section>

          {/* INSTAGRAM VİTRİNİ */}
          <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5 reveal-on-scroll">
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
                      <img src={post.img} alt={post.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" decoding="async" />
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
                        <img src={member.img} alt={member.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
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
          <section ref={formRef} className="py-20 lg:py-32 px-4 md:px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5 relative bg-[#0B0F1A]">
                <div className="bg-[#131926] p-6 md:p-10 lg:p-20 relative w-full">
                  {isSubmitting && <div className="absolute inset-0 bg-[#131926]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-[#facc15] border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black italic uppercase text-[#facc15] tracking-widest text-sm">İşleminiz Yapılıyor...</p>
                  </div>}
                  {!formSuccess && <h2 className="text-5xl font-black italic uppercase tracking-tighter italic mb-10">Hemen <span className="text-[#facc15]">Başvur</span></h2>}
                  {formSuccess ? (
                    <div id="success-screen" className="flex flex-col items-center justify-center text-center space-y-6 py-16">
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
                          <div className="w-full flex justify-center scale-[0.85] md:scale-100 origin-center">
                            <Turnstile 
                              num-token="1"
                              sitekey="0x4AAAAAADCs4Dto3zUFJEGb" 
                              onVerify={(token) => {
                                console.log("Turnstile Token Received:", token.substring(0, 10) + "...");
                                setTurnstileToken(token);
                                setIsTurnstileVerified(true);
                              }} 
                              theme="dark"
                            />
                          </div>
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
                        {isSubmitting ? 'GÖNDERİLİYOR...' : 'BAŞVURUYU TAMAMLA'}
                      </button>
                    </form>
                  )}
                </div>
                <div className="bg-[#facc15] p-8 md:p-10 lg:p-16 text-[#0B0F1A] flex flex-col justify-between relative overflow-hidden group w-full min-h-[400px]">
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
      ) : currentPage === 'blog_detail' ? (
        <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto min-h-screen">
          {(() => {
            const post = blogPosts.find(b => b.slug === selectedBlogSlug);
            if (!post) return <div className="text-white text-center py-20 animate-pulse">Blog yazısı yükleniyor...</div>;
            
            return (
              <div className="animate-fade-up">
                <button onClick={() => { setCurrentPage('blog'); window.history.pushState({}, '', '/blog'); }} className="flex items-center space-x-2 text-gray-400 hover:text-[#facc15] mb-8 transition-colors">
                  <ArrowLeft size={16} /><span>Blog'a Dön</span>
                </button>
                {post.cover_image && <img src={post.cover_image} alt={post.title} onError={(e) => { e.target.src = 'https://placehold.co/800x400/1a1a2e/facc15?text=CMSVize+Blog' }} className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8 border border-white/10 shadow-2xl" />}
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-xs font-black text-[#facc15] bg-[#facc15]/10 px-3 py-1 rounded-md uppercase tracking-widest">{post.category}</span>
                  <span className="text-gray-500 text-sm">{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-8 text-white">{post.title}</h1>
                <div className="text-gray-300 text-lg leading-relaxed space-y-6" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}></div>
              </div>
            );
          })()}
        </div>
      ) : currentPage === 'blog' ? (
        <div className="pt-40 pb-32 px-6 max-w-5xl mx-auto min-h-screen">
          <h2 className="text-5xl font-black italic uppercase mb-12 tracking-tighter">CMSVize <span className="text-[#facc15]">Blog</span></h2>
          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.filter(b => b.is_published).map(post => (
              <div key={post.id} onClick={() => { setSelectedBlogSlug(post.slug); setCurrentPage('blog_detail'); window.history.pushState({}, '', `/blog/${post.slug}`); window.scrollTo(0, 0); }} className="glass p-6 rounded-xl hover:border-[#facc15]/50 transition-all cursor-pointer group flex flex-col h-full border border-white/5">
                {post.cover_image && <img src={post.cover_image} alt={post.title} onError={(e) => { e.target.src = 'https://placehold.co/800x400/1a1a2e/facc15?text=CMSVize+Blog' }} className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-[1.02] transition-transform duration-300 shadow-xl" />}
                <div className="flex-1">
                  <span className="text-[10px] font-black text-[#facc15] bg-[#facc15]/10 px-3 py-1 rounded-md uppercase tracking-widest">{post.category}</span>
                  <h3 className="text-xl font-black italic mt-3 mb-2 group-hover:text-[#facc15] transition-colors text-white">{post.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{post.summary}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                  <span className="text-xs font-bold text-[#facc15] flex items-center space-x-1"><span>Devamını Oku</span> <ChevronRight size={14} /></span>
                </div>
              </div>
            ))}
            {blogPosts.filter(b => b.is_published).length === 0 && !isBlogLoading && (
              <div className="col-span-full text-center text-gray-500 py-12">Henüz blog yazısı bulunmamaktadır.</div>
            )}
            {isBlogLoading && (
              <div className="col-span-full text-center text-gray-500 py-12 animate-pulse">Yazılar Yükleniyor...</div>
            )}
          </div>
        </div>
      ) : currentPage === 'privacy' ? (
        <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto space-y-12 animate-fade-up">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Gizlilik <span className="text-[#facc15]">Politikası</span></h1>
          <div className="glass p-10 rounded-3xl space-y-6 text-gray-300 leading-relaxed">
            <p>CMSVize olarak kişisel verilerinizin güvenliğine büyük önem veriyoruz. 6698 sayılı KVKK kapsamında verileriniz sadece danışmanlık süreçlerinizin yürütülmesi amacıyla işlenir.</p>
            <h3 className="text-xl font-bold text-white uppercase italic">Veri Toplama Amacı</h3>
            <p>Vize başvurularınızın gerçekleştirilmesi, randevu alımı ve konsolosluk işlemlerinin takibi için gerekli olan bilgileriniz güvenli sunucularımızda saklanmaktadır.</p>
            <p>Verileriniz üçüncü şahıslarla ticari amaçla asla paylaşılmaz, sadece yasal süreçler kapsamında yetkili makamlara iletilir.</p>
          </div>
          <button onClick={() => setCurrentPage('home')} className="btn-corporate glass px-8 py-4 rounded-xl font-bold flex items-center space-x-2">
            <ArrowLeft size={18} />
            <span>ANA SAYFAYA DÖN</span>
          </button>
        </div>
      ) : currentPage === 'terms' ? (
        <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto space-y-12 animate-fade-up">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Kullanım <span className="text-[#facc15]">Koşulları</span></h1>
          <div className="glass p-10 rounded-3xl space-y-6 text-gray-300 leading-relaxed">
            <p>CMSVize tarafından sunulan hizmetler, danışmanlık ve başvuru takibi kapsamındadır. Vize onay veya red kararı tamamen ilgili konsoloslukların yetkisindedir.</p>
            <h3 className="text-xl font-bold text-white uppercase italic">Sorumluluk Reddi</h3>
            <p>Danışmanlık ücreti hizmet bedeli olup, vize sonucundan bağımsız olarak tahsil edilir. Yanlış veya eksik beyanlardan doğacak sorumluluk kullanıcıya aittir.</p>
            <p>Sitemizdeki bilgiler güncel mevzuata göre hazırlanmış olup bilgilendirme amaçlıdır.</p>
          </div>
          <button onClick={() => setCurrentPage('home')} className="btn-corporate glass px-8 py-4 rounded-xl font-bold flex items-center space-x-2">
            <ArrowLeft size={18} />
            <span>ANA SAYFAYA DÖN</span>
          </button>
        </div>
      ) : currentPage === 'cookies' ? (
        <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto space-y-12 animate-fade-up">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Çerez <span className="text-[#facc15]">Politikası</span></h1>
          <div className="glass p-10 rounded-3xl space-y-8 text-gray-300 leading-relaxed text-sm">
            <p className="font-bold text-[#facc15]">Son güncelleme: Nisan 2026</p>
            
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-white uppercase italic">1. Çerezler Nedir?</h3>
              <p>Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin dosyalarıdır.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-white uppercase italic">2. Hangi Çerezleri Kullanıyoruz?</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="text-white font-bold">Zorunlu Çerezler:</span> Sitenin düzgün çalışması için gereklidir.</li>
                <li><span className="text-white font-bold">Analitik Çerezler:</span> Ziyaretçi istatistikleri için kullanılır (Google Analytics).</li>
                <li><span className="text-white font-bold">Güvenlik Çerezler:</span> Bot koruması için Cloudflare Turnstile tarafından kullanılır.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-white uppercase italic">3. Çerezleri Nasıl Kontrol Edebilirsiniz?</h3>
              <p>Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz. Ancak bu durumda sitenin bazı özellikleri çalışmayabilir.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-white uppercase italic">4. İletişim</h3>
              <p>Çerez politikamız hakkında sorularınız için: <span className="text-white font-bold">info@cmsvize.com</span></p>
            </section>
          </div>
          <button onClick={() => setCurrentPage('home')} className="btn-corporate glass px-8 py-4 rounded-xl font-bold flex items-center space-x-2">
            <ArrowLeft size={18} />
            <span>ANA SAYFAYA DÖN</span>
          </button>
        </div>
      ) : currentPage === 'guides_main' ? (
        <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto space-y-16 animate-fade-up">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter">Avrupa <span className="text-[#facc15]">Vize Rehberi</span></h1>
            <p className="text-gray-400 max-w-2xl mx-auto font-medium">Hedeflediğiniz ülkede yaşam, çalışma şartları ve vize süreçleri hakkında en güncel bilgiler.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 'litvanya', name: 'LİTVANYA', flag: '🇱🇹', desc: 'Düşük yaşam maliyeti ve hızlı vize süreciyle Avrupa\'nın parlayan yıldızı.', color: 'border-yellow-600' },
              { id: 'almanya', name: 'ALMANYA', flag: '🇩🇪', desc: 'Avrupa\'nın en büyük ekonomisi, yüksek maaşlar ve güçlü sosyal haklar.', color: 'border-red-600' },
              { id: 'polonya', name: 'POLONYA', flag: '🇵🇱', desc: 'Hızlı büyüyen ekonomi ve kolay vize süreçleriyle Türk çalışanlar için ideal.', color: 'border-white' }
            ].map(country => (
              <div key={country.id} className={`glass p-8 rounded-3xl border-t-4 ${country.color} space-y-6 hover:translate-y-[-8px] transition-all duration-300 group`}>
                <div className="text-5xl">{country.flag}</div>
                <h3 className="text-2xl font-black italic uppercase tracking-tight text-white">{country.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{country.desc}</p>
                <button 
                  onClick={() => setCurrentPage(`guide_${country.id}`)}
                  className="w-full btn-corporate glass py-3 rounded-xl font-bold uppercase tracking-widest text-xs group-hover:bg-[#facc15] group-hover:text-black transition-colors"
                >
                  Rehberi İncele
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : currentPage === 'guide_litvanya' ? (
        <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto space-y-12 animate-fade-up">
          <div className="flex items-center space-x-4 mb-8">
            <button onClick={() => setCurrentPage('guides_main')} className="w-12 h-12 glass rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <span className="text-gray-500 font-black uppercase tracking-widest text-xs">Rehberler / Litvanya</span>
          </div>

          <div className="space-y-12">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-tight">🇱🇹 LİTVANYA KAPSAMLI <br/><span className="text-[#facc15]">YAŞAM REHBERİ 2026</span></h1>
            
            <div className="prose prose-invert max-w-none space-y-12 text-gray-300 leading-relaxed">
              <section className="glass p-10 rounded-3xl border-l-4 border-[#facc15] space-y-4">
                <h2 className="text-2xl font-black italic uppercase text-white">Litvanya Hakkında Genel Bilgi</h2>
                <p>Litvanya, Baltık bölgesinde yer alan AB ve NATO üyesi bir ülkedir. Başkenti Vilnius, nüfusu yaklaşık 2.8 milyon, resmi para birimi Euro'dur. Schengen bölgesinde yer alır.</p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-[#facc15]">Neden Litvanya?</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                  {['27 Schengen ülkesinde vizesiz seyahat', 'Bati Avrupa\'ya kıyasla %40-50 daha uygun yaşam maliyeti', 'Hızlı büyüyen iş ve teknoloji ekosistemi', 'AB vatandaşlığına giden yol', 'Aile birleşimi hakkı'].map((item, i) => (
                    <li key={i} className="glass p-4 rounded-xl flex items-center space-x-3">
                      <CheckCircle2 size={18} className="text-[#facc15] flex-shrink-0" />
                      <span className="text-sm font-bold">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-white">Şehirler</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: 'Vilnius', title: 'Başkent', desc: 'Kuzey\'in Silicon Valley\'i olarak anılır.' },
                    { name: 'Kaunas', title: 'Sanayi Merkezi', desc: 'Yaşam maliyeti daha uygundur.' },
                    { name: 'Klaipeda', title: 'Liman Şehri', desc: 'Lojistik ve denizcilik sektörü güçlü.' }
                  ].map((city, i) => (
                    <div key={i} className="glass p-6 rounded-2xl space-y-2 border-b-2 border-white/5">
                      <h4 className="text-lg font-black text-[#facc15] italic">{city.name}</h4>
                      <p className="text-[10px] font-black uppercase text-gray-500">{city.title}</p>
                      <p className="text-xs">{city.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-white">Yaşam Maliyeti (2026)</h2>
                <div className="overflow-hidden rounded-2xl glass border border-white/5">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-white font-black uppercase text-[10px] tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Kalem</th>
                        <th className="px-6 py-4">Tahmini Maliyet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { k: 'Tek kişilik daire kirası', v: '400-700 EUR/ay' },
                        { k: 'Market alışverişi', v: '200-350 EUR/ay' },
                        { k: 'Ulaşım (aylık)', v: '30-50 EUR' },
                        { k: 'Sağlık sigortası', v: '20-40 EUR/ay' },
                        { k: 'Ortalama toplam', v: '700-1200 EUR/ay' }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-medium">{row.k}</td>
                          <td className="px-6 py-4 text-[#facc15] font-black">{row.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-white">Ortalama Maaşlar (2026)</h2>
                <div className="overflow-hidden rounded-2xl glass border border-white/5">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-white font-black uppercase text-[10px] tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Sektör</th>
                        <th className="px-6 py-4">Aylık Maaş</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { k: 'TIR Şoförü (KOD95)', v: '1.800-2.500 EUR' },
                        { k: 'Fabrika İşçisi', v: '1.000-1.400 EUR' },
                        { k: 'İnşaat', v: '1.200-1.800 EUR' },
                        { k: 'BT Uzmanı', v: '2.500-4.000 EUR' },
                        { k: 'Asgari Ücret', v: '~1.038 EUR' }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-medium">{row.k}</td>
                          <td className="px-6 py-4 text-[#facc15] font-black">{row.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="glass p-8 rounded-3xl space-y-4">
                  <h3 className="text-xl font-black italic uppercase text-white">Konaklama</h3>
                  <p className="text-sm">Litvanya'da konaklama bulmak görece kolaydır. Kira sözleşmesi oturum kartı başvurusu için zorunludur. CMSVize olarak konaklama bulma sürecinde de destek sağlıyoruz.</p>
                </div>
                <div className="glass p-8 rounded-3xl space-y-4">
                  <h3 className="text-xl font-black italic uppercase text-white">Sağlık & Ulaşım</h3>
                  <p className="text-sm">Çalışanlar işveren aracılığıyla devlet sağlık sistemine dahil olur. Şehir içi ve şehirler arası ulaşım ağı oldukça gelişmiş ve ekonomiktir.</p>
                </div>
              </div>

              <section className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-white">Sık Sorulan Sorular</h2>
                <div className="space-y-4">
                  {[
                    { q: 'Litvanya\'da çalışmak için dil şartı var mı?', a: 'Çoğu sektörde dil şartı yoktur. İngilizce bilen işverenler yaygındır.' },
                    { q: 'Litvanya\'dan diğer AB ülkelerine geçiş yapabilir miyim?', a: 'Evet, Schengen vizesiyle 27 ülkede serbestçe seyahat edebilirsiniz.' },
                    { q: 'Aile birleşimi için ne kadar beklenir?', a: 'Oturum kartınızı aldıktan sonra aile birleşimi başvurusu yapılabilir. Ortalama 2-3 ay sürer.' }
                  ].map((faq, i) => (
                    <div key={i} className="glass p-6 rounded-2xl space-y-2">
                      <p className="font-black text-white text-sm">S: {faq.q}</p>
                      <p className="text-gray-400 text-sm italic">C: {faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-20 p-12 rounded-3xl glass border border-[#facc15]/30 text-center space-y-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-black italic uppercase">Uzman Ekibimizle Ücretsiz Görüşün</h3>
                <p className="text-gray-400 font-medium">Litvanya oturum kartı ve iş imkanları için formu doldurun, sizi arayalım.</p>
              </div>
              <button onClick={scrollToForm} className="btn-corporate bg-[#facc15] text-black px-12 py-5 rounded-2xl font-black text-lg uppercase tracking-wider hover:scale-105 transition-transform">
                ÜCRETSİZ BAŞVURU BAŞLAT
              </button>
            </div>
          </div>
        </div>
      ) : currentPage === 'guide_almanya' ? (
        <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto space-y-12 animate-fade-up">
          <div className="flex items-center space-x-4 mb-8">
            <button onClick={() => setCurrentPage('guides_main')} className="w-12 h-12 glass rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <span className="text-gray-500 font-black uppercase tracking-widest text-xs">Rehberler / Almanya</span>
          </div>

          <div className="space-y-12">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-tight">🇩🇪 ALMANYA KAPSAMLI <br/><span className="text-[#facc15]">ÇALIŞMA REHBERİ 2026</span></h1>
            
            <div className="prose prose-invert max-w-none space-y-12 text-gray-300 leading-relaxed">
              <section className="glass p-10 rounded-3xl border-l-4 border-red-600 space-y-4">
                <h2 className="text-2xl font-black italic uppercase text-white">Almanya Hakkında Genel Bilgi</h2>
                <p>Almanya, Avrupa'nın en büyük ekonomisi ve Türk göçmenler için en popüler destinasyondur. Başkenti Berlin, nüfusu ~84 milyon, para birimi Euro'dur.</p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-[#facc15]">Neden Almanya?</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                  {['Avrupa\'nın en yüksek maaşları', 'Güçlü sosyal haklar ve işçi güvencesi', 'Kaliteli sağlık ve eğitim sistemi', 'Büyük Türk topluluğu (yaklaşık 3 milyon)', 'Yüksek yaşam standardı'].map((item, i) => (
                    <li key={i} className="glass p-4 rounded-xl flex items-center space-x-3">
                      <CheckCircle2 size={18} className="text-[#facc15] flex-shrink-0" />
                      <span className="text-sm font-bold">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-white">Popüler İş Alanları</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'TIR Şoförlüğü', desc: 'KOD95 belgesi zorunludur. Maaşlar 2.500-3.500 EUR arasındadır.' },
                    { name: 'Depo & Lojistik', desc: 'Amazon, DHL, DPD gibi büyük firmalarda yaygındır.' },
                    { name: 'Fabrika & Üretim', desc: 'Otomotiv (BMW, Mercedes) sektöründe alım fazladır.' },
                    { name: 'İnşaat', desc: 'Tecrübeli işçilere yüksek ücret ödenmektedir.' }
                  ].map((job, i) => (
                    <div key={i} className="glass p-6 rounded-2xl space-y-2 border-b-2 border-white/5">
                      <h4 className="text-lg font-black text-[#facc15] italic">{job.name}</h4>
                      <p className="text-xs">{job.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-white">Ortalama Maaşlar (2026)</h2>
                <div className="overflow-hidden rounded-2xl glass border border-white/5">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-white font-black uppercase text-[10px] tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Pozisyon</th>
                        <th className="px-6 py-4">Aylık Maaş (Brüt)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { k: 'TIR Şoförü', v: '2.500-3.500 EUR' },
                        { k: 'Depo İşçisi', v: '1.800-2.200 EUR' },
                        { k: 'Fabrika İşçisi', v: '2.000-2.800 EUR' },
                        { k: 'İnşaat İşçisi', v: '2.200-3.000 EUR' },
                        { k: 'Asgari Ücret', v: '~1.700 EUR' }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-medium">{row.k}</td>
                          <td className="px-6 py-4 text-[#facc15] font-black">{row.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="glass p-10 rounded-3xl border border-[#facc15]/30 space-y-4">
                <h2 className="text-2xl font-black italic uppercase text-white">KOD95 Belgesi Nedir?</h2>
                <p className="text-sm">Avrupa'da ticari araç kullananlar için zorunlu mesleki yeterlilik belgesidir. Ehliyette "95" kodu olarak görünür. CMSVize olarak KOD95 belgesi olan TIR şoförlerine özel işveren eşleştirme yapıyoruz.</p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-white">Yaşam Maliyeti (2026)</h2>
                <div className="overflow-hidden rounded-2xl glass border border-white/5">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-white font-black uppercase text-[10px] tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Kalem</th>
                        <th className="px-6 py-4">Tahmini Maliyet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { k: 'Tek kişilik daire', v: '800-1.500 EUR/ay' },
                        { k: 'Market alışverişi', v: '300-500 EUR/ay' },
                        { k: 'Ulaşım (aylık)', v: '80-100 EUR' },
                        { k: 'Sağlık sigortası', v: 'İşveren Öder' },
                        { k: 'Ortalama toplam', v: '1.300-2.200 EUR/ay' }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-medium">{row.k}</td>
                          <td className="px-6 py-4 text-[#facc15] font-black">{row.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-white">Sık Sorulan Sorular</h2>
                <div className="space-y-4">
                  {[
                    { q: 'Almancam olmadan çalışabilir miyim?', a: 'TIR şoförlüğü ve bazı fabrika işlerinde Almanca şartı aranmaz. Ancak öğrenmek kariyer için önemlidir.' },
                    { q: 'Almanya\'da oturum izninden vatandaşlığa geçiş ne kadar sürer?', a: 'Genellikle 5-8 yıl yasal ikamet ve dil şartı (B1) gerekmektedir.' }
                  ].map((faq, i) => (
                    <div key={i} className="glass p-6 rounded-2xl space-y-2">
                      <p className="font-black text-white text-sm">S: {faq.q}</p>
                      <p className="text-gray-400 text-sm italic">C: {faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-20 p-12 rounded-3xl glass border border-[#facc15]/30 text-center space-y-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-black italic uppercase">Uzman Ekibimizle Ücretsiz Görüşün</h3>
                <p className="text-gray-400 font-medium">Almanya iş fırsatları ve vize süreci için formu doldurun, sizi arayalım.</p>
              </div>
              <button onClick={scrollToForm} className="btn-corporate bg-[#facc15] text-black px-12 py-5 rounded-2xl font-black text-lg uppercase tracking-wider hover:scale-105 transition-transform">
                ÜCRETSİZ BAŞVURU BAŞLAT
              </button>
            </div>
          </div>
        </div>
      ) : currentPage === 'guide_polonya' ? (
        <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto space-y-12 animate-fade-up">
          <div className="flex items-center space-x-4 mb-8">
            <button onClick={() => setCurrentPage('guides_main')} className="w-12 h-12 glass rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <span className="text-gray-500 font-black uppercase tracking-widest text-xs">Rehberler / Polonya</span>
          </div>

          <div className="space-y-12">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-tight">🇵🇱 POLONYA KAPSAMLI <br/><span className="text-[#facc15]">ÇALIŞMA REHBERİ 2026</span></h1>
            
            <div className="prose prose-invert max-w-none space-y-12 text-gray-300 leading-relaxed">
              <section className="glass p-10 rounded-3xl border-l-4 border-white space-y-4">
                <h2 className="text-2xl font-black italic uppercase text-white">Polonya Hakkında Genel Bilgi</h2>
                <p>Polonya, Orta Avrupa'nın en hızlı büyüyen ekonomilerinden biridir. Başkenti Varşova, nüfusu ~38 milyon, para birimi Zloti (PLN)'dir.</p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-[#facc15]">Neden Polonya?</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                  {['Avrupa\'nın en hızlı büyüyen ekonomisi', 'Almanya\'ya kıyasla kolay vize süreci', 'Uygun yaşam maliyeti', 'Güçlü sanayi ve üretim sektörü', 'Türkiye\'ye yakın konum'].map((item, i) => (
                    <li key={i} className="glass p-4 rounded-xl flex items-center space-x-3">
                      <CheckCircle2 size={18} className="text-[#facc15] flex-shrink-0" />
                      <span className="text-sm font-bold">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-white">Ortalama Maaşlar (2026)</h2>
                <div className="overflow-hidden rounded-2xl glass border border-white/5">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-white font-black uppercase text-[10px] tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Pozisyon</th>
                        <th className="px-6 py-4">Aylık Maaş</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { k: 'Fabrika İşçisi', v: '700-1.000 EUR' },
                        { k: 'Depo İşçisi', v: '700-900 EUR' },
                        { k: 'İnşaat İşçisi', v: '900-1.400 EUR' },
                        { k: 'TIR Şoförü', v: '1.500-2.200 EUR' },
                        { k: 'Asgari Ücret', v: '~900 EUR' }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-medium">{row.k}</td>
                          <td className="px-6 py-4 text-[#facc15] font-black">{row.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-white">Yaşam Maliyeti (2026)</h2>
                <div className="overflow-hidden rounded-2xl glass border border-white/5">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-white font-black uppercase text-[10px] tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Kalem</th>
                        <th className="px-6 py-4">Tahmini Maliyet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { k: 'Tek kişilik daire', v: '300-600 EUR/ay' },
                        { k: 'Market alışverişi', v: '150-250 EUR/ay' },
                        { k: 'Ulaşım', v: '30-50 EUR/ay' },
                        { k: 'Toplam', v: '550-950 EUR/ay' }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-medium">{row.k}</td>
                          <td className="px-6 py-4 text-[#facc15] font-black">{row.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-white">Vize Süreci</h2>
                <div className="glass p-10 rounded-3xl space-y-4">
                  <p>Polonya'da çalışmak için D tipi ulusal vize gereklidir. İşveren daveti veya iş sözleşmesi ile başvuru yapılır. Onay süresi 2-4 haftadır, bu da Almanya'ya göre çok daha hızlı bir seçenektir.</p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-white">Sık Sorulan Sorular</h2>
                <div className="space-y-4">
                  {[
                    { q: 'Polonya\'dan diğer Schengen ülkelerine geçiş yapabilir miyim?', a: 'Evet, Polonya Schengen üyesidir. Oturum izniyle 27 ülkede seyahat edebilirsiniz.' },
                    { q: 'Polonya vizesi ne kadar sürede çıkar?', a: 'Ortalama 2-4 hafta. Almanya\'ya göre çok daha hızlı.' },
                    { q: 'Polonya\'da dil şartı var mı?', a: 'Fabrika işlerinde genellikle aranmaz. Temel İngilizce veya Rusça bilen işverenler yaygındır.' }
                  ].map((faq, i) => (
                    <div key={i} className="glass p-6 rounded-2xl space-y-2">
                      <p className="font-black text-white text-sm">S: {faq.q}</p>
                      <p className="text-gray-400 text-sm italic">C: {faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-20 p-12 rounded-3xl glass border border-[#facc15]/30 text-center space-y-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-black italic uppercase">Uzman Ekibimizle Ücretsiz Görüşün</h3>
                <p className="text-gray-400 font-medium">Polonya iş fırsatları ve vize süreci için formu doldurun, sizi arayalım.</p>
              </div>
              <button onClick={scrollToForm} className="btn-corporate bg-[#facc15] text-black px-12 py-5 rounded-2xl font-black text-lg uppercase tracking-wider hover:scale-105 transition-transform">
                ÜCRETSİZ BAŞVURU BAŞLAT
              </button>
            </div>
          </div>
        </div>
      ) : currentPage === 'admin-login' ? (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B0F1A]">
          <div className="max-w-md w-full glass p-10 rounded-2xl border-t-4 border-[#facc15] shadow-2xl">
            <div className="flex justify-center mb-10">
              <img src={logoImg} alt="CMSVize Logo" className="h-20 w-auto object-contain brightness-125" />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-center mb-2">Admin <span className="text-[#facc15]">Panel</span></h2>
            <p className="text-gray-400 text-center text-sm mb-8">Yetkili personel girişi gereklidir.</p>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">KULLANICI ADI</label>
                <input required value={adminUser} onChange={(e) => setAdminUser(e.target.value)} className="w-full bg-black/50 border border-white/10 px-6 py-4 rounded-lg font-bold focus:border-[#facc15] outline-none" placeholder="cms_master_admin" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">GÜVENLİK ANAHTARI</label>
                <input required type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full bg-black/50 border border-white/10 px-6 py-4 rounded-lg font-bold focus:border-[#facc15] outline-none" placeholder="••••••••••••" />
              </div>
              <button type="button" onClick={handleAdminLogin} className="w-full bg-[#facc15] text-black font-black py-5 rounded-lg text-lg hover:scale-[1.02] transition-transform mt-4">SİSTEME GİRİŞ YAP</button>
            </div>
          </div>
        </div>
      ) : currentPage === 'admin-dashboard' && adminLoggedIn ? (
        <div className="min-h-screen bg-[#080C14] text-white">
          <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-72 bg-[#0B0F1A] border-r border-white/5 p-8 flex flex-col justify-between">
              <div className="space-y-10">
                <div className="flex items-center space-x-2 px-2">
                  <img src={logoImg} alt="CMSVize Logo" className="h-[32px] w-auto object-contain" />
                  <span className="font-black italic text-xl tracking-tighter text-white opacity-80">ADMIN</span>
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
                  <button onClick={() => setAdminTab('reviews')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'reviews' ? 'bg-[#facc15] text-[#0B0F1A]' : 'text-gray-400 hover:bg-white/5'}`}>
                    <MessageSquare size={18} /> <span>Müşteri Yorumları</span>
                  </button>
                  <button onClick={() => setAdminTab('blog')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'blog' ? 'bg-[#facc15] text-[#0B0F1A]' : 'text-gray-400 hover:bg-white/5'}`}>
                    <BookOpen size={18} /> <span>Blog Yazıları</span>
                  </button>
                  <button onClick={() => setAdminTab('leads')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'leads' ? 'bg-[#facc15] text-[#0B0F1A]' : 'text-gray-400 hover:bg-white/5'}`}>
                    <Briefcase size={18} /> <span>Başvurular</span>
                  </button>
                  <button onClick={() => setAdminTab('settings')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'settings' ? 'bg-[#facc15] text-black' : 'text-gray-400 hover:bg-white/5'}`}>
                    <Settings size={18} /> <span>Site Ayarları</span>
                  </button>
                </nav>
              </div>
              <button onClick={() => { 
                localStorage.removeItem('adminAuth');
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
                      {adminTab === 'reviews' && 'Müşteri Yorumları'}
                      {adminTab === 'blog' && 'Blog Yönetimi'}
                      {adminTab === 'settings' && 'Site Ayarları'}
                      <span className="text-[#facc15] ml-2">Paneli</span>
                    </h1>
                  </div>
                </div>

                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sistem Durumu</p>
                  <div className="flex flex-col items-end">
                    <p className="text-green-500 font-bold flex items-center justify-end space-x-2"> <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> <span>Çevrimiçi</span> </p>
                    <div className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20 text-[9px] font-black uppercase mt-1 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      <span>Analytics Aktif</span>
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
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
                      <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                          <CheckCircle2 size={32} className="text-green-500" />
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter">Vercel Analytics Aktif</h3>
                        <p className="text-gray-500 text-sm max-w-md font-medium">Ziyaretçi ve davranış verileri Vercel Analytics üzerinden takip edilmektedir.</p>
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
                          <option value="İşlemde">İşlemde</option>
                          <option value="Tamamlandı">Tamamlandı</option>
                          <option value="Reddedildi">Reddedildi</option>
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
                        <tbody className="relative">
                          {isLoadingLeads && (
                            <tr>
                              <td colSpan="6" className="p-2 text-center">
                                <div className="absolute inset-0 bg-[#0B0F1A]/50 backdrop-blur-[1px] flex items-center justify-center z-10 py-10">
                                  <div className="flex items-center space-x-2 text-[#facc15] font-black text-xs uppercase tracking-widest italic animate-pulse">
                                    <Clock size={14} />
                                    <span>Veritabanı Senkronize Ediliyor...</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
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
                                  onChange={async (e) => { 
                                    const newStatus = e.target.value;
                                    try {
                                      const { error } = await supabase
                                        .from('applications')
                                        .update({ status: newStatus })
                                        .eq('id', lead.id);
                                      
                                      if (error) throw error;
                                      
                                      const newLeads = leads.map(l => l.id === lead.id ? {...l, status: newStatus, isNew: false} : l);
                                      setLeads(newLeads); 
                                      showToast('Durum güncellendi'); 
                                    } catch (err) {
                                      console.error("Status update error:", err);
                                      showToast('Durum güncellenemedi');
                                    }
                                  }}
                                  className="bg-[#0B0F1A] border border-white/10 text-xs font-bold px-3 py-2 rounded-lg outline-none focus:border-[#facc15]"
                                >
                                  <option value="İşlemde">İşlemde</option>
                                  <option value="Tamamlandı">Tamamlandı</option>
                                  <option value="Reddedildi">Reddedildi</option>
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
                                <button onClick={async () => { 
                                  if(window.confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) { 
                                    try {
                                      const { error } = await supabase
                                        .from('applications')
                                        .delete()
                                        .eq('id', lead.id);
                                      
                                      if (error) throw error;
                                      
                                      setLeads(leads.filter(l => l.id !== lead.id));
                                      showToast('Başvuru silindi');
                                    } catch (err) {
                                      console.error("Delete error:", err);
                                      showToast('Silme işlemi başarısız');
                                    }
                                  } 
                                }} className="inline-flex p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
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
                      <button onClick={() => setShowNewReviewForm(!showNewReviewForm)} className="bg-white/10 hover:bg-[#facc15] text-white hover:text-[#0B0F1A] font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
                        <Plus size={16} /> <span>{showNewReviewForm ? 'Formu Kapat' : 'Yeni Yorum Ekle'}</span>
                      </button>
                    </div>

                    {showNewReviewForm && (
                      <div className="glass p-6 rounded-xl space-y-6 border border-[#facc15]/30 mb-8">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-[#facc15]">Yeni Yorum Ekle</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ad Soyad</label>
                            <input value={newReviewData.name} onChange={(e) => setNewReviewData({...newReviewData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#facc15]" placeholder="Örn: Ahmet Yılmaz" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ülke</label>
                            <select value={newReviewData.country} onChange={(e) => setNewReviewData({...newReviewData, country: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#facc15]">
                              <option className="bg-[#0B0F1A]" value="Almanya">Almanya</option>
                              <option className="bg-[#0B0F1A]" value="Polonya">Polonya</option>
                              <option className="bg-[#0B0F1A]" value="Litvanya">Litvanya</option>
                              <option className="bg-[#0B0F1A]" value="Hollanda">Hollanda</option>
                              <option className="bg-[#0B0F1A]" value="Belçika">Belçika</option>
                              <option className="bg-[#0B0F1A]" value="diğer">Diğer</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Vize Tipi</label>
                            <input value={newReviewData.visa_type} onChange={(e) => setNewReviewData({...newReviewData, visa_type: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#facc15]" placeholder="Örn: D Tipi Ulusal Vize" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Kaç Gün/Hafta Önce</label>
                            <input value={newReviewData.time_ago} onChange={(e) => setNewReviewData({...newReviewData, time_ago: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#facc15]" placeholder="Örn: 3 gün önce" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Beğeni Sayısı</label>
                            <input type="number" value={newReviewData.likes} onChange={(e) => setNewReviewData({...newReviewData, likes: parseInt(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#facc15]" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Yorum Sayısı</label>
                            <input type="number" value={newReviewData.comments_count} onChange={(e) => setNewReviewData({...newReviewData, comments_count: parseInt(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#facc15]" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Yorum Metni</label>
                          <textarea value={newReviewData.comment} onChange={(e) => setNewReviewData({...newReviewData, comment: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-lg text-sm text-gray-300 outline-none focus:border-[#facc15] min-h-[80px]" placeholder="Yorum içeriği..." />
                        </div>
                        <div className="flex justify-end pt-4 border-t border-white/5">
                          <button onClick={async () => {
                            try {
                              const { error } = await supabase.from('testimonials').insert([newReviewData]);
                              if (error) throw error;
                              showToast('Yorum başarıyla kaydedildi!');
                              setShowNewReviewForm(false);
                              setNewReviewData({ name: '', country: 'Almanya', visa_type: '', comment: '', likes: 0, comments_count: 0, time_ago: '3 gün önce', is_active: true });
                              fetchAllData();
                            } catch (err) {
                              console.error("TESTIMONIALS INSERT ERROR:", err);
                              showToast('Yorum kaydedilirken bir hata oluştu.');
                            }
                          }} className="bg-[#facc15] text-[#0B0F1A] font-black px-8 py-3 rounded-lg flex items-center space-x-2 hover:scale-105 transition-all">
                            <Save size={18} /> <span>YORUMLARI YAYINLA</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-6">
                      {isTestimonialsLoading ? (
                        <div className="text-center text-gray-500 animate-pulse py-10">Yorumlar Yükleniyor...</div>
                      ) : (
                        testimonials.map((review) => (
                          <div key={review.id} className="glass p-6 rounded-xl space-y-6 border border-white/5">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-lg font-black text-white">{review.name}</h4>
                                <p className="text-xs text-[#facc15] font-bold">{review.visa_type} - {review.country}</p>
                              </div>
                              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${review.is_active ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                                {review.is_active ? 'Yayında' : 'Gizli'}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 font-bold">
                              <span>Beğeni: {review.likes}</span>
                              <span>Yorum: {review.comments_count}</span>
                              <span>Zaman: {review.time_ago}</span>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
                              <button onClick={async () => {
                                const newStatus = !review.is_active;
                                try {
                                  const { error } = await supabase.from('testimonials').update({ is_active: newStatus }).eq('id', review.id);
                                  if (error) throw error;
                                  showToast(newStatus ? 'Yorum yayına alındı!' : 'Yorum gizlendi.');
                                  fetchAllData();
                                } catch (err) {
                                  console.error(err);
                                  showToast('Durum güncellenemedi.');
                                }
                              }} className="bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-lg transition-all text-xs font-bold flex items-center space-x-2">
                                <Edit size={14} /> <span>{review.is_active ? 'Gizle' : 'Yayınla'}</span>
                              </button>
                              <button onClick={async () => {
                                if(window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
                                  try {
                                    const { error } = await supabase.from('testimonials').delete().eq('id', review.id);
                                    if (error) throw error;
                                    showToast('Yorum silindi!');
                                    fetchAllData();
                                  } catch (err) {
                                    console.error(err);
                                    showToast('Yorum silinirken hata oluştu.');
                                  }
                                }
                              }} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition-all text-xs font-bold flex items-center space-x-2">
                                <Trash2 size={14} /> <span>Yorumu Kaldır</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {adminTab === 'blog' && (
                  <div className="space-y-6 animate-fade-up">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-gray-500 font-medium text-sm">Blog içeriklerinizi buradan yönetin.</p>
                      <button onClick={() => setShowNewBlogForm(!showNewBlogForm)} className="bg-white/10 hover:bg-[#facc15] text-white hover:text-[#0B0F1A] font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
                        <Plus size={16} /> <span>{showNewBlogForm ? 'Formu Kapat' : 'Yeni Yazı Ekle'}</span>
                      </button>
                    </div>

                    {showNewBlogForm && (
                      <div className="glass p-6 rounded-xl space-y-6 border border-[#facc15]/30 mb-8">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-[#facc15]">Yeni Yazı</h3>
                        <div className="grid grid-cols-1 gap-6">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Başlık</label>
                            <input value={newBlogData.title} onChange={(e) => setNewBlogData({...newBlogData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#facc15]" />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Slug (URL)</label>
                              <input value={newBlogData.slug} onChange={(e) => setNewBlogData({...newBlogData, slug: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#facc15] text-gray-400" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Kategori</label>
                              <input value={newBlogData.category} onChange={(e) => setNewBlogData({...newBlogData, category: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#facc15]" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Kapak Görseli</label>
                            <input type="file" accept="image/*" onChange={async (e) => {
                              const file = e.target.files[0];
                              if(!file) return;
                              showToast('Görsel yükleniyor...');
                              try {
                                const { data, error } = await supabase.storage.from('blog-images').upload(`${Date.now()}-${file.name}`, file);
                                if (error) throw error;
                                const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(data.path);
                                setNewBlogData({...newBlogData, cover_image: urlData.publicUrl});
                                showToast('Görsel başarıyla yüklendi!');
                              } catch (err) {
                                console.error('IMAGE UPLOAD ERROR:', err);
                                showToast('Görsel yüklenirken hata oluştu.');
                              }
                            }} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#facc15] text-gray-300" />
                            {newBlogData.cover_image && <div className="mt-2 text-xs text-green-400 font-bold flex items-center space-x-1"><span>✓ Görsel Yüklendi:</span> <a href={newBlogData.cover_image} target="_blank" rel="noreferrer" className="underline truncate block max-w-xs">{newBlogData.cover_image}</a></div>}
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Özet</label>
                            <textarea value={newBlogData.summary} onChange={(e) => setNewBlogData({...newBlogData, summary: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-lg text-sm text-gray-300 outline-none focus:border-[#facc15] min-h-[60px]" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">İçerik</label>
                            <textarea value={newBlogData.content} onChange={(e) => setNewBlogData({...newBlogData, content: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-lg text-sm text-gray-300 outline-none focus:border-[#facc15] min-h-[200px]" />
                          </div>
                          <div className="flex items-center space-x-3">
                            <input type="checkbox" id="is_pub" checked={newBlogData.is_published} onChange={(e) => setNewBlogData({...newBlogData, is_published: e.target.checked})} className="w-4 h-4 accent-[#facc15]" />
                            <label htmlFor="is_pub" className="text-sm font-bold text-white cursor-pointer">Yayınla (Aktif)</label>
                          </div>
                        </div>
                        <div className="flex justify-end pt-4 border-t border-white/5">
                          <button onClick={async () => {
                            try {
                              const { error } = await supabase.from('blog_posts').insert([newBlogData]);
                              if (error) throw error;
                              showToast('Blog yazısı başarıyla eklendi!');
                              setShowNewBlogForm(false);
                              setNewBlogData({ title: '', slug: '', summary: '', content: '', category: 'Vize Rehberi', cover_image: '', is_published: true });
                              fetchAllData();
                            } catch (err) {
                              console.error("BLOG INSERT ERROR:", err);
                              showToast('Blog eklenirken hata oluştu.');
                            }
                          }} className="bg-[#facc15] text-[#0B0F1A] font-black px-8 py-3 rounded-lg flex items-center space-x-2 hover:scale-105 transition-all">
                            <Save size={18} /> <span>YAZIYI KAYDET</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-6">
                      {isBlogLoading ? (
                        <div className="text-center text-gray-500 animate-pulse py-10">Yazılar Yükleniyor...</div>
                      ) : (
                        blogPosts.map((post) => (
                          <div key={post.id} className="glass p-6 rounded-xl space-y-4 border border-white/5">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-lg font-black text-white">{post.title}</h4>
                                <p className="text-xs text-[#facc15] font-bold">/{post.slug}</p>
                              </div>
                              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${post.is_published ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                                {post.is_published ? 'Yayında' : 'Taslak'}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{post.summary}</p>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
                              <button onClick={async () => {
                                const newStatus = !post.is_published;
                                try {
                                  const { error } = await supabase.from('blog_posts').update({ is_published: newStatus }).eq('id', post.id);
                                  if (error) throw error;
                                  showToast(newStatus ? 'Yazı yayına alındı!' : 'Yazı taslağa çekildi.');
                                  fetchAllData();
                                } catch (err) {
                                  console.error(err);
                                  showToast('Durum güncellenemedi.');
                                }
                              }} className="bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-lg transition-all text-xs font-bold flex items-center space-x-2">
                                <Edit size={14} /> <span>{post.is_published ? 'Gizle' : 'Yayınla'}</span>
                              </button>
                              <button onClick={async () => {
                                if(window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
                                  try {
                                    const { error } = await supabase.from('blog_posts').delete().eq('id', post.id);
                                    if (error) throw error;
                                    showToast('Yazı silindi!');
                                    fetchAllData();
                                  } catch (err) {
                                    console.error(err);
                                    showToast('Yazı silinirken hata oluştu.');
                                  }
                                }
                              }} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition-all text-xs font-bold flex items-center space-x-2">
                                <Trash2 size={14} /> <span>Yazıyı Sil</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {adminTab === 'settings' && (
                  <div className="space-y-8 animate-fade-up max-w-2xl">
                    <div className="glass p-8 rounded-xl space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Site Başlığı</label>
                        <input 
                          value={siteSettings?.title || ''} 
                          onChange={(e) => setSiteSettings({...siteSettings, title: e.target.value})}
                          className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-lg font-bold text-white outline-none focus:border-[#facc15]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">İletişim Telefonu</label>
                        <input 
                          value={siteSettings?.phone || ''} 
                          onChange={(e) => setSiteSettings({...siteSettings, phone: e.target.value})}
                          className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-lg font-bold text-white outline-none focus:border-[#facc15]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">WhatsApp Numarası (Uluslararası Format)</label>
                        <input 
                          value={siteSettings?.whatsapp || ''} 
                          onChange={(e) => setSiteSettings({...siteSettings, whatsapp: e.target.value})}
                          className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-lg font-bold text-white outline-none focus:border-[#facc15]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <button onClick={async () => {
                        try {
                          const { error } = await supabase.from('site_settings').update({
                            title: siteSettings.title,
                            phone: siteSettings.phone,
                            whatsapp: siteSettings.whatsapp
                          }).eq('id', 1); // Varsayılan id 1
                          
                          if (error) throw error;
                          showToast('Site ayarları kaydedildi!');
                          fetchAllData(); // Refresh UI including document title
                        } catch (err) {
                          console.error(err);
                          showToast('Ayarlar kaydedilirken hata oluştu.');
                        }
                      }} className="bg-[#facc15] text-[#0B0F1A] font-black px-8 py-3 rounded-lg flex items-center space-x-2 hover:scale-105 transition-all">
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
        ) : null}

      {/* WHATSAPP FLOAT */}
      {!currentPage.startsWith('admin') && (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 group flex items-center">
          <div className="mr-4 bg-white text-[#0B0F1A] px-4 py-2 rounded-lg shadow-2xl font-black text-sm italic tracking-tight opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 border border-gray-200 relative pointer-events-none">
            Size nasıl yardımcı olabiliriz?
            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-white border-b-[6px] border-b-transparent"></div>
          </div>
          <a
            href={getWhatsAppURL()}
            target="_blank"
            rel="noreferrer"
            className="relative block transition-transform hover:scale-110"
          >
            <div className="bg-[#25D366] px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.5)] flex items-center space-x-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span className="text-white font-black italic tracking-wide">Danışmana Yaz</span>
            </div>
          </a>
        </div>
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

      {/* FOOTER */}
      {!currentPage.startsWith('admin') && (
        <footer className="bg-[#05070A] pt-32 pb-16 px-6 border-t border-white/5 mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
              <div className="space-y-8">
                <img src={logoImg} alt="CMSVize Logo" className="footer-logo h-16 w-auto" loading="lazy" decoding="async" />
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  Avrupa vizeleri ve oturum izinleri konusunda profesyonel çözüm ortağınız.
                </p>
                <div className="flex space-x-4">
                  <a href="https://www.instagram.com/cmsprime/" target="_blank" rel="noreferrer" className="w-10 h-10 glass rounded-full flex items-center justify-center text-gray-400 hover:text-[#facc15] transition-colors"><InstagramIcon size={18} /></a>
                  <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center text-gray-400 hover:text-[#facc15] transition-colors"><Globe size={18} /></a>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-lg font-black italic uppercase tracking-widest border-l-4 border-[#facc15] pl-4">Türkiye Ofisi</h4>
                <div className="space-y-4 text-sm text-gray-400 font-bold">
                  <div className="flex items-start space-x-3">
                    <MapPin size={18} className="text-[#facc15] mt-1 flex-shrink-0" />
                    <p className="md:hidden">Bankalar Cad. No:12, Aksaray</p>
                    <p className="hidden md:block">Zafer Mahallesi, Bankalar Caddesi No:12 Kat:3 Merkez / Aksaray</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-[#facc15]" />
                    <p>+90 545 991 82 68</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-lg font-black italic uppercase tracking-widest border-l-4 border-[#facc15] pl-4">Avrupa Ofisi</h4>
                <div className="space-y-4 text-sm text-gray-400 font-bold">
                  <div className="flex items-start space-x-3">
                    <MapPin size={18} className="text-[#facc15] mt-1 flex-shrink-0" />
                    <p className="md:hidden">Gedimino pr. 20, Vilnius</p>
                    <p className="hidden md:block">Gedimino pr. 20, Vilnius 01103 Lietuva (Litvanya)</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-[#facc15]" />
                    <p>+370 600 12345</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-lg font-black italic uppercase tracking-widest border-l-4 border-[#facc15] pl-4">İletişim & Mesai</h4>
                <div className="space-y-4 text-sm text-gray-400 font-bold">
                  <div className="flex items-center space-x-3">
                    <Mail size={16} className="text-[#facc15]" />
                    <p>info@cmsvize.com</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock size={16} className="text-[#facc15]" />
                    <p>Pzt-Cum: 09:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center py-12 border-y border-white/5 gap-8 mb-12">
              <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                <span className="flex items-center space-x-2"><Lock size={14} className="text-[#facc15]" /> <span>SSL GÜVENLİ</span></span>
                <span className="flex items-center space-x-2"><CheckCircle2 size={14} className="text-[#facc15]" /> <span>KVKK UYUMLU</span></span>
                <span className="flex items-center space-x-2"><ShieldCheck size={14} className="text-[#facc15]" /> <span>RESMİ DANIŞMANLIK</span></span>
                <span className="flex items-center space-x-2"><Users size={14} className="text-[#facc15]" /> <span>500+ BAŞARILI BAŞVURU</span></span>
              </div>
              <div className="flex space-x-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <button onClick={() => setCurrentPage('privacy')} className="hover:text-[#facc15] transition-colors">GİZLİLİK POLİTİKASI</button>
                <button onClick={() => setCurrentPage('terms')} className="hover:text-[#facc15] transition-colors">KULLANIM KOŞULLARI</button>
                <button onClick={() => setCurrentPage('cookies')} className="hover:text-[#facc15] transition-colors">ÇEREZ POLİTİKASI</button>
              </div>
            </div>

            <div className="text-center text-[10px] font-bold text-gray-600 tracking-[0.3em] uppercase">
              © 2026 CMSVIZE GLOBAL CONSULTANCY. TÜM HAKLARI SAKLIDIR.
            </div>
          </div>
        </footer>
      )}

      {/* COOKIE CONSENT BANNER */}
      {!cookieConsent && (
        <div className="fixed bottom-6 left-6 right-6 md:right-auto md:left-10 md:w-[400px] z-[100] animate-fade-up">
          <div className="glass p-6 rounded-2xl border border-[#facc15]/30 shadow-2xl space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🍪</span>
              <p className="text-xs text-gray-300 leading-relaxed">
                Bu site daha iyi bir deneyim sunmak için çerez kullanmaktadır. Çerezler hakkında detaylı bilgi için <button onClick={() => setCurrentPage('cookies')} className="text-[#facc15] hover:underline">Çerez Politikası</button> sayfamızı ziyaret edebilirsiniz.
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  localStorage.setItem('cookieConsent', 'accepted');
                  setCookieConsent('accepted');
                }}
                className="flex-1 bg-[#facc15] text-black text-[10px] font-black uppercase py-2.5 rounded-lg hover:scale-[1.02] transition-transform"
              >
                Kabul Et
              </button>
              <button 
                onClick={() => {
                  localStorage.setItem('cookieConsent', 'rejected');
                  setCookieConsent('rejected');
                }}
                className="flex-1 glass text-white text-[10px] font-black uppercase py-2.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                Reddet
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
  );
};

export default App;