import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "../../lib/db";
import { VOIVODATY, getVoivodato } from "../../lib/voivodaty";
import { breadcrumbSchema, campingListSchema } from "../../lib/schema";

export const revalidate = 86400;

export async function generateStaticParams() {
  return VOIVODATY.map((v) => ({ voivodato: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ voivodato: string }> }): Promise<Metadata> {
  const { voivodato: slug } = await params;
  const v = getVoivodato(slug);
  if (!v) return {};
  return {
    title: v.meta_title_pl,
    description: v.meta_desc_pl,
    alternates: { canonical: `https://kempingi.com/kempingi/${slug}/` },
  };
}

export default async function VoivodatoPage({ params }: { params: Promise<{ voivodato: string }> }) {
  const { voivodato: slug } = await params;
  const voiv = getVoivodato(slug);
  if (!voiv) notFound();

  let campings = [];
  try {
    campings = await db.getCampingsByVoivodato(slug);
  } catch {
    campings = [];
  }

  const pageUrl = `https://kempingi.com/kempingi/${slug}/`;
  const breadcrumbs = [
    { name: "Strona główna", url: "https://kempingi.com/" },
    { name: voiv.name, url: pageUrl },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema(breadcrumbs), campingListSchema(campings, voiv.h1_pl, pageUrl)]) }} />
      <main id="main-content" className="max-w-5xl mx-auto px-4 py-6">
        <nav aria-label="Ścieżka nawigacji">
          <ol className="flex gap-2 text-sm text-gray-500 mb-4 flex-wrap">
            {breadcrumbs.map((b, i) => (
              <li key={b.url} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">›</span>}
                {i < breadcrumbs.length - 1 ? <a href={b.url} className="hover:text-green-700">{b.name}</a> : <span className="text-gray-900 font-medium">{b.name}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="text-2xl font-medium mb-1">{voiv.h1_pl}</h1>
        <p className="text-gray-500 text-sm mb-6">Znalezione: <strong className="text-gray-900">{campings.length} kempingów</strong></p>
        {campings.length === 0 ? (
          <p className="text-gray-400 text-sm py-12 text-center">Brak kempingów w tej lokalizacji. Wróć wkrótce!</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
            {campings.map((c) => (
              <li key={c.id}>
                <a href={`/kempingi/${c.voivodato_slug}/${c.slug}/`} className="block border border-gray-200 rounded-xl overflow-hidden hover:border-green-500 transition-colors">
                  <div className="h-36 bg-green-50 flex items-center justify-center text-green-300 text-sm">
                    {c.primary_image ? <img src={c.primary_image.url} alt={c.primary_image.alt} className="w-full h-full object-cover" loading="lazy" /> : <span>🏕️</span>}
                  </div>
                  <div className="p-3">
                    {c.is_featured && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full mb-1 inline-block">Wyróżniony</span>}
                    <h2 className="font-medium text-sm mb-0.5">{c.name}</h2>
                    <p className="text-xs text-gray-500 mb-2">{c.city}</p>
                    <div className="flex gap-1 flex-wrap mb-2">
                      {c.has_pool && <span className="text-xs bg-green-50 text-green-800 px-1.5 py-0.5 rounded">z basenem</span>}
                      {c.pets_allowed && <span className="text-xs bg-green-50 text-green-800 px-1.5 py-0.5 rounded">psy OK</span>}
                      {c.near_lake && <span className="text-xs bg-green-50 text-green-800 px-1.5 py-0.5 rounded">nad jeziorem</span>}
                      {c.is_glamping && <span className="text-xs bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded">glamping</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {c.rating > 0 ? <><span className="text-amber-500">★</span> <span className="font-medium text-gray-900">{c.rating.toFixed(1)}</span> <span className="text-gray-400">({c.review_count})</span></> : <span className="text-gray-400">brak opinii</span>}
                      </span>
                      <span className="text-sm font-medium text-green-700">od {c.price_min} zł<span className="text-xs text-gray-400">/noc</span></span>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
