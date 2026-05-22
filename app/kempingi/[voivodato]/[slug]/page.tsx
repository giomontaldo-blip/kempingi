export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getVoivodato } from "@/lib/voivodaty";
import { campingSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 86400;

export async function generateStaticParams() {
  return [{ voivodato: "mazury", slug: "placeholder" }];
}

export async function generateMetadata({ params }: { params: Promise<{ voivodato: string; slug: string }> }): Promise<Metadata> {
  const { voivodato, slug } = await params;
  let camping = null;
  try { camping = await db.getCampingBySlug(voivodato, slug); } catch { return {}; }
  if (!camping) return {};
  const title = `${camping.name} – ${camping.location.city} | kempingi.com`;
  const description = `${camping.name} w ${camping.location.city}. Od ${camping.price_min} zł/noc.`;
  return {
    title,
    description,
    alternates: { canonical: `https://kempingi.com/kempingi/${voivodato}/${slug}/` },
    openGraph: { title, description, url: `https://kempingi.com/kempingi/${voivodato}/${slug}/` },
  };
}

export default async function CampingDetailPage({ params }: { params: Promise<{ voivodato: string; slug: string }> }) {
  const { voivodato, slug } = await params;
  let camping = null;
  try { camping = await db.getCampingBySlug(voivodato, slug); } catch { notFound(); }
  if (!camping) notFound();

  const voiv = getVoivodato(voivodato);
  let reviews = [];
  try { reviews = await db.getReviews(camping.id, 5) as any[]; } catch { reviews = []; }

  const faqs = [
    { question: `Ile kosztuje nocleg na kempingu ${camping.name}?`, answer: `Cena od ${camping.price_min} zł/noc.` },
    { question: `Kiedy jest otwarty kemping ${camping.name}?`, answer: camping.year_round ? "Otwarty przez cały rok." : `Otwarty od ${camping.season_start} do ${camping.season_end}.` },
    ...(camping.pets_allowed ? [{ question: `Czy można przyjechać z psem?`, answer: "Tak, kemping jest przyjazny zwierzętom." }] : []),
    ...(camping.has_pool ? [{ question: `Czy kemping ma basen?`, answer: "Tak, kemping dysponuje odkrytym basenem." }] : []),
  ];

  const breadcrumbs = [
    { name: "Strona główna", url: "https://kempingi.com/" },
    { name: voiv?.name ?? "Kempingi", url: `https://kempingi.com/kempingi/${voivodato}/` },
    { name: camping.name, url: `https://kempingi.com/kempingi/${voivodato}/${slug}/` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([campingSchema(camping), faqSchema(faqs), breadcrumbSchema(breadcrumbs)]) }} />
      <main id="main-content" className="max-w-5xl mx-auto px-4 py-4">
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
        <h1 className="text-2xl font-medium mb-2">{camping.name}</h1>
        <div className="flex items-center gap-3 text-sm mb-4 flex-wrap">
          {camping.rating > 0 && <span><span className="text-amber-400">★</span> <strong>{camping.rating.toFixed(1)}</strong> <a href="#opinie" className="text-green-700">({camping.review_count} opinii)</a></span>}
          <span className="text-gray-400">·</span>
          <span className="text-gray-500">📍 {camping.location.city}, {camping.location.voivodato}</span>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <section className="mb-6">
              <h2 className="text-base font-medium border-b border-gray-100 pb-2 mb-3">Opis</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{camping.description_pl || "Opis wkrótce."}</p>
            </section>
            <section className="mb-6">
              <h2 className="text-base font-medium border-b border-gray-100 pb-2 mb-3">Udogodnienia</h2>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                {[
                  { key: "has_pool", label: "Basen" }, { key: "has_wifi", label: "WiFi" },
                  { key: "pets_allowed", label: "Zwierzęta" }, { key: "has_showers", label: "Prysznice" },
                  { key: "has_electricity", label: "Prąd 230V" }, { key: "has_playground", label: "Plac zabaw" },
                  { key: "near_lake", label: "Nad jeziorem" }, { key: "near_sea", label: "Nad morzem" },
                  { key: "has_parking", label: "Parking" },
                ].map(({ key, label }) => {
                  const active = camping[key as keyof typeof camping] as boolean;
                  return (
                    <li key={key} className={`flex items-center gap-2 text-sm py-1 ${active ? "text-gray-800" : "text-gray-300 line-through"}`}>
                      <span className={active ? "text-green-600" : "text-gray-300"}>{active ? "✓" : "✗"}</span>{label}
                    </li>
                  );
                })}
              </ul>
            </section>
            <section className="mb-6" id="opinie">
              <h2 className="text-base font-medium border-b border-gray-100 pb-2 mb-3">Opinie</h2>
              {reviews.length === 0 ? <p className="text-sm text-gray-400">Brak opinii.</p> : (
                <ul className="space-y-3">
                  {reviews.map((r: any) => (
                    <li key={r.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{r.author}</span>
                        <span className="text-amber-400 text-sm">{"★".repeat(r.rating)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{r.body_pl}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="mb-6">
              <h2 className="text-base font-medium border-b border-gray-100 pb-2 mb-3">FAQ</h2>
              <dl className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i}>
                    <dt className="text-sm font-medium mb-1">{faq.question}</dt>
                    <dd className="text-sm text-gray-600">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
          <aside className="lg:w-60 flex-shrink-0">
            <div className="border border-gray-200 rounded-xl p-4 lg:sticky lg:top-4">
              <p className="text-xs text-gray-400">od</p>
              <p className="text-3xl font-medium">{camping.price_min} zł<span className="text-sm text-gray-400 font-normal">/noc</span></p>
              <a href={camping.affiliate_url ?? camping.website ?? "#"} className="block w-full text-center bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 mt-4 mb-2 text-sm font-medium transition-colors">
                Sprawdź dostępność
              </a>
              {camping.phone && <a href={`tel:${camping.phone}`} className="block w-full text-center border border-green-600 text-green-700 rounded-lg py-2.5 mb-4 text-sm hover:bg-green-50">Zadzwoń</a>}
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Miejscowość</dt><dd className="font-medium">{camping.location.city}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Sezon</dt><dd className="font-medium">{camping.season_start} – {camping.season_end}</dd></div>
              </dl>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
