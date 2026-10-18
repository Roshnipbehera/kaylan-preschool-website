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
    logo: `${SITE_URL}/brand/kaylan-logo.png`,
    image: `${SITE_URL}/brand/koki-mascot-final.png`,
    telephone: "+91 96636 30221",
    email: "info@kaylanpreschool.com",
    hasMap:
      "https://www.google.com/maps/place/Kaylan+Preschool/@12.8476486,77.6424096,17z/data=!4m8!3m7!1s0x3bae6b9b672e8d85:0xd95610aa3ce6c9e2!8m2!3d12.8476486!4d77.6424096!9m1!1b1!16s%2Fg%2F11vk7cj610!18m1!1e1?entry=ttu",
    geo: {
      "@type": "GeoCoordinates",
      latitude: 12.8476486,
      longitude: 77.6424096,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "#30 Prakruthi Residential Layout, Bettadasanpura, Electronic City Ph 1 (Near Neo Hospital, Doddathoguru)",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "560100",
      addressCountry: "IN",
    },
    areaServed: [
      "Electronic City Phase 1",
      "Bettadasanapura",
      "Doddathoguru",
      "Celebrity Classic Layout",
      "Prakruthi Layout",
      "NeoTown",
      "Bengaluru",
    ],
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Credit Card, Bank Transfer, Net Banking",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "45",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Eswararao Agasti" },
        datePublished: "2026-07-15",
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody: "Excellent 'Kaylan preschool' with caring teachers and a safe, friendly environment. My child loves going to school and has learned so much in a short time. The staff are supportive, and the activities are fun and educational. Highly recommended for every parent!",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Padmapriya" },
        datePublished: "2026-07-20",
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody: "I am so happy with this school. The teachers took great care of my child. They teach children in a very practical and engaging way that makes it easy for them to understand and grasp concepts. My son is in nursery, and he has already started to identify pictures and learn well.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Ranjitha Suchith" },
        datePublished: "2026-07-22",
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody: "A good preschool with a caring and positive environment. My son loves going to school every day and has learned so much. Thank you to all the staff for your dedication and support. Highly recommended!",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Archita Sharma" },
        datePublished: "2026-01-18",
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody: "My kid has been going to this school since she was 1.5 years old. I must say the attention and care teachers provide there to kids have been applauding. My kid has learnt so much there and I love how the atmosphere there is so positive.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Chindum Vasantha" },
        datePublished: "2025-12-10",
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody: "Kaylan Preschool in Prakruthi Layout has been an amazing experience for our child! The teachers are caring, attentive, and truly passionate about early childhood development. Highly recommend!",
      },
    ],
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
      "https://www.instagram.com/kaylanpreschoolanddaycare?stkn=MXR5ZXJmc2c4Z202dw==",
      "https://youtube.com/@kaylanpreschool",
      "https://www.google.com/maps/place/Kaylan+Preschool/@12.8476486,77.6424096,17z/data=!4m8!3m7!1s0x3bae6b9b672e8d85:0xd95610aa3ce6c9e2!8m2!3d12.8476486!4d77.6424096!9m1!1b1!16s%2Fg%2F11vk7cj610!18m1!1e1?entry=ttu",
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
