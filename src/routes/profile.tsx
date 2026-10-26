import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/kit";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/profile")({
  head: () => seo("Your profile", "Personal details and preferences."),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Your profile" sub="Personal details and preferences." />
      <div className="card"><EmptyState title="Coming next" body="This section is planned and will be built in the next pass." /></div>
    </div>
  );
}
