"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "1rem", textAlign: "center" }}>
          <h1>Something went wrong</h1>
          <p>{error.message || "An unexpected error occurred."}</p>
          <button onClick={reset}>Try again</button>
        </main>
      </body>
    </html>
  );
}
