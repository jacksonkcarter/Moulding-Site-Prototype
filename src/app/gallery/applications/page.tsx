import { ApplicationsDrawer } from "@/components/ApplicationsDrawer";
import { GALLERY_APPLICATIONS } from "@/data/gallery-applications";

export default function GalleryApplicationsPage() {
  return (
    <main>
      <ApplicationsDrawer categories={GALLERY_APPLICATIONS} />
    </main>
  );
}
