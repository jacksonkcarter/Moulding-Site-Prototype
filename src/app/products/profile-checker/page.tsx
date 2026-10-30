import { notFound } from "next/navigation";
import { ProfileCheckerView } from "@/components/ProfileCheckerView";
import { getStockItemByModel, getStockItemDisplayName } from "@/data/stock-items";
import { safeProfileSearchReturn } from "@/lib/profile-search-params";
import { getOutlinePdfLookupId, getProfileById } from "@/lib/profiles";

type ProfileCheckerPageProps = {
  searchParams: Promise<{ item?: string; category?: string; profile?: string; return?: string }>;
};

export default async function ProfileCheckerPage({ searchParams }: ProfileCheckerPageProps) {
  const {
    item: itemParam,
    category: categoryParam,
    profile: profileParam,
    return: returnParam,
  } = await searchParams;

  if (profileParam) {
    const profileId = decodeURIComponent(profileParam);
    const profile = getProfileById(profileId);
    if (!profile) notFound();

    const outlineId = getOutlinePdfLookupId([profile.profileId]);
    const referenceOutlinePdfUrl = outlineId
      ? `/api/profile-pdfs/${encodeURIComponent(outlineId)}`
      : null;

    const browseReturn = safeProfileSearchReturn(returnParam);
    const profileDetailPath = `/products/select-profiles/${encodeURIComponent(profile.profileId)}`;
    const backHref = `${profileDetailPath}?return=${encodeURIComponent(browseReturn)}`;

    return (
      <ProfileCheckerView
        profileName={profile.profileId}
        backHref={backHref}
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
      backHref={`/products/stock-items/${categorySlug}/${encodeURIComponent(stockItem.item)}`}
      backLabel="← Back to stock item"
      referenceOutlinePdfUrl={referenceOutlinePdfUrl}
    />
  );
}
