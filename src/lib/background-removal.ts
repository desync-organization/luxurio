import { removeBackground, type Config } from "@imgly/background-removal";

interface RemoveBackgroundOptions {
  onProgress?: (progressPercent: number) => void;
}

export async function removeImageBackground(
  imageFile: File,
  options: RemoveBackgroundOptions = {},
): Promise<Blob> {
  const config: Config = {
    output: {
      format: "image/png",
      quality: 1,
    },
    progress: (_, current, total) => {
      if (!options.onProgress || total === 0) {
        return;
      }

      const percentage = Math.min(100, Math.round((current / total) * 100));
      options.onProgress(percentage);
    },
  };

  const result = await removeBackground(imageFile, config);
  options.onProgress?.(100);
  return result;
}
