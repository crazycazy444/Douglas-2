"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<"image" | "video">("image");
  const [duration, setDuration] = useState(5);
  const [resolution, setResolution] = useState("1080p");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ url: string; type: "image" | "video"; resolution: string } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type, duration, resolution }),
      });
      if (!response.ok) throw new Error("Failed to generate");
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Generation failed", error);
      alert("Something went wrong during generation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 p-4 sm:p-8 dark:bg-zinc-950 dark:text-zinc-50 font-sans">
      <header className="mb-8 text-center sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">AI HD Generator</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Create high-quality images and videos from text</p>
      </header>

      <main className="w-full max-w-2xl space-y-6 sm:space-y-8 rounded-2xl bg-white p-6 sm:p-8 shadow-md dark:bg-zinc-900">
        <div className="space-y-2">
          <label htmlFor="prompt" className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Prompt</label>
          <textarea
            id="prompt"
            placeholder="Describe what you want to generate in detail..."
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 transition-all min-h-[120px]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Resource Type</label>
            <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
              <button
                type="button"
                onClick={() => setType("image")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  type === "image" 
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-700 dark:text-indigo-400" 
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                Image (HD)
              </button>
              <button
                type="button"
                onClick={() => setType("video")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  type === "video" 
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-700 dark:text-indigo-400" 
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                Video (HD)
              </button>
            </div>
          </div>

          <div className={`space-y-2 transition-opacity duration-300 ${type === "video" ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
            <label htmlFor="duration" className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Duration: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{duration}s</span>
            </label>
            <input
              id="duration"
              type="range"
              min={1}
              max={30}
              disabled={type === "image"}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 dark:bg-zinc-700 accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>1s</span>
              <span>15s</span>
              <span>30s</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="resolution" className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Resolution</label>
            <select
              id="resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <option value="720p">720p (HD)</option>
              <option value="1080p">1080p (Full HD)</option>
              <option value="1440p">1440p (2K)</option>
              <option value="4k">4K (Ultra HD)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt || isGenerating}
          className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating HD {type.toUpperCase()}...
            </span>
          ) : `Generate ${type === 'image' ? 'HD Image' : 'HD Video'}`}
        </button>

        {result && (
          <div className="mt-10 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Generated {type.toUpperCase()}</h3>
              <a 
                href={result.url} 
                download={`generated-${type}.png`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Download {result.resolution.toUpperCase()}
              </a>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 shadow-inner">
              {result.type === "image" ? (
                <img 
                  src={result.url} 
                  alt={prompt} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              ) : (
                <video 
                  src={result.url} 
                  controls 
                  className="w-full h-auto" 
                  autoPlay 
                  loop 
                  muted
                />
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 text-zinc-500 text-sm">
        <p>&copy; 2025 AI HD Generator. Powered by Advanced AI Models.</p>
      </footer>
    </div>
  );
}
