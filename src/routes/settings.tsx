import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/kit";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/settings")({
  head: () => seo("Settings", "Workspace, branding, notifications, appearance and data settings."),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Settings" sub="Workspace, branding, notifications, appearance and data settings." />
      <div className="card"><EmptyState title="Coming next" body="This section is planned and will be built in the next pass." /></div>
    </div>
  );
}
