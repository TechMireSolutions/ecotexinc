import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatFileSize, compressAndConvertImage } from '../src/utils/imageCompressor.js';

describe('Image Compressor & Formatter Unit Tests', () => {
  it('should accurately format file sizes in B, KB, and MB', () => {
    assert.strictEqual(formatFileSize(0), '0 Bytes');
    assert.strictEqual(formatFileSize(512), '512 B');
    assert.strictEqual(formatFileSize(1024), '1.0 KB');
    assert.strictEqual(formatFileSize(150 * 1024), '150.0 KB');
    assert.strictEqual(formatFileSize(5.5 * 1024 * 1024), '5.50 MB');
    assert.strictEqual(formatFileSize(12.345 * 1024 * 1024), '12.35 MB');
  });

  it('should safely handle SVG images without canvas rasterization', async () => {
    const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40"/></svg>';
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    const svgFile = new File([svgBlob], 'icon.svg', { type: 'image/svg+xml' });

    const result = await compressAndConvertImage(svgFile);
    assert.strictEqual(result.format, 'image/svg+xml');
    assert.strictEqual(result.originalSize, svgFile.size);
    assert.strictEqual(result.compressedSize, svgFile.size);
    assert.ok(result.dataUrl.startsWith('data:image/svg+xml'));
  });

  it('should safely bypass non-image files', async () => {
    const textBlob = new Blob(['sample data'], { type: 'text/plain' });
    const textFile = new File([textBlob], 'sample.txt', { type: 'text/plain' });

    const result = await compressAndConvertImage(textFile);
    assert.strictEqual(result.format, 'text/plain');
    assert.strictEqual(result.savingsPercent, 0);
  });
});
