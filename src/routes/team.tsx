import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/kit";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/team")({
  head: () => seo("Team", "Members, roles, invitations and activity."),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Team" sub="Members, roles, invitations and activity." />
      <div className="card"><EmptyState title="Coming next" body="This section is planned and will be built in the next pass." /></div>
    </div>
  );
}
