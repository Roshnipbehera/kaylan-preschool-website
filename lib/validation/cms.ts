// Zod schemas for every admin-editable CMS content shape. Used both by the
// admin dashboard forms (client-side validation) and the API route handlers
// (server-side validation before persisting to data/cms/<section>.json).
import { z } from "zod";

export const heroButtonSchema = z.object({
  emoji: z.string().min(1, "Required"),
  label: z.string().min(1, "Required"),
  href: z.string().min(1, "Required"),
});
export const homeSchema = z.object({
  badge: z.string().min(1),
  heading: z.string().min(1),
  headingHighlight: z.string().min(1),
  subtext: z.string().min(1),
  buttons: z.array(heroButtonSchema).min(1),
});

export const aboutBlockSchema = z.object({
  emoji: z.string().min(1),
  title: z.string().min(1),
  text: z.string().min(1),
  bg: z.string().min(1),
});
export const aboutSchema = z.object({
  heading: z.string().min(1),
  highlightWord: z.string().min(1),
  headingEmoji: z.string().min(1),
  subtext: z.string().min(1),
  blocks: z.array(aboutBlockSchema).min(1),
});

export const programHouseSchema = z.object({
  name: z.string().min(1),
  age: z.string().min(1),
  color: z.string().min(1),
  roof: z.string().min(1),
});
export const programsSchema = z.object({
  heading: z.string().min(1),
  subtext: z.string().min(1),
  houses: z.array(programHouseSchema).min(1),
});

export const teacherMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  emoji: z.string().min(1),
  color: z.string().min(1),
});
export const teachersSchema = z.object({
  heading: z.string().min(1),
  subtext: z.string().min(1),
  teachers: z.array(teacherMemberSchema).min(1),
});

export const reviewSchema = z.object({
  name: z.string().min(1),
  quote: z.string().min(1),
  stars: z.coerce.number().min(1).max(5),
});
export const testimonialsSchema = z.object({
  heading: z.string().min(1),
  subtext: z.string().min(1),
  reviews: z.array(reviewSchema).min(1),
});

export const faqItemSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});
export const faqSchema = z.object({
  heading: z.string().min(1),
  subtext: z.string().min(1),
  faqs: z.array(faqItemSchema).min(1),
});

export const curriculumPillarSchema = z.object({
  title: z.string().min(1),
  emoji: z.string().min(1),
  color: z.string().min(1),
});
export const curriculumSchema = z.object({
  heading: z.string().min(1),
  subtext: z.string().min(1),
  pillars: z.array(curriculumPillarSchema).min(1),
});

export const galleryFrameSchema = z.object({
  shape: z.string().min(1),
  color: z.string().min(1),
  emoji: z.string().min(1),
});
export const gallerySchema = z.object({
  heading: z.string().min(1),
  subtext: z.string().min(1),
  frames: z.array(galleryFrameSchema).min(1),
});

export const footerLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});
export const footerSchema = z.object({
  brand: z.string().min(1),
  tagline: z.string().min(1),
  newsletterHeading: z.string().min(1),
  newsletterText: z.string().min(1),
  quickLinks: z.array(footerLinkSchema).min(1),
});

export const navigationSchema = z.object({
  brand: z.string().min(1),
  links: z.array(z.string().min(1)).min(1),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
});

export const admissionStepSchema = z.object({
  label: z.string().min(1),
  emoji: z.string().min(1),
});
export const admissionsStepsSchema = z.object({
  heading: z.string().min(1),
  subtext: z.string().min(1),
  steps: z.array(admissionStepSchema).min(1),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
});

export const facilitySchema = z.object({
  title: z.string().min(1),
  emoji: z.string().min(1),
  text: z.string().min(1),
});
export const facilitiesSchema = z.object({
  heading: z.string().min(1),
  subtext: z.string().min(1),
  facilities: z.array(facilitySchema).min(1),
});

export const blogPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  body: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  author: z.string().min(1),
  publishedAt: z.string().min(1),
  draft: z.boolean().default(false),
});
export const blogSchema = z.object({
  heading: z.string().min(1),
  subtext: z.string().min(1),
  posts: z.array(blogPostSchema).default([]),
});

export const eventItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  description: z.string().min(1),
});
export const eventsSchema = z.object({
  heading: z.string().min(1),
  subtext: z.string().min(1),
  events: z.array(eventItemSchema).default([]),
});

export const cmsSchemaMap = {
  home: homeSchema,
  about: aboutSchema,
  programs: programsSchema,
  teachers: teachersSchema,
  testimonials: testimonialsSchema,
  faq: faqSchema,
  curriculum: curriculumSchema,
  gallery: gallerySchema,
  footer: footerSchema,
  navigation: navigationSchema,
  "admissions-steps": admissionsStepsSchema,
  facilities: facilitiesSchema,
  blog: blogSchema,
  events: eventsSchema,
} as const;

export type CmsSchemaKey = keyof typeof cmsSchemaMap;
