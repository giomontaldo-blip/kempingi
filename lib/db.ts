import { getRequestContext } from "@cloudflare/next-on-pages";
import type { CampingListItem, CampingWithLocation, Obszar } from "@/types/db";

function getDB(): D1Database {
  const { env } = getRequestContext();
  return (env as CloudflareEnv).DB;
}

function parseImages(raw: string): CampingListItem["primary_image"] {
  try {
    const imgs = JSON.parse(raw);
    return Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : null;
  } catch { return null; }
}

export const db = {
  async getFeaturedCampings(limit = 6): Promise<CampingListItem[]> {
    const { results } = await getDB().prepare(
      `SELECT c.id, c.name, c.slug, l.voivodato_slug, c.lat, c.lng,
              c.price_min, c.rating, c.review_count,
              c.has_pool, c.pets_allowed, c.near_lake, c.near_sea,
              c.is_glamping, c.is_featured, c.listing_tier, c.images, l.city
       FROM campings c JOIN locations l ON l.id = c.location_id
       ORDER BY c.is_featured DESC, c.rating DESC LIMIT ?`
    ).bind(limit).all<CampingListItem & { images: string }>();
    return results.map((r) => ({ ...r, primary_image: parseImages(r.images) }));
  },

  async getCampingsByVoivodato(voivodatoSlug: string, limit = 24, offset = 0): Promise<CampingListItem[]> {
    const { results } = await getDB().prepare(
      `SELECT c.id, c.name, c.slug, l.voivodato_slug, c.lat, c.lng,
              c.price_min, c.rating, c.review_count,
              c.has_pool, c.pets_allowed, c.near_lake, c.near_sea,
              c.is_glamping, c.is_featured, c.listing_tier, c.images, l.city
       FROM campings c JOIN locations l ON l.id = c.location_id
       WHERE l.voivodato_slug = ?
       ORDER BY c.is_featured DESC, c.rating DESC LIMIT ? OFFSET ?`
    ).bind(voivodatoSlug, limit, offset).all<CampingListItem & { images: string }>();
    return results.map((r) => ({ ...r, primary_image: parseImages(r.images) }));
  },

  async getCampingsByObszar(obszarSlug: string, limit = 24): Promise<CampingListItem[]> {
    const { results } = await getDB().prepare(
      `SELECT c.id, c.name, c.slug, l.voivodato_slug, c.lat, c.lng,
              c.price_min, c.rating, c.review_count,
              c.has_pool, c.pets_allowed, c.near_lake, c.near_sea,
              c.is_glamping, c.is_featured, c.listing_tier, c.images, l.city
       FROM campings c
       JOIN locations l ON l.id = c.location_id
       JOIN obszary o ON o.id = l.obszar_id
       WHERE o.slug = ?
       ORDER BY c.is_featured DESC, c.rating DESC LIMIT ?`
    ).bind(obszarSlug, limit).all<CampingListItem & { images: string }>();
    return results.map((r) => ({ ...r, primary_image: parseImages(r.images) }));
  },

  async getCampingBySlug(voivodatoSlug: string, campingSlug: string): Promise<CampingWithLocation | null> {
    const result = await getDB().prepare(
      `SELECT c.*, l.country, l.voivodato, l.voivodato_slug, l.city, l.obszar_id,
              o.name_pl as obszar_name, o.slug as obszar_slug
       FROM campings c
       JOIN locations l ON l.id = c.location_id
       LEFT JOIN obszary o ON o.id = l.obszar_id
       WHERE l.voivodato_slug = ? AND c.slug = ? LIMIT 1`
    ).bind(voivodatoSlug, campingSlug).first<Record<string, unknown>>();
    if (!result) return null;
    return result as unknown as CampingWithLocation;
  },

  async getCountByVoivodato(): Promise<{ voivodato_slug: string; voivodato: string; count: number }[]> {
    const { results } = await getDB().prepare(
      `SELECT l.voivodato_slug, l.voivodato, COUNT(*) as count
       FROM campings c JOIN locations l ON l.id = c.location_id
       GROUP BY l.voivodato_slug ORDER BY count DESC`
    ).all<{ voivodato_slug: string; voivodato: string; count: number }>();
    return results;
  },

  async getObszaryWithCount(): Promise<(Obszar & { count: number })[]> {
    const { results } = await getDB().prepare(
      `SELECT o.*, COUNT(c.id) as count
       FROM obszary o
       LEFT JOIN locations l ON l.obszar_id = o.id
       LEFT JOIN campings c ON c.location_id = l.id
       GROUP BY o.id ORDER BY count DESC`
    ).all<Obszar & { count: number }>();
    return results;
  },

  async getReviews(campingId: string, limit = 10) {
    const { results } = await getDB().prepare(
      `SELECT * FROM reviews WHERE camping_id = ? ORDER BY created_at DESC LIMIT ?`
    ).bind(campingId, limit).all();
    return results;
  },

  async getAllCampingSlugs(): Promise<{ voivodato: string; slug: string }[]> {
    const { results } = await getDB().prepare(
      `SELECT c.slug, l.voivodato_slug as voivodato
       FROM campings c JOIN locations l ON l.id = c.location_id`
    ).all<{ voivodato: string; slug: string }>();
    return results;
  },
};
