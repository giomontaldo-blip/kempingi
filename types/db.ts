export type ListingTier = "free" | "premium";

export interface Location {
  id: string;
  country: string;
  voivodato: string;
  voivodato_slug: string;
  city: string;
  obszar_id: string | null;
  lat: number;
  lng: number;
  meta_title_pl: string;
  meta_desc_pl: string;
}

export interface Obszar {
  id: string;
  name_pl: string;
  slug: string;
  description_pl: string;
  lat: number;
  lng: number;
  meta_title_pl: string;
  meta_desc_pl: string;
}

export interface Category {
  id: string;
  name_pl: string;
  slug: string;
  db_field: string;
  icon: string;
  h1_template_pl: string;
  meta_title_pl: string;
  meta_desc_pl: string;
}

export interface CampingImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  is_primary: boolean;
}

export interface Camping {
  id: string;
  name: string;
  slug: string;
  location_id: string;
  lat: number;
  lng: number;
  description_pl: string;
  price_min: number;
  price_max: number;
  season_start: string;
  season_end: string;
  rating: number;
  review_count: number;
  has_pool: boolean;
  family_friendly: boolean;
  near_lake: boolean;
  near_sea: boolean;
  in_mountains: boolean;
  pets_allowed: boolean;
  is_glamping: boolean;
  has_wifi: boolean;
  year_round: boolean;
  has_electricity: boolean;
  has_showers: boolean;
  has_playground: boolean;
  has_shop: boolean;
  has_laundry: boolean;
  has_restaurant: boolean;
  has_parking: boolean;
  images: CampingImage[];
  phone: string | null;
  website: string | null;
  affiliate_url: string | null;
  listing_tier: ListingTier;
  is_featured: boolean;
  pfcc_stars: number | null;
  address: string;
  updated_at: string;
}

export interface CampingWithLocation extends Camping {
  location: Location;
  obszar: Obszar | null;
}

export interface CampingListItem {
  id: string;
  name: string;
  slug: string;
  voivodato_slug: string;
  lat: number;
  lng: number;
  price_min: number;
  rating: number;
  review_count: number;
  has_pool: boolean;
  pets_allowed: boolean;
  near_lake: boolean;
  near_sea: boolean;
  is_glamping: boolean;
  is_featured: boolean;
  listing_tier: ListingTier;
  primary_image: CampingImage | null;
  city: string;
}
