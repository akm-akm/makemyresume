"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generatePdf } from "@/lib/pdf-generator";
import { 
  FONT_SIZES, 
  COLOR_SCHEMES, 
  FONTS, 
  type FontSize, 
  type ColorScheme, 
  type FontFamily,
  type TemplateSettings 
} from "@/lib/resume-settings";
import { validateMarkdown, type MarkdownError } from "@/lib/markdown-validator";


const DEFAULT_MARKDOWN = `# Your Name

[email@example.com](mailto:email@example.com) | [linkedin.com/in/yourname](https://linkedin.com) | [github.com/yourname](https://github.com)

---

## Summary

A brief professional summary about yourself and your career goals.

---

## Experience

### Job Title | Company Name
*Start Date - End Date*

- Key achievement or responsibility
- Another important achievement
- Quantifiable results you delivered

### Another Job Title | Another Company
*Start Date - End Date*

- Responsibility or achievement
- Another key point
- Impact you made

---

## Education

### Degree Name | University Name
*Graduation Year*

- Major: Your Major
- GPA: X.XX (if relevant)
- Relevant coursework or achievements

---

## Skills

**Programming Languages:** JavaScript, Python, Java  
**Frameworks:** React, Node.js, Django  
**Tools:** Git, Docker, AWS  

---

## Projects

### Project Name
*Link to project (if available)*

Brief description of the project and your role.

- Key technology or approach used
- Impact or results

---

## Certifications

- Certification Name | Issuing Organization | Year
- Another Certification | Organization | Year
`;

const TEMPLATE_SETTINGS: Record<string, TemplateSettings> = {
  blank: { 
    markdown: "", 
    color: "blue", 
    font: "merriweather",
    size: "90"
  },
  professional: { 
    color: "blue",
    font: "arial",
    size: "80",
    markdown: `# Sarah Johnson
[sarah.johnson@email.com](mailto:sarah.johnson@email.com) | (555) 123-4567 | New York, NY

---

## Professional Summary

Results-driven Sales Professional with 8+ years of experience in B2B software sales. Proven track record of exceeding quotas by 150%+ and building long-term client relationships.

---

## Experience

### Senior Account Executive | TechCorp Solutions
*January 2020 - Present*

- Exceeded annual sales quota by 175% for three consecutive years
- Generated $4.5M in new business revenue in 2023
- Built and maintained a portfolio of 50+ enterprise clients

### Account Executive | SalesPro Inc
*March 2016 - December 2019*

- Consistently ranked in top 10% of sales team nationwide
- Increased territory revenue by 200% over three years
- Awarded "Salesperson of the Year" in 2018

---

## Education

### Bachelor of Business Administration | State University
*2012 - 2016*

- Major: Marketing & Sales
- Dean's List: All semesters
- President, Sales Club

---

## Skills

**Sales:** B2B Sales, Account Management, Negotiation, Cold Calling, Contract Negotiation  
**CRM Tools:** Salesforce, HubSpot, LinkedIn Sales Navigator, Pipedrive  
**Soft Skills:** Communication, Relationship Building, Presentation, Strategic Planning

---

## Achievements

- Top 5% performer nationwide for 4 consecutive years
- Closed largest deal in company history: $2.8M contract
- Featured speaker at National Sales Conference 2022`,
  },
  modern: { 
    color: "purple",
    font: "calibri",
    size: "100",
    markdown: `# Michael Chen
[m.chen@email.com](mailto:m.chen@email.com) | LinkedIn: linkedin.com/in/mchen

---

## Executive Summary

Strategic Product Manager with 10+ years leading cross-functional teams. Expert in Agile methodologies, product strategy, and stakeholder management.

---

## Professional Experience

### Senior Product Manager | InnovateTech
*2021 - Present*

- Lead a team of 15 across engineering, design, and marketing
- Launched 3 major products generating $10M ARR
- Improved team velocity by 40% through process optimization

### Product Manager | StartupXYZ
*2018 - 2021*

- Managed product roadmap for flagship SaaS platform
- Coordinated releases across 5 engineering teams
- Increased user engagement by 60% through data-driven decisions

### Associate Product Manager | TechGiant Corp
*2015 - 2018*

- Conducted user research with 500+ customers
- Defined product requirements and user stories
- Collaborated with engineering on technical implementation

---

## Education

### MBA | Business School
*2013 - 2015*

### Bachelor of Science in Computer Science | University
*2009 - 2013*

---

## Skills

**Product:** Roadmap Planning, User Research, A/B Testing, Analytics  
**Management:** Agile/Scrum, Team Leadership, Stakeholder Management  
**Tools:** JIRA, Figma, Mixpanel, Google Analytics

---

## Certifications

- Certified Scrum Product Owner (CSPO)
- Google Analytics Certified`,
  },
  minimal: { 
    color: "gray",
    font: "calibri",
    size: "110",
    markdown: `# Alex Kumar
alex.kumar@email.com | github.com/alexk | Portfolio: alexkumar.dev

---

## Skills

**Languages:** JavaScript, Python, TypeScript, Go, Rust  
**Frontend:** React, Next.js, Vue.js, TailwindCSS  
**Backend:** Node.js, Django, PostgreSQL, Redis  
**DevOps:** Docker, Kubernetes, AWS, CI/CD

---

## Experience

### Senior Software Engineer | CloudScale Inc
*2021 - Present*

- Architected microservices handling 10M+ daily requests
- Reduced API latency by 60% through optimization
- Led migration from monolith to microservices architecture

### Software Engineer | DevShop
*2018 - 2021*

- Built real-time collaboration features using WebSockets
- Implemented automated testing reducing bugs by 45%
- Mentored 5 junior developers

### Junior Developer | StartupLab
*2016 - 2018*

- Developed RESTful APIs serving 100K+ users
- Contributed to open-source projects
- Participated in code reviews and pair programming

---

## Education

### Bachelor of Computer Science | Tech University
*2012 - 2016*

---

## Projects

### Open Source Contributor
- Contributed to React, Vue.js, and Node.js ecosystems
- 500+ GitHub stars across personal projects

### Personal Projects
- Built CLI tools with 10K+ downloads
- Technical blog with 50K+ monthly readers

---

## Certifications

- AWS Certified Solutions Architect
- Kubernetes Certified Administrator`,
  },
};

