import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/kit";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/signin")({
  head: () => seo("Sign in", "Sign in to Ravyu."),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Sign in" sub="Sign in to Ravyu." />
      <div className="card"><EmptyState title="Coming next" body="This section is planned and will be built in the next pass." /></div>
    </div>
  );
}
