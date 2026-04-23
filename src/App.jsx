import { useState } from "react";
import {
  ShieldCheck,
  FileBadge2,
  Truck,
  Globe2,
  Phone,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  FileText,
  Clock3,
  BadgeCheck,
  MessageCircleMore,
  Building2,
  Send,
  User,
  MapPinned,
  MessageSquareText,
} from "lucide-react";

export default function CMSVizeLandingPage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    country: "Almanya",
    message: "",
  });

  const stats = [
    { value: "2 Yıl", label: "Oturum Odaklı Süreç" },
    { value: "KOD 95", label: "Profesyonel Sürücü Desteği" },
    { value: "AB Hatları", label: "Almanya, Fransa, İtalya" },
    { value: "Tam Destek", label: "Evrak ve Başvuru Takibi" },
  ];

  const services = [
    {
      icon: <FileBadge2 className="h-6 w-6" />,
      title: "Litvanya Oturum Danışmanlığı",
      desc: "2 yıllık oturum süreci için profesyonel yönlendirme, evrak planlaması ve başvuru desteği.",
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "KOD 95 Süreç Yönetimi",
      desc: "Profesyonel sürücüler için gerekli belge ve mesleki yeterlilik sürecinde net rehberlik.",
    },
    {
      icon: <Globe2 className="h-6 w-6" />,
      title: "Avrupa İş ve Transit Hattı",
      desc: "Litvanya çıkışlı Almanya, Fransa ve İtalya hatlarına uygun kariyer ve geçiş planlaması.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Evrak Kontrol ve Dosyalama",
      desc: "Eksiksiz, düzenli ve güven veren başvuru dosyası hazırlığı ile profesyonel süreç takibi.",
    },
  ];

  const process = [
    {
      step: "01",
      title: "Ön Değerlendirme",
      desc: "Mevcut durumunuz analiz edilir ve size uygun başvuru planı oluşturulur.",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      step: "02",
      title: "Evrak Hazırlığı",
      desc: "Gerekli evrak listesi netleştirilir, belgeler profesyonel şekilde düzenlenir.",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      step: "03",
      title: "Başvuru ve Takip",
      desc: "Başvuru süreci kontrollü şekilde ilerletilir ve her aşama düzenli takip edilir.",
      icon: <Clock3 className="h-5 w-5" />,
    },
    {
      step: "04",
      title: "Yeni Sürece Geçiş",
      desc: "Oturum ve sürücü süreciniz sonrası Avrupa odaklı profesyonel yönlendirme sağlanır.",
      icon: <BadgeCheck className="h-5 w-5" />,
    },
  ];

  const reasons = [
    "Kurumsal ve güven veren dijital sunum",
    "2 yıllık oturum odaklı net süreç yapısı",
    "KOD 95 ve sürücü odaklı profesyonel destek",
    "Eksiksiz dosyalama ve başvuru takibi",
    "Müşteri iletişiminde hızlı dönüş yapısı",
    "Avrupa hedefi olan başvurular için düzenli planlama",
  ];

  const whatsappMessage = `Merhaba, CMSVize üzerinden başvuru bırakıyorum.%0A%0AAd Soyad: ${form.fullName || "-"}%0ATelefon: ${form.phone || "-"}%0AHedef Ülke: ${form.country || "-"}%0AMesaj: ${form.message || "-"}`;
  const whatsappLink = `https://wa.me/905459918268?text=${whatsappMessage}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#030712]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-yellow-400/25 bg-yellow-400/10 text-yellow-300 shadow-lg shadow-yellow-500/10">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight">CMSVize</div>
              <div className="text-xs text-slate-400">
                Avrupa Oturum ve Sürücü Danışmanlığı
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
            <a href="#hizmetler" className="transition hover:text-white">
              Hizmetler
            </a>
            <a href="#surec" className="transition hover:text-white">
              Süreç
            </a>
            <a href="#neden-biz" className="transition hover:text-white">
              Neden Biz?
            </a>
            <a href="#basvuru-formu" className="transition hover:text-white">
              Başvuru
            </a>
          </nav>

          <a
            href="#basvuru-formu"
            className="hidden rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02] lg:inline-flex"
          >
            Hızlı Başvuru
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(37,99,235,0.28),transparent_38%),linear-gradient(to_bottom,#0b1736,#071122_55%,#030712)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px]" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-300">
              CMSVize • Güven veren premium danışmanlık deneyimi
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl xl:text-7xl">
              2 Yıllık Litvanya Oturum
              <span className="mt-2 block text-yellow-400">
                KOD 95 ile Avrupa Yolunda
              </span>
              <span className="mt-2 block text-white">
                Güvenli ve Profesyonel Başlangıç
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Litvanya oturum, KOD 95 ve Avrupa iş fırsatları için güçlü marka
              algısı oluşturan, tamamen profesyonel ve koyu temalı bir açılış
              sayfası.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#basvuru-formu"
                className="inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-6 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-yellow-500/20 transition hover:scale-[1.02]"
              >
                Hemen Başvuru <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#hizmetler"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Hizmetleri İncele
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5 backdrop-blur-sm"
                >
                  <div className="text-2xl font-black text-yellow-400">
                    {item.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-300">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="rounded-[28px] border border-blue-400/10 bg-[#071226] p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-slate-400">
                      Kurumsal Süreç Paneli
                    </div>
                    <div className="mt-1 text-3xl font-black tracking-tight">
                      CMSVize
                    </div>
                  </div>
                  <div className="rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-bold text-slate-950">
                    2 Yıllık Oturum
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[24px] border border-white/10 bg-slate-800/40 p-5">
                    <div className="text-sm text-slate-400">Ana Hizmet</div>
                    <div className="mt-3 text-3xl font-black">
                      Litvanya Oturum
                    </div>
                    <div className="mt-2 text-sm leading-7 text-slate-300">
                      Başvuru, evrak ve süreç yönetimi ile güven veren
                      danışmanlık yapısı.
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-yellow-400/20 bg-yellow-400/10 p-5">
                    <div className="text-sm text-yellow-200/70">
                      Profesyonel Sürücü
                    </div>
                    <div className="mt-3 text-3xl font-black text-yellow-300">
                      KOD 95
                    </div>
                    <div className="mt-2 text-sm leading-7 text-yellow-100/80">
                      Mesleki yeterlilik odaklı, premium destek ve süreç
                      rehberliği.
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-slate-800/40 p-5 md:col-span-2">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm text-slate-400">
                          Transit Hatlar
                        </div>
                        <div className="mt-2 text-2xl font-black">
                          Litvanya → Almanya / Fransa / İtalya
                        </div>
                        <div className="mt-2 text-sm text-slate-300">
                          Avrupa hedefli sürücü ve oturum süreçleri için odak
                          pazarlama yapısı.
                        </div>
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
                        🌍
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-slate-300">
                    Kurumsal güven algısı
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-slate-300">
                    Premium müşteri sunumu
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-slate-300">
                    Dijital reklam uyumu
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="hizmetler" className="border-y border-white/10 bg-[#020817]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <div className="text-sm font-bold uppercase tracking-[0.28em] text-yellow-400">
                Hizmetlerimiz
              </div>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                Tamamen profesyonel çözümler
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Koyu tema, premium görünüm ve güven veren mesaj dili ile CMSVize
              markasını güçlü gösterecek hizmet blokları burada sunulur.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="group rounded-[28px] border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-yellow-400/20 hover:bg-white/[0.06]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
                  {service.icon}
                </div>
                <h3 className="mt-6 text-2xl font-black tracking-tight">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-slate-300">
                  {service.desc}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-yellow-300">
                  Detayı Gör{" "}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="surec" className="bg-[#030712]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="text-center">
            <div className="text-sm font-bold uppercase tracking-[0.28em] text-yellow-400">
              Süreç Planı
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Başvurudan sonuca kadar net akış
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
              Ziyaretçinin kafasını karıştırmayan, adım adım güven veren bir
              süreç anlatımıyla dönüşüm oranını yükseltecek profesyonel yapı.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {process.map((item) => (
              <div
                key={item.step}
                className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-7"
              >
                <div className="flex items-center justify-between">
                  <div className="text-5xl font-black text-yellow-400/90">
                    {item.step}
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200">
                    {item.icon}
                  </div>
                </div>
                <h3 className="mt-8 text-2xl font-black">{item.title}</h3>
                <p className="mt-4 text-sm leading-8 text-slate-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="neden-biz"
        className="border-y border-white/10 bg-[#020817]"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-24 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0a1630] to-[#07101f] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-10">
            <div className="text-sm font-bold uppercase tracking-[0.28em] text-yellow-400">
              Neden Biz?
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Güven veren marka hissi
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Bu yapı sadece güzel görünmek için değil, potansiyel müşterinin
              markaya güvenmesini sağlamak ve iletişime geçmesini kolaylaştırmak
              için tasarlandı.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {reasons.map((reason) => (
                <div
                  key={reason}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
                  <div className="text-sm leading-7 text-slate-200">
                    {reason}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            id="basvuru-formu"
            className="rounded-[32px] border border-yellow-400/15 bg-yellow-400/10 p-8 sm:p-10"
          >
            <div className="text-sm font-bold uppercase tracking-[0.28em] text-yellow-300">
              Başvuru Formu
            </div>
            <h3 className="mt-4 text-3xl font-black sm:text-4xl">
              Bilgini bırak, sana hızlı dönüş yapalım
            </h3>
            <p className="mt-5 text-base leading-8 text-yellow-100/85">
              Formu doldur, gönder butonuna bas. Bilgiler hazır mesaj halinde
              direkt WhatsApp ekranına düşsün.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <label className="mb-2 flex items-center gap-2 text-sm text-yellow-100/80">
                    <User className="h-4 w-4" /> Ad Soyad
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Ad Soyad"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-yellow-400/40"
                    required
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <label className="mb-2 flex items-center gap-2 text-sm text-yellow-100/80">
                    <Phone className="h-4 w-4" /> Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="05XX XXX XX XX"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-yellow-400/40"
                    required
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <label className="mb-2 flex items-center gap-2 text-sm text-yellow-100/80">
                  <MapPinned className="h-4 w-4" /> Hedef Ülke
                </label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-yellow-400/40"
                >
                  <option className="text-black">Almanya</option>
                  <option className="text-black">Fransa</option>
                  <option className="text-black">İtalya</option>
                  <option className="text-black">Diğer</option>
                </select>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <label className="mb-2 flex items-center gap-2 text-sm text-yellow-100/80">
                  <MessageSquareText className="h-4 w-4" /> Mesaj
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Kısa bilgi bırakabilirsiniz"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-yellow-400/40"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white transition hover:bg-black"
              >
                <Send className="h-4 w-4" /> Formu WhatsApp ile Gönder
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-[#030712]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <span className="font-black text-white">CMSVize</span> • Koyu,
            premium ve güven veren kurumsal açılış sayfası.
          </div>

          <div className="flex flex-wrap gap-5">
            <span>Ana Sayfa</span>
            <span>Hizmetler</span>
            <span>Süreç</span>
            <span>Başvuru</span>
          </div>
        </div>
      </footer>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile iletişime geç"
        className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-green-400/30 bg-green-500 px-5 py-3 text-white shadow-[0_12px_35px_rgba(34,197,94,0.35)] transition duration-300 hover:scale-105 hover:bg-green-400 animate-bounce [animation-duration:2.2s]"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
          <MessageCircleMore className="h-6 w-6" />
        </div>

        <div className="pr-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
            Hemen Yaz
          </div>
          <div className="text-sm font-black leading-none">
            WhatsApp Destek
          </div>
        </div>
      </a>
    </div>
  );
}
