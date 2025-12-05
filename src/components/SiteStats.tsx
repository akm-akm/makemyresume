"use client";

import { useEffect, useState } from "react";

type StatsData = {
  views: number;
  downloads: number;
};

export default function SiteStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const goatCounterCode = "makemyresume";
        
        // Fetch total page views
        const viewsRes = await fetch(
          `https://${goatCounterCode}.goatcounter.com/counter/TOTAL.json`
        );
        
        // Fetch download count
        const downloadsRes = await fetch(
          `https://${goatCounterCode}.goatcounter.com/counter/click/download-pdf.json`
        );

        const viewsData = viewsRes.ok ? await viewsRes.json() : { count: 0 };
        const downloadsData = downloadsRes.ok ? await downloadsRes.json() : { count: 0 };

        setStats({
          views: viewsData.count || 0,
          downloads: downloadsData.count || 0,
        });
      } catch {
        // CORS error on localhost is expected, silently fail
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every 60 seconds
    const interval = setInterval(fetchStats, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show loading placeholder
  if (loading) {
    return (
      <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-200 shadow-lg">
        <div className="animate-pulse flex gap-4">
          <div className="h-5 w-12 bg-slate-200 rounded"></div>
          <div className="h-5 w-12 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Use 0 as fallback for display
  const views = stats?.views || 0;
  const downloads = stats?.downloads || 0;

  return (
    <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-200 shadow-lg text-sm">
      <div className="flex items-center gap-1.5">
        <span className="text-slate-500">👁</span>
        <span className="font-semibold text-slate-700">{views.toLocaleString()}</span>
      </div>
      <div className="w-px h-4 bg-slate-200"></div>
      <div className="flex items-center gap-1.5">
        <span className="text-slate-500">⬇</span>
        <span className="font-semibold text-slate-700">{downloads.toLocaleString()}</span>
      </div>
    </div>
  );
}
