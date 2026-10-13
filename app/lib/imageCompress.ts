/**
 * Client-side lightweight image compression using HTML5 Canvas.
 * Solves Vercel 4.5MB serverless payload limit & prevents network timeout errors.
 */

export function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        resolve("");
        return;
      }
      compressDataUri(src, maxWidth, maxHeight, quality).then(resolve);
    };
    reader.onerror = () => resolve("");
  });
}

export function compressDataUri(
  dataUri: string,
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.8
): Promise<string> {
  if (typeof window === "undefined" || !dataUri || !dataUri.startsWith("data:image")) {
    return Promise.resolve(dataUri);
  }

  // Jika sudah ringan (< 150 KB), tidak perlu dikompresi lagi
  if (dataUri.length < 150 * 1024) {
    return Promise.resolve(dataUri);
  }

  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUri);
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL("image/jpeg", quality);
      resolve(compressed);
    };
    img.onerror = () => resolve(dataUri);
    img.src = dataUri;
  });
}
