import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VOIVODATY, getVoivodato } from "@/lib/voivodaty";
import { d1Query } from "@/lib/d1-fetch";
import { breadcrumbSchema, campingListSchema } from "@/lib/schema";

export const dynamic = "force-static";

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

interface CampingRow {
  id: string;
  name: string;
  slug: string;
  city: string;
  lat: number;
  lng: number;
  price_min: number;
  rating: number;
  review_count: number;
  has_pool: number;
  pets_allowed: number;
  near_lake: number;
  near_sea: number;
  is_glamping: number;
  is_featured: number;
  listing_tier: string;
}

export default async function VoivodatoPage({ params }: { params: Promise<{ voivodato: string }> }) {
  const { voivodato: slug } = await params;
  const voiv = getVoivodato(slug);
  if (!voiv) notFound();

  const campings = await d1Query<CampingRow>(
    `SELECT c.id, c.name, c.slug, l.city, c.lat, c.lng,
            c.price_min, c.rating, c.review_count,
            c.has_pool, c.pets_allowed, c.near_lake, c.near_sea,
            c.is_glamping, c.is_featured, c.listing_tier
     FROM campings c JOIN locations l ON l.id = c.location_id
     WHERE l.voivodato_slug = ?
     ORDER BY c.is_featured DESC, c.rating DESC
     LIMIT 24`,
    [slug]
  );

  const pageUrl = `https://kempingi.com/kempingi/${slug}/`;
  const breadcrumbs = [
    { name: "Strona główna", url: "https://kempingi.com/" },
    { name: voiv.name, url: pageUrl },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        breadcrumbSchema(breadcrumbs),
        campingListSchema(campings.map(c => ({...c, voivodato_slug: slug})), voiv.h1_pl, pageUrl)
      ]) }} />
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "16px 20px" }}>
        <nav style={{ fontSize: "13px", color: "#999", marginBottom: "16px" }}>
          <a href="/" style={{ color: "#999" }}>Strona główna</a> ›{" "}
          <span style={{ color: "#111" }}>{voiv.name}</span>
        </nav>
        <h1 style={{ fontSize: "24px", fontWeight: 500, marginBottom: "4px" }}>{voiv.h1_pl}</h1>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "24px" }}>
          Znalezione: <strong style={{ color: "#111" }}>{campings.length} kempingów</strong>
        </p>
        {campings.length === 0 ? (
          <p style={{ color: "#999", fontSize: "14px" }}>Brak kempingów w tej lokalizacji. Wróć wkrótce!</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {campings.map((c) => (
              <a key={c.id} href={`/kempingi/${slug}/${c.slug}/`}
                style={{ display: "block", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", textDecoration: "none", color: "inherit" }}>
                <div style={{ height: "140px", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>
                  🏕️
                </div>
                <div style={{ padding: "12px" }}>
                  {c.is_featured ? <span style={{ fontSize: "11px", background: "#FEF3C7", color: "#92400E", padding: "2px 8px", borderRadius: "20px", marginBottom: "6px", display: "inline-block" }}>Wyróżniony</span> : null}
                  <h2 style={{ fontSize: "14px", fontWeight: 500, margin: "0 0 4px" }}>{c.name}</h2>
                  <p style={{ fontSize: "12px", color: "#666", margin: "0 0 8px" }}>{c.city}</p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                    {c.has_pool ? <span style={{ fontSize: "11px", background: "#E1F5EE", color: "#065F46", padding: "2px 6px", borderRadius: "4px" }}>z basenem</span> : null}
                    {c.pets_allowed ? <span style={{ fontSize: "11px", background: "#E1F5EE", color: "#065F46", padding: "2px 6px", borderRadius: "4px" }}>psy OK</span> : null}
                    {c.near_lake ? <span style={{ fontSize: "11px", background: "#E1F5EE", color: "#065F46", padding: "2px 6px", borderRadius: "4px" }}>nad jeziorem</span> : null}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {c.rating > 0 ? <><span style={{ color: "#F59E0B" }}>★</span> {c.rating.toFixed(1)}</> : "brak opinii"}
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "#1D9E75" }}>
                      {c.price_min > 0 ? `od ${c.price_min} zł/noc` : ""}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
