/**
 * Lightweight loading skeleton that mirrors the public site layout
 * (navbar + hero + a row of cards) so the first paint feels intentional
 * rather than a bare spinner.
 */
function Block({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-black/[0.06] ${className}`} />;
}

export default function SiteSkeleton() {
  return (
    <div className="bg-warm min-h-screen">
      {/* Navbar */}
      <div className="mx-auto flex w-[92%] max-w-7xl items-center justify-between py-6">
        <Block className="h-9 w-36" />
        <div className="hidden gap-6 md:flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Block key={i} className="h-4 w-16 rounded-full" />
          ))}
        </div>
        <Block className="h-10 w-28 rounded-full" />
      </div>

      {/* Hero */}
      <div className="mx-auto mt-8 w-[92%] max-w-7xl">
        <Block className="mx-auto h-6 w-40 rounded-full" />
        <Block className="mx-auto mt-6 h-12 w-3/4" />
        <Block className="mx-auto mt-3 h-12 w-2/3" />
        <Block className="mx-auto mt-6 h-5 w-1/2" />
        <div className="mt-8 flex justify-center gap-3">
          <Block className="h-12 w-44 rounded-full" />
          <Block className="h-12 w-44 rounded-full" />
        </div>
      </div>

      {/* Card row */}
      <div className="mx-auto mt-16 grid w-[92%] max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card-soft overflow-hidden rounded-2xl">
            <Block className="h-44 rounded-none" />
            <div className="space-y-3 p-5">
              <Block className="h-5 w-3/4" />
              <Block className="h-4 w-1/2" />
              <Block className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
