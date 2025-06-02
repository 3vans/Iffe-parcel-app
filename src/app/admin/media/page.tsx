
// src/app/admin/media/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, Link as LinkIcon } from "lucide-react";

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Media Library Management</CardTitle>
          <CardDescription>Manage images in the gallery and videos in the library.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Image Gallery</h3>
            <p className="text-muted-foreground mb-3">Upload new images, edit captions/tags, or delete existing gallery items.</p>
            <Button><UploadCloud className="mr-2 h-4 w-4" /> Upload to Gallery</Button>
            {/* Placeholder for gallery management table/grid */}
          </div>
          <hr className="my-6"/>
          <div>
            <h3 className="font-semibold text-lg mb-2">Video Library</h3>
            <p className="text-muted-foreground mb-3">Add YouTube video links, manage video details, categories, and visibility.</p>
            <Button><LinkIcon className="mr-2 h-4 w-4" /> Add YouTube Video</Button>
            {/* Placeholder for video management table/grid */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
