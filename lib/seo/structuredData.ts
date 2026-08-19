// Small helpers that build Schema.org JSON-LD payloads. Kept framework-agnostic
// (plain objects) so both server components and client components can render
// them via <script type="application/ld+json" dangerouslySetInnerHTML={...} />.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kaylanpreschool.example";

export function preschoolStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Preschool",
    name: "Kaylan Preschool",
    description:
      "Kaylan Preschool in Bangalore blends Montessori-inspired learning with the Kreedo curriculum in a magical, storybook world of play, discovery, creativity and love.",
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
  };
}

export function blogPostingStructuredData(post: {
  title: string;
  excerpt: string;
  slug: string;
  coverImageUrl?: string;
  publishedAt?: string | null;
  updatedAt?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    author: post.authorName ? { "@type": "Person", name: post.authorName } : undefined,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };
}

export function eventStructuredData(event: {
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  location?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startAt,
    endDate: event.endAt ?? undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.location ?? "Kaylan Preschool",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bangalore",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
    },
    organizer: { "@type": "Organization", name: "Kaylan Preschool", url: SITE_URL },
  };
}

export function faqPageStructuredData(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
