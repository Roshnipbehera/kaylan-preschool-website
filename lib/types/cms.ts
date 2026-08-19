// TypeScript interfaces for every admin-editable CMS content shape.
// Each interface mirrors the JSON persisted under data/cms/<section>.json
// and the request/response shapes served by app/api/cms/[section]/route.ts.

export interface HeroButton {
  emoji: string;
  label: string;
  href: string;
}
export interface HomeContent {
  badge: string;
  heading: string;
  headingHighlight: string;
  subtext: string;
  buttons: HeroButton[];
}

export interface AboutBlock {
  emoji: string;
  title: string;
  text: string;
  bg: string;
}
export interface AboutContent {
  heading: string;
  highlightWord: string;
  headingEmoji: string;
  subtext: string;
  blocks: AboutBlock[];
}

export interface ProgramHouse {
  name: string;
  age: string;
  color: string;
  roof: string;
}
export interface ProgramsContent {
  heading: string;
  subtext: string;
  houses: ProgramHouse[];
}

export interface TeacherMember {
  name: string;
  role: string;
  emoji: string;
  color: string;
}
export interface TeachersContent {
  heading: string;
  subtext: string;
  teachers: TeacherMember[];
}

export interface Review {
  name: string;
  quote: string;
  stars: number;
}
export interface TestimonialsContent {
  heading: string;
  subtext: string;
  reviews: Review[];
}

export interface FaqItem {
  q: string;
  a: string;
}
export interface FaqContent {
  heading: string;
  subtext: string;
  faqs: FaqItem[];
}

export interface CurriculumPillar {
  title: string;
  emoji: string;
  color: string;
}
export interface CurriculumContent {
  heading: string;
  subtext: string;
  pillars: CurriculumPillar[];
}

export interface GalleryFrame {
  shape: string;
  color: string;
  emoji: string;
}
export interface GalleryContent {
  heading: string;
  subtext: string;
  frames: GalleryFrame[];
}

export interface FooterLink {
  label: string;
  href: string;
}
export interface FooterContent {
  brand: string;
  tagline: string;
  newsletterHeading: string;
  newsletterText: string;
  quickLinks: FooterLink[];
}

export interface NavigationContent {
  brand: string;
  links: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface AdmissionStep {
  label: string;
  emoji: string;
}
export interface AdmissionsStepsContent {
  heading: string;
  subtext: string;
  steps: AdmissionStep[];
  ctaLabel: string;
  ctaHref: string;
}

export interface Facility {
  title: string;
  emoji: string;
  text: string;
}
export interface FacilitiesContent {
  heading: string;
  subtext: string;
  facilities: Facility[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  draft: boolean;
}
export interface BlogContent {
  heading: string;
  subtext: string;
  posts: BlogPost[];
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  description: string;
}
export interface EventsContent {
  heading: string;
  subtext: string;
  events: EventItem[];
}

export type CmsSectionKey =
  | "home"
  | "about"
  | "programs"
  | "teachers"
  | "testimonials"
  | "faq"
  | "curriculum"
  | "gallery"
  | "footer"
  | "navigation"
  | "admissions-steps"
  | "facilities"
  | "blog"
  | "events";

export interface CmsSectionMap {
  home: HomeContent;
  about: AboutContent;
  programs: ProgramsContent;
  teachers: TeachersContent;
  testimonials: TestimonialsContent;
  faq: FaqContent;
  curriculum: CurriculumContent;
  gallery: GalleryContent;
  footer: FooterContent;
  navigation: NavigationContent;
  "admissions-steps": AdmissionsStepsContent;
  facilities: FacilitiesContent;
  blog: BlogContent;
  events: EventsContent;
}

export const CMS_SECTIONS: { key: CmsSectionKey; label: string; description: string }[] = [
  { key: "home", label: "Home / Hero", description: "Hero badge, heading and CTA buttons" },
  { key: "about", label: "About / Welcome", description: "Welcome heading and feature blocks" },
  { key: "programs", label: "Programs", description: "Age-group program houses" },
  { key: "teachers", label: "Teachers", description: "Teacher profiles" },
  { key: "facilities", label: "Facilities", description: "Facility highlights" },
  { key: "gallery", label: "Gallery", description: "Gallery frames" },
  { key: "events", label: "Events", description: "Upcoming events" },
  { key: "testimonials", label: "Testimonials", description: "Parent reviews" },
  { key: "faq", label: "FAQs", description: "Frequently asked questions" },
  { key: "curriculum", label: "Curriculum / Philosophy", description: "Learning philosophy pillars" },
  { key: "footer", label: "Footer", description: "Footer links and tagline" },
  { key: "navigation", label: "Navigation", description: "Navbar links and brand" },
  { key: "admissions-steps", label: "Admissions Steps", description: "Homepage admissions step-by-step section" },
  { key: "blog", label: "Blog", description: "Blog heading and posts" },
];
