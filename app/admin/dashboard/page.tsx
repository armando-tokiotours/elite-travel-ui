"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadConfig, saveConfig, type SiteConfig } from "@/lib/config";

export default function AdminDashboard() {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [activeTab, setActiveTab] = useState<
    "hero" | "themes" | "typography" | "sections" | "destinations" | "images"
  >("hero");
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ fileName: string; location: string; publicPath: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin");
      return;
    }
    setConfig(loadConfig());
  }, [router]);

  if (!config) return <div className="text-white p-8">Loading...</div>;

  const handleSave = () => {
    saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleColorChange = (
    theme: "light" | "dark",
    key: keyof typeof config.themes.light,
    value: string
  ) => {
    setConfig({
      ...config,
      themes: {
        ...config.themes,
        [theme]: {
          ...config.themes[theme],
          [key]: value,
        },
      },
    });
  };

  const secondsToMMSS = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const mmssToSeconds = (mmss: string): number => {
    const parts = mmss.split(":");
    if (parts.length !== 2) return 0;
    const mins = parseInt(parts[0]) || 0;
    const secs = parseInt(parts[1]) || 0;
    return mins * 60 + secs;
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadStatus({
          fileName: data.fileName,
          location: data.location,
          publicPath: data.publicPath,
        });

        // Auto-update the video URL
        setConfig({
          ...config,
          sections: {
            ...config.sections,
            hero: {
              ...config.sections.hero,
              videoUrl: data.publicPath,
            },
          },
        });

        // Auto-save
        setTimeout(() => {
          saveConfig({
            ...config,
            sections: {
              ...config.sections,
              hero: {
                ...config.sections.hero,
                videoUrl: data.publicPath,
              },
            },
          });
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }, 500);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      alert("Upload error: " + error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Elite Travel — Admin Configuration</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/dashboard/experience-cards"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition"
          >
            🎨 Experience Cards
          </Link>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
          >
            ← Back to Website
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("admin-token");
              router.push("/admin");
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-800 px-6 py-4 overflow-x-auto">
        {(
          ["hero", "themes", "typography", "sections", "destinations", "images"] as const
        ).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize ${
              activeTab === tab
                ? "border-b-2 border-yellow-500 text-yellow-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Hero Tab */}
        {activeTab === "hero" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6">Hero Scrollytelling</h2>

            <div className="border border-slate-700 p-6 rounded">
              <h3 className="text-lg font-bold mb-4">Video Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Video URL or Upload Link</label>
                  <input
                    type="text"
                    value={config.sections.hero.videoUrl}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        sections: {
                          ...config.sections,
                          hero: {
                            ...config.sections.hero,
                            videoUrl: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="https://... or /videos/hero-1.mp4"
                    className="bg-slate-800 border border-slate-700 px-4 py-2 rounded w-full text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Current: {config.sections.hero.videoUrl}</p>
                </div>

                <div>
                  <label className="block text-sm mb-2 font-semibold">Upload Video</label>
                  <label className={`px-4 py-2 ${uploading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"} rounded cursor-pointer inline-block transition`}>
                    {uploading ? "Uploading..." : "Choose File"}
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoUpload}
                      disabled={uploading}
                    />
                  </label>

                  {uploadStatus && (
                    <div className="mt-3 p-3 bg-green-900 border border-green-700 rounded text-sm">
                      <p className="text-green-200 font-semibold">✓ Upload Successful!</p>
                      <p className="text-green-300 mt-1">File: <span className="font-mono">{uploadStatus.fileName}</span></p>
                      <p className="text-green-300">Location: <span className="font-mono">{uploadStatus.location}</span></p>
                      <p className="text-green-300">URL: <span className="font-mono text-xs">{uploadStatus.publicPath}</span></p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-600 flex gap-3">
                  <button
                    onClick={() => {
                      saveConfig(config);
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2000);
                    }}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded transition font-semibold"
                  >
                    ✓ Save Video Changes
                  </button>
                  <button
                    onClick={() => alert("Available videos:\n\n• /videos/hero-1.mp4\n• /videos/hero-2.mp4\n• /videos/hero-3.mp4\n\nOr upload custom videos via the 'Choose File' button above.")}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded transition"
                  >
                    🔍 Browse Saved Videos
                  </button>
                </div>

                {saved && <p className="text-green-400 text-sm">✓ Changes saved!</p>}
              </div>
            </div>

            <div className="border border-slate-700 p-6 rounded">
              <h3 className="text-lg font-bold mb-4">Video Configuration</h3>
              <p className="text-sm text-gray-400 mb-4">Set your video duration and how many frame sections to use (1-7)</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Video Duration (seconds): {config.sections.hero.videoDuration}</label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="1"
                    value={config.sections.hero.videoDuration}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        sections: {
                          ...config.sections,
                          hero: {
                            ...config.sections.hero,
                            videoDuration: parseInt(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Total length of your hero video</p>
                </div>

                <div>
                  <label className="block text-sm mb-2">Number of Frames: {config.sections.hero.numberOfFrames}</label>
                  <select
                    value={config.sections.hero.numberOfFrames}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        sections: {
                          ...config.sections,
                          hero: {
                            ...config.sections.hero,
                            numberOfFrames: parseInt(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-sm"
                  >
                    <option value="1">1 Frame</option>
                    <option value="2">2 Frames</option>
                    <option value="3">3 Frames</option>
                    <option value="4">4 Frames</option>
                    <option value="5">5 Frames</option>
                    <option value="6">6 Frames</option>
                    <option value="7">7 Frames (Full)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">How many sections are in your video?</p>
                </div>
              </div>
            </div>

            <div className="border border-slate-700 p-6 rounded">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Hero Title & Subtitle</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.sections.hero.titleSubtitleEnabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        sections: {
                          ...config.sections,
                          hero: {
                            ...config.sections.hero,
                            titleSubtitleEnabled: e.target.checked,
                          },
                        },
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Enabled</span>
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Title</label>
                  <input
                    type="text"
                    value={config.sections.hero.title}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        sections: {
                          ...config.sections,
                          hero: {
                            ...config.sections.hero,
                            title: e.target.value,
                          },
                        },
                      })
                    }
                    className="bg-slate-800 border border-slate-700 px-4 py-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={config.sections.hero.subtitle}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        sections: {
                          ...config.sections,
                          hero: {
                            ...config.sections.hero,
                            subtitle: e.target.value,
                          },
                        },
                      })
                    }
                    className="bg-slate-800 border border-slate-700 px-4 py-2 rounded w-full"
                  />
                </div>
              </div>
            </div>

            <div className="border border-slate-700 p-6 rounded">
              <h3 className="text-lg font-bold mb-4">Video Frames ({config.sections.hero.numberOfFrames} Active)</h3>
              <p className="text-sm text-gray-400 mb-6">Configure timing, position, effects, and text for each frame. Blur and fade effects are responsive across web and mobile.</p>

              <div className="space-y-6">
                {config.sections.hero.frames?.slice(0, config.sections.hero.numberOfFrames).map((frame, idx) => (
                  <div key={frame.id} className="bg-slate-900 p-5 rounded border border-slate-600">
                    <div className="text-sm font-semibold text-yellow-500 mb-4">Frame {idx + 1}</div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Title */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Title</label>
                        <input
                          type="text"
                          value={frame.title}
                          onChange={(e) => {
                            const updatedFrames = [...config.sections.hero.frames];
                            updatedFrames[idx] = { ...frame, title: e.target.value };
                            setConfig({
                              ...config,
                              sections: { ...config.sections, hero: { ...config.sections.hero, frames: updatedFrames } },
                            });
                          }}
                          className="w-full bg-slate-800 border border-slate-700 px-3 py-1 rounded text-sm"
                        />
                      </div>

                      {/* Text Position */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Text Position</label>
                        <select
                          value={frame.textPosition}
                          onChange={(e) => {
                            const updatedFrames = [...config.sections.hero.frames];
                            updatedFrames[idx] = { ...frame, textPosition: e.target.value as "left" | "right" | "center" | "top" };
                            setConfig({
                              ...config,
                              sections: { ...config.sections, hero: { ...config.sections.hero, frames: updatedFrames } },
                            });
                          }}
                          className="w-full bg-slate-800 border border-slate-700 px-3 py-1 rounded text-sm"
                        >
                          <option value="center">Center</option>
                          <option value="left">Left</option>
                          <option value="right">Right</option>
                          <option value="top">Top</option>
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label className="block text-xs text-gray-400 mb-1">Text/Description</label>
                      <textarea
                        value={frame.text}
                        onChange={(e) => {
                          const updatedFrames = [...config.sections.hero.frames];
                          updatedFrames[idx] = { ...frame, text: e.target.value };
                          setConfig({
                            ...config,
                            sections: { ...config.sections, hero: { ...config.sections.hero, frames: updatedFrames } },
                          });
                        }}
                        className="w-full bg-slate-800 border border-slate-700 px-3 py-1 rounded text-sm h-16"
                      />
                    </div>

                    {/* Timing Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-700">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Start Time (MM:SS)</label>
                        <input
                          type="text"
                          value={secondsToMMSS(frame.startSeconds)}
                          onChange={(e) => {
                            const seconds = mmssToSeconds(e.target.value);
                            const updatedFrames = [...config.sections.hero.frames];
                            updatedFrames[idx] = { ...frame, startSeconds: seconds };
                            setConfig({
                              ...config,
                              sections: { ...config.sections, hero: { ...config.sections.hero, frames: updatedFrames } },
                            });
                          }}
                          placeholder="00:00"
                          className="w-full bg-slate-800 border border-slate-700 px-3 py-1 rounded text-sm font-mono"
                        />
                        <p className="text-xs text-gray-500 mt-1">Format: MM:SS (e.g., 00:30)</p>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Duration (frames): {frame.durationFrames}</label>
                        <input
                          type="range"
                          min="2"
                          max="40"
                          step="1"
                          value={frame.durationFrames}
                          onChange={(e) => {
                            const updatedFrames = [...config.sections.hero.frames];
                            updatedFrames[idx] = { ...frame, durationFrames: parseInt(e.target.value) };
                            setConfig({
                              ...config,
                              sections: { ...config.sections, hero: { ...config.sections.hero, frames: updatedFrames } },
                            });
                          }}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max 40 frames to prevent overlap</p>
                      </div>
                    </div>

                    {/* Effects */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Blur Intensity: {frame.blurIntensity}</label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="1"
                          value={frame.blurIntensity}
                          onChange={(e) => {
                            const updatedFrames = [...config.sections.hero.frames];
                            updatedFrames[idx] = { ...frame, blurIntensity: parseInt(e.target.value) };
                            setConfig({
                              ...config,
                              sections: { ...config.sections, hero: { ...config.sections.hero, frames: updatedFrames } },
                            });
                          }}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">0 = no blur, 10 = max blur</p>
                      </div>

                      <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={frame.fadeEffect}
                            onChange={(e) => {
                              const updatedFrames = [...config.sections.hero.frames];
                              updatedFrames[idx] = { ...frame, fadeEffect: e.target.checked };
                              setConfig({
                                ...config,
                                sections: { ...config.sections, hero: { ...config.sections.hero, frames: updatedFrames } },
                              });
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-xs text-gray-400">Enable Fade Effect (in/out)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Color Themes Tab */}
        {activeTab === "themes" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6">Color Themes</h2>

            {(["light", "dark"] as const).map((theme) => (
              <div key={theme} className="border border-slate-700 p-6 rounded">
                <h3 className="text-xl font-bold mb-4 capitalize">{theme} Theme</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {(
                    ["primary", "secondary", "text", "background", "accent"] as const
                  ).map((colorKey) => (
                    <div key={colorKey}>
                      <label className="block text-sm mb-2 capitalize">
                        {colorKey}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.themes[theme][colorKey]}
                          onChange={(e) =>
                            handleColorChange(theme, colorKey, e.target.value)
                          }
                          className="w-16 h-10 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.themes[theme][colorKey]}
                          onChange={(e) =>
                            handleColorChange(theme, colorKey, e.target.value)
                          }
                          className="flex-1 bg-slate-800 border border-slate-700 px-3 py-2 rounded text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <label className="block text-sm mb-2">Active Theme</label>
              <select
                value={config.activeTheme}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    activeTheme: e.target.value as "light" | "dark",
                  })
                }
                className="bg-slate-800 border border-slate-700 px-4 py-2 rounded w-full"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        )}

        {/* Typography Tab */}
        {activeTab === "typography" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Typography Settings</h2>

            {(
              ["heroTitle", "sectionTitle", "bodyText"] as const
            ).map((typKey) => (
              <div
                key={typKey}
                className="border border-slate-700 p-6 rounded"
              >
                <h3 className="text-xl font-bold mb-4 capitalize">
                  {typKey.replace(/([A-Z])/g, " $1")}
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Size</label>
                    <input
                      type="text"
                      placeholder="e.g., 2xl, 3xl, 4xl"
                      value={config.typography[typKey].size}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          typography: {
                            ...config.typography,
                            [typKey]: {
                              ...config.typography[typKey],
                              size: e.target.value,
                            },
                          },
                        })
                      }
                      className="bg-slate-800 border border-slate-700 px-4 py-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Weight</label>
                    <select
                      value={config.typography[typKey].weight}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          typography: {
                            ...config.typography,
                            [typKey]: {
                              ...config.typography[typKey],
                              weight: e.target.value,
                            },
                          },
                        })
                      }
                      className="bg-slate-800 border border-slate-700 px-4 py-2 rounded w-full"
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                      <option value="700">Bold</option>
                      <option value="800">Extrabold</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sections Tab */}
        {activeTab === "sections" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Section Settings</h2>

            {Object.entries(config.sections).map(([sectionKey, section]) => (
              <div
                key={sectionKey}
                className="border border-slate-700 p-6 rounded"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold capitalize">{sectionKey}</h3>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          sections: {
                            ...config.sections,
                            [sectionKey]: {
                              ...section,
                              enabled: e.target.checked,
                            },
                          },
                        })
                      }
                    />
                    <span>Enabled</span>
                  </label>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">Title</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          sections: {
                            ...config.sections,
                            [sectionKey]: {
                              ...section,
                              title: e.target.value,
                            },
                          },
                        })
                      }
                      className="bg-slate-800 border border-slate-700 px-4 py-2 rounded w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={section.subtitle}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          sections: {
                            ...config.sections,
                            [sectionKey]: {
                              ...section,
                              subtitle: e.target.value,
                            },
                          },
                        })
                      }
                      className="bg-slate-800 border border-slate-700 px-4 py-2 rounded w-full text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Destinations Tab */}
        {activeTab === "destinations" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6">Destinations Management</h2>

            <div className="border border-slate-700 p-6 rounded">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">Section Settings</h3>
                  <p className="text-sm text-gray-400 mt-1">Enable/disable the destinations section</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.sections.destinations.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        sections: {
                          ...config.sections,
                          destinations: {
                            ...config.sections.destinations,
                            enabled: e.target.checked,
                          },
                        },
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Enabled</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Section Title</label>
                  <input
                    type="text"
                    value={config.sections.destinations.title}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        sections: {
                          ...config.sections,
                          destinations: {
                            ...config.sections.destinations,
                            title: e.target.value,
                          },
                        },
                      })
                    }
                    className="bg-slate-800 border border-slate-700 px-4 py-2 rounded w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Section Subtitle</label>
                  <input
                    type="text"
                    value={config.sections.destinations.subtitle}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        sections: {
                          ...config.sections,
                          destinations: {
                            ...config.sections.destinations,
                            subtitle: e.target.value,
                          },
                        },
                      })
                    }
                    className="bg-slate-800 border border-slate-700 px-4 py-2 rounded w-full text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold">Continents</h3>

              {config.sections.destinations.items.map((destination, idx) => (
                <div key={destination.id} className="border border-slate-700 p-6 rounded bg-slate-800 bg-opacity-30">
                  <div className="text-sm font-semibold text-yellow-500 mb-4">
                    {destination.title}
                  </div>

                  {/* Image Upload */}
                  <div className="mb-6 pb-6 border-b border-slate-700">
                    <label className="block text-sm mb-3 font-medium">Destination Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-slate-900 rounded border border-slate-600 flex items-center justify-center overflow-hidden">
                        {destination.image ? (
                          <img
                            src={destination.image}
                            alt={destination.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center text-gray-500 text-xs">No image</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer inline-block text-sm font-medium mb-2">
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const base64 = event.target?.result as string;
                                  const updatedItems = [...config.sections.destinations.items];
                                  updatedItems[idx] = {
                                    ...destination,
                                    image: base64,
                                  };
                                  setConfig({
                                    ...config,
                                    sections: {
                                      ...config.sections,
                                      destinations: {
                                        ...config.sections.destinations,
                                        items: updatedItems,
                                      },
                                    },
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        <p className="text-xs text-gray-400">
                          Images are stored as base64 in config
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Title</label>
                      <input
                        type="text"
                        value={destination.title}
                        onChange={(e) => {
                          const updatedItems = [...config.sections.destinations.items];
                          updatedItems[idx] = {
                            ...destination,
                            title: e.target.value,
                          };
                          setConfig({
                            ...config,
                            sections: {
                              ...config.sections,
                              destinations: {
                                ...config.sections.destinations,
                                items: updatedItems,
                              },
                            },
                          });
                        }}
                        className="bg-slate-800 border border-slate-700 px-4 py-2 rounded w-full text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Slug</label>
                      <input
                        type="text"
                        value={destination.slug}
                        onChange={(e) => {
                          const updatedItems = [...config.sections.destinations.items];
                          updatedItems[idx] = {
                            ...destination,
                            slug: e.target.value,
                          };
                          setConfig({
                            ...config,
                            sections: {
                              ...config.sections,
                              destinations: {
                                ...config.sections.destinations,
                                items: updatedItems,
                              },
                            },
                          });
                        }}
                        placeholder="e.g., asia, europe, americas"
                        className="bg-slate-800 border border-slate-700 px-4 py-2 rounded w-full text-sm"
                      />
                      <p className="text-xs text-gray-400 mt-1">Used for URLs and references</p>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Description</label>
                      <textarea
                        value={destination.description}
                        onChange={(e) => {
                          const updatedItems = [...config.sections.destinations.items];
                          updatedItems[idx] = {
                            ...destination,
                            description: e.target.value,
                          };
                          setConfig({
                            ...config,
                            sections: {
                              ...config.sections,
                              destinations: {
                                ...config.sections.destinations,
                                items: updatedItems,
                              },
                            },
                          });
                        }}
                        className="bg-slate-800 border border-slate-700 px-4 py-2 rounded w-full text-sm h-20"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === "images" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Image Management</h2>

            <div className="bg-blue-900 border border-blue-700 p-4 rounded text-sm">
              <p>
                📋 <strong>Note:</strong> Upload images to replace green
                placeholders. Currently, images are shown as green placeholders
                to indicate where you need to add photos.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border border-slate-700 p-4 rounded">
                <h4 className="font-bold mb-2">Destination Images</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Replace green placeholders for destination cards
                </p>
                <div className="space-y-2">
                  {config.sections.destinations.items.map((dest) => (
                    <div
                      key={dest.id}
                      className="flex items-center gap-4 p-2 bg-slate-800 rounded"
                    >
                      <span className="flex-1">{dest.title}</span>
                      <label className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded cursor-pointer text-sm">
                        Upload
                        <input type="file" accept="image/*" className="hidden" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-slate-700 p-4 rounded">
                <h4 className="font-bold mb-2">About Section Image</h4>
                <label className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded cursor-pointer inline-block">
                  Upload Image
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold transition flex items-center gap-2"
          >
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
