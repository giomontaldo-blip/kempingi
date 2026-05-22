import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

const CATEGORIES = [
  { slug: "z-basenem", name: "Kempingi z basenem", emoji: "🏊", desc: "Kempingi z basenem w Polsce" },
  { slug: "dla-dzieci", name: "Kempingi dla dzieci", emoji: "👨‍👩‍👧", desc: "Kempingi przyjazne rodzinom z dziećmi" },
  { slug: "nad-jeziorem", name: "Kempingi nad jeziorem", emoji: "🏞️", desc: "Kempingi z dostępem do jeziora" },
  { slug: "nad-morzem", name: "Kempingi nad morzem", emoji: "🌊", desc: "Kempingi przy Bałtyku" },
  { slug: "w-gorach", name: "Kempingi w górach", emoji: "⛰️", desc: "Kempingi w polskich górach" },
  { slug: "przyjazne-psom", name: "Kempingi przyjazne psom", emoji: "🐕", desc: "Kempingi gdzie można przyjechać z psem" },
  { slug: "glamping", name: "Glamping", emoji: "🏕️", desc: "Luksusowy camping w Polsce" },
  { slug: "tanie", name: "Tanie kempingi", emoji: "💰", desc: "Tanie kempingi w Polsce" },
  { slug: "z-wifi", name: "Kempingi z WiFi", emoji: "📶", desc: "Kempingi z dostępem do internetu" },
  { slug: "caloroczne", name: "Kempingi całoroczne", emoji: "📅", desc: "Kempingi otwarte przez cały rok" },
];

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: `${cat.name} | kempingi.com`,
    description: cat.desc,
    alternates: { canonical: `https://kempingi.com/kategoria/${slug}/` },
  };
}

export default async function KategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <nav style={{ fontSize: "13px", color: "#999", marginBottom: "16px" }}>
        <a href="/" style={{ color: "#999" }}>Strona główna</a> › 
        <a href="/kategoria/" style={{ color: "#999" }}> Kategorie</a> › 
        <span style={{ color: "#111" }}> {cat.name}</span>
      </nav>
      <h1 style={{ fontSize: "24px", fontWeight: 500, marginBottom: "8px" }}>
        {cat.emoji} {cat.name}
      </h1>
      <p style={{ color: "#666", marginBottom: "24px" }}>{cat.desc}</p>
      <p style={{ color: "#999", fontSize: "14px" }}>Brak kempingów w tej kategorii. Wróć wkrótce!</p>
    </div>
  );
}
