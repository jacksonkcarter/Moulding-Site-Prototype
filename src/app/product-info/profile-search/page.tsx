import { Suspense } from "react";
import { ProfileSearch } from "@/components/ProfileSearch";
import { loadProfilesWithImages } from "@/lib/profiles";

export default function ProfileSearchPage() {
  const profiles = loadProfilesWithImages();

  return (
    <main className="min-h-screen">
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-neutral-500">
            Loading profiles…
          </div>
        }
      >
        <ProfileSearch initialProfiles={profiles} />
      </Suspense>
    </main>
  );
}
