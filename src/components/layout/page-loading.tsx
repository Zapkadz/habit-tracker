export function PageLoading({ label = "Loading page" }: { label?: string }) {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-8 w-72 max-w-full animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-slate-100" />
        <p className="sr-only">{label}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-lg border border-slate-200 bg-white shadow-sm"
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.8fr)]">
        <div className="h-96 animate-pulse rounded-lg border border-slate-200 bg-white shadow-sm" />
        <div className="h-96 animate-pulse rounded-lg border border-slate-200 bg-white shadow-sm" />
      </section>
    </div>
  );
}
