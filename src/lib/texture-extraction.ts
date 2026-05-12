export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not convert blob to data URL."));
    };

    reader.onerror = () => reject(new Error("Could not convert blob to data URL."));
    reader.readAsDataURL(blob);
  });
}
