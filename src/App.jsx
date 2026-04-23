import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

/* =================== KÜÇÜK ARA BİLEŞENLER =================== */

function SocialChips({ online }) {
  return (
    <div className="mt-6 flex flex-wrap gap-3 text-sm">
      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-xl">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <span><b>{online}</b> kişi şu anda inceliyor</span>
      </div>

      <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
        Son başvuru: <b>2 dk önce</b>
      </div>

      <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
        ✔ <b>312+</b> başarılı başvuru
      </div>
    </div>
  );
}

function TrustList() {
  const items = [
    "Bilgileriniz KVKK kapsamında gizlidir",
    "Ücretsiz ön değerlendirme",
    "48 saat içinde geri dönüş",
    "Dosya takibi ve süreç danışmanlığı",
  ];
  return (
    <ul className="mt-4 space-y-2 text-sm text-gray-300">
      {items.map((t, i) => (
        <li key={i} className="flex items-center gap-2">
          <span className="text-emerald-400">✔</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Testimonials() {
  const data = [
    {
      name: "Ahmet K.",
      text: "Evrak süreci hızlı ilerledi. 2 yıl oturum ve iş yerleşimi için destek aldım.",
      city: "İzmir",
    },
    {
      name: "Mehmet T.",
      text: "KOD95 ve yerleştirme sürecinde net yönlendirme yaptılar.",
      city: "Ankara",
    },
    {
      name: "Ali Y.",
      text: "Başvurudan sonra düzenli bilgilendirme aldım, tavsiye ederim.",
      city: "Bursa",
    },
  ];

  return (
    <section className="px-6 pb-20 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Müşteri Yorumları</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {data.map((t, i) => (
          <div
            key={i}
            data-aos="fade-up"
            className="p-5 rounded-2xl border border-white/10 bg-white/5"
          >
            <p className="text-gray-300 text-sm leading-relaxed">“{t.text}”</p>
            <div className="mt-4 text-sm text-gray-400">
              <b className="text-white">{t.name}</b> • {t.city}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Popup({ item }) {
  if (!item) return null;
  return (
    <div className="fixed bottom-6 left-6 z-50 animate-fade-in">
      <div className="bg-[#111827] border border-white/10 px-4 py-3 rounded-xl shadow-lg text-sm">
        <span className="text-emerald-400 mr-2">✔</span>
        {item}
      </div>
    </div>
  );
}

/* =================== ANA UYGULAMA =================== */

export default function App() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    country: "Almanya",
    message: "",
  });

  const online = useMemo(() => Math.floor(Math.random() * 15) + 10, []);

  const popMessages = [
    "Ahmet • Almanya başvurusu yaptı",
    "Mehmet • Fransa başvurusu yaptı",
    "Ali • İtalya başvurusu yaptı",
    "Hasan • Litvanya oturum başvurusu yaptı",
  ];
  const [popup, setPopup] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const i = setInterval(() => {
      const r = popMessages[Math.floor(Math.random() * popMessages.length)];
      setPopup(r);
      setTimeout(() => setPopup(""), 3500);
    }, 6000);
    return () => clearInterval(i);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `Merhaba, başvuru yapmak istiyorum.
Ad Soyad: ${form.fullName}
Telefon: ${form.phone}
Hedef Ülke: ${form.country}
Mesaj: ${form.message || "-"}`;
    window.open(
      `https://wa.me/905459918268?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <div className="bg-[#030712] text-white min-h-screen">
      {/* ===== HERO ===== */}
      <section className="px-6 py-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* SOL */}
        <div data-aos="fade-right">
          <span className="text-yellow-400 text-sm font-semibold">
            CMSVize • Profesyonel Danışmanlık
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold mt-4 leading-tight">
            2 Yıllık Litvanya Oturum Kartı ile{" "}
            <span className="text-yellow-400">
              Avrupa’da Çalışma Fırsatı
            </span>
          </h1>

          <p className="mt-4 inline-block bg-yellow-400/10 border border-yellow-400/30 px-4 py-2 rounded-xl text-sm text-yellow-300">
            ⚡ Sınırlı kontenjan • Başvurular hızla doluyor
          </p>

          <p className="text-gray-400 mt-4">
            A1 Transfer + KOD95 ile Avrupa’da tır şoförlüğü ve çalışma fırsatı.
            Dosya hazırlığı, başvuru ve süreç takibi için danışmanlık sunuyoruz.
          </p>

          <div className="flex gap-4 mt-6">
            <a
              href="#basvuru"
              className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
            >
              Hemen Başvur
            </a>
            <a className="border px-6 py-3 rounded-xl hover:bg-white/10 transition">
              Hizmetler
            </a>
          </div>

          <SocialChips online={online} />
        </div>

        {/* SAĞ – OTURUM KARTI TEMALI GÖRSEL */}
        <div data-aos="fade-left">
          <img
            alt="Oturum kartı temsili görsel"
            src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&auto=format&fit=crop"
            className="rounded-2xl shadow-2xl border border-white/10"
          />
        </div>
      </section>

      {/* ===== FORM / SAĞ PANEL ===== */}
      <section
        id="basvuru"
        className="px-6 pb-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10"
      >
        <div data-aos="fade-up">
          <h2 className="text-3xl font-bold">Güven veren marka hissi</h2>
          <p className="text-gray-400 mt-4">
            Profesyonel süreç, hızlı iletişim ve düzenli bilgilendirme.
          </p>
        </div>

        <div
          className="bg-[#111827] p-6 rounded-2xl border border-white/10"
          data-aos="fade-up"
        >
          <h3 className="text-xl font-bold mb-4">
            Bilgini bırak, hızlı dönüş yapalım
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="fullName"
              placeholder="Ad Soyad"
              value={form.fullName}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
              required
            />
            <input
              name="phone"
              placeholder="Telefon"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
              required
            />
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
            >
              <option>Almanya</option>
              <option>Fransa</option>
              <option>İtalya</option>
            </select>
            <textarea
              name="message"
              placeholder="Mesaj"
              value={form.message}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
            />

            <button
              type="submit"
              className="w-full bg-emerald-500 py-3 rounded-xl font-bold hover:scale-105 transition"
            >
              WhatsApp ile Gönder
            </button>

            <TrustList />
          </form>
        </div>
      </section>

      {/* ===== YORUMLAR ===== */}
      <Testimonials />

      {/* FLOAT WHATSAPP */}
      <a
        href="https://wa.me/905459918268"
        target="_blank"
        className="fixed bottom-6 right-6 bg-emerald-500 px-6 py-3 rounded-full shadow-lg hover:scale-110 transition"
      >
        WhatsApp Yaz
      </a>

      {/* POPUP */}
      <Popup item={popup} />
    </div>
  );
}