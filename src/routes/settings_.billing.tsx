import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/kit";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/settings_/billing")({
  head: () => seo("Billing & Subscription", "Plan, usage and invoices."),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Billing & Subscription" sub="Plan, usage and invoices." />
      <div className="card"><EmptyState title="Coming next" body="This section is planned and will be built in the next pass." /></div>
    </div>
  );
}
