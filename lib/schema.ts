import type { CampingWithLocation } from "../types/db";

const SITE_URL = "https://kempingi.com";
const SITE_NAME = "kempingi.com";

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "kontakt@kempingi.com",
      availableLanguage: "Polish",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "pl-PL",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/szukaj?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function campingSchema(camping: CampingWithLocation) {
  const url = `${SITE_URL}/kempingi/${camping.location.voivodato_slug}/${camping.slug}/`;
  const images = JSON.parse(camping.images as unknown as string ?? "[]");
  const amenities: string[] = [];
  if (camping.has_pool) amenities.push("Swimming pool");
  if (camping.has_wifi) amenities.push("Free WiFi");
  if (camping.pets_allowed) amenities.push("Pets allowed");
  if (camping.near_lake) amenities.push("Lake access");
  if (camping.near_sea) amenities.push("Beach access");
  return {
    "@context": "https://schema.org",
    "@type": "Campground",
    "@id": url,
    name: camping.name,
    url,
    description: camping.description_pl,
    address: {
      "@type": "PostalAddress",
      streetAddress: camping.address,
      addressLocality: camping.location.city,
      addressRegion: camping.location.voivodato,
      addressCountry: "PL",
    },
    geo: { "@type": "GeoCoordinates", latitude: camping.lat, longitude: camping.lng },
    ...(camping.rating > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: camping.rating.toFixed(1),
        reviewCount: camping.review_count,
        bestRating: "5",
        worstRating: "1",
      },
    }),
    amenityFeature: amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })),
    ...(camping.price_min > 0 && { priceRange: `od ${camping.price_min} PLN` }),
    ...(camping.phone && { telephone: camping.phone }),
    ...(camping.website && { sameAs: camping.website }),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function campingListSchema(campings: { name: string; slug: string; voivodato_slug: string }[], pageTitle: string, pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageTitle,
    url: pageUrl,
    numberOfItems: campings.length,
    itemListElement: campings.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${SITE_URL}/kempingi/${c.voivodato_slug}/${c.slug}/`,
    })),
  };
}
