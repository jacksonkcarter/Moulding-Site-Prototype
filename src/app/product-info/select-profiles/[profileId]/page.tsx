import { notFound } from "next/navigation";
import { ProfileDetailView } from "@/components/ProfileDetailView";
import { safeProfileSearchReturn } from "@/lib/profile-search-params";
import {
  getOutlinePdfFileName,
  getProfileById,
  isNewProfileDrawing,
} from "@/lib/profiles";

type ProfileDetailPageProps = {
  params: Promise<{ profileId: string }>;
  searchParams: Promise<{ return?: string }>;
};

export default async function ProfileDetailPage({ params, searchParams }: ProfileDetailPageProps) {
  const { profileId: rawId } = await params;
  const { return: returnTo } = await searchParams;
  const profileId = decodeURIComponent(rawId);
  const profile = getProfileById(profileId);
  if (!profile) notFound();

  const imageSrc = `/api/images/${encodeURIComponent(profile.profileId)}`;
  const isNewDrawing = isNewProfileDrawing(profile.profileId);
  const hasOutlinePdf = getOutlinePdfFileName(profile.profileId) != null;
  const backHref = safeProfileSearchReturn(returnTo);

  return (
    <ProfileDetailView
      profile={profile}
      imageSrc={imageSrc}
      isNewDrawing={isNewDrawing}
      hasOutlinePdf={hasOutlinePdf}
      backHref={backHref}
    />
  );
}
