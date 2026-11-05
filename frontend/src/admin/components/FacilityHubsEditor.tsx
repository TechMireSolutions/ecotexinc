'use client';

import React, { useState } from 'react';
import { 
  Factory, 
  MapPin, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Eye, 
  RotateCcw, 
  Check, 
  Sparkles,
  Layers,
  Award,
  Truck
} from 'lucide-react';
import { FacilityHub, FacilitiesConfig } from '../../types';
import { ImageUploader } from './ImageUploader';

interface FacilityHubsEditorProps {
  facilitiesConfig?: FacilitiesConfig;
  facilityAddress?: string;
  plantAddress?: string;
  onChange: (updatedConfig: FacilitiesConfig, extraUpdates?: { facilityAddress?: string; plantAddress?: string }) => void;
}

export const DEFAULT_HUBS: FacilityHub[] = [
  {
    name: 'Corona Distribution & Testing Hub',
    tag: 'US Headquarters & Fulfillment',
    address: '1200 Industrial Parkway, Corona, CA 92881',
    capabilities: ['Same-Day Pallet Dispatch', 'ASTM Tensile Testing Lab', 'Custom Sample Prototyping'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=1200+Industrial+Parkway,+Corona,+CA+92881'
  },
  {
    name: 'Primary Manufacturing Plant',
    tag: 'Heavy Industrial Production',
    address: 'Sector 15, Korangi Industrial Area, Karachi, PK',
    capabilities: ['Automated Ultrasonic Welding', '8-Color Flexographic Printing', 'Virgin PP & Bio-PLA Extrusion'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=Korangi+Industrial+Area+Karachi'
  }
];

export const FacilityHubsEditor: React.FC<FacilityHubsEditorProps> = ({
  facilitiesConfig,
  facilityAddress,
  plantAddress,
  onChange
}) => {
  const currentConfig: FacilitiesConfig = {
    title: facilitiesConfig?.title || 'Manufacturing Facilities & Fulfillment Hubs',
    subtitle: facilitiesConfig?.subtitle || 'Dual-continental operations combining California wholesale fulfillment with high-speed automated manufacturing mills.',
    storySnippet: facilitiesConfig?.storySnippet || 'From automated ultrasonic welding to high-definition 8-color flexographic printing, our facilities are engineered for maximum circularity and zero-landfill compliance.',
    annualCapacity: facilitiesConfig?.annualCapacity || '50,000,000+ Units / Year',
    certificationsMetric: facilitiesConfig?.certificationsMetric || 'ISO 9001:2015 & ASTM D6400',
    activeLinesMetric: facilitiesConfig?.activeLinesMetric || '14 High-Speed Extrusion Lines',
    showOnHomepage: facilitiesConfig?.showOnHomepage !== false,
    bannerImage: facilitiesConfig?.bannerImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=85',
    hubs: (facilitiesConfig?.hubs && facilitiesConfig.hubs.length > 0)
      ? facilitiesConfig.hubs
      : DEFAULT_HUBS
  };

  const hubs = currentConfig.hubs;
  const [activeHubIndex, setActiveHubIndex] = useState<number>(0);
  const [newCapInput, setNewCapInput] = useState<string>('');

  const handleUpdateHub = (index: number, updates: Partial<FacilityHub>) => {
    const updatedHubs = hubs.map((h, i) => i === index ? { ...h, ...updates } : h);
    const updatedConfig: FacilitiesConfig = {
      ...currentConfig,
      hubs: updatedHubs
    };

    const extra: { facilityAddress?: string; plantAddress?: string } = {};
    if (index === 0 && updates.address !== undefined) {
      extra.facilityAddress = updates.address;
    } else if (index === 1 && updates.address !== undefined) {
      extra.plantAddress = updates.address;
    }

    onChange(updatedConfig, extra);
  };

  const handleAddCapability = (hubIndex: number) => {
    const trimmed = newCapInput.trim();
    if (!trimmed) return;
    const targetHub = hubs[hubIndex];
    if (!targetHub) return;
    const currentCaps = targetHub.capabilities || [];
    if (!currentCaps.includes(trimmed)) {
      handleUpdateHub(hubIndex, {
        capabilities: [...currentCaps, trimmed]
      });
    }
    setNewCapInput('');
  };

  const handleRemoveCapability = (hubIndex: number, capIndex: number) => {
    const targetHub = hubs[hubIndex];
    if (!targetHub) return;
    const updatedCaps = (targetHub.capabilities || []).filter((_, i) => i !== capIndex);
    handleUpdateHub(hubIndex, {
      capabilities: updatedCaps
    });
  };

  const handleResetHub = (index: number) => {
    const defaultHub = DEFAULT_HUBS[index] || DEFAULT_HUBS[0];
    handleUpdateHub(index, { ...defaultHub });
  };

  const PRESET_CAPABILITIES = [
    'Same-Day Pallet Dispatch',
    'ASTM Tensile Testing Lab',
    'Custom Sample Prototyping',
    'Automated Ultrasonic Welding',
    '8-Color Flexographic Printing',
    'Virgin PP & Bio-PLA Extrusion',
    'California SB 270 Compliance Lab',
    'Cleanroom Reclosable Packaging',
    'High-Speed Gusset Formation'
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Info Banner with Quick Toggle */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-green-50/70 border-2 border-[#166534]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#166534] text-white flex items-center justify-center shadow-md shadow-[#166534]/20 shrink-0">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
              <span>Homepage Facility Cards Editor</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#dcfce7] text-[#166534] border border-emerald-300">
                2 Dual Hubs
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Change the background photos, titles, badges, street addresses, capabilities, and Google Maps links for both facility cards displayed on the storefront.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={currentConfig.showOnHomepage !== false}
              onChange={(e) => onChange({ ...currentConfig, showOnHomepage: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#166534]"></div>
            <span className="ml-2 text-xs font-bold text-slate-700">
              {currentConfig.showOnHomepage !== false ? 'Shown on Homepage' : 'Section Hidden'}
            </span>
          </label>
        </div>
      </div>

      {/* Hub Tabs Selection (Hub 1 vs Hub 2) */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
        {hubs.map((hub, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setActiveHubIndex(idx);
              setNewCapInput('');
            }}
            className={`flex-1 min-w-[200px] flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeHubIndex === idx
                ? 'bg-white text-slate-900 shadow-md border border-slate-200/90 scale-100 ring-2 ring-[#166534]/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                activeHubIndex === idx ? 'bg-[#166534] text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {idx + 1}
              </span>
              <div className="text-left truncate">
                <span className="block truncate font-black text-xs text-slate-900">{hub.name || `Hub #${idx + 1}`}</span>
                <span className="block truncate text-[10px] text-slate-400 font-semibold uppercase">{hub.tag || 'Facility'}</span>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold text-[#166534] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
              {(hub.capabilities || []).length} Tags
            </span>
          </button>
        ))}
      </div>

      {/* Active Hub Editor Panel */}
      {hubs[activeHubIndex] && (() => {
        const hub = hubs[activeHubIndex];
        const idx = activeHubIndex;

        return (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#B2E2C5]/50 shadow-xs space-y-6 animate-fadeIn">
            
            {/* Header with Reset button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-100/80 text-[#166534] font-black text-xs font-mono">
                  HUB {idx + 1} OF {hubs.length}
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase">
                    {idx === 0 ? 'Hub #1: US Distribution & Fulfillment Center' : 'Hub #2: Heavy Industrial Mill Plant'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {idx === 0 ? 'Corona, CA wholesale distribution hub card' : 'Overseas production mill card'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleResetHub(idx)}
                className="text-xs text-slate-500 hover:text-red-600 font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                title="Reset this facility hub to default photos and text"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Factory Defaults</span>
              </button>
            </div>

            {/* 2-Column Layout: Form Inputs on Left + Live Card Preview on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* 1. Facility Background Photo Upload */}
                <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#166534]" />
                      Facility Background Picture *
                    </span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100/90 font-bold px-2 py-0.5 rounded-full">
                      Up to 50MB (Auto-Compressed)
                    </span>
                  </div>

                  <ImageUploader
                    label={`Hub #${idx + 1} Card Photo`}
                    description="Upload photo directly from your PC (JPG, PNG, WebP) or enter an image URL. Automatically compresses large MB files to fast-loading KBs."
                    value={hub.image || ''}
                    onChange={(url) => handleUpdateHub(idx, { image: url })}
                    aspectRatio="wide"
                    placeholderText="Click Browse or Drag Photo Here (Warehouse / Plant exterior or interior)"
                  />
                </div>

                {/* 2. Badge & Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Card Header Badge / Tag *
                    </label>
                    <input
                      type="text"
                      value={hub.tag || ''}
                      onChange={(e) => handleUpdateHub(idx, { tag: e.target.value })}
                      placeholder={idx === 0 ? 'US HEADQUARTERS & FULFILLMENT' : 'HEAVY INDUSTRIAL PRODUCTION'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#166534]"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Photo ke upar floating pill badge text.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Facility Hub Title / Name *
                    </label>
                    <input
                      type="text"
                      value={hub.name || ''}
                      onChange={(e) => handleUpdateHub(idx, { name: e.target.value })}
                      placeholder={idx === 0 ? 'Corona Distribution & Testing Hub' : 'Primary Manufacturing Plant'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#166534]"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Card ka main heading title.</p>
                  </div>
                </div>

                {/* 3. Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#166534]" />
                      Facility Physical Address *
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Location Pin</span>
                  </label>
                  <input
                    type="text"
                    value={hub.address || ''}
                    onChange={(e) => handleUpdateHub(idx, { address: e.target.value })}
                    placeholder={idx === 0 ? '1200 Industrial Parkway, Corona, CA 92881' : 'Sector 15, Korangi Industrial Area, Karachi, PK'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-[#166534]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Address update hone par site settings ke main addresses se bhi sync ho jata hai.</p>
                </div>

                {/* 4. Google Maps & Directions Link */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Google Maps & Directions URL</span>
                    {hub.googleMapsUrl && (
                      <a
                        href={hub.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-[#166534] hover:underline flex items-center gap-1"
                      >
                        <span>Open & Test Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </label>
                  <input
                    type="text"
                    value={hub.googleMapsUrl || ''}
                    onChange={(e) => handleUpdateHub(idx, { googleMapsUrl: e.target.value })}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-[#166534]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">"Open Map & Directions" link par click karne par yeh URL open hoga.</p>
                </div>

                {/* 5. Key Facility Capabilities Pills */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                      Key Facility Capabilities (Tags / Badges)
                    </label>
                    <span className="text-[10px] text-slate-500 font-bold">
                      {(hub.capabilities || []).length} active tags
                    </span>
                  </div>

                  {/* Current Active Pills */}
                  <div className="flex flex-wrap gap-2 min-h-[36px] p-2.5 bg-white rounded-xl border border-slate-200">
                    {(hub.capabilities && hub.capabilities.length > 0) ? (
                      hub.capabilities.map((cap, cIdx) => (
                        <span
                          key={cIdx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 group"
                        >
                          <span>{cap}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCapability(idx, cIdx)}
                            className="w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Remove tag"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No capabilities added yet. Type below or pick presets.</span>
                    )}
                  </div>

                  {/* Add New Custom Tag Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCapInput}
                      onChange={(e) => setNewCapInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCapability(idx);
                        }
                      }}
                      placeholder="Type custom capability (e.g. ASTM Tensile Testing Lab) and press Add..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-[#166534]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCapability(idx)}
                      disabled={!newCapInput.trim()}
                      className="px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#15803d] text-white text-xs font-bold cursor-pointer transition-all disabled:opacity-40 shrink-0 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Preset Suggestions */}
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Quick Suggestions (Click to Add):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_CAPABILITIES.filter(p => !(hub.capabilities || []).includes(p)).map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            handleUpdateHub(idx, {
                              capabilities: [...(hub.capabilities || []), preset]
                            });
                          }}
                          className="px-2 py-1 rounded-md text-[11px] font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#166534] border border-slate-200 hover:border-emerald-300 cursor-pointer transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3 text-[#166534]" />
                          <span>{preset}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Exact Live Storefront Card Preview (5 cols) */}
              <div className="lg:col-span-5 sticky top-24 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-[#166534] flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    Live Storefront Preview
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Exact Visitor View</span>
                </div>

                {/* Replica of HomepageAboutFacilitiesSection Card */}
                <div className="group rounded-3xl overflow-hidden border-2 border-emerald-400/50 bg-white shadow-xl transition-all duration-300 flex flex-col">
                  
                  {/* Photo Header */}
                  <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-slate-900">
                    <img
                      src={hub.image || (idx === 0 ? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80' : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80')}
                      alt={hub.name || 'Facility'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-slate-900 backdrop-blur-md shadow-xs border border-white/60">
                      {hub.tag || (idx === 0 ? 'US HEADQUARTERS & FULFILLMENT' : 'HEAVY INDUSTRIAL PRODUCTION')}
                    </span>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-black text-white leading-tight">
                        {hub.name || 'Facility Hub Name'}
                      </h3>
                    </div>
                  </div>

                  {/* Hub Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                      <MapPin className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                      <span>{hub.address || 'Facility Address here'}</span>
                    </div>

                    {hub.capabilities && hub.capabilities.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                          Key Facility Capabilities
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {hub.capabilities.map((cap, cIdx) => (
                            <span 
                              key={cIdx}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#166534] uppercase tracking-wider">
                        <span>Open Map & Directions</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">Storefront Card</span>
                    </div>
                  </div>

                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#166534] shrink-0" />
                  <span>Koi bhi changes karte hi Save All Changes par click karein taake live site update ho jaye.</span>
                </div>
              </div>

            </div>

          </div>
        );
      })()}

      {/* Section Global Headlines & 3 Stat Highlights (Optional Customization) */}
      <div className="bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200 space-y-4">
        <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider">
          Facilities Section Header & Stat Metrics (Optional)
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Section Main Title
            </label>
            <input
              type="text"
              value={currentConfig.title}
              onChange={(e) => onChange({ ...currentConfig, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Section Subtitle
            </label>
            <input
              type="text"
              value={currentConfig.subtitle}
              onChange={(e) => onChange({ ...currentConfig, subtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Metric 1: Annual Capacity
            </label>
            <input
              type="text"
              value={currentConfig.annualCapacity}
              onChange={(e) => onChange({ ...currentConfig, annualCapacity: e.target.value })}
              placeholder="50,000,000+ Units Produced Annually"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Metric 2: Certifications
            </label>
            <input
              type="text"
              value={currentConfig.certificationsMetric}
              onChange={(e) => onChange({ ...currentConfig, certificationsMetric: e.target.value })}
              placeholder="ISO 9001 & ASTM"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 bg-white"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
