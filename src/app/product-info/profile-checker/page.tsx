import { notFound } from "next/navigation";
import { ProfileCheckerView } from "@/components/ProfileCheckerView";
import { getStockItemByModel, getStockItemDisplayName } from "@/data/stock-items";
import { getOutlinePdfLookupId, getProfileById } from "@/lib/profiles";

type ProfileCheckerPageProps = {
  searchParams: Promise<{ item?: string; category?: string; profile?: string }>;
};

export default async function ProfileCheckerPage({ searchParams }: ProfileCheckerPageProps) {
  const {
    item: itemParam,
    category: categoryParam,
    profile: profileParam,
  } = await searchParams;

  if (profileParam) {
    const profileId = decodeURIComponent(profileParam);
    const profile = getProfileById(profileId);
    if (!profile) notFound();

    const outlineId = getOutlinePdfLookupId([profile.profileId]);
    const referenceOutlinePdfUrl = outlineId
      ? `/api/profile-pdfs/${encodeURIComponent(outlineId)}`
      : null;

    return (
      <ProfileCheckerView
        profileName={profile.profileId}
        backHref={`/product-info/select-profiles/${encodeURIComponent(profile.profileId)}`}
        backLabel="← Back to select profile"
        referenceOutlinePdfUrl={referenceOutlinePdfUrl}
      />
    );
  }

  if (!itemParam) notFound();

  const stockItem = getStockItemByModel(decodeURIComponent(itemParam));
  if (!stockItem) notFound();

  const categorySlug = categoryParam
    ? decodeURIComponent(categoryParam)
    : stockItem.categorySlug;

  const outlineId = getOutlinePdfLookupId([stockItem.item, stockItem.alternateName]);
  const referenceOutlinePdfUrl = outlineId
    ? `/api/profile-pdfs/${encodeURIComponent(outlineId)}`
    : null;

  return (
    <ProfileCheckerView
      profileName={getStockItemDisplayName(stockItem)}
      backHref={`/product-info/stock-items/${categorySlug}/${encodeURIComponent(stockItem.item)}`}
      backLabel="← Back to stock item"
      referenceOutlinePdfUrl={referenceOutlinePdfUrl}
    />
  );
}
