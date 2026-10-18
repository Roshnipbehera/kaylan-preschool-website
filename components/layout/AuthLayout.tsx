import Image from "next/image";
import Link from "next/link";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sunshine/10 via-sky/10 to-candy/10 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-block">
            <Image
              src="/brand/kaylan-logo.png"
              alt="Kaylan Preschool & Daycare"
              width={130}
              height={50}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
          <Image
            src="/brand/kaylan-caterpillar-mascot.png"
            alt="Kaylan Preschool mascot"
            width={52}
            height={36}
            className="object-contain animate-bob"
          />
        </div>
        <h1 className="font-heading text-2xl font-bold text-[#3a2e4d]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[#3a2e4d]/70">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
