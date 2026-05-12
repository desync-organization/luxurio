"use client";

import Image from "next/image";
import { useState } from "react";

import { ImageUploadPanel, MAX_FILE_SIZE_BYTES } from "@/components/app/image-upload-panel";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Separator } from "@/components/ui/separator";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Could not read image."));
    };

    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}

export function MirrorSimApp() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  const onFileSelected = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are supported.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError("Image is too large. Max size is 8MB.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setPreviewUrl(dataUrl);
      setFileName(file.name);
      setUploadCount((count) => count + 1);
    } catch {
      setUploadError("Upload failed. Please try another image.");
    } finally {
      setIsUploading(false);
    }
  };

  const onClearUpload = () => {
    setPreviewUrl(null);
    setFileName(null);
    setUploadError(null);
    setIsUploading(false);
  };

  return (
    <main className="flex min-h-screen w-full flex-col">
      <header className="flex h-14 items-center justify-between border-b border-foreground/30 px-4">
        <h1 className="text-sm font-semibold tracking-[0.2em] uppercase">MirrorSim</h1>
        <p className="text-xs tracking-wide uppercase text-foreground/80">Upload Prototype</p>
      </header>

      <div className="flex flex-1">
        <aside className="flex w-[22rem] flex-col border-r border-foreground/30">
          <section className="space-y-2 p-4">
            <h2 className="text-xs tracking-wide uppercase">Image Upload</h2>
            <ImageUploadPanel
              isUploading={isUploading}
              previewUrl={previewUrl}
              fileName={fileName}
              errorMessage={uploadError}
              onFileSelected={onFileSelected}
              onClear={onClearUpload}
            />
          </section>

          <Separator />

          <section className="space-y-2 p-4">
            <h2 className="text-xs tracking-wide uppercase">Background Removal</h2>
            <div className="rounded-md border border-foreground/30 p-3 text-xs text-foreground/80">
              Auto-processing pipeline will be wired in the next step.
            </div>
          </section>

          <Separator />

          <section className="space-y-2 p-4">
            <h2 className="text-xs tracking-wide uppercase">Status</h2>
            <div className="space-y-2 rounded-md border border-foreground/30 p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="uppercase">Uploads</span>
                <NumberTicker value={uploadCount} />
              </div>
              <p className="truncate uppercase text-foreground/80">
                {isUploading ? "Uploading image..." : previewUrl ? "Image ready" : "Waiting for upload"}
              </p>
            </div>
          </section>
        </aside>

        <section className="flex flex-1 p-4">
          <div className="relative flex w-full items-center justify-center overflow-hidden rounded-md border border-foreground/30">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={fileName ?? "Uploaded image"}
                fill
                unoptimized
                className="object-contain"
              />
            ) : (
              <p className="text-xs tracking-wide uppercase text-foreground/80">
                3D viewport placeholder
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
