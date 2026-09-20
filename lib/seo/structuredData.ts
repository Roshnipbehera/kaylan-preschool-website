// Small helpers that build Schema.org JSON-LD payloads. Kept framework-agnostic
// (plain objects) so both server components and client components can render
// them via <script type="application/ld+json" dangerouslySetInnerHTML={...} />.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kaylan-preschool-website.vercel.app";

export function preschoolStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Preschool",
    name: "Kaylan Preschool",
    description:
      "Kaylan Preschool in Bangalore blends Montessori-inspired learning with the Kreedo curriculum in a magical, storybook world of play, discovery, creativity and love.",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/koki-mascot-final.png`,
    image: `${SITE_URL}/brand/koki-mascot-final.png`,
    telephone: "+91-98860-12345",
    email: "admissions@kaylanpreschool.com",
    hasMap:
      "https://www.google.com/maps/place/Kaylan+Preschool/@12.8476538,77.6398347,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae6b9b672e8d85:0xd95610aa3ce6c9e2!8m2!3d12.8476486!4d77.6424096!16s%2Fg%2F11vk7cj610?entry=ttu",
    geo: {
      "@type": "GeoCoordinates",
      latitude: 12.8476486,
      longitude: 77.6424096,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot #14, NeoTown Road, Electronic City Phase 1",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      postalCode: "560100",
      addressCountry: "IN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:30",
        closes: "18:30",
      },
    ],
    sameAs: [
      "https://facebook.com/kaylanpreschool",
      "https://instagram.com/kaylanpreschool",
      "https://youtube.com/@kaylanpreschool",
      "https://www.google.com/maps/place/Kaylan+Preschool/@12.8476538,77.6398347,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae6b9b672e8d85:0xd95610aa3ce6c9e2!8m2!3d12.8476486!4d77.6424096!16s%2Fg%2F11vk7cj610?entry=ttu",
    ],
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
