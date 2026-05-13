// =============================
// IMPORTS
// =============================

"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";

import { ImageUploadPanel, MAX_FILE_SIZE_BYTES } from "@/components/app/image-upload-panel";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { GridViewport } from "../scene/grid-viewport";
import { Separator } from "@/components/ui/separator";
import {
  preloadBackgroundRemovalAssets,
  removeImageBackground,
} from "@/lib/background-removal";



// =============================
// MAIN APP COMPONENT
// =============================

export function LuxurioApp() {

  // =============================
  // IMAGE UPLOAD STATES
  // =============================

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);



  // =============================
  // BACKGROUND REMOVAL STATES
  // =============================

  const [removeError, setRemoveError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeProgress, setRemoveProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [engineReady, setEngineReady] = useState(false);



  // =============================
  // BODY MORPH STATES
  // Every slider gets its own state
  // =============================

  const [waistValue, setWaistValue] = useState(0);
  const [chestValue, setChestValue] = useState(0);
  const [thighValue, setThighValue] = useState(0);
  const [heightCm, setHeightCm] = useState(175);

  // FUTURE:
  // const [hipValue, setHipValue] = useState(0);
  // const [thighValue, setThighValue] = useState(0);



  // =============================
  // OBJECT URL MANAGEMENT
  // Handles browser blob cleanup
  // =============================

  const sourceObjectUrlRef = useRef<string | null>(null);



  // =============================
  // CLEAR PREVIOUS OBJECT URL
  // Prevents memory leaks
  // =============================

  const clearObjectUrl = (urlRef: MutableRefObject<string | null>) => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  };



  // =============================
  // CREATE PREVIEW URL FROM IMAGE
  // =============================

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



  // =============================
  // ENGINE INITIALIZATION
  // Preloads AI background removal model
  // =============================

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
          setRemoveError("Background model warm-up failed.");
        }
      });

    return () => {
      mounted = false;
      clearObjectUrl(sourceObjectUrlRef);
    };
  }, []);




  // =============================
  // BACKGROUND REMOVAL PIPELINE
  // =============================

  const processBackground = async (file: File) => {
    setRemoveError(null);
    setIsRemoving(true);
    setRemoveProgress(0);

    try {
      await removeImageBackground(file, {
        onProgress: (progressPercent) =>
          setRemoveProgress(progressPercent),
      });

      setProcessedCount((count) => count + 1);
      setRemoveProgress(100);

    } catch {

      setRemoveError("Background removal failed.");

    } finally {

      setIsRemoving(false);

    }
  };




  // =============================
  // FILE UPLOAD HANDLER
  // =============================

  const onFileSelected = async (file: File) => {

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files supported.");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError("Image too large.");
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

      setUploadError("Upload failed.");

    } finally {

      setIsUploading(false);

    }
  };




  // =============================
  // RESET / CLEAR UPLOAD
  // =============================

  const onClearUpload = () => {
    setSourceFile(null);
    setPreviewFromFile(null);
    setFileName(null);

    setUploadError(null);
    setIsUploading(false);

    setRemoveError(null);
    setIsRemoving(false);

    setRemoveProgress(0);
  };



  // =============================
  // UI RENDER
  // =============================

  return (

    // =============================
    // MAIN APP WRAPPER
    // =============================

    <main className="flex min-h-screen w-full flex-col">


      {/* =============================
          TOP HEADER
      ============================== */}

      <header className="flex h-14 items-center justify-between border-b border-foreground/30 px-4">

        <h1 className="text-sm font-semibold tracking-[0.2em] uppercase">
          Luxurio
        </h1>

      </header>



      {/* =============================
          MAIN APP LAYOUT
          LEFT PANEL + VIEWPORT
      ============================== */}

      <div className="flex flex-1">


        {/* =============================
            LEFT SIDEBAR
        ============================== */}

        <aside className="flex w-[22rem] flex-col border-r border-foreground/30">


          {/* =============================
              BODY CONTROL SECTION
          ============================== */}

          <section className="space-y-2 p-4">

            <Separator />

            <section className="space-y-3 p-4">

              {/* Section Header */}
              <div className="flex items-center justify-between">

                <h2 className="text-xs tracking-wide uppercase">
                  Body Controls
                </h2>

                <span className="text-xs text-foreground/60">
                  Male
                </span>

              </div>



              {/* =============================
                  BODY SLIDER CONTAINER
              ============================== */}

              <div className="rounded-md border border-foreground/30 p-3 space-y-4">


                {/* =============================
                    WAIST SLIDER
                ============================== */}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs uppercase">
                    <span>Waist</span>

                    <span className="text-foreground/70">
                      {Math.round(30 + waistValue * 12)} in
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={waistValue}
                    onChange={(e) =>
                      setWaistValue(Number(e.target.value))
                    }
                    className="w-full accent-white"
                  />
                </div>



                {/* =============================
                    CHEST SLIDER
                ============================== */}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs uppercase">
                    <span>Chest</span>

                    <span className="text-foreground/70">
                      {Math.round(32 + chestValue * 14)} in
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={chestValue}
                    onChange={(e) =>
                      setChestValue(Number(e.target.value))
                    }
                    className="w-full accent-white"
                  />
                </div>



                {/* =============================
                    THIGH SLIDER
                ============================== */}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs uppercase">
                    <span>Thigh</span>

                    <span className="text-foreground/70">
                      {Math.round(32 + chestValue * 14)} in
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={thighValue}
                    onChange={(e) =>
                      setThighValue(Number(e.target.value))
                    }
                    className="w-full accent-white"
                  />
                </div>



                {/* =============================
                    HEIGHT SLIDER
                ============================== */}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs uppercase">
                    <span>Height</span>

                    <span className="text-foreground/70">
                      {heightCm} cm
                    </span>
                  </div>

                  <input
                    type="number"
                    min={140}
                    max={220}
                    value={heightCm}
                    onChange={(e) =>
                      setHeightCm(Number(e.target.value))
                    }
                    className="w-full rounded border border-white/20 bg-black px-2 py-1 text-sm"
                  />
                </div>

              </div>
            </section>



            {/* =============================
                IMAGE UPLOAD SECTION
            ============================== */}

            <h2 className="text-xs tracking-wide uppercase">
              Image Upload
            </h2>

            <ImageUploadPanel
              isUploading={isUploading}
              previewUrl={previewUrl}
              fileName={fileName}
              errorMessage={uploadError}
              onFileSelected={onFileSelected}
              onClear={onClearUpload}
            />

          </section>



          {/* =============================
              STATUS SECTION
          ============================== */}

          <Separator />

          <section className="space-y-2 p-4">

            <h2 className="text-xs tracking-wide uppercase">
              Status
            </h2>

            {/* Status Card */}
            <div className="space-y-2 rounded-md border border-foreground/30 p-3 text-xs">

              {/* Upload Counter */}
              <div className="flex items-center justify-between">

                <span className="uppercase">
                  Uploads
                </span>

                <NumberTicker value={uploadCount} />

              </div>

            </div>
          </section>
        </aside>



        {/* =============================
            3D VIEWPORT SECTION
        ============================== */}

        <section className="flex flex-1 p-4">

          <GridViewport
            waistValue={waistValue}
            chestValue={chestValue}
            thighValue={thighValue}
            heightCm={heightCm}
          />

        </section>

      </div>
    </main>
  );
}
