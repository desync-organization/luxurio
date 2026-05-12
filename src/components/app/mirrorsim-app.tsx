"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";

import { ImageUploadPanel, MAX_FILE_SIZE_BYTES } from "@/components/app/image-upload-panel";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Separator } from "@/components/ui/separator";
import {
  preloadBackgroundRemovalAssets,
  removeImageBackground,
} from "@/lib/background-removal";

export function MirrorSimApp() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  const [removeError, setRemoveError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeProgress, setRemoveProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [engineReady, setEngineReady] = useState(false);

  const sourceObjectUrlRef = useRef<string | null>(null);
  const resultObjectUrlRef = useRef<string | null>(null);

  const clearObjectUrl = (urlRef: MutableRefObject<string | null>) => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  };

  const setPreviewFromFile = (file: File | null) => {
    clearObjectUrl(sourceObjectUrlRef);

    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    sourceObjectUrlRef.current = nextUrl;
    setPreviewUrl(nextUrl);
  };

  const clearProcessedResult = () => {
    clearObjectUrl(resultObjectUrlRef);
  };

  useEffect(() => {
    let mounted = true;

    preloadBackgroundRemovalAssets()
      .then(() => {
        if (mounted) {
          setEngineReady(true);
        }
      })
      .catch(() => {
        if (mounted) {
          setRemoveError("Background model warm-up failed. First run may be slower.");
        }
      });

    return () => {
      mounted = false;
      clearObjectUrl(sourceObjectUrlRef);
      clearObjectUrl(resultObjectUrlRef);
    };
  }, []);

  const processBackground = async (file: File) => {
    setRemoveError(null);
    setIsRemoving(true);
    setRemoveProgress(0);
    clearProcessedResult();

    try {
      const blob = await removeImageBackground(file, {
        onProgress: (progressPercent) => setRemoveProgress(progressPercent),
      });
      const resultObjectUrl = URL.createObjectURL(blob);
      resultObjectUrlRef.current = resultObjectUrl;
      setProcessedCount((count) => count + 1);
      setRemoveProgress(100);
    } catch {
      setRemoveError("Background removal failed. Try another image.");
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
      setSourceFile(file);
      setPreviewFromFile(file);
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
    setPreviewFromFile(null);
    setFileName(null);
    setUploadError(null);
    setIsUploading(false);
    clearProcessedResult();
    setRemoveError(null);
    setIsRemoving(false);
    setRemoveProgress(0);
  };

  return (
    <main className="flex min-h-screen w-full flex-col">
      <header className="flex h-14 items-center justify-between border-b border-foreground/30 px-4">
        <h1 className="text-sm font-semibold tracking-[0.2em] uppercase">MirrorSim</h1>
        <p className="text-xs tracking-wide uppercase text-foreground/80">Fast Upload Pipeline</p>
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
                {engineReady ? "Engine ready" : "Warming model cache"}
              </p>
              <p className="truncate uppercase text-foreground/80">
                {isUploading
                  ? "Uploading image..."
                  : isRemoving
                    ? `Removing background ${removeProgress}%`
                    : sourceFile
                      ? "Background removed"
                      : "Waiting for upload"}
              </p>
              {removeError ? (
                <p className="rounded-md border border-foreground/30 px-2 py-1">{removeError}</p>
              ) : null}
            </div>
          </section>
        </aside>

        <section className="flex flex-1 p-4">
          <div className="relative flex w-full items-center justify-center overflow-hidden rounded-md border border-foreground/30">
            <p className="text-xs tracking-wide uppercase text-foreground/80">
              3D viewport placeholder
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
