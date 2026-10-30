import { Suspense } from "react";
import { ProfileSearch } from "@/components/ProfileSearch";

export default function ProfileSearchPage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={null}>
        <ProfileSearch />
      </Suspense>
    </main>
  );
}