function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const template = searchParams.get("template") || "blank";
  const docId = searchParams.get("id");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [markdown, setMarkdown] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [fontSize, setFontSize] = useState<FontSize>("90");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("blue");
  const [fontFamily, setFontFamily] = useState<FontFamily>("merriweather");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [filename, setFilename] = useState("Untitled Resume");
  const [currentDocId, setCurrentDocId] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);
  const [initialState, setInitialState] = useState({ markdown: "", fontSize: "", colorScheme: "", fontFamily: "" });
  const [markdownErrors, setMarkdownErrors] = useState<MarkdownError[]>([]);

  // Jump to error line
  const jumpToLine = (lineNumber: number) => {
    if (!textareaRef.current) return;

    const lines = markdown.split('\n');
    let position = 0;
    
    // Calculate the character position of the start of the target line
    for (let i = 0; i < lineNumber - 1 && i < lines.length; i++) {
      position += lines[i].length + 1; // +1 for the newline character
    }
    
    // Set cursor position to the start of the line
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(position, position + (lines[lineNumber - 1]?.length || 0));
    
    // Scroll to the line
    const lineHeight = 20; // approximate line height in pixels
    const scrollTop = (lineNumber - 1) * lineHeight;
    textareaRef.current.scrollTop = scrollTop;
  };

  // Validate markdown
  useEffect(() => {
    const errors = validateMarkdown(markdown);
    setMarkdownErrors(errors);
  }, [markdown]);

  // Load from localStorage on mount
  useEffect(() => {
    if (docId) {
      // Load existing document
      const docs = JSON.parse(localStorage.getItem("resume-documents") || "[]");
      const doc = docs.find((d: any) => d.id === docId);
      if (doc) {
        setMarkdown(doc.markdown);
        setFontSize(doc.fontSize);
        setColorScheme(doc.colorScheme as keyof typeof COLOR_SCHEMES);
        setFontFamily(doc.fontFamily as keyof typeof FONTS);
        setCurrentDocId(doc.id);
        setHasChanges(false);
        setInitialState({
          markdown: doc.markdown,
          fontSize: doc.fontSize,
          colorScheme: doc.colorScheme,
          fontFamily: doc.fontFamily,
        });
      }
    } else {
      // New document from template
      const newId = Date.now().toString();
      setCurrentDocId(newId);
      const templateSettings = TEMPLATE_SETTINGS[template] || TEMPLATE_SETTINGS.blank;
      setMarkdown(templateSettings.markdown);
      setColorScheme(templateSettings.color);
      setFontFamily(templateSettings.font);
      setFontSize(templateSettings.size);
      setHasChanges(false);
      setInitialState({
        markdown: templateSettings.markdown,
        fontSize: templateSettings.size,
        colorScheme: templateSettings.color,
        fontFamily: templateSettings.font,
      });
    }
  }, [template, docId]);

  // Convert markdown and extract filename
  useEffect(() => {
    const convertMarkdown = async () => {
      const MarkdownIt = (await import("markdown-it")).default;
      const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
      });
      
      const html = md.render(markdown);
      setHtmlContent(html);

      // Extract filename from first H1
      const h1Match = markdown.match(/^#\s+(.+)$/m);
      if (h1Match && h1Match[1]) {
        setFilename(h1Match[1].trim());
      } else {
        setFilename("Untitled Resume");
      }
    };

    convertMarkdown();
  }, [markdown]);

  // Track changes
  useEffect(() => {
    const changed = 
      markdown !== initialState.markdown ||
      fontSize !== initialState.fontSize ||
      colorScheme !== initialState.colorScheme ||
      fontFamily !== initialState.fontFamily;
    
    setHasChanges(changed);
  }, [markdown, fontSize, colorScheme, fontFamily, initialState]);

  // Update URL when changes are made to a template (convert to saved document)
  useEffect(() => {
    if (hasChanges && currentDocId && template && !docId) {
      // Replace the URL from ?template=xxx to ?id=xxx
      router.replace(`/editor?id=${currentDocId}`);
    }
  }, [hasChanges, currentDocId, template, docId, router]);

  // Auto-save to localStorage with debounce - only if changes made
  useEffect(() => {
    if (!currentDocId || !markdown || !hasChanges) return;
    
    setSaveStatus("saving");
    const timer = setTimeout(() => {
      const docs = JSON.parse(localStorage.getItem("resume-documents") || "[]");
      const existingIndex = docs.findIndex((d: any) => d.id === currentDocId);
      
      const docData = {
        id: currentDocId,
        markdown,
        fontSize,
        colorScheme,
        fontFamily,
        name: filename,
        lastEdited: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        docs[existingIndex] = docData;
      } else {
        docs.unshift(docData);
      }

      localStorage.setItem("resume-documents", JSON.stringify(docs));
      setSaveStatus("saved");
      
      // Update initial state after save
      setInitialState({ markdown, fontSize, colorScheme, fontFamily });
    }, 1000);

    return () => clearTimeout(timer);
  }, [markdown, fontSize, colorScheme, fontFamily, filename, currentDocId, hasChanges]);

  const handleDownloadClick = () => {
    setShowPaymentDialog(true);
  };

  const handleDownloadPdf = () => {
    const colors = COLOR_SCHEMES[colorScheme];
    const scale = parseInt(fontSize) / 100;
    const font = FONTS[fontFamily];
    generatePdf(htmlContent, colors, scale, font.family);
    setShowPaymentDialog(false);
  };

  const colors = COLOR_SCHEMES[colorScheme];
  const fontSizeMultiplier = parseInt(fontSize) / 100;
  const selectedFont = FONTS[fontFamily];

  // Calculate number of pages based on content height
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      const contentElement = document.getElementById("resume-content");
      if (contentElement) {
        const contentHeight = contentElement.scrollHeight;
        // A4 page: 297mm height
        const pageHeightMm = 297;
        const pixelsPerMm = 3.7795275591;
        const pageHeightPx = pageHeightMm * pixelsPerMm;
        const pages = Math.ceil(contentHeight / pageHeightPx);
        setPageCount(Math.max(1, pages));
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [htmlContent, fontSize, colorScheme, fontFamily]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-screen flex flex-col">
      <header className="border-b p-4 flex items-center justify-between bg-background">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="p-2 hover:bg-slate-100 rounded cursor-pointer transition-colors"
            title="Back to home"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-sans text-slate-800">{filename}</h1>
          {hasChanges && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {saveStatus === "saving" ? (
                <>
                  <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Saved</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
            {/* Font Selector */}
            <Select value={fontFamily} onValueChange={(value) => setFontFamily(value as keyof typeof FONTS)}>
              <SelectTrigger className="w-[120px] h-8 text-[13px] cursor-pointer font-sans">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FONTS).map(([key, font]) => (
                  <Tooltip key={key}>
                    <TooltipTrigger asChild>
                      <div>
                        <SelectItem value={key} className="text-[13px] cursor-pointer font-sans">
                          {font.name}
                        </SelectItem>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-xs">{font.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </SelectContent>
            </Select>

            {/* Text Size Buttons */}
            <div className="flex gap-0.5 border rounded-lg p-1 bg-background">
              {Object.entries(FONT_SIZES).map(([size, { label, tooltip }]) => (
                <Tooltip key={size}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setFontSize(size as FontSize)}
                      className={`px-2.5 py-1 text-[13px] font-sans font-medium rounded transition-colors min-w-[32px] cursor-pointer ${
                        fontSize === size
                          ? "bg-slate-900 text-white"
                          : "bg-transparent text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {label}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Color Swatches */}
            <div className="flex gap-1.5 border rounded-lg p-1.5 bg-background">
              {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setColorScheme(key as keyof typeof COLOR_SCHEMES)}
                      className={`w-5 h-5 rounded-full border transition-all hover:scale-110 cursor-pointer ${
                        colorScheme === key ? "ring-2 ring-slate-900 ring-offset-1" : "border-slate-300"
                      }`}
                      style={{ backgroundColor: scheme.primary }}
                      aria-label={scheme.name}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">{scheme.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

          <Button onClick={handleDownloadClick} size="sm" className="cursor-pointer font-sans text-[13px]">Download PDF</Button>
        </div>
      </header>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-left text-black">
              Download your resume.
            </DialogTitle>
            <DialogDescription className="text-base text-gray-500 pt-4 text-left">
              If you pay us ₹10,000 we will pray for your job. No refunds. No guarantees. But hey, at least you&apos;ll have a nice PDF! 🙏
              <br /><br />
              <span className="text-xs text-gray-400">💡 Tip: In print dialog, uncheck &quot;Headers and footers&quot; for a clean PDF</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-3 justify-end pt-6">
            <Button 
              onClick={handleDownloadPdf}
              variant="outline"
              className="bg-white hover:bg-gray-50 text-black border-gray-300"
            >
              Pay ₹10,000
            </Button>
            <Button 
              onClick={handleDownloadPdf}
              className="bg-black hover:bg-gray-900 text-white"
            >
              Promise to pay next time
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col">
            <div className="border-b p-2 bg-muted/30">
              <h2 className="text-sm font-medium font-sans">Markdown Input</h2>
            </div>
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none"
              placeholder="Enter your resume content in Markdown..."
            />
            
            {/* Markdown Errors */}
            {markdownErrors.length > 0 && (
              <div className="border-t-2 border-red-400 bg-red-100 p-3 max-h-32 overflow-y-auto shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-red-800 uppercase tracking-wide">
                    {markdownErrors.length} Syntax {markdownErrors.length === 1 ? 'Error' : 'Errors'}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {markdownErrors.map((error, idx) => (
                    <TooltipProvider key={idx}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            onClick={() => jumpToLine(error.line)}
                            className="text-xs text-red-800 font-mono cursor-pointer hover:bg-red-200 bg-red-50 p-2 rounded border border-red-300 transition-all hover:border-red-400 hover:shadow-sm"
                          >
                            <span className="font-bold text-red-900">Line {error.line}:</span> {error.message}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-slate-900 text-white">
                          <p className="font-semibold mb-1">💡 How to fix:</p>
                          <p>{error.suggestion}</p>
                          <p className="text-xs text-slate-400 mt-1">Click to jump to line</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={55} minSize={50}>
          <div className="h-full flex flex-col">
            <div className="border-b p-2 bg-muted/30 flex items-center justify-between">
              <h2 className="text-sm font-medium font-sans">Live Preview</h2>
              <div className="flex items-center gap-4">
                {pageCount > 1 && (
                  <span className="text-xs font-medium font-sans text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    {pageCount} pages
                  </span>
                )}
                <span className="text-xs text-muted-foreground font-sans">A4: 210mm × 297mm</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto" style={{ backgroundColor: "#e2e8f0" }}>
              <div className="min-h-full p-8 flex justify-center">
                <div className="pb-8" style={{ width: "210mm", flexShrink: 0 }}>
                {/* Single continuous content with page break indicators */}
                <div
                  id="resume-content"
                  className="shadow-2xl border border-slate-300 relative"
                  style={{
                    width: "210mm",
                    minHeight: "297mm",
                    backgroundColor: "#ffffff",
                    fontFamily: selectedFont.family,
                    fontSize: `${11 * fontSizeMultiplier}px`,
                    lineHeight: "1.45",
                    color: colors.text,
                    padding: "15mm",
                    boxSizing: "border-box",
                    ["--heading-color" as string]: colors.primary,
                    ["--subheading-color" as string]: colors.secondary,
                  }}
                >
                  {/* Page break indicators */}
                  {pageCount > 1 && Array.from({ length: pageCount - 1 }).map((_, index) => (
                    <div
                      key={index}
                      className="absolute left-0 right-0 pointer-events-none"
                      style={{
                        top: `calc(${(index + 1) * 297}mm - 15mm)`,
                        height: "2px",
                        background: "repeating-linear-gradient(90deg, #94a3b8 0, #94a3b8 10px, transparent 10px, transparent 20px)",
                        zIndex: 1000,
                      }}
                    >
                      <div className="absolute right-4 -top-5 text-xs text-slate-500 bg-white px-2 py-1 rounded">
                        Page {index + 2} starts here
                      </div>
                    </div>
                  ))}
                  
                  {/* Actual content */}
                  <div 
                    className="resume-page-content relative"
                    style={{ zIndex: 1 }}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>
              </div>
            </div>
          </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      </div>
    </TooltipProvider>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-slate-300 border-t-slate-600 rounded-full"></div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}

