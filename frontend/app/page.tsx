export default function Home() {
  const metrics = [
    { label: "Active SKUs", value: "128", helper: "Mock dashboard data" },
    { label: "Stock Records", value: "384", helper: "Across all stores" },
    { label: "Reorder Needed", value: "12", helper: "Pending document workflow" },
    { label: "Stores", value: "3", helper: "Bangkok, Chiang Mai, Hat Yai" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-2xl font-bold">Warehouse Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Current frontend shell with mock operational data.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-muted-foreground text-sm">{metric.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{metric.value}</p>
            <p className="text-muted-foreground mt-1 text-xs">{metric.helper}</p>
          </div>
        ))}
      </div>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h2 className="font-semibold">Next workflow</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Low-stock requests and approvals will move through the document feature before backend
          permissions are introduced.
        </p>
      </section>
    </div>
  );
}
