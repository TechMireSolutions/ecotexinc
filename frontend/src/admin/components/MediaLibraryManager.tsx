'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Eye, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useStore, MediaAsset } from '../../store/useStore';
import { compressAndConvertImage } from '../../utils/imageCompressor';

export const MediaLibraryManager: React.FC = () => {
  const { 
    mediaLibrary, 
    addMediaAsset, 
    deleteMediaAsset, 
    updateSiteImage, 
    updateHeroConfig 
  } = useStore();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Lock body scroll and handle Escape key for preview modal
  useEffect(() => {
    if (!previewAsset) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewAsset(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [previewAsset]);

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        const optimized = await compressAndConvertImage(file, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.82,
          targetMaxKb: 350
        });

        addMediaAsset({
          name: optimized.file.name,
          url: optimized.dataUrl,
          size: optimized.compressedSizeStr,
          type: optimized.format
        });
      } catch (err) {
        console.warn('Fallback to standard FileReader for asset:', err);
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            addMediaAsset({
              name: file.name,
              url: result,
              size: `${(file.size / 1024).toFixed(0)} KB`,
              type: file.type
            });
          }
        };
        reader.readAsDataURL(file);
      }
    }

    setSuccessToast('Assets successfully converted to KB & uploaded.');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleQuickAssign = (asset: MediaAsset, target: 'heroJar' | 'facility' | 'shopBanner') => {
    if (target === 'heroJar') {
      updateHeroConfig({ productImage: asset.url });
      setSuccessToast(`Set "${asset.name}" as the 3D Hero Product Showcase!`);
    } else if (target === 'facility') {
      updateSiteImage('facilityPhoto', asset.url);
      setSuccessToast(`Set "${asset.name}" as the Facility Photo!`);
    } else if (target === 'shopBanner') {
      updateSiteImage('shopBanner', asset.url);
      setSuccessToast(`Set "${asset.name}" as the Shop Catalog Banner!`);
    }
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeInUp pb-12">
      
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-[#B2E2C5]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#B2E2C5]/20 text-[#4E9F76]">
              <ImageIcon className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#4E9F76]">
              Digital Asset Management (DAM)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] mt-1">
            Media & Bag Artwork Library
          </h2>
          <p className="text-xs text-slate-500">
            Upload transparent bag renders, custom artwork logos, and high-res factory photography.
          </p>
        </div>

        <label className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#4E9F76] hover:bg-[#86C59E] text-white text-xs font-bold transition-all shadow-md shadow-[#4E9F76]/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer w-full sm:w-auto">
          <Upload className="w-4 h-4" />
          <span>Upload Media Assets</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {/* Toast alert */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-[#86C59E]/15 border border-[#86C59E]/40 text-[#4E9F76] text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-slate-500 hover:text-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Media Assets Grid - Pure Image Gallery */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
        {mediaLibrary.map((asset) => (
          <div
            key={asset.id}
            onClick={() => setPreviewAsset(asset)}
            className="group relative aspect-square bg-[#f8faf9] rounded-2xl border border-slate-200 hover:border-[#166534] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center p-3"
          >
            {/* Pure Image Display */}
            <img
              src={asset.url}
              alt={asset.name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
              loading="lazy"
            />

            {/* Mobile Touch Quick Action (Visible on mobile screens) */}
            <div 
              className="sm:hidden absolute top-2 right-2 flex items-center gap-1 z-10 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-xs border border-slate-200/80"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyUrl(asset);
                }}
                className="p-1 text-slate-600 hover:text-[#166534]"
                title="Copy Image URL"
              >
                {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-[#166534]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Subtle Hover Action Overlay */}
            <div 
              className="hidden sm:flex absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center gap-2 p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyUrl(asset);
                }}
                className="p-2.5 rounded-xl bg-white/95 text-slate-700 hover:text-[#166534] hover:bg-white shadow-md transition-all active:scale-95"
                title="Copy Image URL"
              >
                {copiedId === asset.id ? <Check className="w-4 h-4 text-[#166534]" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewAsset(asset);
                }}
                className="p-2.5 rounded-xl bg-white/95 text-slate-700 hover:text-[#166534] hover:bg-white shadow-md transition-all active:scale-95"
                title="View Full Size"
              >
                <Eye className="w-4 h-4" />
              </button>

              {mediaLibrary.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMediaAsset(asset.id);
                  }}
                  className="p-2.5 rounded-xl bg-white/95 text-slate-400 hover:text-red-600 hover:bg-white shadow-md transition-all active:scale-95"
                  title="Delete Asset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Copied indicator pill */}
            {copiedId === asset.id && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-[#166534] text-white text-[10px] font-bold shadow-md z-10 flex items-center gap-1 animate-fadeIn">
                <Check className="w-3 h-3" />
                <span>Copied!</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Asset Preview Modal - Centered with Blurry Backdrop in Document Portal */}
      {previewAsset && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setPreviewAsset(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl shadow-black/40 border border-slate-200/80 space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="min-w-0 pr-4">
                <h3 className="text-sm font-bold text-[#0f172a] truncate">{previewAsset.name}</h3>
                <span className="text-xs text-slate-400">{previewAsset.size} · {previewAsset.type}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-60 sm:h-80 md:h-[380px] bg-[#f8faf9] rounded-2xl p-4 flex items-center justify-center border border-slate-100">
              <img
                src={previewAsset.url}
                alt={previewAsset.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Assign options in preview modal */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Assign To:
                </span>
                <button
                  onClick={() => handleQuickAssign(previewAsset, 'heroJar')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#166534] hover:text-white text-xs font-medium text-slate-700 transition-colors"
                >
                  Hero Product
                </button>
                <button
                  onClick={() => handleQuickAssign(previewAsset, 'facility')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#166534] hover:text-white text-xs font-medium text-slate-700 transition-colors"
                >
                  Facility Photo
                </button>
                <button
                  onClick={() => handleQuickAssign(previewAsset, 'shopBanner')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#166534] hover:text-white text-xs font-medium text-slate-700 transition-colors"
                >
                  Shop Banner
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                <button
                  onClick={() => handleCopyUrl(previewAsset)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {copiedId === previewAsset.id ? <Check className="w-3.5 h-3.5 text-[#166534]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === previewAsset.id ? 'Copied!' : 'Copy Asset URL'}</span>
                </button>

                <button
                  onClick={() => setPreviewAsset(null)}
                  className="px-4 py-1.5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
