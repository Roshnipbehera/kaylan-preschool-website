# CMS User Guide (for non-technical staff)

This guide explains how to edit the content that visitors see on the public Kaylan Preschool website, using only the admin dashboard — no code or developer help required. For a broader tour of the whole admin dashboard, see `docs/guides/ADMIN_GUIDE.md`. For the technical/developer explanation of how the CMS works under the hood, see `docs/CMS.md`.

## Signing in

Go to `/login` and sign in with your admin account, then open `/admin/cms`.

## Editing a page section

1. On `/admin/cms` you'll see a list of editable sections. Each one corresponds to a real block of content on the public site: the homepage hero banner, the Programs list, the Curriculum ("Adventures") section, Teachers, Testimonials, FAQ, Facilities, the Footer, the top Navigation menu, the Admissions steps, and the intro blurbs for the Blog, Gallery, and Events pages.
2. Click a section to open its editor (`/admin/cms/<section>`). The form fields match exactly what's shown on the live page — e.g. the Hero editor has a headline, subheading, and call-to-action button text/link.
3. Edit the fields and click Save.
4. Changes appear on the live public site immediately — there's no separate "publish" step, and visitors do not need to refresh in any special way; the next time they load or revisit that page, they'll see your update.

**No loading flash:** the public pages are built to show content instantly (using the previous default content as a placeholder while your live edits load in the background), so editing a section will never cause a visible blank/loading state for visitors.

## Editing contact details, address, and social links

Contact information (phone, email, physical address), school timings, the Google Maps link, admissions-open/closed status, and social media links (Facebook, Instagram, Twitter) are **not** edited in `/admin/cms` — they live in `/admin/settings`, under the "Branding & Public Details" section. This is because these are cross-cutting details used in multiple places (the homepage Contact section, the Footer, WhatsApp/call links) rather than content belonging to one single page.

Editing any of these fields and saving immediately updates:
- The homepage "Find Us" contact section (phone/email/address, click-to-call, click-to-WhatsApp, and the Google Maps link).
- The site Footer (social media icons only appear once you've filled in their matching URL).

## Managing other content

These have their own dedicated admin pages (not part of `/admin/cms`) because each is a list of individual records rather than a single fixed section:
- **Announcements** (`/admin/announcements`) — school-wide notices, shown to parents/teachers.
- **Blog** (`/admin/blog`) — individual blog posts.
- **Gallery** (`/admin/gallery`) — photo/video albums.
- **Events** (`/admin/events`) — individual events with RSVP tracking.
- **Admissions** (`/admin/admissions`) — review and update the status of submitted applications (this is application data, not marketing content).

## What you cannot change from the dashboard

- **Colors/visual theme**: the site's color palette is built into the code (Tailwind design tokens) rather than an admin-editable setting. Changing brand colors currently requires a developer to edit `tailwind.config.ts` and the components that use it — this is a deliberate scope boundary, not an oversight, and is called out as a "Known Limitation" in `FINAL_ACCEPTANCE_REPORT.md`.
- **Logo/mascot image**: there is an admin-editable "Logo URL" field in Settings, but no logo image asset currently exists in the project, and no component renders it as an `<img>` yet — supplying a final logo asset and wiring it in is a small follow-up development task, not something editable purely from the dashboard today.

## Tips

- Always double-check a section on the live public page after saving, especially for longer text fields, to make sure nothing overflows awkwardly.
- If you're unsure whether a piece of text belongs in `/admin/cms` (page content) or `/admin/settings` (site-wide contact/branding details), it's almost always CMS unless it's a phone number, email, address, timing, map link, or social media URL.
