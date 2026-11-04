/**
 * Ecotex Inc. - Client-Side Auto Image Converter & Optimizer
 * 
 * Automatically converts high-resolution / heavy MB photos (e.g. 5MB - 30MB)
 * down to lightweight, web-optimized KB sizes (typically 80KB - 300KB)
 * directly in the user's browser before network transfer or storage.
 */

export interface CompressionResult {
  file: File;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  originalSizeStr: string;
  compressedSizeStr: string;
  savingsPercent: number;
  width: number;
  height: number;
  format: string;
}

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  targetMaxKb?: number;
  preferWebp?: boolean;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Checks whether an image on canvas contains any transparent pixels
 */
function checkTransparency(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  try {
    // Sample 20x20 grid to detect alpha channel efficiently
    const sampleW = Math.min(width, 32);
    const sampleH = Math.min(height, 32);
    const imgData = ctx.getImageData(0, 0, sampleW, sampleH).data;
    for (let i = 3; i < imgData.length; i += 4) {
      if (imgData[i] < 250) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Main compression and auto-conversion engine.
 * Converts heavy images in MBs to crystal-clear lightweight images in KBs.
 */
export async function compressAndConvertImage(
  file: File,
  options: CompressOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    targetMaxKb = 400,
    preferWebp = true,
  } = options;

  // 1. If not an image (or if it's already an SVG vector), return as-is
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    const dataUrl = await readFileAsDataUrl(file);
    return {
      file,
      dataUrl,
      originalSize: file.size,
      compressedSize: file.size,
      originalSizeStr: formatFileSize(file.size),
      compressedSizeStr: formatFileSize(file.size),
      savingsPercent: 0,
      width: 0,
      height: 0,
      format: file.type || 'image/svg+xml',
    };
  }

  // 2. Load file into HTML Image Element
  const img = await loadImageElement(file);

  // 3. Compute scale-down dimensions preserving exact aspect ratio
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.max(1, Math.round(width * ratio));
    height = Math.max(1, Math.round(height * ratio));
  }

  // 4. Render to HTML5 Canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  // 5. Detect if transparency exists (e.g. cutout bag PNGs)
  const isOriginalPng = file.type === 'image/png';
  const hasAlpha = isOriginalPng && checkTransparency(ctx, width, height);

  // Determine output MIME type:
  // WebP supports both transparent cutouts and lossy compression at 80% smaller size!
  let outputMime = 'image/webp';
  if (!preferWebp) {
    outputMime = hasAlpha ? 'image/png' : 'image/jpeg';
  }

  // 6. First pass conversion to blob
  let currentQuality = quality;
  let blob = await canvasToBlob(canvas, outputMime, currentQuality);

  // Fallback if browser canvas does not support image/webp
  if (!blob || blob.type !== outputMime) {
    outputMime = hasAlpha ? 'image/png' : 'image/jpeg';
    blob = await canvasToBlob(canvas, outputMime, currentQuality);
  }

  if (!blob) {
    throw new Error('Failed to create compressed image blob');
  }

  // 7. Iterative optimization if the image is still above targetMaxKb
  if (blob.size > targetMaxKb * 1024 && currentQuality > 0.65) {
    currentQuality = 0.72;
    const secondPass = await canvasToBlob(canvas, outputMime, currentQuality);
    if (secondPass && secondPass.size < blob.size) {
      blob = secondPass;
    }
  }

  // 8. If even after quality reduction it's still large (e.g. extremely complex large photos),
  // scale down dimensions slightly to ensure it stays in KBs
  if (blob.size > targetMaxKb * 1024 && (width > 1200 || height > 1200)) {
    const scale = 0.75;
    const smallerW = Math.max(1, Math.round(width * scale));
    const smallerH = Math.max(1, Math.round(height * scale));
    const smallerCanvas = document.createElement('canvas');
    smallerCanvas.width = smallerW;
    smallerCanvas.height = smallerH;
    const sCtx = smallerCanvas.getContext('2d');
    if (sCtx) {
      sCtx.imageSmoothingEnabled = true;
      sCtx.imageSmoothingQuality = 'high';
      sCtx.drawImage(canvas, 0, 0, smallerW, smallerH);
      const thirdPass = await canvasToBlob(smallerCanvas, outputMime, 0.75);
      if (thirdPass && thirdPass.size < blob.size) {
        blob = thirdPass;
        width = smallerW;
        height = smallerH;
      }
    }
  }

  // 9. Construct new File object with proper extension
  const ext = outputMime === 'image/webp' ? '.webp' : (outputMime === 'image/png' ? '.png' : '.jpg');
  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const newFilename = `${baseName}${ext}`;

  const optimizedFile = new File([blob], newFilename, {
    type: outputMime,
    lastModified: Date.now(),
  });

  const dataUrl = await readFileAsDataUrl(blob);
  const savings = Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100));

  return {
    file: optimizedFile,
    dataUrl,
    originalSize: file.size,
    compressedSize: blob.size,
    originalSizeStr: formatFileSize(file.size),
    compressedSizeStr: formatFileSize(blob.size),
    savingsPercent: savings,
    width,
    height,
    format: outputMime,
  };
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      mimeType,
      quality
    );
  });
}

async function readFileAsDataUrl(blobOrFile: Blob | File): Promise<string> {
  if (typeof FileReader !== 'undefined') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blobOrFile);
    });
  }

  // Node.js & SSR fallback
  const buffer = Buffer.from(await blobOrFile.arrayBuffer());
  const mimeType = blobOrFile.type || 'application/octet-stream';
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}
