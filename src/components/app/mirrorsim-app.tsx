"use client";

import Image from "next/image";
import { useState } from "react";

import { ImageUploadPanel, MAX_FILE_SIZE_BYTES } from "@/components/app/image-upload-panel";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { removeImageBackground } from "@/lib/background-removal";
import { blobToDataUrl } from "@/lib/texture-extraction";

export function MirrorSimApp() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeProgress, setRemoveProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);

  const processBackground = async (file: File) => {
    setRemoveError(null);
    setIsRemoving(true);
    setRemoveProgress(0);
    setResultUrl(null);

    try {
      const blob = await removeImageBackground(file, {
        onProgress: (progressPercent) => setRemoveProgress(progressPercent),
      });
      const extractedTexture = await blobToDataUrl(blob);
      setResultUrl(extractedTexture);
      setProcessedCount((count) => count + 1);
      setRemoveProgress(100);
    } catch {
      setRemoveError("Background removal failed. Retry once the model download completes.");
    } finally {
      setIsRemoving(false);
    }
  };

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
      const dataUrl = await blobToDataUrl(file);
      setSourceFile(file);
      setPreviewUrl(dataUrl);
      setFileName(file.name);
      setUploadCount((count) => count + 1);
      await processBackground(file);
    } catch {
      setUploadError("Upload failed. Please try another image.");
    } finally {
      setIsUploading(false);
    }
  };

  const onClearUpload = () => {
    setSourceFile(null);
    setPreviewUrl(null);
    setFileName(null);
    setUploadError(null);
    setIsUploading(false);
    setResultUrl(null);
    setRemoveError(null);
    setIsRemoving(false);
    setRemoveProgress(0);
  };

  return (
    <main className="flex min-h-screen w-full flex-col">
      <header className="flex h-14 items-center justify-between border-b border-foreground/30 px-4">
        <h1 className="text-sm font-semibold tracking-[0.2em] uppercase">MirrorSim</h1>
        <p className="text-xs tracking-wide uppercase text-foreground/80">Upload + Remove BG</p>
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
            <div className="space-y-2 rounded-md border border-foreground/30 p-3 text-xs">
              <p className="uppercase text-foreground/80">
                {isRemoving ? `Processing ${removeProgress}%` : resultUrl ? "Background removed" : "Idle"}
              </p>

              {removeError ? (
                <p className="rounded-md border border-foreground/30 px-2 py-1">{removeError}</p>
              ) : null}

              {sourceFile ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isRemoving}
                  onClick={() => processBackground(sourceFile)}
                >
                  Retry Remove Background
                </Button>
              ) : null}

              {previewUrl && resultUrl ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-foreground/80">Before</p>
                    <div className="relative h-20 overflow-hidden rounded-md border border-foreground/30">
                      <Image src={previewUrl} alt="Before removal" fill unoptimized className="object-contain" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-foreground/80">After</p>
                    <div className="relative h-20 overflow-hidden rounded-md border border-foreground/30">
                      <Image src={resultUrl} alt="After removal" fill unoptimized className="object-contain" />
                    </div>
                  </div>
                </div>
              ) : null}
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
              <div className="flex items-center justify-between">
                <span className="uppercase">Processed</span>
                <NumberTicker value={processedCount} />
              </div>
              <p className="truncate uppercase text-foreground/80">
                {isUploading
                  ? "Uploading image..."
                  : isRemoving
                    ? "Removing background..."
                    : resultUrl
                      ? "Ready for texture mapping"
                      : previewUrl
                        ? "Image uploaded"
                        : "Waiting for upload"}
              </p>
            </div>
          </section>
        </aside>

        <section className="flex flex-1 p-4">
          <div className="relative flex w-full items-center justify-center overflow-hidden rounded-md border border-foreground/30">
            {resultUrl ? (
              <Image src={resultUrl} alt="Background removed result" fill unoptimized className="object-contain" />
            ) : previewUrl ? (
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
