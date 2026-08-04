import { PageContent } from "@/components/PageContent";
import { SiteSearchResults } from "@/components/SiteSearchResults";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const initialQuery = typeof params.q === "string" ? params.q : "";

  return (
    <PageContent title="Search">
      <SiteSearchResults initialQuery={initialQuery} />
    </PageContent>
  );
}
