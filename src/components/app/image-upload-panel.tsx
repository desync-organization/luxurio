"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

interface ImageUploadPanelProps {
  isUploading: boolean;
  previewUrl: string | null;
  fileName: string | null;
  errorMessage: string | null;
  onFileSelected: (file: File) => void;
  onClear: () => void;
}

export function ImageUploadPanel({
  isUploading,
  previewUrl,
  fileName,
  errorMessage,
  onFileSelected,
  onClear,
}: ImageUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) {
      return;
    }

    onFileSelected(file);
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      <div
        className="rounded-md border border-foreground/30 p-3"
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
      >
        <div
          className={`flex min-h-32 flex-col items-center justify-center gap-2 rounded-md border border-dashed px-3 py-4 text-center text-xs ${
            isDragging ? "border-foreground bg-foreground text-background" : "border-foreground/30"
          }`}
        >
          <p className="tracking-wide uppercase">
            {isDragging ? "Drop image here" : "Drag and drop image"}
          </p>
          <p className="text-[11px] text-foreground/80">PNG / JPG / WEBP • Max 8MB</p>
          <Button
            size="sm"
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? "Uploading..." : "Choose Image"}
          </Button>
        </div>
      </div>

      {errorMessage ? (
        <p className="rounded-md border border-foreground/30 px-2 py-1 text-[11px]">{errorMessage}</p>
      ) : null}

      {previewUrl ? (
        <div className="space-y-2 rounded-md border border-foreground/30 p-3">
          <p className="truncate text-[11px] uppercase">{fileName}</p>
          <div className="relative h-28 w-full overflow-hidden rounded-md border border-foreground/30">
            <Image
              src={previewUrl}
              alt="Uploaded preview"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
          <Button variant="outline" size="sm" type="button" onClick={onClear}>
            Clear
          </Button>
        </div>
      ) : null}

      <p className="text-[11px] text-foreground/80">
        Client-side validation: images only, maximum {Math.round(MAX_FILE_SIZE_BYTES / 1024 / 1024)}MB.
      </p>
    </div>
  );
}

export { MAX_FILE_SIZE_BYTES };
