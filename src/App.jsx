import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function App() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    country: "Almanya",
    message: "",
  });

  const onlineCount = Math.floor(Math.random() * 15) + 10;

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const text = `Merhaba, başvuru yapmak istiyorum.
Ad Soyad: ${form.fullName}
Telefon: ${form.phone}
Hedef Ülke: ${form.country}
Mesaj: ${form.message}`;

    window.open(
      `https://wa.me/905459918268?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <div className="bg-[#030712] text-white min-h-screen">

      {/* HERO */}
      <section className="px-6 py-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

        {/* SOL */}
        <div data-aos="fade-right">

          <span className="text-yellow-400 text-sm font-semibold">
            CMSVize • Profesyonel Danışmanlık
          </span>

          {/* 1️⃣ HERO BAŞLIK */}
          <h1 className="text-4xl sm:text-5xl font-bold mt-4 leading-tight">
            2 Yıllık Litvanya Oturum Kartı ile  
            <span className="text-yellow-400"> Avrupa’da Çalışma Fırsatı</span>
          </h1>

          {/* 2️⃣ ACİLİYET */}
          <p className="mt-4 inline-block bg-yellow-400/10 border border-yellow-400/30 px-4 py-2 rounded-xl text-sm text-yellow-300">
            ⚡ Sınırlı kontenjan • Başvurular hızla doluyor
          </p>

          <p className="text-gray-400 mt-4">
            A1 Transfer + KOD95 ile Avrupa’da tır şoförlüğü ve çalışma fırsatı.
          </p>

          {/* BUTONLAR */}
          <div className="flex gap-4 mt-6">
            <a
              href="#basvuru"
              className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition animate-pulse"
            >
              Hemen Başvur
            </a>

            <a className="border px-6 py-3 rounded-xl hover:bg-white/10 transition">
              Hizmetler
            </a>
          </div>

          {/* 3️⃣ FAKE SOSYAL KANIT */}
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-2 rounded-xl">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
              {onlineCount} kişi inceliyor
            </div>

            <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
              Son başvuru: 2 dk önce
            </div>

            <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
              ✔ 312+ başvuru
            </div>
          </div>

        </div>

        {/* SAĞ */}
        <div data-aos="fade-left">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
            className="rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* FORM */}
      <section id="basvuru" className="px-6 pb-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">

        {/* SOL */}
        <div data-aos="fade-up">
          <h2 className="text-3xl font-bold">Güven veren marka hissi</h2>

          <p className="text-gray-400 mt-4">
            Profesyonel süreç, hızlı iletişim ve güvenli başvuru.
          </p>
        </div>

        {/* SAĞ PANEL */}
        <div className="bg-[#111827] p-6 rounded-2xl border border-white/10" data-aos="fade-up">

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

            {/* 5️⃣ WHATSAPP BUTON */}
            <button
              type="submit"
              className="w-full bg-green-500 py-3 rounded-xl font-bold hover:scale-105 transition animate-pulse"
            >
              WhatsApp ile Gönder
            </button>

            {/* 4️⃣ GÜVEN MADDELERİ */}
            <div className="mt-4 text-sm text-gray-400 space-y-2">
              <p>✔ Bilgileriniz gizlidir</p>
              <p>✔ Ücretsiz danışmanlık</p>
              <p>✔ Hızlı geri dönüş</p>
            </div>

          </form>
        </div>

      </section>

      {/* FLOAT WHATSAPP */}
      <a
        href="https://wa.me/905459918268"
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 px-6 py-3 rounded-full shadow-lg animate-bounce"
      >
        WhatsApp Yaz
      </a>

    </div>
  );
}