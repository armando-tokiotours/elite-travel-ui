'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_SITE_CONFIG, loadSiteConfig, saveSiteConfig, type SiteConfig } from '@/lib/adminConfig';

export default function AdminDashboard() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'navigation' | 'scrolls' | 'portals' | 'cards' | 'team' | 'matrix' | 'themes' | 'about'>('navigation');

  useEffect(() => {
    setConfig(loadSiteConfig());
  }, []);

  const handleSave = () => {
    saveSiteConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateNavigation = (index: number, field: string, value: string) => {
    const updated = [...config.navigation];
    const nav = updated[index] as any;
    nav[field] = value;
    setConfig({ ...config, navigation: updated });
  };

  const updateScroll = (scroll: 'america' | 'asia' | 'europe', field: string, value: string) => {
    const updated = config.heroScrolls[scroll] as any;
    updated[field] = value;
    setConfig({
      ...config,
      heroScrolls: { ...config.heroScrolls, [scroll]: updated }
    });
  };

  const updateCard = (index: number, field: string, value: string | File) => {
    const updated = [...config.experienceCards];
    const card = updated[index] as any;

    if (field === 'image' && value instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        card.image = e.target?.result as string;
        setConfig({ ...config, experienceCards: updated });
      };
      reader.readAsDataURL(value);
    } else {
      card[field] = value;
      setConfig({ ...config, experienceCards: updated });
    }
  };

  const updateAbout = (field: string, value: string) => {
    setConfig({
      ...config,
      aboutUs: { ...config.aboutUs, [field]: value }
    });
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F] text-[#E5E5E5] py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-[#F9C56C] mb-2">Master Configuration Hub</h1>
          <p className="text-[#E5E5E5]/70">Edit all site content without touching code</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[#755F42]/30 overflow-x-auto pb-2">
          {(['navigation', 'scrolls', 'portals', 'cards', 'team', 'matrix', 'themes', 'about'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-serif uppercase tracking-widest transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'text-[#F9C56C] border-b-2 border-[#F9C56C]'
                  : 'text-[#E5E5E5]/60 hover:text-[#E5E5E5]'
              }`}
            >
              {tab === 'navigation' && 'Navigation'}
              {tab === 'scrolls' && 'Hero Scrolls'}
              {tab === 'portals' && 'Brand Portals'}
              {tab === 'cards' && 'Experience Cards'}
              {tab === 'team' && 'Team'}
              {tab === 'matrix' && 'House Matrix'}
              {tab === 'themes' && 'Themes'}
              {tab === 'about' && 'About'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">

          {/* Navigation Tab */}
          {activeTab === 'navigation' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-[#F9C56C] mb-6">Edit Navigation Menu</h2>
              {config.navigation.map((item, idx) => (
                <div key={item.id} className="bg-[#0D0D0D] border border-[#755F42]/30 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={item.label}
                      onChange={e => updateNavigation(idx, 'label', e.target.value)}
                      placeholder="Label"
                      className="bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] placeholder-[#E5E5E5]/40"
                    />
                    <input
                      type="text"
                      value={item.url}
                      onChange={e => updateNavigation(idx, 'url', e.target.value)}
                      placeholder="URL"
                      className="bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] placeholder-[#E5E5E5]/40"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hero Scrolls Tab */}
          {activeTab === 'scrolls' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-[#F9C56C] mb-6">Edit Shoji Scroll Destinations</h2>
              {(['america', 'asia', 'europe'] as const).map(scroll => (
                <div key={scroll} className="bg-[#0D0D0D] border border-[#755F42]/30 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-serif text-[#F9C56C] capitalize">{scroll}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={config.heroScrolls[scroll].title}
                      onChange={e => updateScroll(scroll, 'title', e.target.value)}
                      placeholder="Title"
                      className="bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] placeholder-[#E5E5E5]/40"
                    />
                    <input
                      type="text"
                      value={config.heroScrolls[scroll].url}
                      onChange={e => updateScroll(scroll, 'url', e.target.value)}
                      placeholder="URL"
                      className="bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] placeholder-[#E5E5E5]/40"
                    />
                    <input
                      type="text"
                      value={config.heroScrolls[scroll].image}
                      onChange={e => updateScroll(scroll, 'image', e.target.value)}
                      placeholder="Image Path"
                      className="bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] placeholder-[#E5E5E5]/40"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Brand Portals Tab */}
          {activeTab === 'portals' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-[#F9C56C] mb-6">Edit Brand Portal URLs</h2>
              <div className="bg-[#0D0D0D] border border-[#755F42]/30 rounded-lg p-6 space-y-4">
                <input
                  type="text"
                  value={config.houseMatrix.sectionTitle}
                  onChange={e => setConfig({ ...config, houseMatrix: { ...config.houseMatrix, sectionTitle: e.target.value } })}
                  placeholder="Section Title"
                  className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] placeholder-[#E5E5E5]/40"
                />
                <input
                  type="text"
                  value={config.houseMatrix.tokiotoursUrl}
                  onChange={e => setConfig({ ...config, houseMatrix: { ...config.houseMatrix, tokiotoursUrl: e.target.value } })}
                  placeholder="Tokiotours URL"
                  className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] placeholder-[#E5E5E5]/40"
                />
                <input
                  type="text"
                  value={config.houseMatrix.eliteTravelUrl}
                  onChange={e => setConfig({ ...config, houseMatrix: { ...config.houseMatrix, eliteTravelUrl: e.target.value } })}
                  placeholder="Elite Travel URL"
                  className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] placeholder-[#E5E5E5]/40"
                />
              </div>
            </div>
          )}

          {/* Experience Cards Tab */}
          {activeTab === 'cards' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-[#F9C56C] mb-6">Edit Experience Cards</h2>
              {config.experienceCards.map((card, idx) => (
                <div key={card.id} className="bg-[#0D0D0D] border border-[#755F42]/30 rounded-lg p-6 space-y-4">
                  {/* Image Preview and Upload */}
                  <div className="space-y-2">
                    {card.image && (
                      <div className="w-full h-32 rounded overflow-hidden border border-[#755F42]/30">
                        <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="block px-4 py-2 bg-[#F9C56C] text-[#1F1F1F] rounded cursor-pointer text-sm font-serif uppercase text-center hover:bg-[#E5C050] transition">
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) updateCard(idx, 'image', file);
                        }}
                      />
                    </label>
                  </div>

                  {/* Text Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={card.title}
                      onChange={e => updateCard(idx, 'title', e.target.value)}
                      placeholder="Title"
                      className="bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] placeholder-[#E5E5E5]/40"
                    />
                    <input
                      type="text"
                      value={card.url}
                      onChange={e => updateCard(idx, 'url', e.target.value)}
                      placeholder="URL"
                      className="bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] placeholder-[#E5E5E5]/40"
                    />
                  </div>
                  <textarea
                    value={card.description}
                    onChange={e => updateCard(idx, 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] placeholder-[#E5E5E5]/40 h-20"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-[#F9C56C] mb-6">— OUR CONCIERGE TEAM —</h2>
              <p className="text-[#E5E5E5]/70 mb-6">Add team member information, photos, and bios</p>

              <div className="bg-[#0D0D0D] border border-[#755F42]/30 rounded-lg p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-serif text-[#F9C56C] mb-2">Team Member 1</label>
                    <div className="space-y-2">
                      <input type="text" placeholder="Name" className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5]" />
                      <input type="text" placeholder="Role" className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5]" />
                      <textarea placeholder="Bio" className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] h-16" />
                      <label className="block px-4 py-2 bg-[#F9C56C] text-[#1F1F1F] rounded cursor-pointer text-sm font-serif text-center hover:bg-[#E5C050]">
                        Upload Photo
                        <input type="file" accept="image/*" className="hidden" />
                      </label>
                    </div>
                  </div>
                  <div className="border-t border-[#755F42]/30 pt-4">
                    <label className="block text-sm font-serif text-[#F9C56C] mb-2">Team Member 2</label>
                    <div className="space-y-2">
                      <input type="text" placeholder="Name" className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5]" />
                      <input type="text" placeholder="Role" className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5]" />
                      <textarea placeholder="Bio" className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] h-16" />
                      <label className="block px-4 py-2 bg-[#F9C56C] text-[#1F1F1F] rounded cursor-pointer text-sm font-serif text-center hover:bg-[#E5C050]">
                        Upload Photo
                        <input type="file" accept="image/*" className="hidden" />
                      </label>
                    </div>
                  </div>
                  <div className="border-t border-[#755F42]/30 pt-4">
                    <label className="block text-sm font-serif text-[#F9C56C] mb-2">Team Member 3</label>
                    <div className="space-y-2">
                      <input type="text" placeholder="Name" className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5]" />
                      <input type="text" placeholder="Role" className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5]" />
                      <textarea placeholder="Bio" className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] h-16" />
                      <label className="block px-4 py-2 bg-[#F9C56C] text-[#1F1F1F] rounded cursor-pointer text-sm font-serif text-center hover:bg-[#E5C050]">
                        Upload Photo
                        <input type="file" accept="image/*" className="hidden" />
                      </label>
                    </div>
                  </div>
                  <div className="border-t border-[#755F42]/30 pt-4">
                    <label className="block text-sm font-serif text-[#F9C56C] mb-2">Team Member 4</label>
                    <div className="space-y-2">
                      <input type="text" placeholder="Name" className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5]" />
                      <input type="text" placeholder="Role" className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5]" />
                      <textarea placeholder="Bio" className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] h-16" />
                      <label className="block px-4 py-2 bg-[#F9C56C] text-[#1F1F1F] rounded cursor-pointer text-sm font-serif text-center hover:bg-[#E5C050]">
                        Upload Photo
                        <input type="file" accept="image/*" className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* House Matrix Tab */}
          {activeTab === 'matrix' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-[#F9C56C] mb-6">— THE HOUSE MATRIX —</h2>
              <div className="bg-[#0D0D0D] border border-[#755F42]/30 rounded-lg p-6 space-y-6">
                <div>
                  <label className="block text-sm font-serif text-[#F9C56C] mb-2">Section Title</label>
                  <input
                    type="text"
                    value={config.houseMatrix.sectionTitle}
                    onChange={e => setConfig({ ...config, houseMatrix: { ...config.houseMatrix, sectionTitle: e.target.value } })}
                    placeholder="Two Portals, One Standard of Luxury"
                    className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5]"
                  />
                </div>

                <div className="border-t border-[#755F42]/30 pt-4">
                  <label className="block text-sm font-serif text-[#F9C56C] mb-2">Tokiotours Portal</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={config.houseMatrix.tokiotoursUrl}
                      onChange={e => setConfig({ ...config, houseMatrix: { ...config.houseMatrix, tokiotoursUrl: e.target.value } })}
                      placeholder="Portal URL"
                      className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5]"
                    />
                  </div>
                </div>

                <div className="border-t border-[#755F42]/30 pt-4">
                  <label className="block text-sm font-serif text-[#F9C56C] mb-2">Elite Travel Portal</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={config.houseMatrix.eliteTravelUrl}
                      onChange={e => setConfig({ ...config, houseMatrix: { ...config.houseMatrix, eliteTravelUrl: e.target.value } })}
                      placeholder="Portal URL"
                      className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Themes Tab */}
          {activeTab === 'themes' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-[#F9C56C] mb-6">Color Themes & Font Sizes</h2>
              <div className="bg-[#0D0D0D] border border-[#755F42]/30 rounded-lg p-6 space-y-6">
                <div>
                  <label className="block text-sm font-serif text-[#F9C56C] mb-4">Primary Colors</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#E5E5E5]/60 mb-1 block">Dark Background</label>
                      <input type="color" defaultValue="#1F1F1F" className="w-full h-10 rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="text-xs text-[#E5E5E5]/60 mb-1 block">Gold Accent</label>
                      <input type="color" defaultValue="#F9C56C" className="w-full h-10 rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="text-xs text-[#E5E5E5]/60 mb-1 block">Warm Brown</label>
                      <input type="color" defaultValue="#755F42" className="w-full h-10 rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="text-xs text-[#E5E5E5]/60 mb-1 block">Off-White</label>
                      <input type="color" defaultValue="#E5E5E5" className="w-full h-10 rounded cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#755F42]/30 pt-4">
                  <label className="block text-sm font-serif text-[#F9C56C] mb-4">Font Sizes</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#E5E5E5]/60 mb-1 block">Heading Font Size</label>
                      <input type="text" placeholder="2xl, 3xl, 4xl" className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-3 py-2 text-[#E5E5E5] text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-[#E5E5E5]/60 mb-1 block">Body Font Size</label>
                      <input type="text" placeholder="sm, base, lg" className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-3 py-2 text-[#E5E5E5] text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-[#E5E5E5]/60 mb-1 block">Tab Font Size</label>
                      <input type="text" placeholder="xs, sm, base" className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-3 py-2 text-[#E5E5E5] text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-[#E5E5E5]/60 mb-1 block">Button Font Size</label>
                      <input type="text" placeholder="sm, base, lg" className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-3 py-2 text-[#E5E5E5] text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About Section Tab */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-[#F9C56C] mb-6">Edit About Section</h2>
              <div className="bg-[#0D0D0D] border border-[#755F42]/30 rounded-lg p-6 space-y-4">
                <input
                  type="text"
                  value={config.aboutUs.badge}
                  onChange={e => updateAbout('badge', e.target.value)}
                  placeholder="Badge Text"
                  className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] placeholder-[#E5E5E5]/40"
                />
                <input
                  type="text"
                  value={config.aboutUs.headline}
                  onChange={e => updateAbout('headline', e.target.value)}
                  placeholder="Headline"
                  className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] placeholder-[#E5E5E5]/40"
                />
                <textarea
                  value={config.aboutUs.bodyText}
                  onChange={e => updateAbout('bodyText', e.target.value)}
                  placeholder="Body Text"
                  className="w-full bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] placeholder-[#E5E5E5]/40 h-32"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={config.aboutUs.ctaLabel}
                    onChange={e => updateAbout('ctaLabel', e.target.value)}
                    placeholder="CTA Label"
                    className="bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] placeholder-[#E5E5E5]/40"
                  />
                  <input
                    type="text"
                    value={config.aboutUs.ctaUrl}
                    onChange={e => updateAbout('ctaUrl', e.target.value)}
                    placeholder="CTA URL"
                    className="bg-[#1A1A1A] border border-[#755F42]/40 rounded px-4 py-2 text-[#E5E5E5] placeholder-[#E5E5E5]/40"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-12 flex gap-4">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-[#F9C56C] text-[#1F1F1F] font-serif uppercase tracking-widest rounded-lg hover:bg-[#E5C050] transition-colors"
          >
            Save Configuration
          </button>
          {saved && (
            <div className="px-8 py-3 bg-green-900/30 text-green-300 font-serif uppercase tracking-widest rounded-lg flex items-center">
              ✓ Configuration Saved
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
