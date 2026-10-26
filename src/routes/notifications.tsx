import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/kit";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/notifications")({
  head: () => seo("Notifications", "Leads, campaigns, listings, sync and system alerts."),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Notifications" sub="Leads, campaigns, listings, sync and system alerts." />
      <div className="card"><EmptyState title="Coming next" body="This section is planned and will be built in the next pass." /></div>
    </div>
  );
}
