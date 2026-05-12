import { preload, removeBackground, type Config } from "@imgly/background-removal";

const MAX_PROCESSING_DIMENSION = 768;
const FAST_MODEL = "isnet_quint8";

interface RemoveBackgroundOptions {
  onProgress?: (progressPercent: number) => void;
}

let preloadPromise: Promise<void> | null = null;

function getDevice(): Config["device"] {
  // CPU avoids noisy WebGPU execution-provider warnings in Next.js dev overlay.
  return "cpu";
}

function getFastConfig(options: RemoveBackgroundOptions = {}): Config {
  return {
    model: FAST_MODEL,
    device: getDevice(),
    output: {
      format: "image/png",
      quality: 0.9,
    },
    progress: (_, current, total) => {
      if (!options.onProgress || total === 0) {
        return;
      }

      const percentage = Math.min(100, Math.round((current / total) * 100));
      options.onProgress(percentage);
    },
  };
}

async function resizeForFastInference(imageFile: File): Promise<Blob> {
  if (typeof createImageBitmap === "undefined" || typeof document === "undefined") {
    return imageFile;
  }

  const bitmap = await createImageBitmap(imageFile);
  const needsResize =
    bitmap.width > MAX_PROCESSING_DIMENSION || bitmap.height > MAX_PROCESSING_DIMENSION;

  if (!needsResize) {
    bitmap.close();
    return imageFile;
  }

  const scale = Math.min(MAX_PROCESSING_DIMENSION / bitmap.width, MAX_PROCESSING_DIMENSION / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return imageFile;
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const resizedBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.9);
  });

  return resizedBlob ?? imageFile;
}

export function preloadBackgroundRemovalAssets(): Promise<void> {
  if (!preloadPromise) {
    preloadPromise = preload(getFastConfig());
  }

  return preloadPromise;
}

export async function removeImageBackground(
  imageFile: File,
  options: RemoveBackgroundOptions = {},
): Promise<Blob> {
  await preloadBackgroundRemovalAssets();
  const optimizedInput = await resizeForFastInference(imageFile);
  const result = await removeBackground(optimizedInput, getFastConfig(options));
  options.onProgress?.(100);
  return result;
}
