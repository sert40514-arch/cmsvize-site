import { useState } from "react";
import {
  Phone,
  MessageCircle,
  ShieldCheck,
  FileText,
  Truck,
  Globe,
  CheckCircle,
} from "lucide-react";

export default function App() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    country: "Almanya",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const whatsappMessage = `Merhaba, CMSVize üzerinden başvuru bırakıyorum.

Ad Soyad: ${form.fullName || "-"}
Telefon: ${form.phone || "-"}
Hedef Ülke: ${form.country || "-"}
Mesaj: ${form.message || "-"}

2 yıllık Litvanya oturum kartı, A1 transfer ve KOD 95 süreci hakkında bilgi almak istiyorum.`;

  const whatsappLink = `https://wa.me/905459918268?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="bg-[#030712] text-white min-h-screen">

      {/* HERO */}
      <section className="px-6 py-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        
        <div>
          <span className="text-yellow-400 text-sm font-semibold">
            CMSVize • Profesyonel Danışmanlık
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold mt-4 leading-tight">
            2 Yıllık Litvanya Oturum Kartı ile  
            <span className="text-yellow-400"> Avrupa’da Çalışma</span>
          </h1>

          <p className="text-gray-400 mt-4">
            A1 Transfer, KOD 95 ve tır şoförü iş süreçlerinde profesyonel danışmanlık.
          </p>

          <div className="flex gap-4 mt-6">
            <a
              href="#basvuru"
              className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold"
            >
              Hemen Başvur
            </a>
            <a className="border px-6 py-3 rounded-xl">Hizmetler</a>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
          className="rounded-2xl shadow-2xl"
        />
      </section>

      {/* HİZMETLER */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-10">Hizmetlerimiz</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Litvanya Oturum",
              icon: <FileText />,
            },
            {
              title: "A1 Transfer",
              icon: <Globe />,
            },
            {
              title: "KOD 95 + İş",
              icon: <Truck />,
            },
            {
              title: "Almanya Süreci",
              icon: <ShieldCheck />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#0f172a] p-6 rounded-xl border border-white/10"
            >
              <div className="text-yellow-400 mb-3">{item.icon}</div>
              <h3 className="font-bold">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* SÜREÇ */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-10">Süreç</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {["Değerlendirme", "Evrak", "Başvuru", "Sonuç"].map((step, i) => (
            <div key={i} className="bg-[#0f172a] p-6 rounded-xl">
              <h3 className="font-bold">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section id="basvuru" className="px-6 py-16 max-w-5xl mx-auto">
        <div className="bg-[#0f172a] p-10 rounded-2xl border border-yellow-400/20">
          
          <h2 className="text-3xl font-bold">
            Bilgini bırak, sana dönüş yapalım
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            
            <input
              name="fullName"
              onChange={handleChange}
              placeholder="Ad Soyad"
              className="w-full p-3 rounded bg-black border"
            />

            <input
              name="phone"
              onChange={handleChange}
              placeholder="Telefon"
              className="w-full p-3 rounded bg-black border"
            />

            <select
              name="country"
              onChange={handleChange}
              className="w-full p-3 rounded bg-black border text-white"
            >
              <option>Almanya</option>
              <option>Fransa</option>
              <option>İtalya</option>
            </select>

            <textarea
              name="message"
              onChange={handleChange}
              placeholder="Mesaj"
              className="w-full p-3 rounded bg-black border"
            />

            <button
              type="submit"
              className="w-full bg-yellow-400 text-black py-3 rounded-xl font-bold"
            >
              WhatsApp ile Gönder
            </button>

            <p className="text-xs text-gray-400 text-center">
              Bilgileriniz gizli tutulur.
            </p>
          </form>
        </div>
      </section>

      {/* WHATSAPP FLOAT */}
      <a
        href="https://wa.me/905459918268"
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 px-6 py-3 rounded-full flex items-center gap-2 animate-bounce"
      >
        <MessageCircle size={18} /> WhatsApp
      </a>
    </div>
  );
}