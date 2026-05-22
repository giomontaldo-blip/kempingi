export interface Voivodato {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  meta_title_pl: string;
  meta_desc_pl: string;
  h1_pl: string;
}

export const VOIVODATY: Voivodato[] = [
  { slug: "dolnoslaskie", name: "Dolnośląskie", lat: 51.1, lng: 16.9, h1_pl: "Kempingi w województwie dolnośląskim", meta_title_pl: "Kempingi Dolnośląskie | kempingi.com", meta_desc_pl: "Najlepsze kempingi w województwie dolnośląskim." },
  { slug: "kujawsko-pomorskie", name: "Kujawsko-Pomorskie", lat: 53.1, lng: 18.2, h1_pl: "Kempingi w województwie kujawsko-pomorskim", meta_title_pl: "Kempingi Kujawsko-Pomorskie | kempingi.com", meta_desc_pl: "Najlepsze kempingi w województwie kujawsko-pomorskim." },
  { slug: "lubelskie", name: "Lubelskie", lat: 51.2, lng: 23.1, h1_pl: "Kempingi w województwie lubelskim", meta_title_pl: "Kempingi Lubelskie | kempingi.com", meta_desc_pl: "Najlepsze kempingi w województwie lubelskim." },
  { slug: "lubuskie", name: "Lubuskie", lat: 52.2, lng: 15.2, h1_pl: "Kempingi w województwie lubuskim", meta_title_pl: "Kempingi Lubuskie | kempingi.com", meta_desc_pl: "Najlepsze kempingi w województwie lubuskim." },
  { slug: "lodzkie", name: "Łódzkie", lat: 51.8, lng: 19.4, h1_pl: "Kempingi w województwie łódzkim", meta_title_pl: "Kempingi Łódzkie | kempingi.com", meta_desc_pl: "Najlepsze kempingi w województwie łódzkim." },
  { slug: "malopolskie", name: "Małopolskie", lat: 49.7, lng: 20.5, h1_pl: "Kempingi w województwie małopolskim", meta_title_pl: "Kempingi Małopolskie | kempingi.com", meta_desc_pl: "Najlepsze kempingi w Małopolsce." },
  { slug: "mazowieckie", name: "Mazowieckie", lat: 52.1, lng: 21.0, h1_pl: "Kempingi w województwie mazowieckim", meta_title_pl: "Kempingi Mazowieckie | kempingi.com", meta_desc_pl: "Najlepsze kempingi w województwie mazowieckim." },
  { slug: "opolskie", name: "Opolskie", lat: 50.7, lng: 17.9, h1_pl: "Kempingi w województwie opolskim", meta_title_pl: "Kempingi Opolskie | kempingi.com", meta_desc_pl: "Najlepsze kempingi w województwie opolskim." },
  { slug: "podkarpackie", name: "Podkarpackie", lat: 50.0, lng: 22.4, h1_pl: "Kempingi w województwie podkarpackim", meta_title_pl: "Kempingi Podkarpackie | kempingi.com", meta_desc_pl: "Najlepsze kempingi w Bieszczadach i Beskidach." },
  { slug: "podlaskie", name: "Podlaskie", lat: 53.1, lng: 23.2, h1_pl: "Kempingi w województwie podlaskim", meta_title_pl: "Kempingi Podlaskie | kempingi.com", meta_desc_pl: "Najlepsze kempingi w województwie podlaskim." },
  { slug: "pomorskie", name: "Pomorskie", lat: 54.2, lng: 18.1, h1_pl: "Kempingi w województwie pomorskim", meta_title_pl: "Kempingi Pomorskie | kempingi.com", meta_desc_pl: "Najlepsze kempingi nad Bałtykiem i Kaszubach." },
  { slug: "slaskie", name: "Śląskie", lat: 50.3, lng: 19.0, h1_pl: "Kempingi w województwie śląskim", meta_title_pl: "Kempingi Śląskie | kempingi.com", meta_desc_pl: "Najlepsze kempingi w województwie śląskim." },
  { slug: "swietokrzyskie", name: "Świętokrzyskie", lat: 50.9, lng: 20.6, h1_pl: "Kempingi w województwie świętokrzyskim", meta_title_pl: "Kempingi Świętokrzyskie | kempingi.com", meta_desc_pl: "Najlepsze kempingi w województwie świętokrzyskim." },
  { slug: "warminsko-mazurskie", name: "Warmińsko-Mazurskie", lat: 53.8, lng: 20.5, h1_pl: "Kempingi w województwie warmińsko-mazurskim", meta_title_pl: "Kempingi Warmińsko-Mazurskie – Mazury | kempingi.com", meta_desc_pl: "Najlepsze kempingi na Mazurach." },
  { slug: "wielkopolskie", name: "Wielkopolskie", lat: 52.4, lng: 16.9, h1_pl: "Kempingi w województwie wielkopolskim", meta_title_pl: "Kempingi Wielkopolskie | kempingi.com", meta_desc_pl: "Najlepsze kempingi w województwie wielkopolskim." },
  { slug: "zachodniopomorskie", name: "Zachodniopomorskie", lat: 53.4, lng: 15.0, h1_pl: "Kempingi w województwie zachodniopomorskim", meta_title_pl: "Kempingi Zachodniopomorskie | kempingi.com", meta_desc_pl: "Najlepsze kempingi nad Bałtykiem." },
];

export const VOIVODATY_MAP = new Map(VOIVODATY.map((v) => [v.slug, v]));
export function getVoivodato(slug: string): Voivodato | undefined {
  return VOIVODATY_MAP.get(slug);
}
