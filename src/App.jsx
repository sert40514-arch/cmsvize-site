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

// Corporate Design System Colors - Redesigned Palette
const colors = {
  primary: "#0F2557",
  primaryLight: "#1A3A7C",
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  dark: "#080F20",
  white: "#FFFFFF",
  gray: "#F4F6FA",
  text: "#1A1A2E",
  textLight: "#6B7280",
  border: "#E2E8F0",
};

const STATS_DEFAULTS = { success: 98, clients: 2500, countries: 15 };
const darkBg = colors.bgMain;

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

// Helper to create TrustedHTML if Trusted Types is enabled
const getTrustedHTML = (html) => {
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    if (!window.trustedTypes.defaultPolicy) {
      try {
        window.trustedTypes.createPolicy('default', {
          createHTML: (string) => string,
          createScript: (string) => string,
          createScriptURL: (string) => string
        });
      } catch (e) {
        // Policy might already exist
      }
    }
    try {
      return window.trustedTypes.defaultPolicy.createHTML(html);
    } catch (e) {
      return html;
    }
  }
  return html;
};

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
  const [isTurnstileVerified, setIsTurnstileVerified] = useState(true);
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

  // Data Integrity Guard - ESLint bu pattern'i uyarıyor ama initialization için gerekli
  useEffect(() => {
    if (!siteContent?.stats) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Path Detection and Auth Check - ESLint bu pattern'i uyarıyor ama initialization için gerekli
  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    const isLoggedIn = auth === 'true';
    if (isLoggedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <div className="min-h-screen font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden" style={{ backgroundColor: colors.bgMain }}>
      {/* Corporate Design System - Enhanced CSS */}
      <style>{`
        /* ===== CORPORATE DESIGN TOKENS ===== */
        :root {
          --color-primary: ${colors.primary};
          --color-primary-light: ${colors.primaryLight};
          --color-accent: ${colors.accent};
          --color-bg-main: ${colors.bgMain};
          --color-bg-secondary: ${colors.bgSecondary};
          --color-text-primary: ${colors.textPrimary};
          --color-text-secondary: ${colors.textSecondary};
          --color-border: ${colors.border};
          --space-xs: 0.5rem;
          --space-sm: 1rem;
          --space-md: 1.5rem;
          --space-lg: 2rem;
          --space-xl: 3rem;
          --space-2xl: 4rem;
          --radius-sm: 6px;
          --radius-md: 10px;
          --radius-lg: 16px;
          --radius-xl: 24px;
          --shadow-sm: 0 2px 8px rgba(0,0,0,0.2);
          --shadow-md: 0 4px 16px rgba(0,0,0,0.3);
          --shadow-lg: 0 8px 32px rgba(0,0,0,0.4);
          --transition-base: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        /* ===== BASE ANIMATIONS ===== */
        @keyframes fade-up { 
          from { opacity: 0; transform: translateY(40px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-up { 
          animation: fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }

        :root {
          --primary: ${colors.primary};
          --primary-light: ${colors.primaryLight};
          --gold: ${colors.gold};
          --gold-light: ${colors.goldLight};
          --dark: ${colors.dark};
          --white: ${colors.white};
          --gray: ${colors.gray};
          --text: ${colors.text};
          --text-light: ${colors.textLight};
          --border: ${colors.border};
          --font-main: 'Inter', sans-serif;
          --font-title: 'Playfair Display', serif;
          --transition-base: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        body {
          font-family: var(--font-main);
          color: var(--text);
          background-color: var(--white);
          margin: 0;
          padding: 0;
        }

        h1, h2, h3, h4, .font-title {
          font-family: var(--font-title);
        }

        /* ===== SCROLL REVEAL ===== */
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-out;
        }
        .reveal-active {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        /* ===== NAVIGATION ===== */
        .top-bar {
          background-color: var(--primary);
          color: var(--white);
          height: 40px;
          display: flex;
          align-items: center;
          font-size: 13px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 10000;
        }
        nav {
          position: fixed;
          top: 40px;
          left: 0;
          right: 0;
          z-index: 9999;
          background: white;
          border-bottom: 1px solid #E2E8F0;
        }
        .navbar {
          height: 80px;
          display: flex;
          align-items: center;
          width: 100%;
          transition: all 0.3s ease;
        }
        .page-content, main, #root > div {
          padding-top: 110px;
        }
        .navbar.scrolled {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .nav-link {
          color: var(--text);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 14px;
          transition: color 0.2s ease;
        }
        .nav-link:hover {
          color: var(--gold);
        }
        .btn-gold {
          background-color: var(--gold);
          color: var(--primary);
          padding: 10px 24px;
          border-radius: 4px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.2s ease;
        }
        .btn-gold:hover {
          background-color: var(--gold-light);
          transform: translateY(-1px);
        }

        /* ===== HERO SECTION ===== */
        .hero-section {
          background: linear-gradient(135deg, var(--primary) 0%, var(--dark) 100%);
          color: var(--white);
          padding: 100px 0;
          position: relative;
          overflow: hidden;
        }
        .hero-tag {
          color: var(--gold);
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
          display: inline-block;
        }
        .hero-title {
          font-size: 52px;
          line-height: 1.1;
          margin-bottom: 24px;
        }
        .hero-title span {
          color: var(--gold);
          text-decoration: underline;
        }
        .hero-subtitle {
          font-size: 16px;
          color: #94A3B8;
          max-width: 500px;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .hero-btn-outline {
          border: 1px solid var(--gold);
          color: var(--gold);
          padding: 14px 28px;
          border-radius: 4px;
          font-weight: 700;
          transition: all 0.2s ease;
        }
        .hero-btn-outline:hover {
          background: rgba(201, 168, 76, 0.1);
        }
        .hero-card {
          background: var(--white);
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          color: var(--primary);
        }

        /* ===== STATISTICS ===== */
        .stats-section {
          background-color: var(--gray);
          padding: 60px 0;
        }
        .stat-item {
          border-top: 2px solid var(--gold);
          padding-top: 20px;
        }
        .stat-number {
          font-size: 48px;
          color: var(--primary);
          font-weight: 700;
          margin-bottom: 8px;
        }
        .stat-label {
          color: var(--text-light);
          font-size: 14px;
          font-weight: 500;
        }

        /* ===== SERVICES ===== */
        .service-card {
          background: var(--white);
          padding: 32px;
          border-radius: 8px;
          transition: all 0.3s ease;
          border: 1px solid var(--border);
          height: 100%;
        }
        .service-card:hover {
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border-top: 4px solid var(--gold);
          transform: translateY(-5px);
        }
        .icon-box {
          width: 40px;
          height: 40px;
          background: var(--primary);
          color: var(--white);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        /* ===== WHY US ===== */
        .why-us-section {
          background-color: var(--primary);
          color: var(--white);
          padding: 100px 0;
        }
        .check-item {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        .check-icon {
          color: var(--gold);
          margin-right: 12px;
        }

        /* ===== TIMELINE ===== */
        .timeline-section {
          background-color: var(--gray);
          padding: 100px 0;
        }
        .timeline-step {
          position: relative;
          text-align: center;
        }
        .timeline-number {
          width: 40px;
          height: 40px;
          background: var(--primary);
          color: var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-weight: 700;
          z-index: 2;
          position: relative;
        }
        .timeline-line {
          position: absolute;
          top: 20px;
          left: 50%;
          width: 100%;
          height: 2px;
          background-color: var(--gold);
          z-index: 1;
        }

        /* ===== TESTIMONIALS ===== */
        .testimonial-card {
          background: var(--gray);
          padding: 24px;
          border-radius: 8px;
          border-top: 3px solid var(--primary);
        }
        .testimonial-name {
          color: var(--primary);
          font-weight: 700;
        }
        .testimonial-badge {
          background: var(--primary);
          color: var(--white);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          text-transform: uppercase;
        }

        /* ===== BLOG ===== */
        .blog-section {
          background-color: var(--gray);
          padding: 100px 0;
        }
        .blog-card {
          background: var(--white);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .blog-card:hover {
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .category-badge {
          background: var(--primary);
          color: var(--white);
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 600;
        }

        /* ===== FOOTER ===== */
        .footer {
          background-color: var(--dark);
          color: var(--white);
          padding: 80px 0 20px;
        }
        .footer-icon {
          color: var(--gold);
        }

        /* ===== MOBILE RULES ===== */
        @media (max-width: 768px) {
          .top-bar { display: none !important; }
          main, #root > div > div:not(nav):first-child { margin-top: 70px; }
          .navbar { height: 70px !important; top: 0 !important; }
          .hero-title { font-size: 36px; }
          .hero-section { padding: 60px 0; padding-top: 80px; }
          section { padding: 40px 16px; }
          h1 { font-size: 28px !important; }
          h2 { font-size: 22px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .service-grid { grid-template-columns: 1fr !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          
          * { 
            animation: none !important; 
            transition: none !important; 
          }
        }
      `}</style>

      {/* TOP BAR */}
      {!currentPage.startsWith('admin') && (
        <div className="top-bar px-6">
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center font-medium">
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-2"><Phone size={14} className="text-[#C9A84C]" /> <span>+90 545 991 82 68</span></span>
              <span className="hidden sm:flex items-center space-x-2"><Mail size={14} className="text-[#C9A84C]" /> <span>info@cmsvize.com</span></span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="hidden lg:flex items-center space-x-2"><Clock size={14} className="text-[#C9A84C]" /> <span>Pzt-Cum 09:00-18:00</span></span>
              <span className="flex items-center space-x-2"><MapPin size={14} className="text-[#C9A84C]" /> <span>TR Ofis: Aksaray</span></span>
              <span className="hidden xs:flex items-center space-x-2"><MapPin size={14} className="text-[#C9A84C]" /> <span>LT Ofis: Vilnius</span></span>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      {!currentPage.startsWith('admin') && (
        <nav className={`fixed top-10 left-0 w-full z-50 transition-all duration-300 h-20 flex items-center ${scrolled ? 'bg-[#0f172a]/90 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.3)] border-b border-white/5' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
            <div onClick={() => setCurrentPage('home')} className="nav-logo-container flex items-center group cursor-pointer">
              <img src={logoImg} alt="CMSVize - Avrupa Vize ve Çalışma İzni Danışmanlığı" className="nav-logo h-[50px] w-auto object-contain transition-transform group-hover:scale-105" loading="lazy" decoding="async" />
            </div>

            <div className="hidden lg:flex items-center space-x-10 font-bold text-xs tracking-[0.15em]">
              <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('hizmetler')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-[#d69e2e] transition-colors uppercase tracking-widest">HİZMETLER</button>
              <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('referanslar')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-[#d69e2e] transition-colors uppercase tracking-widest">REFERANSLAR</button>
              <button onClick={() => setCurrentPage('guides_main')} className={`hover:text-[#d69e2e] transition-colors uppercase tracking-widest ${['guides_main', 'guide_litvanya', 'guide_almanya', 'guide_polonya'].includes(currentPage) ? 'text-[#d69e2e]' : ''}`}>VİZE REHBERİ</button>
              <button onClick={() => setCurrentPage('portal')} className={`hover:text-[#d69e2e] transition-colors flex items-center space-x-1 uppercase tracking-widest ${currentPage === 'portal' ? 'text-[#d69e2e]' : ''}`}><User size={14} /><span>PORTAL</span></button>

              <div className="flex items-center space-x-4 border border-white/10 p-1.5 rounded-lg bg-[#1e293b]">
                <button onClick={() => setShowTrackingModal(true)} className="btn-corporate px-6 py-2.5 text-gray-300 hover:text-white font-black flex items-center space-x-2 transition-all hover:bg-white/5 rounded-md">
                  <Search size={16} className="text-[#3b82f6]" />
                  <span>BAŞVURU TAKİP</span>
                </button>
                <button onClick={scrollToForm} className="btn-gold">
                  BAŞVURU BAŞLAT
                </button>
              </div>
            </div>

            <button className="lg:hidden p-2 text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </nav>
      )}

      {/* RENDER PAGES */}
      {currentPage === 'home' ? (
        <>
          {/* HERO SECTION */}
          <section className="hero-section">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-12 gap-12 items-center hero-grid">
                {/* Sol Kolon */}
                <div className="lg:col-span-7">
                  <span className="hero-tag">🏆 TÜRKİYE'NİN ÖNCÜ VİZE DANIŞMANLIĞI</span>
                  <h1 className="hero-title">
                    Avrupa'da<br />
                    <span>Yeni Bir Hayat</span><br />
                    Kurun
                  </h1>
                  <p className="hero-subtitle">
                    Litvanya, Almanya ve Polonya vize ve oturum izni süreçlerinde 500+ başarılı başvuruyla yanınızdayız.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-12">
                    <button onClick={scrollToForm} className="btn-gold px-8 py-4 text-lg">ÜCRETSİZ BAŞVURU BAŞLAT</button>
                    <button onClick={() => setShowWizard(true)} className="hero-btn-outline">UYGUNLUK TESTİ</button>
                  </div>

                  <div className="flex items-center space-x-8 text-sm text-gray-400">
                    <span className="flex items-center space-x-2"><ShieldCheck size={18} className="text-[#C9A84C]" /> <span>SSL Güvenli</span></span>
                    <span className="flex items-center space-x-2"><CheckCircle2 size={18} className="text-[#C9A84C]" /> <span>✓ KVKK</span></span>
                    <span className="flex items-center space-x-2"><Star size={18} className="text-[#C9A84C]" /> <span>⭐ %95+ Onay</span></span>
                  </div>
                </div>

                {/* Sağ Kolon */}
                <div className="lg:col-span-5">
                  <div className="hero-card">
                    <h3 className="text-2xl font-bold mb-2 text-primary font-title">Ücretsiz Ön Değerlendirme</h3>
                    <p className="text-sm text-gray-500 mb-6">24 saat içinde uzmanımız sizi arar</p>
                    
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <input 
                        type="text" 
                        name="name"
                        placeholder="Ad Soyad" 
                        className="w-full p-4 border border-border rounded-lg bg-gray-50 focus:border-gold outline-none"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      <input 
                        type="tel" 
                        name="phone"
                        placeholder="Telefon" 
                        className="w-full p-4 border border-border rounded-lg bg-gray-50 focus:border-gold outline-none"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                      <select 
                        name="country"
                        className="w-full p-4 border border-border rounded-lg bg-gray-50 focus:border-gold outline-none"
                        value={formData.country}
                        onChange={handleInputChange}
                      >
                        <option>Litvanya</option>
                        <option>Almanya</option>
                        <option>Polonya</option>
                        <option>Hollanda</option>
                      </select>
                      <select 
                        name="workField"
                        className="w-full p-4 border border-border rounded-lg bg-gray-50 focus:border-gold outline-none"
                        value={formData.workField}
                        onChange={handleInputChange}
                      >
                        <option>Oturum İzni</option>
                        <option>Çalışma Vizesi</option>
                        <option>Schengen Vizesi</option>
                        <option>D Tipi Ulusal Vize</option>
                      </select>
                      
                      {/* Security */}
                      <div className="flex justify-center py-2">
                        <Turnstile
                          sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAAA4uW9S9j_f3s_2j"}
                          onVerify={(token) => {
                            setTurnstileToken(token);
                            setIsTurnstileVerified(true);
                          }}
                        />
                      </div>

                      <button type="submit" className="w-full btn-gold py-4 rounded-lg flex items-center justify-center space-x-2">
                        <span>HEMEN BAŞVUR</span>
                        <ChevronRight size={18} />
                      </button>
                      <p className="text-[11px] text-center text-gray-400 mt-4">
                        🔒 Bilgileriniz güvende. KVKK kapsamında korunur.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* İSTATİSTİKLER BÖLÜMÜ */}
          <section className="stats-section" id="stats-section">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="stat-item reveal-on-scroll">
                  <p className="stat-number font-title">{counts.success}+</p>
                  <p className="stat-label">Başarılı Başvuru</p>
                </div>
                <div className="stat-item reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
                  <p className="stat-number font-title">%{counts.approval}</p>
                  <p className="stat-label">Onay Oranı</p>
                </div>
                <div className="stat-item reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
                  <p className="stat-number font-title">{counts.years}+</p>
                  <p className="stat-label">Yıl Deneyim</p>
                </div>
                <div className="stat-item reveal-on-scroll" style={{ transitionDelay: '0.3s' }}>
                  <p className="stat-number font-title">27</p>
                  <p className="stat-label">Schengen Ülkesi</p>
                </div>
              </div>
            </div>
          </section>

          {/* NEDEN BİZ? */}
          <section className="py-24 px-6 bg-primary text-white reveal-on-scroll">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl lg:text-5xl font-title uppercase">Neden <span className="text-gold">CMSVize?</span></h2>
                <p className="text-gray-300">Profesyonel yaklaşımımızla fark yaratıyoruz.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  "Türkiye & Litvanya'da Fiziksel Ofis",
                  "%95+ Onay Oranı ile Kanıtlanmış Başarı",
                  "Anahtar Teslim Süreç Yönetimi",
                  "7/24 WhatsApp Destek Hattı",
                  "KVKK Uyumlu Veri Güvenliği",
                  "Uzman Hukuki Danışmanlık Desteği"
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-4 border border-white/10 p-6 rounded-lg hover:border-gold transition-colors">
                    <CheckCircle2 size={24} className="text-gold flex-shrink-0" />
                    <span className="font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>


          {/* STATS TICKER */}
          <div className="bg-primary py-8 border-y border-gold/30 overflow-hidden relative z-20">
            <div className="flex whitespace-nowrap animate-marquee">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center space-x-12 px-6 text-white font-bold text-xl uppercase tracking-widest">
                  <span>Avrupa'da Kariyer</span> <Star size={20} className="text-gold" fill="currentColor" />
                  <span>A1 Transfer &amp; Sigorta</span> <Star size={20} className="text-gold" fill="currentColor" />
                  <span>Fabrika &amp; Depo İşleri</span> <Star size={20} className="text-gold" fill="currentColor" />
                  <span>2 Yıllık Oturum Kartı</span> <Star size={20} className="text-gold" fill="currentColor" />
                </div>
              ))}
            </div>
          </div>

          {/* PDF LEAD MAGNET SECTION */}
          <section className="py-24 px-6 bg-white border-b border-border">
            <div className="max-w-7xl mx-auto">
              <div className="bg-primary rounded-2xl p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                <div className="space-y-6 flex-1 text-center lg:text-left relative z-10">
                  <div className="inline-block bg-gold px-4 py-1 rounded text-primary font-bold text-xs tracking-widest uppercase">
                    ÜCRETSİZ PREMİUM REHBER
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-title text-white leading-tight">
                    2026 Litvanya 2 Yıllık <br />
                    <span className="text-gold">Oturum Kartı Rehberi</span>
                  </h2>
                  <p className="text-gray-300 text-lg max-w-xl">
                    Süreçler, gerekli belgeler ve Schengen haklarını içeren kapsamlı rehberi ücretsiz indirin.
                  </p>
                </div>
                <div className="w-full lg:w-auto relative z-10">
                  <button 
                    onClick={() => setShowPdfModal(true)} 
                    className="btn-gold w-full lg:w-auto px-12 py-5 text-lg"
                  >
                    ÜCRETSİZ REHBERİ AL
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* PDF LEAD MODAL */}
          {showPdfModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-md" onClick={() => !isPdfSubmitting && setShowPdfModal(false)}></div>
              <div className="bg-[#1e293b] border border-[#d69e2e]/30 rounded-2xl p-8 max-w-md w-full relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-fade-up max-h-[90vh] overflow-y-auto">
                <button onClick={() => !isPdfSubmitting && setShowPdfModal(false)} className="absolute top-4 right-4 text-gray-300 hover:text-white bg-white/5 rounded-full p-2 transition-colors">
                  <X size={20} />
                </button>
                
                <div className="text-center space-y-4 mb-8">
                  <div className="w-16 h-16 bg-[#1e3a8a]/10 border border-[#d69e2e]/20 rounded-full flex items-center justify-center mx-auto text-[#d69e2e]">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Rehberi <span className="text-[#d69e2e]">İndir</span></h3>
                  <p className="text-sm text-gray-300 font-medium">Lütfen rehbere erişmek için bilgilerinizi eksiksiz doldurun.</p>
                </div>

                {pdfFormSuccess ? (
                  <div className="text-center space-y-6 py-8">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-black italic text-white uppercase">Rehberiniz Hazırlanıyor...</h4>
                      <p className="text-sm text-gray-300">Dosya birazdan yeni sekmede açılacaktır.</p>
                    </div>
                    <div className="w-8 h-8 border-4 border-[#d69e2e] border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
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
                        className="w-full bg-black/40 px-5 py-3.5 text-sm font-bold border border-white/10 rounded-lg focus:border-[#d69e2e] outline-none transition-colors" 
                        placeholder="Ad Soyad" 
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">TELEFON</label>
                      <input 
                        required 
                        value={pdfFormData.phone} 
                        onChange={(e) => setPdfFormData({...pdfFormData, phone: e.target.value.replace(/[^\d+]/g, '')})} 
                        className="w-full bg-black/40 px-5 py-3.5 text-sm font-bold border border-white/10 rounded-lg focus:border-[#d69e2e] outline-none transition-colors" 
                        placeholder="05xx xxx xx xx" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">HEDEF ÜLKE</label>
                        <select 
                          value={pdfFormData.targetCountry} 
                          onChange={(e) => setPdfFormData({...pdfFormData, targetCountry: e.target.value})} 
                          className="w-full bg-black/40 px-3 py-3.5 text-sm font-bold border border-white/10 rounded-lg focus:border-[#d69e2e] outline-none transition-colors text-white"
                        >
                          <option className="bg-[#0f172a]">Litvanya</option>
                          <option className="bg-[#0f172a]">Almanya</option>
                          <option className="bg-[#0f172a]">Polonya</option>
                          <option className="bg-[#0f172a]">Hollanda</option>
                          <option className="bg-[#0f172a]">Fransa</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">ÇALIŞMAK İSTEDİĞİ ALAN</label>
                        <select
                          value={pdfFormData.workField} 
                          onChange={(e) => setPdfFormData({...pdfFormData, workField: e.target.value})} 
                          className="w-full bg-black/40 px-3 py-3.5 text-sm font-bold border border-white/10 rounded-lg focus:border-[#d69e2e] outline-none transition-colors text-[#d69e2e]" 
                        >
                          <option className="bg-[#0f172a]" value="">Seçiniz...</option>
                          <option className="bg-[#0f172a]">Tır Şoförlüğü</option>
                          <option className="bg-[#0f172a]">Fabrika / Depo</option>
                          <option className="bg-[#0f172a]">A1 Transfer</option>
                          <option className="bg-[#0f172a]">Fark Etmez</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">EK NOT (Opsiyonel)</label>
                      <textarea 
                        value={pdfFormData.note} 
                        onChange={(e) => setPdfFormData({...pdfFormData, note: e.target.value})} 
                        className="w-full bg-black/40 px-5 py-3.5 text-sm font-bold border border-white/10 rounded-lg focus:border-[#d69e2e] outline-none transition-colors resize-none" 
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
                        className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#d69e2e] focus:ring-[#d69e2e] cursor-pointer accent-[#d69e2e]" 
                      />
                      <label htmlFor="pdfTerms" className="text-[10px] text-gray-300 leading-relaxed cursor-pointer font-medium">
                        Danışmanlık hizmet şartlarını okudum, KVKK metnini onaylıyorum ve vize karar merciinin ilgili Konsolosluklar olduğunu kabul ediyorum.
                      </label>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isPdfSubmitting || !pdfFormData.terms || pdfFormData.name.length < 3 || pdfFormData.phone.length < 10}
                      className="w-full btn-corporate bg-[#1e3a8a] text-white py-4 rounded-xl font-black text-lg mt-4 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all"
                    >
                      {isPdfSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[#0f172a] border-t-transparent rounded-full animate-spin"></div>
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

          {/* İSTATİSTİK BÖLÜMÜ */}
          <section id="istatistik" className="py-24 bg-gray reveal-on-scroll">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="text-center space-y-4 bg-white p-10 rounded-lg border-t-4 border-gold shadow-sm">
                  <div className="flex justify-center text-gold mb-2"> <Star size={48} /> </div>
                  <p className="text-6xl font-title text-primary tracking-tighter">%{stats.success}</p>
                  <p className="text-text-light font-bold uppercase tracking-widest text-xs">Başarı Oranı</p>
                </div>
                <div className="text-center space-y-4 bg-white p-10 rounded-lg border-t-4 border-gold shadow-sm">
                  <div className="flex justify-center text-gold mb-2"> <Users size={48} /> </div>
                  <p className="text-6xl font-title text-primary tracking-tighter">{stats.clients}+</p>
                  <p className="text-text-light font-bold uppercase tracking-widest text-sm">Mutlu Danışan</p>
                </div>
                <div className="text-center space-y-4 bg-white p-10 rounded-lg border-t-4 border-gold shadow-sm">
                  <div className="flex justify-center text-gold mb-2"> <Globe size={48} /> </div>
                  <p className="text-6xl font-title text-primary tracking-tighter">{stats.countries}+</p>
                  <p className="text-text-light font-bold uppercase tracking-widest text-sm">Hedef Ülke</p>
                </div>
              </div>
            </div>
          </section>

          {/* REFERANSLAR */}
          <section id="referanslar" className="py-32 px-6 bg-gray reveal-on-scroll">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl lg:text-5xl font-title text-primary uppercase">Müşteri <span className="text-gold">Görüşleri</span></h2>
                <p className="text-text-light font-medium text-lg">Vizesine kavuşan danışanlarımızın gerçek deneyimleri.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {((testimonials || []).filter(t => t.is_active)).map((ref, idx) => (
                  <div key={ref.id || idx} className="testimonial-card shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">{ref.name[0]}</div>
                        <div>
                          <h4 className="font-bold text-primary">{ref.name}</h4>
                          <p className="text-[11px] text-gold font-bold uppercase tracking-wider">{ref.visa_type}</p>
                        </div>
                      </div>
                      <div className="text-2xl" title={ref.country}>
                        {ref.country === 'Almanya' ? '🇩🇪' : ref.country === 'Polonya' ? '🇵🇱' : ref.country === 'Litvanya' ? '🇱🇹' : '🌍'}
                      </div>
                    </div>
                    <p className="text-text leading-relaxed text-sm italic">"{ref.comment}"</p>
                    <div className="flex items-center mt-4 space-x-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-gold fill-gold" />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* HİZMETLER */}
          <section id="hizmetler" className="py-32 px-6 bg-white reveal-on-scroll">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20 space-y-4">
                <h2 className="text-4xl lg:text-5xl font-title text-primary uppercase">Profesyonel <span className="text-gold">Hizmetlerimiz</span></h2>
                <p className="text-text-light font-medium text-lg max-w-2xl mx-auto">Avrupa kariyer yolculuğunuzda her adımda yanınızdayız.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { icon: <Globe size={24} />, title: "Litvanya Oturum İzni", desc: "2 yıllık oturum kartı ve A1 transfer süreçleri." },
                  { icon: <Briefcase size={24} />, title: "Almanya İş Fırsatları", desc: "Nitelikli iş gücü ve tır şoförlüğü vizeleri." },
                  { icon: <Send size={24} />, title: "Polonya Çalışma İzni", desc: "Fabrika ve lojistik sektörü için hızlı çözümler." },
                  { icon: <ShieldCheck size={24} />, title: "Schengen Vizeleri", desc: "Turistik ve ticari vizelerde yüksek onay oranı." },
                  { icon: <Users size={24} />, title: "Aile Birleşimi", desc: "Sevdiklerinizle Avrupa'da buluşmanız için tam destek." },
                  { icon: <Star size={24} />, title: "AB Mavi Kart", desc: "Yüksek nitelikli çalışanlar için kariyer fırsatları." }
                ].map((item, i) => (
                  <div key={i} className="service-card reveal-on-scroll" style={{ transitionDelay: `${i * 0.1}s` }}>
                    <div className="icon-box">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-title text-primary mb-4">{item.title}</h3>
                    <p className="text-text-light leading-relaxed mb-6">{item.desc}</p>
                    <button onClick={scrollToForm} className="text-gold font-bold flex items-center space-x-2 group hover:text-primary transition-colors">
                      <span>Detaylı Bilgi</span> <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* BAŞVURU SÜRECİ (TIMELINE) */}
          <section className="timeline-section reveal-on-scroll">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-4xl lg:text-5xl font-title text-primary uppercase">Nasıl <span className="text-gold">Çalışır?</span></h2>
                <p className="text-text-light mt-4">Avrupa kapılarını aralayan 5 güvenli adım.</p>
              </div>
              
              <div className="relative">
                <div className="hidden lg:block timeline-line"></div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 relative z-10">
                  {[
                    { num: "1", title: "Başvuru", desc: "Formu doldurun, uzmanımız sizi arasın." },
                    { num: "2", title: "Değerlendirme", desc: "Profilinize en uygun rota belirlenir." },
                    { num: "3", title: "Evrak", desc: "Belgeleriniz titizlikle hazırlanır." },
                    { num: "4", title: "Başvuru", desc: "Resmi makamlara dosyanız iletilir." },
                    { num: "5", title: "Vize & Oturum", desc: "Süreciniz başarıyla tamamlanır." }
                  ].map((step, i) => (
                    <div key={i} className="timeline-step">
                      <div className="timeline-number font-title">
                        {step.num}
                      </div>
                      <h4 className="text-xl font-title text-primary mb-2">{step.title}</h4>
                      <p className="text-text-light text-sm">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SÜREÇTEN KESİTLER */}
          <section className="py-24 px-6 bg-white reveal-on-scroll">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="relative group overflow-hidden rounded-lg shadow-lg">
                  <img src={OturumKartiImg} className="w-full h-auto transform transition-transform group-hover:scale-105" alt="Oturum Kartı" />
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-all"></div>
                  <p className="absolute bottom-4 left-6 text-white font-bold text-lg drop-shadow-md">RESMİ OTURUM & ÇALIŞMA KARTI</p>
                </div>
                <div className="relative group overflow-hidden rounded-lg shadow-lg">
                  <img src={TirImg} className="w-full h-auto transform transition-transform group-hover:scale-105" alt="Tır Operasyonları" />
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-all"></div>
                  <p className="absolute bottom-4 left-6 text-white font-bold text-lg drop-shadow-md">ULUSLARARASI LOJİSTİK AĞI</p>
                </div>
              </div>
            </div>
          </section>

          {/* INSTAGRAM VİTRİNİ */}
          <section className="py-24 px-6 bg-gray reveal-on-scroll">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col items-center text-center mb-16">
                <InstagramIcon size={40} className="text-gold mb-4" />
                <h2 className="text-4xl lg:text-5xl font-title text-primary uppercase">Bizi <span className="text-gold">Takip Edin</span></h2>
                <p className="text-text-light mt-4">Güncel vize onayları ve yurtdışı yaşam ipuçları.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[insta1Img, insta2Img, insta3Img, insta4Img].map((img, i) => (
                  <a key={i} href="https://www.instagram.com/cmsprime/" target="_blank" rel="noreferrer" className="block relative group overflow-hidden rounded-lg shadow-sm">
                    <img src={img} className="aspect-square w-full object-cover transform transition-transform group-hover:scale-110" alt="Instagram Post" />
                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <InstagramIcon size={32} className="text-white" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* EKİBİMİZ */}
          <section id="ekip" className="py-32 px-6 bg-white reveal-on-scroll">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl lg:text-5xl font-title text-primary uppercase">Uzman <span className="text-gold">Ekibimiz</span></h2>
                <p className="text-text-light font-medium text-lg">Vize ve kariyer yolculuğunuzda size rehberlik eden profesyoneller.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                {siteContent?.team?.filter(m => m.isVisible !== false).map((member) => (
                  <div key={member.id} className="group">
                    <div className="aspect-[4/5] rounded-lg overflow-hidden mb-6 shadow-md">
                      <img src={member.img} alt={member.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <h3 className="text-2xl font-title text-primary">{member.name}</h3>
                    <p className="text-gold font-bold uppercase tracking-wider text-xs mt-1">{member.title}</p>
                    <p className="text-text-light mt-3 text-sm leading-relaxed">{member.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SSS */}
          <section id="sss" className="py-32 px-6 bg-gray">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl lg:text-5xl font-title text-primary uppercase">Sıkça Sorulan <span className="text-gold">Sorular</span></h2>
              </div>
              <div className="space-y-4">
                {[
                  { q: "Almanya randevu süreci nasıl işler?", a: "Randevular iDATA üzerinden atanmaktadır. Ortalama bekleme süresi 2-6 haftadır." },
                  { q: "Litvanya oturum izni ne kadar sürer?", a: "Dosya onay süreci genellikle 4-6 hafta sürmektedir." },
                  { q: "Vize reddi alırsam ne olur?", a: "Ret gerekçeleri incelenerek resmi itiraz süreci başlatılır." }
                ].map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-lg border border-border overflow-hidden">
                    <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full p-6 flex justify-between items-center text-left">
                      <span className="font-bold text-primary">{faq.q}</span>
                      <ChevronDown className={`transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {activeFaq === idx && (
                      <div className="p-6 pt-0 text-text-light border-t border-border bg-gray/30">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* BAŞVURU FORMU */}
          <section ref={formRef} className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-0 rounded-xl overflow-hidden shadow-2xl border border-border">
                {/* Sol Kolon: Form */}
                <div className="p-10 lg:p-16 bg-white">
                  {formSuccess ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                      <div className="text-center space-y-8 w-full max-w-md mx-auto">
                        <div className="w-20 h-20 bg-gold/10 border-2 border-gold rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 size={40} className="text-gold" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-title text-primary mb-3">Başvurunuz Başarıyla Alındı</h3>
                          <p className="text-text-light text-sm">Sayın <strong className="text-primary">{formData.name || 'Değerli Müşterimiz'}</strong>,</p>
                          <p className="text-text-light text-sm mt-1">Başvurunuz sistemimize kaydedilmiştir.</p>
                          <p className="text-text-light text-sm">Uzman danışmanımız en kısa sürede sizinle iletişime geçecektir.</p>
                        </div>
                        {submittedTrackingId && (
                          <div className="bg-gray rounded-lg p-6 border border-border">
                            <p className="text-xs font-bold text-text-light uppercase tracking-widest mb-2">Takip Kodunuz</p>
                            <button
                              onClick={() => { navigator.clipboard?.writeText(submittedTrackingId); showToast('Takip kodu kopyalandı!'); }}
                              className="text-2xl font-title text-gold tracking-widest hover:text-gold-light transition-colors"
                              title="Kopyalamak için tıklayın"
                            >
                              {submittedTrackingId}
                            </button>
                            <p className="text-[10px] text-text-light mt-2">Kopyalamak için üstüne tıklayın</p>
                          </div>
                        )}
                        <div className="flex items-center justify-center space-x-2 text-xs text-text-light">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          <span>Ortalama Dönüş Süresi: <strong>15-30 dakika</strong></span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <button onClick={resetForm} className="bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-light transition-colors text-sm">YENİ BAŞVURU YAP</button>
                          <a href={`https://wa.me/905459918268?text=${encodeURIComponent('Merhaba, yeni başvuru yaptım. Takip kodum: ' + (submittedTrackingId || ''))}`} target="_blank" rel="noreferrer" className="bg-[#25D366] text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center justify-center">WHATSAPP'TAN ULAŞ</a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-3xl font-title text-primary mb-8 uppercase">Ücretsiz Ön Değerlendirme</h2>
                      <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-primary uppercase tracking-widest">AD SOYAD</label>
                          <input 
                            required 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange}
                            className="w-full p-4 border border-border rounded-lg focus:border-gold outline-none bg-gray/30"
                            placeholder="Ad Soyad"
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-primary uppercase tracking-widest">TELEFON</label>
                            <input 
                              required 
                              name="phone" 
                              value={formData.phone} 
                              onChange={handleInputChange}
                              className="w-full p-4 border border-border rounded-lg focus:border-gold outline-none bg-gray/30"
                              placeholder="05xx xxx xx xx"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-primary uppercase tracking-widest">ÜLKE</label>
                            <select 
                              name="country" 
                              value={formData.country} 
                              onChange={handleInputChange}
                              className="w-full p-4 border border-border rounded-lg focus:border-gold outline-none bg-gray/30"
                            >
                              <option>Almanya</option>
                              <option>Polonya</option>
                              <option>Litvanya</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-primary uppercase tracking-widest">ALAN</label>
                          <select 
                            name="workField" 
                            value={formData.workField} 
                            onChange={handleInputChange}
                            className="w-full p-4 border border-border rounded-lg focus:border-gold outline-none bg-gray/30"
                          >
                            <option>Tır Şoförlüğü</option>
                            <option>Fabrika / Depo</option>
                            <option>A1 Transfer</option>
                          </select>
                        </div>
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full btn-gold py-5 text-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'GÖNDERİLİYOR...' : 'BAŞVURUYU TAMAMLA'}
                        </button>
                      </form>
                    </>
                  )}
                </div>
                {/* Sağ Kolon: Info */}
                <div className="p-10 lg:p-16 bg-primary text-white flex flex-col justify-center">
                  <h3 className="text-4xl font-title mb-8 leading-tight">Avrupa Kapısı <br/><span className="text-gold">Sizin İçin Açılıyor</span></h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold flex-shrink-0"><CheckCircle2 size={20} /></div>
                      <p className="font-medium text-gray-300">Resmi ve güvenli başvuru süreci.</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold flex-shrink-0"><CheckCircle2 size={20} /></div>
                      <p className="font-medium text-gray-300">Uzman danışman kadrosu ile tam destek.</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold flex-shrink-0"><CheckCircle2 size={20} /></div>
                      <p className="font-medium text-gray-300">%95+ onaylanmış başvuru oranı.</p>
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-white/10">
                    <p className="text-gold font-bold mb-2">📞 +90 545 991 82 68</p>
                    <p className="text-gray-400 text-sm italic">24 saat içinde size dönüş sağlıyoruz.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DYNAMIC MAP SECTION */}
          <section className="py-24 px-6 bg-[#0F2557] border-t border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
            <div className="max-w-7xl mx-auto space-y-16 relative z-10">
              <div className="text-center space-y-4">
                <h2 className="text-3xl lg:text-4xl font-title uppercase text-white">AKTİF <span className="text-gold">AVRUPA AĞI</span></h2>
                <p className="text-gray-300 font-medium">Uzmanlık alanımızdaki 5 ülkede kesintisiz hizmet.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { country: "Almanya", code: "DE", flag: "🇩🇪", desc: "Tır & Nitelikli" },
                  { country: "Polonya", code: "PL", flag: "🇵🇱", desc: "Lojistik & Depo" },
                  { country: "Litvanya", code: "LT", flag: "🇱🇹", desc: "A1 & 2 Yıllık Oturum" },
                  { country: "Hollanda", code: "NL", flag: "🇳🇱", desc: "High-Skilled" },
                  { country: "Fransa", code: "FR", flag: "🇫🇷", desc: "Çalışma İzni" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center justify-center text-center p-8 rounded-lg w-44 cursor-pointer group transition-all duration-300 hover:border-gold hover:bg-white/10" style={{background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(201,168,76,0.3)'}}>
                    <div className="text-4xl mb-3 group-hover:-translate-y-1 transition-transform">{item.flag}</div>
                    <p className="text-[32px] font-bold text-gold tracking-wider mb-1 leading-none">{item.code}</p>
                    <p className="font-bold text-white text-[16px] mt-2">{item.country}</p>
                    <p className="text-[13px] text-gray-300 mt-1 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SÜREÇ YÖNETİMİ */}
          <section className="py-24 px-6 bg-white border-t border-border">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-2xl lg:text-3xl font-title text-primary uppercase">Avrupa Vize ve Oturum Danışmanlığında <br className="hidden md:block" /> Profesyonel Süreç Yönetimi</h2>
                <p className="text-[#4b5563] mt-4 max-w-2xl mx-auto font-medium">CMSVize; Almanya, Polonya ve Litvanya başta olmak üzere Avrupa'da iş, oturum ve aile birleşimi süreçlerinde başvuru sahiplerine profesyonel yol haritası sunar.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white text-text p-8 rounded-lg text-center space-y-4 border border-border transition-colors hover:border-gold group">
                  <div className="w-16 h-16 mx-auto bg-primary rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">📋</div>
                  <h3 className="text-lg font-title text-primary font-bold">Belge & Evrak Hazırlığı</h3>
                  <p className="text-text-light text-sm leading-relaxed">Tüm belgeleri sizin için eksiksiz hazırlıyoruz.</p>
                </div>
                <div className="bg-white text-text p-8 rounded-lg text-center space-y-4 border border-border transition-colors hover:border-gold group">
                  <div className="w-16 h-16 mx-auto bg-primary rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">✈️</div>
                  <h3 className="text-lg font-title text-primary font-bold">Resmi Başvuru Yönetimi</h3>
                  <p className="text-text-light text-sm leading-relaxed">Resmi makamlara eksiksiz iletiyoruz.</p>
                </div>
                <div className="bg-white text-text p-8 rounded-lg text-center space-y-4 border border-border transition-colors hover:border-gold group">
                  <div className="w-16 h-16 mx-auto bg-primary rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
                  <h3 className="text-lg font-title text-primary font-bold">Sonuç Garantisi</h3>
                  <p className="text-text-light text-sm leading-relaxed">%95+ onay oranıyla her adımda yanınızdayız.</p>
                </div>
              </div>
              <div className="mt-12 p-4 rounded-lg border-l-4 border-primary bg-gray">
                <p className="text-xs text-text-light leading-relaxed">
                  <span className="text-primary font-bold uppercase tracking-widest block mb-1">Yasal Uyarı &amp; Bilgilendirme:</span>
                  CMSVize danışmanlık hizmeti sunar. Nihai karar yetkisi ilgili konsolosluklara aittir.
                </p>
              </div>
            </div>
          </section>
        </>
      ) : currentPage === 'blog_detail' ? (
        <div className="bg-white min-h-screen pt-40 pb-32 px-6">
          <div className="max-w-4xl mx-auto">
            {(() => {
              const post = blogPosts.find(b => b.slug === selectedBlogSlug);
              if (!post) return <div className="text-primary text-center py-20 font-bold">Blog yazısı yükleniyor...</div>;
              
              return (
                <div>
                  <button onClick={() => { setCurrentPage('blog'); window.history.pushState({}, '', '/blog'); }} className="flex items-center space-x-2 text-primary hover:text-gold mb-8 transition-colors font-bold text-sm">
                    <ArrowLeft size={16} /><span>Blog'a Dön</span>
                  </button>
                  {post.cover_image && <img src={post.cover_image} alt={post.title} onError={(e) => { e.target.src = 'https://placehold.co/800x400/0F2557/C9A84C?text=CMSVize+Blog' }} className="w-full h-64 md:h-96 object-cover rounded-xl mb-8 border border-border shadow-md" />}
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="text-xs font-bold text-white bg-primary px-3 py-1 rounded uppercase tracking-widest">{post.category}</span>
                    <span className="text-gray-500 text-sm font-medium">{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-title font-bold mb-8 text-primary leading-tight">{post.title}</h1>
                  <div className="text-text leading-relaxed space-y-6 prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: getTrustedHTML(post.content.replace(/\n/g, '<br/>')) }}></div>
                </div>
              );
            })()}
          </div>
        </div>
      ) : currentPage === 'blog' ? (
        <div className="bg-white min-h-screen pt-40 pb-32 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-title font-bold uppercase tracking-wider text-primary">CMSVİZE <span className="text-gold">BLOG</span></h2>
              <p className="text-text-light mt-4">Vize, çalışma ve Avrupa'da yaşam hakkında en güncel yazılar.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts.filter(b => b.is_published).map(post => (
                <div key={post.id} onClick={() => { setSelectedBlogSlug(post.slug); setCurrentPage('blog_detail'); window.history.pushState({}, '', `/blog/${post.slug}`); window.scrollTo(0, 0); }} className="bg-white border border-border rounded-lg p-6 hover:border-primary hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full">
                  {post.cover_image && <img src={post.cover_image} alt={post.title} onError={(e) => { e.target.src = 'https://placehold.co/800x400/0F2557/C9A84C?text=CMSVize+Blog' }} className="w-full h-48 object-cover rounded-md mb-6 group-hover:scale-[1.02] transition-transform duration-300 shadow-sm" />}
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-gold border border-gold px-3 py-1 rounded uppercase tracking-widest mb-3 inline-block">{post.category}</span>
                    <h3 className="text-xl font-title font-bold mb-3 group-hover:text-gold transition-colors text-primary">{post.title}</h3>
                    <p className="text-text-light text-sm leading-relaxed line-clamp-3">{post.summary}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                    <span className="text-xs font-bold text-primary flex items-center space-x-1 group-hover:text-gold transition-colors"><span>Devamını Oku</span> <ChevronRight size={14} /></span>
                  </div>
                </div>
              ))}
              {blogPosts.filter(b => b.is_published).length === 0 && !isBlogLoading && (
                <div className="col-span-full text-center text-gray-500 py-12">Henüz blog yazısı bulunmamaktadır.</div>
              )}
              {isBlogLoading && (
                <div className="col-span-full text-center text-primary font-bold py-12">Yazılar Yükleniyor...</div>
              )}
            </div>
          </div>
        </div>
      ) : currentPage === 'privacy' ? (
        <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto space-y-12 animate-fade-up">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Gizlilik <span className="text-[#d69e2e]">Politikası</span></h1>
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
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Kullanım <span className="text-[#d69e2e]">Koşulları</span></h1>
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
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Çerez <span className="text-[#d69e2e]">Politikası</span></h1>
          <div className="glass p-10 rounded-3xl space-y-8 text-gray-300 leading-relaxed text-sm">
            <p className="font-bold text-[#d69e2e]">Son güncelleme: Nisan 2026</p>
            
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
        <div className="bg-white min-h-screen pb-32">
          <div className="bg-primary text-white py-20 px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-title uppercase tracking-wider mb-4">AVRUPA VİZE REHBERİ</h1>
            <p className="text-gray-300 max-w-2xl mx-auto font-medium">Hedeflediğiniz ülkede yaşam, çalışma şartları ve vize süreçleri hakkında en güncel bilgiler.</p>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { id: 'litvanya', name: 'LİTVANYA', code: 'LT', flag: '🇱🇹', desc: 'Düşük yaşam maliyeti ve hızlı vize süreciyle Avrupa\'nın parlayan yıldızı.' },
                { id: 'almanya', name: 'ALMANYA', code: 'DE', flag: '🇩🇪', desc: 'Avrupa\'nın en büyük ekonomisi, yüksek maaşlar ve güçlü sosyal haklar.' },
                { id: 'polonya', name: 'POLONYA', code: 'PL', flag: '🇵🇱', desc: 'Hızlı büyüyen ekonomi ve kolay vize süreçleriyle Türk çalışanlar için ideal.' }
              ].map(country => (
                <div key={country.id} className="bg-white border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-xl group flex flex-col h-full">
                  <div className="bg-primary py-6 flex flex-col items-center justify-center">
                    <div className="text-4xl mb-2">{country.flag}</div>
                    <span className="text-gold font-bold text-xl">{country.code}</span>
                  </div>
                  <div className="p-8 flex flex-col flex-1 text-center">
                    <h3 className="text-[24px] font-title text-primary font-bold mb-4">{country.name}</h3>
                    <p className="text-text-light text-sm leading-relaxed mb-8 flex-1">{country.desc}</p>
                    <button 
                      onClick={() => setCurrentPage(`guide_${country.id}`)}
                      className="w-full border border-gold text-gold py-3 rounded uppercase font-bold text-xs tracking-widest hover:bg-gold hover:text-white transition-colors"
                    >
                      REHBERİ İNCELE →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : currentPage === 'guide_litvanya' ? (
        <div className="bg-white min-h-screen pb-32 font-main text-[#1A1A2E]">
          <div className="bg-primary pt-32 pb-20 px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-title uppercase tracking-wider text-white mb-4">🇱🇹 LİTVANYA KAPSAMLI <br/><span className="text-gold">YAŞAM REHBERİ 2026</span></h1>
          </div>
          
          <div className="max-w-4xl mx-auto px-6 mt-8">
            <div className="flex items-center space-x-2 mb-12 text-sm">
              <button onClick={() => setCurrentPage('guides_main')} className="text-primary font-bold hover:text-gold transition-colors">Rehberler</button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500 font-bold">Litvanya</span>
            </div>

            <div className="space-y-12 leading-relaxed opacity-100">
              <section className="bg-gray p-8 rounded-lg border-l-4 border-gold space-y-4">
                <h2 className="text-2xl font-title uppercase text-primary font-bold">Litvanya Hakkında Genel Bilgi</h2>
                <p>Litvanya, Baltık bölgesinde yer alan AB ve NATO üyesi bir ülkedir. Başkenti Vilnius, nüfusu yaklaşık 2.8 milyon, resmi para birimi Euro'dur. Schengen bölgesinde yer alır.</p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-title uppercase text-primary font-bold border-b border-border pb-2">Neden Litvanya?</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                  {['27 Schengen ülkesinde vizesiz seyahat', 'Bati Avrupa\'ya kıyasla %40-50 daha uygun yaşam maliyeti', 'Hızlı büyüyen iş ve teknoloji ekosistemi', 'AB vatandaşlığına giden yol', 'Aile birleşimi hakkı'].map((item, i) => (
                    <li key={i} className="bg-white border border-border p-4 rounded flex items-center space-x-3">
                      <CheckCircle2 size={18} className="text-gold flex-shrink-0" />
                      <span className="font-bold">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-title uppercase text-primary font-bold border-b border-border pb-2">Şehirler</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: 'Vilnius', title: 'Başkent', desc: 'Kuzey\'in Silicon Valley\'i olarak anılır.' },
                    { name: 'Kaunas', title: 'Sanayi Merkezi', desc: 'Yaşam maliyeti daha uygundur.' },
                    { name: 'Klaipeda', title: 'Liman Şehri', desc: 'Lojistik ve denizcilik sektörü güçlü.' }
                  ].map((city, i) => (
                    <div key={i} className="bg-gray p-6 rounded space-y-2 border-t-2 border-primary">
                      <h4 className="text-lg font-title font-bold text-primary">{city.name}</h4>
                      <p className="text-xs font-bold uppercase text-text-light">{city.title}</p>
                      <p className="text-sm">{city.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-title uppercase text-primary font-bold border-b border-border pb-2">Yaşam Maliyeti (2026)</h2>
                <div className="overflow-hidden rounded border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-primary text-white font-bold uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4">Kalem</th>
                        <th className="px-6 py-4">Tahmini Maliyet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { k: 'Tek kişilik daire kirası', v: '400-700 EUR/ay' },
                        { k: 'Market alışverişi', v: '200-350 EUR/ay' },
                        { k: 'Ulaşım (aylık)', v: '30-50 EUR' },
                        { k: 'Sağlık sigortası', v: '20-40 EUR/ay' },
                        { k: 'Ortalama toplam', v: '700-1200 EUR/ay' }
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray'}>
                          <td className="px-6 py-4 font-medium">{row.k}</td>
                          <td className="px-6 py-4 text-primary font-bold">{row.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-title uppercase text-primary font-bold border-b border-border pb-2">Ortalama Maaşlar (2026)</h2>
                <div className="overflow-hidden rounded border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-primary text-white font-bold uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4">Sektör</th>
                        <th className="px-6 py-4">Aylık Maaş</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { k: 'TIR Şoförü (KOD95)', v: '1.800-2.500 EUR' },
                        { k: 'Fabrika İşçisi', v: '1.000-1.400 EUR' },
                        { k: 'İnşaat', v: '1.200-1.800 EUR' },
                        { k: 'BT Uzmanı', v: '2.500-4.000 EUR' },
                        { k: 'Asgari Ücret', v: '~1.038 EUR' }
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray'}>
                          <td className="px-6 py-4 font-medium">{row.k}</td>
                          <td className="px-6 py-4 text-primary font-bold">{row.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-gray border border-border p-8 rounded space-y-4">
                  <h3 className="text-xl font-title font-bold uppercase text-primary">Konaklama</h3>
                  <p className="text-sm">Litvanya'da konaklama bulmak görece kolaydır. Kira sözleşmesi oturum kartı başvurusu için zorunludur. CMSVize olarak konaklama bulma sürecinde de destek sağlıyoruz.</p>
                </div>
                <div className="bg-gray border border-border p-8 rounded space-y-4">
                  <h3 className="text-xl font-title font-bold uppercase text-primary">Sağlık & Ulaşım</h3>
                  <p className="text-sm">Çalışanlar işveren aracılığıyla devlet sağlık sistemine dahil olur. Şehir içi ve şehirler arası ulaşım ağı oldukça gelişmiş ve ekonomiktir.</p>
                </div>
              </div>

              <section className="space-y-6">
                <h2 className="text-2xl font-title uppercase text-primary font-bold border-b border-border pb-2">Sık Sorulan Sorular</h2>
                <div className="space-y-4">
                  {[
                    { q: 'Litvanya\'da çalışmak için dil şartı var mı?', a: 'Çoğu sektörde dil şartı yoktur. İngilizce bilen işverenler yaygındır.' },
                    { q: 'Litvanya\'dan diğer AB ülkelerine geçiş yapabilir miyim?', a: 'Evet, Schengen vizesiyle 27 ülkede serbestçe seyahat edebilirsiniz.' },
                    { q: 'Aile birleşimi için ne kadar beklenir?', a: 'Oturum kartınızı aldıktan sonra aile birleşimi başvurusu yapılabilir. Ortalama 2-3 ay sürer.' }
                  ].map((faq, i) => (
                    <div key={i} className="bg-white border border-border p-6 rounded space-y-2">
                      <p className="font-bold text-primary">S: {faq.q}</p>
                      <p className="text-[#1A1A2E]">C: {faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-16 p-10 rounded bg-primary text-center space-y-6 text-white shadow-xl">
              <div className="space-y-2">
                <h3 className="text-2xl font-title font-bold uppercase">Uzman Ekibimizle Ücretsiz Görüşün</h3>
                <p className="text-gray-300">Litvanya oturum kartı ve iş imkanları için formu doldurun, sizi arayalım.</p>
              </div>
              <button onClick={scrollToForm} className="bg-gold text-white px-10 py-4 rounded font-bold uppercase tracking-wider hover:bg-[#b0923d] transition-colors">
                ÜCRETSİZ BAŞVURU BAŞLAT
              </button>
            </div>
          </div>
        </div>
      ) : currentPage === 'guide_almanya' ? (
        <div className="bg-white min-h-screen pb-32 font-main text-[#1A1A2E]">
          <div className="bg-primary pt-32 pb-20 px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-title uppercase tracking-wider text-white mb-4">🇩🇪 ALMANYA KAPSAMLI <br/><span className="text-gold">ÇALIŞMA REHBERİ 2026</span></h1>
          </div>
          
          <div className="max-w-4xl mx-auto px-6 mt-8">
            <div className="flex items-center space-x-2 mb-12 text-sm">
              <button onClick={() => setCurrentPage('guides_main')} className="text-primary font-bold hover:text-gold transition-colors">Rehberler</button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500 font-bold">Almanya</span>
            </div>

            <div className="space-y-12 leading-relaxed opacity-100">
              <section className="bg-gray p-8 rounded-lg border-l-4 border-gold space-y-4">
                <h2 className="text-2xl font-title uppercase text-primary font-bold">Almanya Hakkında Genel Bilgi</h2>
                <p>Almanya, Avrupa'nın en büyük ekonomisi ve Türk göçmenler için en popüler destinasyondur. Başkenti Berlin, nüfusu ~84 milyon, para birimi Euro'dur.</p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-title uppercase text-primary font-bold border-b border-border pb-2">Neden Almanya?</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                  {['Avrupa\'nın en yüksek maaşları', 'Güçlü sosyal haklar ve işçi güvencesi', 'Kaliteli sağlık ve eğitim sistemi', 'Büyük Türk topluluğu (yaklaşık 3 milyon)', 'Yüksek yaşam standardı'].map((item, i) => (
                    <li key={i} className="bg-white border border-border p-4 rounded flex items-center space-x-3">
                      <CheckCircle2 size={18} className="text-gold flex-shrink-0" />
                      <span className="font-bold">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-title uppercase text-primary font-bold border-b border-border pb-2">Popüler İş Alanları</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'TIR Şoförlüğü', desc: 'KOD95 belgesi zorunludur. Maaşlar 2.500-3.500 EUR arasındadır.' },
                    { name: 'Depo & Lojistik', desc: 'Amazon, DHL, DPD gibi büyük firmalarda yaygındır.' },
                    { name: 'Fabrika & Üretim', desc: 'Otomotiv (BMW, Mercedes) sektöründe alım fazladır.' },
                    { name: 'İnşaat', desc: 'Tecrübeli işçilere yüksek ücret ödenmektedir.' }
                  ].map((job, i) => (
                    <div key={i} className="bg-gray p-6 rounded space-y-2 border-t-2 border-primary">
                      <h4 className="text-lg font-title font-bold text-primary">{job.name}</h4>
                      <p className="text-sm">{job.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-title uppercase text-primary font-bold border-b border-border pb-2">Ortalama Maaşlar (2026)</h2>
                <div className="overflow-hidden rounded border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-primary text-white font-bold uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4">Pozisyon</th>
                        <th className="px-6 py-4">Aylık Maaş (Brüt)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { k: 'TIR Şoförü', v: '2.500-3.500 EUR' },
                        { k: 'Depo İşçisi', v: '1.800-2.200 EUR' },
                        { k: 'Fabrika İşçisi', v: '2.000-2.800 EUR' },
                        { k: 'İnşaat İşçisi', v: '2.200-3.000 EUR' },
                        { k: 'Asgari Ücret', v: '~1.700 EUR' }
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray'}>
                          <td className="px-6 py-4 font-medium">{row.k}</td>
                          <td className="px-6 py-4 text-primary font-bold">{row.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-gray border border-border p-8 rounded space-y-4">
                <h2 className="text-2xl font-title uppercase text-primary font-bold">KOD95 Belgesi Nedir?</h2>
                <p className="text-sm">Avrupa'da ticari araç kullananlar için zorunlu mesleki yeterlilik belgesidir. Ehliyette "95" kodu olarak görünür. CMSVize olarak KOD95 belgesi olan TIR şoförlerine özel işveren eşleştirme yapıyoruz.</p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-title uppercase text-primary font-bold border-b border-border pb-2">Yaşam Maliyeti (2026)</h2>
                <div className="overflow-hidden rounded border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-primary text-white font-bold uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4">Kalem</th>
                        <th className="px-6 py-4">Tahmini Maliyet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { k: 'Tek kişilik daire', v: '800-1.500 EUR/ay' },
                        { k: 'Market alışverişi', v: '300-500 EUR/ay' },
                        { k: 'Ulaşım (aylık)', v: '80-100 EUR' },
                        { k: 'Sağlık sigortası', v: 'İşveren Öder' },
                        { k: 'Ortalama toplam', v: '1.300-2.200 EUR/ay' }
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray'}>
                          <td className="px-6 py-4 font-medium">{row.k}</td>
                          <td className="px-6 py-4 text-primary font-bold">{row.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-title uppercase text-primary font-bold border-b border-border pb-2">Sık Sorulan Sorular</h2>
                <div className="space-y-4">
                  {[
                    { q: 'Almancam olmadan çalışabilir miyim?', a: 'TIR şoförlüğü ve bazı fabrika işlerinde Almanca şartı aranmaz. Ancak öğrenmek kariyer için önemlidir.' },
                    { q: 'Almanya\'da oturum izninden vatandaşlığa geçiş ne kadar sürer?', a: 'Genellikle 5-8 yıl yasal ikamet ve dil şartı (B1) gerekmektedir.' }
                  ].map((faq, i) => (
                    <div key={i} className="bg-white border border-border p-6 rounded space-y-2">
                      <p className="font-bold text-primary">S: {faq.q}</p>
                      <p className="text-[#1A1A2E]">C: {faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-16 p-10 rounded bg-primary text-center space-y-6 text-white shadow-xl">
              <div className="space-y-2">
                <h3 className="text-2xl font-title font-bold uppercase">Uzman Ekibimizle Ücretsiz Görüşün</h3>
                <p className="text-gray-300">Almanya iş fırsatları ve vize süreci için formu doldurun, sizi arayalım.</p>
              </div>
              <button onClick={scrollToForm} className="bg-gold text-white px-10 py-4 rounded font-bold uppercase tracking-wider hover:bg-[#b0923d] transition-colors">
                ÜCRETSİZ BAŞVURU BAŞLAT
              </button>
            </div>
          </div>
        </div>
      ) : currentPage === 'guide_polonya' ? (
        <div className="bg-white min-h-screen pb-32 font-main text-[#1A1A2E]">
          <div className="bg-primary pt-32 pb-20 px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-title uppercase tracking-wider text-white mb-4">🇵🇱 POLONYA KAPSAMLI <br/><span className="text-gold">ÇALIŞMA REHBERİ 2026</span></h1>
          </div>
          
          <div className="max-w-4xl mx-auto px-6 mt-8">
            <div className="flex items-center space-x-2 mb-12 text-sm">
              <button onClick={() => setCurrentPage('guides_main')} className="text-primary font-bold hover:text-gold transition-colors">Rehberler</button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500 font-bold">Polonya</span>
            </div>

            <div className="space-y-12 leading-relaxed opacity-100">
              <section className="bg-gray p-8 rounded-lg border-l-4 border-gold space-y-4">
                <h2 className="text-2xl font-title uppercase text-primary font-bold">Polonya Hakkında Genel Bilgi</h2>
                <p>Polonya, Orta Avrupa'nın en hızlı büyüyen ekonomilerinden biridir. Başkenti Varşova, nüfusu ~38 milyon, para birimi Zloti (PLN)'dir.</p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-title uppercase text-primary font-bold border-b border-border pb-2">Neden Polonya?</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                  {['Avrupa\'nın en hızlı büyüyen ekonomisi', 'Almanya\'ya kıyasla kolay vize süreci', 'Uygun yaşam maliyeti', 'Güçlü sanayi ve üretim sektörü', 'Türkiye\'ye yakın konum'].map((item, i) => (
                    <li key={i} className="bg-white border border-border p-4 rounded flex items-center space-x-3">
                      <CheckCircle2 size={18} className="text-gold flex-shrink-0" />
                      <span className="font-bold">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-title uppercase text-primary font-bold border-b border-border pb-2">Ortalama Maaşlar (2026)</h2>
                <div className="overflow-hidden rounded border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-primary text-white font-bold uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4">Pozisyon</th>
                        <th className="px-6 py-4">Aylık Maaş</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { k: 'Fabrika İşçisi', v: '700-1.000 EUR' },
                        { k: 'Depo İşçisi', v: '700-900 EUR' },
                        { k: 'İnşaat İşçisi', v: '900-1.400 EUR' },
                        { k: 'TIR Şoförü', v: '1.500-2.200 EUR' },
                        { k: 'Asgari Ücret', v: '~900 EUR' }
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray'}>
                          <td className="px-6 py-4 font-medium">{row.k}</td>
                          <td className="px-6 py-4 text-primary font-bold">{row.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-title uppercase text-primary font-bold border-b border-border pb-2">Yaşam Maliyeti (2026)</h2>
                <div className="overflow-hidden rounded border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-primary text-white font-bold uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4">Kalem</th>
                        <th className="px-6 py-4">Tahmini Maliyet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { k: 'Tek kişilik daire', v: '300-600 EUR/ay' },
                        { k: 'Market alışverişi', v: '150-250 EUR/ay' },
                        { k: 'Ulaşım', v: '30-50 EUR/ay' },
                        { k: 'Toplam', v: '550-950 EUR/ay' }
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray'}>
                          <td className="px-6 py-4 font-medium">{row.k}</td>
                          <td className="px-6 py-4 text-primary font-bold">{row.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-gray border border-border p-8 rounded space-y-4">
                <h2 className="text-2xl font-title uppercase text-primary font-bold">Vize Süreci</h2>
                <p>Polonya'da çalışmak için D tipi ulusal vize gereklidir. İşveren daveti veya iş sözleşmesi ile başvuru yapılır. Onay süresi 2-4 haftadır, bu da Almanya'ya göre çok daha hızlı bir seçenektir.</p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-title uppercase text-primary font-bold border-b border-border pb-2">Sık Sorulan Sorular</h2>
                <div className="space-y-4">
                  {[
                    { q: 'Polonya\'dan diğer Schengen ülkelerine geçiş yapabilir miyim?', a: 'Evet, Polonya Schengen üyesidir. Oturum izniyle 27 ülkede seyahat edebilirsiniz.' },
                    { q: 'Polonya vizesi ne kadar sürede çıkar?', a: 'Ortalama 2-4 hafta. Almanya\'ya göre çok daha hızlı.' },
                    { q: 'Polonya\'da dil şartı var mı?', a: 'Fabrika işlerinde genellikle aranmaz. Temel İngilizce veya Rusça bilen işverenler yaygındır.' }
                  ].map((faq, i) => (
                    <div key={i} className="bg-white border border-border p-6 rounded space-y-2">
                      <p className="font-bold text-primary">S: {faq.q}</p>
                      <p className="text-[#1A1A2E]">C: {faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-16 p-10 rounded bg-primary text-center space-y-6 text-white shadow-xl">
              <div className="space-y-2">
                <h3 className="text-2xl font-title font-bold uppercase">Uzman Ekibimizle Ücretsiz Görüşün</h3>
                <p className="text-gray-300">Polonya iş fırsatları ve vize süreci için formu doldurun, sizi arayalım.</p>
              </div>
              <button onClick={scrollToForm} className="bg-gold text-white px-10 py-4 rounded font-bold uppercase tracking-wider hover:bg-[#b0923d] transition-colors">
                ÜCRETSİZ BAŞVURU BAŞLAT
              </button>
            </div>
          </div>
        </div>
      ) : currentPage === 'admin-login' ? (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f172a]">
          <div className="max-w-md w-full glass p-10 rounded-2xl border-t-4 border-[#d69e2e] shadow-2xl">
            <div className="flex justify-center mb-10">
              <img src={logoImg} alt="CMSVize Logo" className="h-20 w-auto object-contain brightness-125" />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-center mb-2">Admin <span className="text-[#d69e2e]">Panel</span></h2>
            <p className="text-gray-300 text-center text-sm mb-8">Yetkili personel girişi gereklidir.</p>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">KULLANICI ADI</label>
                <input required value={adminUser} onChange={(e) => setAdminUser(e.target.value)} className="w-full bg-black/50 border border-white/10 px-6 py-4 rounded-lg font-bold focus:border-[#d69e2e] outline-none" placeholder="cms_master_admin" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">GÜVENLİK ANAHTARI</label>
                <input required type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full bg-black/50 border border-white/10 px-6 py-4 rounded-lg font-bold focus:border-[#d69e2e] outline-none" placeholder="••••••••••••" />
              </div>
              <button type="button" onClick={handleAdminLogin} className="w-full bg-[#1e3a8a] text-black font-black py-5 rounded-lg text-lg hover:scale-[1.02] transition-transform mt-4">SİSTEME GİRİŞ YAP</button>
            </div>
          </div>
        </div>
      ) : currentPage === 'admin-dashboard' && adminLoggedIn ? (
        <div className="min-h-screen bg-[#080C14] text-white">
          <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-72 bg-[#0f172a] border-r border-white/5 p-8 flex flex-col justify-between">
              <div className="space-y-10">
                <div className="flex items-center space-x-2 px-2">
                  <img src={logoImg} alt="CMSVize Logo" className="h-[32px] w-auto object-contain" />
                  <span className="font-black italic text-xl tracking-tighter text-white opacity-80">ADMIN</span>
                </div>
                <nav className="space-y-2">
                  <button onClick={() => setAdminTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'dashboard' ? 'bg-[#1e3a8a] text-black' : 'text-gray-300 hover:bg-white/5'}`}>
                    <Activity size={18} /> <span>Dashboard</span>
                  </button>
                  <button onClick={() => setAdminTab('stats')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'stats' ? 'bg-[#1e3a8a] text-black' : 'text-gray-300 hover:bg-white/5'}`}>
                    <Star size={18} /> <span>Dinamik Veriler</span>
                  </button>
                  <button onClick={() => setAdminTab('team')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'team' ? 'bg-[#1e3a8a] text-black' : 'text-gray-300 hover:bg-white/5'}`}>
                    <Users size={18} /> <span>Ekip Yönetimi</span>
                  </button>
                  <button onClick={() => setAdminTab('reviews')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'reviews' ? 'bg-[#1e3a8a] text-white' : 'text-gray-300 hover:bg-white/5'}`}>
                    <MessageSquare size={18} /> <span>Müşteri Yorumları</span>
                  </button>
                  <button onClick={() => setAdminTab('blog')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'blog' ? 'bg-[#1e3a8a] text-white' : 'text-gray-300 hover:bg-white/5'}`}>
                    <BookOpen size={18} /> <span>Blog Yazıları</span>
                  </button>
                  <button onClick={() => setAdminTab('leads')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'leads' ? 'bg-[#1e3a8a] text-white' : 'text-gray-300 hover:bg-white/5'}`}>
                    <Briefcase size={18} /> <span>Başvurular</span>
                  </button>
                  <button onClick={() => setAdminTab('settings')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-all ${adminTab === 'settings' ? 'bg-[#1e3a8a] text-black' : 'text-gray-300 hover:bg-white/5'}`}>
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
                      <span className="text-[#d69e2e] ml-2">Paneli</span>
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
                      <div className="glass p-6 rounded-xl border-t-4 border-[#d69e2e] relative overflow-hidden group">
                        <Users className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 group-hover:scale-110 transition-transform" />
                        <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Toplam Başvuru</p>
                        <p className="text-4xl font-black italic mt-2 text-white">{getDashboardStats().total}</p>
                        <div className="mt-4 flex items-center text-[#d69e2e] text-xs font-bold">
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
                        <p className="text-2xl font-black italic text-[#d69e2e]">{getDashboardStats().topCountry}</p>
                        <p className="text-[10px] text-gray-300 italic">En çok başvuru alan ülke.</p>
                      </div>
                      <div className="glass p-6 rounded-xl space-y-4">
                        <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Popüler Hizmet Alanı</p>
                        <p className="text-2xl font-black italic text-blue-400">{getDashboardStats().topService}</p>
                        <p className="text-[10px] text-gray-300 italic">En çok talep gören iş alanı.</p>
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
                          className="w-full bg-black/30 border border-white/10 px-4 py-3 rounded-lg text-2xl font-black text-[#d69e2e] outline-none focus:border-[#d69e2e]"
                        />
                      </div>
                      <div className="glass p-8 rounded-xl space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Mutlu Müşteri Sayısı</p>
                        <input 
                          type="number" 
                          value={siteContent?.stats?.clients || 0} 
                          onChange={(e) => setSiteContent({...siteContent, stats: {...siteContent.stats, clients: parseInt(e.target.value) || 0}})}
                          className="w-full bg-black/30 border border-white/10 px-4 py-3 rounded-lg text-2xl font-black text-[#d69e2e] outline-none focus:border-[#d69e2e]"
                        />
                      </div>
                      <div className="glass p-8 rounded-xl space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Hedef Ülke Sayısı</p>
                        <input 
                          type="number" 
                          value={siteContent?.stats?.countries || 0} 
                          onChange={(e) => setSiteContent({...siteContent, stats: {...siteContent.stats, countries: parseInt(e.target.value) || 0}})}
                          className="w-full bg-black/30 border border-white/10 px-4 py-3 rounded-lg text-2xl font-black text-[#d69e2e] outline-none focus:border-[#d69e2e]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <button onClick={() => showToast('İstatistik verileri başarıyla güncellendi!')} className="bg-[#1e3a8a] text-white font-black px-8 py-3 rounded-lg flex items-center space-x-2 hover:scale-105 transition-all">
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
                      }} className="bg-white/10 hover:bg-[#1e3a8a] text-white hover:text-white font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
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
                            <input value={member.name} onChange={(e) => { const newTeam = [...siteContent.team]; newTeam[idx].name = e.target.value; setSiteContent({...siteContent, team: newTeam}); }} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#d69e2e]" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">UNVAN / POZİSYON</label>
                            <input value={member.title} onChange={(e) => { const newTeam = [...siteContent.team]; newTeam[idx].title = e.target.value; setSiteContent({...siteContent, team: newTeam}); }} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#d69e2e] text-[#d69e2e]" />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">KISA AÇIKLAMA (OPSİYONEL)</label>
                            <input value={member.desc || ''} onChange={(e) => { const newTeam = [...siteContent.team]; newTeam[idx].desc = e.target.value; setSiteContent({...siteContent, team: newTeam}); }} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300 outline-none focus:border-[#d69e2e]" placeholder="Kişi hakkında kısa bilgi..." />
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
                      <button onClick={() => showToast('Ekip bilgileri güncellendi!')} className="bg-[#1e3a8a] text-white font-black px-8 py-3 rounded-lg flex items-center space-x-2 hover:scale-105 transition-all">
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
                          className="w-full bg-black/30 border border-white/10 pl-12 pr-4 py-3 rounded-lg text-sm font-bold outline-none focus:border-[#d69e2e]" 
                        />
                      </div>
                      <div className="flex items-center space-x-3 w-full md:w-auto">
                        <Filter size={18} className="text-gray-500" />
                        <select 
                          value={leadStatusFilter}
                          onChange={(e) => setLeadStatusFilter(e.target.value)}
                          className="flex-1 md:w-48 bg-black/30 border border-white/10 px-4 py-3 rounded-lg text-xs font-bold outline-none focus:border-[#d69e2e]"
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
                                <div className="absolute inset-0 bg-[#0f172a]/50 backdrop-blur-[1px] flex items-center justify-center z-10 py-10">
                                  <div className="flex items-center space-x-2 text-[#d69e2e] font-black text-xs uppercase tracking-widest italic animate-pulse">
                                    <Clock size={14} />
                                    <span>Veritabanı Senkronize Ediliyor...</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                          {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
                            <tr key={lead.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${lead.isNew ? 'bg-[#1e3a8a]/5' : ''}`}>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  {lead.isNew && <span className="bg-[#1e3a8a] text-black text-[8px] font-black px-1.5 py-0.5 rounded animate-pulse">YENİ</span>}
                                  <p className="font-bold text-white uppercase tracking-tight">{lead.name}</p>
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-[10px] text-gray-500 font-mono tracking-tighter">{lead.trackingId || 'ID YOK'}</p>
                                  <span className="text-gray-700">•</span>
                                  <p className="text-[10px] text-gray-300 font-mono">{lead.phone}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <p className="text-[#d69e2e] font-bold text-sm">{lead.service}</p>
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
                                  className="bg-[#0f172a] border border-white/10 text-xs font-bold px-3 py-2 rounded-lg outline-none focus:border-[#d69e2e]"
                                >
                                  <option value="İşlemde">İşlemde</option>
                                  <option value="Tamamlandı">Tamamlandı</option>
                                  <option value="Reddedildi">Reddedildi</option>
                                </select>
                              </td>
                              <td className="p-4 text-[11px] text-gray-300 font-medium">
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
                      <button onClick={() => setShowNewReviewForm(!showNewReviewForm)} className="bg-white/10 hover:bg-[#1e3a8a] text-white hover:text-white font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
                        <Plus size={16} /> <span>{showNewReviewForm ? 'Formu Kapat' : 'Yeni Yorum Ekle'}</span>
                      </button>
                    </div>

                    {showNewReviewForm && (
                      <div className="glass p-6 rounded-xl space-y-6 border border-[#d69e2e]/30 mb-8">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-[#d69e2e]">Yeni Yorum Ekle</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ad Soyad</label>
                            <input value={newReviewData.name} onChange={(e) => setNewReviewData({...newReviewData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#d69e2e]" placeholder="Örn: Ahmet Yılmaz" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ülke</label>
                            <select value={newReviewData.country} onChange={(e) => setNewReviewData({...newReviewData, country: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#d69e2e]">
                              <option className="bg-[#0f172a]" value="Almanya">Almanya</option>
                              <option className="bg-[#0f172a]" value="Polonya">Polonya</option>
                              <option className="bg-[#0f172a]" value="Litvanya">Litvanya</option>
                              <option className="bg-[#0f172a]" value="Hollanda">Hollanda</option>
                              <option className="bg-[#0f172a]" value="Belçika">Belçika</option>
                              <option className="bg-[#0f172a]" value="diğer">Diğer</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Vize Tipi</label>
                            <input value={newReviewData.visa_type} onChange={(e) => setNewReviewData({...newReviewData, visa_type: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#d69e2e]" placeholder="Örn: D Tipi Ulusal Vize" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Kaç Gün/Hafta Önce</label>
                            <input value={newReviewData.time_ago} onChange={(e) => setNewReviewData({...newReviewData, time_ago: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#d69e2e]" placeholder="Örn: 3 gün önce" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Beğeni Sayısı</label>
                            <input type="number" value={newReviewData.likes} onChange={(e) => setNewReviewData({...newReviewData, likes: parseInt(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#d69e2e]" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Yorum Sayısı</label>
                            <input type="number" value={newReviewData.comments_count} onChange={(e) => setNewReviewData({...newReviewData, comments_count: parseInt(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#d69e2e]" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Yorum Metni</label>
                          <textarea value={newReviewData.comment} onChange={(e) => setNewReviewData({...newReviewData, comment: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-lg text-sm text-gray-300 outline-none focus:border-[#d69e2e] min-h-[80px]" placeholder="Yorum içeriği..." />
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
                          }} className="bg-[#1e3a8a] text-white font-black px-8 py-3 rounded-lg flex items-center space-x-2 hover:scale-105 transition-all">
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
                                <p className="text-xs text-[#d69e2e] font-bold">{review.visa_type} - {review.country}</p>
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
                      <button onClick={() => setShowNewBlogForm(!showNewBlogForm)} className="bg-white/10 hover:bg-[#1e3a8a] text-white hover:text-white font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
                        <Plus size={16} /> <span>{showNewBlogForm ? 'Formu Kapat' : 'Yeni Yazı Ekle'}</span>
                      </button>
                    </div>

                    {showNewBlogForm && (
                      <div className="glass p-6 rounded-xl space-y-6 border border-[#d69e2e]/30 mb-8">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-[#d69e2e]">Yeni Yazı</h3>
                        <div className="grid grid-cols-1 gap-6">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Başlık</label>
                            <input value={newBlogData.title} onChange={(e) => setNewBlogData({...newBlogData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#d69e2e]" />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Slug (URL)</label>
                              <input value={newBlogData.slug} onChange={(e) => setNewBlogData({...newBlogData, slug: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#d69e2e] text-gray-300" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Kategori</label>
                              <input value={newBlogData.category} onChange={(e) => setNewBlogData({...newBlogData, category: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#d69e2e]" />
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
                            }} className="w-full bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-bold outline-none focus:border-[#d69e2e] text-gray-300" />
                            {newBlogData.cover_image && <div className="mt-2 text-xs text-green-400 font-bold flex items-center space-x-1"><span>✓ Görsel Yüklendi:</span> <a href={newBlogData.cover_image} target="_blank" rel="noreferrer" className="underline truncate block max-w-xs">{newBlogData.cover_image}</a></div>}
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Özet</label>
                            <textarea value={newBlogData.summary} onChange={(e) => setNewBlogData({...newBlogData, summary: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-lg text-sm text-gray-300 outline-none focus:border-[#d69e2e] min-h-[60px]" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">İçerik</label>
                            <textarea value={newBlogData.content} onChange={(e) => setNewBlogData({...newBlogData, content: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-lg text-sm text-gray-300 outline-none focus:border-[#d69e2e] min-h-[200px]" />
                          </div>
                          <div className="flex items-center space-x-3">
                            <input type="checkbox" id="is_pub" checked={newBlogData.is_published} onChange={(e) => setNewBlogData({...newBlogData, is_published: e.target.checked})} className="w-4 h-4 accent-[#d69e2e]" />
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
                          }} className="bg-[#1e3a8a] text-white font-black px-8 py-3 rounded-lg flex items-center space-x-2 hover:scale-105 transition-all">
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
                                <p className="text-xs text-[#d69e2e] font-bold">/{post.slug}</p>
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
                          className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-lg font-bold text-white outline-none focus:border-[#d69e2e]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">İletişim Telefonu</label>
                        <input 
                          value={siteSettings?.phone || ''} 
                          onChange={(e) => setSiteSettings({...siteSettings, phone: e.target.value})}
                          className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-lg font-bold text-white outline-none focus:border-[#d69e2e]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">WhatsApp Numarası (Uluslararası Format)</label>
                        <input 
                          value={siteSettings?.whatsapp || ''} 
                          onChange={(e) => setSiteSettings({...siteSettings, whatsapp: e.target.value})}
                          className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-lg font-bold text-white outline-none focus:border-[#d69e2e]"
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
                      }} className="bg-[#1e3a8a] text-white font-black px-8 py-3 rounded-lg flex items-center space-x-2 hover:scale-105 transition-all">
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
          <div className="glass p-12 rounded-2xl w-full text-center space-y-8 border-t-4 border-[#d69e2e]">
            <Lock className="text-[#d69e2e] w-16 h-16 mx-auto" />
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Müşteri <span className="text-[#d69e2e]">Portalı</span></h2>
              <p className="text-gray-300 mt-2 text-sm">Vize başvuru sürecinizi adım adım takip edin.</p>
            </div>
            {!portalLoggedIn ? (
              <form onSubmit={handlePortalLogin} className="space-y-4">
                <input 
                  required 
                  placeholder="T.C. Kimlik / Pasaport No" 
                  value={portalUser}
                  onChange={(e) => setPortalUser(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 px-6 py-4 rounded-lg font-bold focus:border-[#d69e2e] outline-none" 
                />
                <input 
                  required 
                  type="password" 
                  placeholder="Şifre" 
                  value={portalPass}
                  onChange={(e) => setPortalPass(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 px-6 py-4 rounded-lg font-bold focus:border-[#d69e2e] outline-none" 
                />
                <button type="submit" className="w-full bg-[#1e3a8a] text-black font-black py-4 rounded-lg text-lg hover:scale-[1.02] transition-transform">GİRİŞ YAP</button>
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
                    <div className="w-6 h-6 rounded-full border-2 border-[#d69e2e] flex items-center justify-center bg-[#1e3a8a]/20 animate-pulse"></div>
                    <div className="flex-1"><p className="text-sm font-bold text-[#d69e2e]">3. Konsolosluk Randevusu</p><p className="text-xs text-gray-500">Bekleniyor (Tahmini: 14 Gün)</p></div>
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
          <div className="mr-4 bg-white text-white px-4 py-2 rounded-lg shadow-2xl font-black text-sm italic tracking-tight opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 border border-gray-200 relative pointer-events-none">
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
          <div className="bg-[#0f172a] border border-white/10 p-10 rounded-2xl w-full max-w-lg relative shadow-2xl animate-scale-up">
            <X size={24} className="absolute top-6 right-6 cursor-pointer text-gray-500 hover:text-white" onClick={() => setSelectedLead(null)} />
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${getLeadQuality(selectedLead).color}`}>
                    {getLeadQuality(selectedLead).label}
                  </span>
                  <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">ID: {selectedLead.trackingId || `#${selectedLead.id}`}</span>
                  <span className="bg-white/5 text-gray-300 text-[9px] px-2 py-1 rounded uppercase tracking-widest font-black">{selectedLead.source || 'BİLİNMİYOR'}</span>
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">{selectedLead.name}</h3>
                <p className="text-[#d69e2e] font-bold text-lg">{selectedLead.service} - {selectedLead.country}</p>
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
                <div className="bg-white/5 p-4 rounded-xl text-gray-300 text-sm italic border border-white/5">
                  {selectedLead.note || "Herhangi bir not eklenmemiş."}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <a href={`tel:${selectedLead.phone}`} className="bg-white/5 border border-white/10 hover:border-[#d69e2e] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all">
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
        <div className={`fixed bottom-10 left-10 z-50 bg-white border border-border p-6 rounded-lg flex items-center space-x-5 transition-all duration-700 shadow-xl ${showPopup ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-gold shadow-lg shadow-primary/20"><Users size={24} /></div>
          <div>
            <p className="text-base font-bold text-primary tracking-tight">{popupContent}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-text-light font-bold uppercase tracking-widest">ŞİMDİ BAŞVURDU</p>
            </div>
          </div>
          <button onClick={() => setShowPopup(false)} className="ml-4 text-text-light hover:text-primary transition-colors"> <X size={18} /> </button>
        </div>
      )}

      {/* WIZARD MODAL */}
      {!currentPage.startsWith('admin') && (
        <div className={`fixed inset-0 z-[100] bg-dark/95 backdrop-blur-md flex items-center justify-center p-6 transition-all duration-500 ${showWizard ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className={`bg-white rounded-xl w-full max-w-2xl relative shadow-2xl transition-all duration-500 ${showWizard ? 'scale-100' : 'scale-95'}`}>
            <X size={24} className="absolute top-6 right-6 cursor-pointer text-text-light hover:text-primary transition-colors" onClick={() => setShowWizard(false)} />

            <div className="p-10 lg:p-16">
              <div className="mb-10">
                <h3 className="text-3xl font-title text-primary uppercase">Uygunluk Testi</h3>
                <p className="text-text-light mt-2">3 adımda size en uygun vize rotasını belirleyelim.</p>
                <div className="flex space-x-2 mt-6">
                  {[1, 2, 3].map(step => (
                    <div key={step} className={`h-1 flex-1 rounded-full ${wizardStep >= step ? 'bg-gold' : 'bg-gray'}`}></div>
                  ))}
                </div>
              </div>

              {wizardStep === 1 && (
                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-primary italic">1. Mesleğiniz nedir?</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {['Tır Şoförü', 'Fabrika İşçisi', 'Depo Personeli', 'Nitelikli Çalışan'].map(job => (
                      <button key={job} onClick={() => { setWizardData({ ...wizardData, job }); setWizardStep(2); }} className="border border-border p-6 rounded-lg font-bold text-primary hover:border-gold hover:bg-gray transition-all">{job}</button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-primary italic">2. Hedef ülkeniz neresi?</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {['Almanya', 'Polonya', 'Litvanya', 'Hollanda'].map(country => (
                      <button key={country} onClick={() => { setWizardData({ ...wizardData, country }); setWizardStep(3); }} className="border border-border p-6 rounded-lg font-bold text-primary hover:border-gold hover:bg-gray transition-all">{country}</button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-primary italic">3. Son Adım</h4>
                  <p className="text-text-light text-sm">Ücretsiz değerlendirme sonucunuzu iletmemiz için bilgilerinizi girin.</p>
                  <div className="space-y-4">
                    <input placeholder="Ad Soyad" onChange={(e) => setWizardData({ ...wizardData, name: e.target.value })} className="w-full border border-border px-6 py-4 rounded-lg focus:border-gold outline-none" />
                    <input placeholder="Telefon" onChange={(e) => setWizardData({ ...wizardData, phone: e.target.value })} className="w-full border border-border px-6 py-4 rounded-lg focus:border-gold outline-none" />
                    <button onClick={() => {
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
                      showToast('Yeni Başvuru Alındı!');
                      setShowWizard(false); 
                      setWizardStep(1);
                      setFormSuccess(true);
                      scrollToForm();
                    }} className="w-full bg-primary text-white font-bold py-5 rounded-lg text-lg hover:bg-primary-light transition-colors mt-4">
                      SONUCU GÖNDER
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        html { scroll-behavior: smooth; }
      `}</style>

      {/* TRACKING MODAL */}
      {showTrackingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark/90 backdrop-blur-md">
          <div className="bg-white max-w-lg w-full p-10 lg:p-12 rounded-xl relative shadow-2xl">
            <button onClick={() => { setShowTrackingModal(false); setTrackingResult(null); setTrackingError(false); setTrackingCode(''); }} className="absolute top-6 right-6 text-text-light hover:text-primary transition-colors">
              <X size={24} />
            </button>

            <div className="space-y-8">
              <div className="text-center">
                <Search className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="text-3xl font-title text-primary uppercase">Başvuru Sorgula</h3>
                <p className="text-text-light text-sm mt-2">Takip kodunuzu girerek güncel durumu öğrenin.</p>
              </div>

              {!trackingResult && !trackingError ? (
                <form onSubmit={handleTrack} className="space-y-4">
                  <input 
                    autoFocus
                    placeholder="Takip Kodu veya Telefon" 
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    className="w-full border border-border px-6 py-4 rounded-lg font-bold text-lg focus:border-gold outline-none"
                  />
                  <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-lg text-lg hover:bg-primary-light transition-colors">SORGULA</button>
                </form>
              ) : trackingResult ? (
                <div className="space-y-8 animate-fade-up">
                  <div className="bg-gray p-6 rounded-lg border border-border space-y-4">
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-light">Danışan</span>
                      <span className="text-primary font-bold">{trackingResult.name}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-light">Durum</span>
                      <span className={`font-bold uppercase ${trackingResult.status === 'İptal' ? 'text-red-600' : 'text-green-600'}`}>{trackingResult.status}</span>
                    </div>
                    <div className="pt-2 space-y-3">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-primary">
                        <span>İlerleme</span>
                        <span>%{getStatusProgress(trackingResult.status)}</span>
                      </div>
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-gold transition-all duration-1000" style={{ width: `${getStatusProgress(trackingResult.status)}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => { setTrackingResult(null); setTrackingCode(''); }} className="border border-border py-4 rounded-lg font-bold text-sm hover:bg-gray transition-colors">YENİ SORGULAMA</button>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER_SAFE}`} target="_blank" rel="noreferrer" className="bg-[#25D366] text-white py-4 rounded-lg font-bold text-sm flex items-center justify-center space-x-2">
                      <MessageCircle size={18} /> <span>DESTEK AL</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                    <p className="text-red-600 font-bold">Kayıt bulunamadı. Lütfen bilgilerinizi kontrol edin.</p>
                  </div>
                  <button onClick={() => setTrackingError(false)} className="w-full border border-border py-4 rounded-lg font-bold">TEKRAR DENE</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      {!currentPage.startsWith('admin') && (
        <footer className="bg-dark pt-16 pb-10 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              <div className="space-y-6">
                <img src={logoImg} alt="CMSVize Logo" className="h-14 w-auto" />
                <p className="text-gray-400 text-sm leading-relaxed">
                  Avrupa vizeleri ve oturum izinleri konusunda profesyonel çözüm ortağınız.
                </p>
                <div className="flex space-x-3">
                  <a href="https://www.instagram.com/cmsvize/" target="_blank" rel="noreferrer" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-gold transition-colors">
                    <InstagramIcon size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-gold transition-colors">
                    <Globe size={18} />
                  </a>
                </div>
                <div className="flex flex-wrap gap-3 pt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <span className="bg-white/5 px-2 py-1 rounded">🔒 SSL Güvenli</span>
                  <span className="bg-white/5 px-2 py-1 rounded">✓ KVKK</span>
                  <span className="bg-white/5 px-2 py-1 rounded">⭐ 500+ Başvuru</span>
                  <span className="bg-white/5 px-2 py-1 rounded">🌍 TR & LT Ofis</span>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-lg font-title text-gold uppercase tracking-widest">Türkiye Ofisi</h4>
                <div className="space-y-4 text-sm text-gray-300">
                  <div className="flex items-start space-x-3">
                    <MapPin size={18} className="text-gold mt-1 flex-shrink-0" />
                    <p>Zafer Mahallesi, Bankalar Caddesi No:12 Kat:3 Merkez / Aksaray</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-gold" />
                    <p>+90 545 991 82 68</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-lg font-title text-gold uppercase tracking-widest">Avrupa Ofisi</h4>
                <div className="space-y-4 text-sm text-gray-300">
                  <div className="flex items-start space-x-3">
                    <MapPin size={18} className="text-gold mt-1 flex-shrink-0" />
                    <p>Gedimino pr. 20, Vilnius 01103 Lietuva (Litvanya)</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-gold" />
                    <p>+370 600 12345</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-lg font-title text-gold uppercase tracking-widest">İletişim & Mesai</h4>
                <div className="space-y-4 text-sm text-gray-300">
                  <div className="flex items-center space-x-3">
                    <Mail size={16} className="text-gold" />
                    <p>info@cmsvize.com</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock size={16} className="text-gold" />
                    <p>Pzt-Cum: 09:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center py-12 border-t border-[#C9A84C]/20 gap-8 mb-8">
              <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <span className="flex items-center space-x-2"><Lock size={14} className="text-gold" /> <span>SSL GÜVENLİ</span></span>
                <span className="flex items-center space-x-2"><CheckCircle2 size={14} className="text-gold" /> <span>KVKK UYUMLU</span></span>
                <span className="flex items-center space-x-2"><ShieldCheck size={14} className="text-gold" /> <span>RESMİ DANIŞMANLIK</span></span>
              </div>
              <div className="flex space-x-8 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                <button onClick={() => setCurrentPage('privacy')} className="hover:text-gold transition-colors">GİZLİLİK POLİTİKASI</button>
                <button onClick={() => setCurrentPage('terms')} className="hover:text-gold transition-colors">KULLANIM KOŞULLARI</button>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 pb-4">
              © 2026 CMSVize Global Consultancy. Tüm hakları saklıdır.
            </div>
          </div>
        </footer>
      )}

      {/* COOKIE CONSENT BANNER */}
      {!cookieConsent && (
        <div className="fixed bottom-6 left-6 right-6 md:right-auto md:left-10 md:w-[400px] z-[100] animate-fade-up">
          <div className="bg-white p-6 rounded-lg border border-gold/30 shadow-2xl space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🍪</span>
              <p className="text-xs text-text-light leading-relaxed">
                Bu site daha iyi bir deneyim sunmak için çerez kullanmaktadır. Detaylı bilgi için <button onClick={() => setCurrentPage('cookies')} className="text-gold hover:underline font-bold">Çerez Politikası</button> sayfamızı inceleyin.
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  localStorage.setItem('cookieConsent', 'accepted');
                  setCookieConsent('accepted');
                }}
                className="flex-1 bg-primary text-white text-[10px] font-bold uppercase py-2.5 rounded-lg transition-transform hover:scale-[1.02]"
              >
                Kabul Et
              </button>
              <button 
                onClick={() => {
                  localStorage.setItem('cookieConsent', 'rejected');
                  setCookieConsent('rejected');
                }}
                className="flex-1 border border-border text-text-light text-[10px] font-bold uppercase py-2.5 rounded-lg transition-colors hover:bg-gray"
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
