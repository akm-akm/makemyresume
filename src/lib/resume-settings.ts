export const FONT_SIZES = {
  "80": { label: "S", tooltip: "Use for 2+ pages or dense content. Ideal for experienced professionals with extensive history." },
  "90": { label: "M", tooltip: "Standard size. Best for most resumes with 1-2 pages. Recommended for all industries." },
  "100": { label: "L", tooltip: "Better readability. Good for entry-level, career changers, or if you have limited content." },
  "110": { label: "XL", tooltip: "Maximum readability. Use for executive summaries or when you have minimal content." },
  "120": { label: "XXL", tooltip: "Very large text. Best for simple one-page resumes or accessibility needs." },
} as const;

export const COLOR_SCHEMES = {
  blue: { 
    primary: "#3b82f6", 
    secondary: "#1a1a1a", 
    text: "#333333", 
    name: "Blue",
    tooltip: "Best for: Tech, Healthcare, Finance. Professional and trustworthy. Most popular choice."
  },
  navy: { 
    primary: "#1e40af", 
    secondary: "#0f172a", 
    text: "#1e293b", 
    name: "Navy",
    tooltip: "Best for: Corporate, Legal, Banking. Conservative and authoritative. Ideal for traditional industries."
  },
  green: { 
    primary: "#059669", 
    secondary: "#064e3b", 
    text: "#1f2937", 
    name: "Green",
    tooltip: "Best for: Environment, Sustainability, Education. Fresh and growth-oriented."
  },
  purple: { 
    primary: "#7c3aed", 
    secondary: "#4c1d95", 
    text: "#374151", 
    name: "Purple",
    tooltip: "Best for: Creative, Design, Marketing. Bold and innovative. Shows creativity while staying professional."
  },
  gray: { 
    primary: "#4b5563", 
    secondary: "#1f2937", 
    text: "#374151", 
    name: "Gray",
    tooltip: "Best for: Minimalists, Engineers, Analysts. Neutral and clean. Works for any industry."
  },
} as const;

export const FONTS = {
  merriweather: { 
    name: "Merriweather", 
    family: "var(--font-merriweather), Georgia, serif",
    tooltip: "Best for: Software Engineers, Data Scientists, Academic Researchers. Modern serif that's professional yet approachable."
  },
  arial: { 
    name: "Arial", 
    family: "Arial, Helvetica, sans-serif",
    tooltip: "Best for: Sales, Marketing, Business Development. Clean and universally readable sans-serif."
  },
  times: { 
    name: "Times New Roman", 
    family: "'Times New Roman', Times, serif",
    tooltip: "Best for: Law, Finance, Academia. Traditional and formal serif font for conservative industries."
  },
  calibri: { 
    name: "Calibri", 
    family: "Calibri, 'Gill Sans', sans-serif",
    tooltip: "Best for: Corporate, HR, Project Management. Modern, professional, and ATS-friendly."
  },
  garamond: { 
    name: "Garamond", 
    family: "Garamond, 'Times New Roman', serif",
    tooltip: "Best for: Design, Publishing, Creative roles. Elegant serif that stands out while remaining professional."
  },
} as const;

export type FontSize = keyof typeof FONT_SIZES;
export type ColorScheme = keyof typeof COLOR_SCHEMES;
export type FontFamily = keyof typeof FONTS;

export interface TemplateSettings {
  markdown: string;
  color: ColorScheme;
  font: FontFamily;
  size: FontSize;
}

