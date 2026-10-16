export interface HighDpiExportOptions {
  width: number;
  height: number;
  dpiScale?: number;
  format?: 'image/png' | 'image/webp';
  quality?: number;
}

/**
 * Renders a high-DPI print-ready garment composite using OffscreenCanvas
 * when supported by the runtime environment, falling back to HTMLCanvasElement.
 */
export async function createPrintReadyBlob(
  sourceCanvas: HTMLCanvasElement,
  options: HighDpiExportOptions
): Promise<Blob> {
  const scale = options.dpiScale ?? 2;
  const targetWidth = Math.round(options.width * scale);
  const targetHeight = Math.round(options.height * scale);
  const format = options.format ?? 'image/png';
  const quality = options.quality ?? 0.95;

  if (typeof OffscreenCanvas !== 'undefined') {
    const offscreen = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to initialize 2D context on OffscreenCanvas');
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);
    return offscreen.convertToBlob({ type: format, quality });
  }

  return new Promise<Blob>((resolve, reject) => {
    sourceCanvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob export failed'));
      },
      format,
      quality
    );
  });
}
