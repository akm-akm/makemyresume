"use client";

import { useEffect, useState, useRef } from "react";

type StatsData = {
  views: number;
  downloads: number;
};

export default function SiteStats() {
  const [stats, setStats] = useState<StatsData>({ views: 0, downloads: 0 });
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const goatCounterCode = "makemyresume";
        
        // Try to fetch from GoatCounter API
        // Note: This requires "Allow adding visitor counts on your website" to be enabled in GoatCounter settings
        try {
          const viewsRes = await fetch(
            `https://${goatCounterCode}.goatcounter.com/counter/TOTAL.json`,
            { mode: 'cors' }
          );
          
          const downloadsRes = await fetch(
            `https://${goatCounterCode}.goatcounter.com/counter/click/download-pdf.json`,
            { mode: 'cors' }
          );

          if (viewsRes.ok) {
            const viewsData = await viewsRes.json();
            setStats(prev => ({ ...prev, views: viewsData.count || 0 }));
          }
          
          if (downloadsRes.ok) {
            const downloadsData = await downloadsRes.json();
            setStats(prev => ({ ...prev, downloads: downloadsData.count || 0 }));
          }
        } catch (apiError) {
          // API might not be accessible, try using GoatCounter's visit_count function
          if (typeof window !== 'undefined' && window.goatcounter) {
            // GoatCounter's visit_count can be accessed but doesn't return a value directly
            // We'll keep using 0 as fallback
          }
        }
      } catch {
        // Silently fail - show 0
      } finally {
        setLoading(false);
      }
    };

    // Wait a bit for GoatCounter to load
    const timer = setTimeout(fetchStats, 2000);
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Use 0 as fallback for display
  const views = stats.views || 0;
  const downloads = stats.downloads || 0;

  return (
    <div ref={containerRef} className="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-200 shadow-lg text-sm">
      {loading ? (
        <div className="animate-pulse flex gap-4">
          <div className="h-5 w-12 bg-slate-200 rounded"></div>
          <div className="h-5 w-12 bg-slate-200 rounded"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">👁</span>
            <span className="font-semibold text-slate-700">{views.toLocaleString()}</span>
          </div>
          <div className="w-px h-4 bg-slate-200"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">⬇</span>
            <span className="font-semibold text-slate-700">{downloads.toLocaleString()}</span>
          </div>
        </>
      )}
    </div>
  );
}
