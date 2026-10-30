import { ApplicationsDrawer } from "@/components/ApplicationsDrawer";
import { GALLERY_APPLICATIONS } from "@/data/gallery-applications";

export default function GalleryPage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ApplicationsDrawer categories={GALLERY_APPLICATIONS} />
    </main>
  );
}
