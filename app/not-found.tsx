import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#faf9ff] px-4 text-center">
      <div className="w-28 h-28 sm:w-36 sm:h-36 animate-float">
        <Image
          src="/brand/koki-mascot-final.png"
          alt="Koki the Kaylan mascot looking puzzled"
          width={144}
          height={167}
          className="object-contain"
          priority
        />
      </div>
      <h1 className="font-heading text-4xl font-bold text-[#3a2e4d]">404 — Page not found</h1>
      <p className="max-w-md text-[#3a2e4d]/70">The page you&apos;re looking for wandered off into the storybook forest.</p>
      <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full bg-candy px-5 py-2.5 font-heading font-semibold text-white hover:bg-candy/90">
        Back to home
      </Link>
    </main>
  );
}
