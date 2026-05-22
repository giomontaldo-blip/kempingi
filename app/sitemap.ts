import type { MetadataRoute } from "next";
import { VOIVODATY } from "../lib/voivodaty";

export const dynamic = "force-static";

const BASE = "https://kempingi.com";
const CATEGORIES = ["z-basenem","dla-dzieci","nad-jeziorem","nad-morzem","w-gorach","przyjazne-psom","glamping","tanie","z-wifi","caloroczne"];
const OBSZARY = ["mazury","tatry","wybrzeze-baltyku","bieszczady","sudety","karkonosze","kaszuby","roztocze","puszcza-bialowieska","pojezierze-drawskie"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  return [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    ...VOIVODATY.map((v) => ({ url: `${BASE}/kempingi/${v.slug}/`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 })),
    ...CATEGORIES.map((s) => ({ url: `${BASE}/kategoria/${s}/`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 })),
    ...OBSZARY.map((s) => ({ url: `${BASE}/obszar/${s}/`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 })),
  ];
}
