import type { Metadata } from "next";
import { listEvents } from "@/lib/api/events";
import { EventsClient } from "@/components/events/EventsClient";
import { eventStructuredData } from "@/lib/seo/structuredData";

export const metadata: Metadata = {
  title: "Events | Kaylan Preschool",
  description: "Upcoming events, celebrations, and open houses at Kaylan Preschool — with a live countdown and easy RSVP.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await listEvents();
  const structuredData = events.map((e) =>
    eventStructuredData({ title: e.title, description: e.description, startAt: e.date, location: e.location })
  );

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-b from-[#FFF6EF] to-white py-16">
      {structuredData.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-center mb-3 text-[#3a2e4d]">
          What&apos;s Happening 🎉
        </h1>
        <p className="text-center text-[#5b4b6b] mb-10 max-w-2xl mx-auto">
          Mark your calendar for our upcoming celebrations, meetings, and open houses.
        </p>
        <EventsClient events={events} />
      </div>
    </main>
  );
}
