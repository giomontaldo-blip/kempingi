import { db } from "@/lib/db";
import { VOIVODATY } from "@/lib/voivodaty";

export const revalidate = 3600;

export default async function HomePage() {
  let counts: { voivodato_slug: string; voivodato: string; count: number }[] = [];
  try {
    counts = await db.getCountByVoivodato();
  } catch {
    counts = [];
  }

  const countMap = new Map(counts.map((c) => [c.voivodato_slug, c.count]));

  return (
    <main id="main-content">
      {/* HEADER */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <a href="/" className="flex items-center gap-2" aria-label="kempingi.com – strona główna">
          <svg width="28" height="30" viewBox="0 0 52 56" aria-hidden="true">
            <polygon points="6,47 26,7 46,47" fill="#1D9E75"/>
            <polygon points="17,47 26,31 35,47" fill="#E1F5EE"/>
            <line x1="1" y1="50" x2="51" y2="50" stroke="#0F6E56" strokeWidth="3.5" strokeLinecap="round"/>
          </svg>
          <span className="text-xl font-medium">kempingi<span className="text-green-600">.com</span></span>
        </a>
        <nav aria-label="Nawigacja główna" className="flex gap-5 text-sm text-gray-500">
          <a href="/kempingi/" className="hover:text-green-700">Województwa</a>
          <a href="/obszar/" className="hover:text-green-700">Obszary</a>
          <a href="/kategoria/" className="hover:text-green-700">Kategorie</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="bg-green-50 px-5 py-10 text-center" aria-labelledby="hero-title">
        <h1 id="hero-title" className="text-3xl font-medium text-green-900 mb-2">
          Najlepsze kempingi w Polsce
        </h1>
        <p className="text-green-700 mb-6 text-sm">
          Ponad 2 000 kempingów w całym kraju – znajdź idealny dla siebie i rodziny
        </p>
        <div className="flex gap-2 max-w-lg mx-auto">
          <input
            type="search"
            placeholder="Szukaj kempingu lub miejscowości…"
            className="flex-1 px-4 py-2.5 border border-green-200 rounded-lg text-sm outline-none focus:border-green-500"
            aria-label="Szukaj kempingów"
          />
          <button className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
            Szukaj
          </button>
        </div>
        <div className="flex gap-2 justify-center flex-wrap mt-3">
          {["Mazury","Tatry","Wybrzeże Bałtyku","Bieszczady","Kaszuby"].map((area) => (
            <span key={area} className="text-xs px-3 py-1 bg-white text-green-700 border border-green-200 rounded-full cursor-pointer hover:bg-green-50">
              ↗ {area}
            </span>
          ))}
        </div>
      </section>

      {/* KATEGORIE */}
      <section className="px-5 py-6" aria-labelledby="cat-title">
        <h2 id="cat-title" className="text-base font-medium mb-4">Szukaj według kategorii</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { slug: "z-basenem", label: "Z basenem", emoji: "🏊" },
            { slug: "dla-dzieci", label: "Dla dzieci", emoji: "👨‍👩‍👧" },
            { slug: "w-gorach", label: "W górach", emoji: "⛰️" },
            { slug: "nad-morzem", label: "Nad morzem", emoji: "🌊" },
            { slug: "glamping", label: "Glamping", emoji: "🏕️" },
          ].map((cat) => (
            
              key={cat.slug}
              href={`/kategoria/${cat.slug}/`}
              className="border border-gray-200 rounded-xl p-4 text-center hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <span className="text-2xl block mb-2" aria-hidden="true">{cat.emoji}</span>
              <span className="text-sm text-gray-800">{cat.label}</span>
            </a>
          ))}
        </div>
      </section>

      <hr className="mx-5 border-gray-100" />

      {/* WOJEWÓDZTWA */}
      <section className="px-5 py-6" aria-labelledby="reg-title">
        <h2 id="reg-title" className="text-base font-medium mb-4">Kempingi według województwa</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {VOIVODATY.map((v) => (
            
              key={v.slug}
              href={`/kempingi/${v.slug}/`}
              className="flex justify-between items-center border border-gray-200 rounded-lg px-3 py-2 hover:border-green-500 transition-colors"
            >
              <span className="text-sm text-gray-800">{v.name}</span>
              {countMap.get(v.slug) && (
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                  {countMap.get(v.slug)}
                </span>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-5 py-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
        <span>© 2026 kempingi.com</span>
        <nav aria-label="Linki w stopce" className="flex gap-4">
          <a href="/o-nas/" className="hover:text-gray-600">O nas</a>
          <a href="/kontakt/" className="hover:text-gray-600">Kontakt</a>
          <a href="/polityka-prywatnosci/" className="hover:text-gray-600">Polityka prywatności</a>
        </nav>
      </footer>
    </main>
  );
}
