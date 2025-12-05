"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { COLOR_SCHEMES, FONTS } from "@/lib/resume-settings";

type SavedDocument = {
  id: string;
  markdown: string;
  fontSize: string;
  colorScheme: string;
  fontFamily: string;
  name: string;
  lastEdited: string;
};

const templates = [
  {
    id: "blank",
    name: "Blank Template",
    description: "Start from scratch with a clean slate",
    markdown: "",
    color: "#3b82f6",
    font: "Arial, sans-serif",
  },
  {
    id: "professional",
    name: "Professional Template",
    description: "Perfect for Sales & Business Development",
    color: "#3b82f6",
    font: "Arial, sans-serif",
    markdown: `# Sarah Johnson
[sarah.johnson@email.com](mailto:sarah.johnson@email.com) | (555) 123-4567 | New York, NY | [LinkedIn](https://linkedin.com/in/sarahjohnson)

---

## Professional Summary

Results-driven Sales Professional with 8+ years of experience in B2B software sales. Proven track record of exceeding quotas by 150%+ and building long-term client relationships. Expert in enterprise sales cycles, strategic account management, and team leadership.

---

## Experience

### Senior Account Executive | TechCorp Solutions
*January 2020 - Present*

- Exceeded annual sales quota by 175% for three consecutive years
- Generated $4.5M in new business revenue in 2023
- Built and maintained a portfolio of 50+ enterprise clients
- Developed strategic partnerships with Fortune 500 companies
- Mentored team of 8 junior sales representatives

### Account Executive | SalesPro Inc
*March 2016 - December 2019*

- Consistently ranked in top 10% of sales team nationwide
- Increased territory revenue by 200% over three years
- Awarded "Salesperson of the Year" in 2018
- Closed deals ranging from $50K to $500K annually
- Implemented CRM best practices adopted company-wide

### Sales Development Representative | GlobalTech
*June 2014 - February 2016*

- Generated 150+ qualified leads per quarter
- Achieved 120% of monthly quota consistently
- Collaborated with marketing on lead generation campaigns

---

## Education

### Bachelor of Business Administration | State University
*2012 - 2016*

- Major: Marketing & Sales, Minor: Psychology
- Dean's List: All semesters
- President, Sales Club
- Graduated Magna Cum Laude

---

## Skills

**Sales:** B2B Sales, Account Management, Negotiation, Cold Calling, Contract Negotiation, Pipeline Management  
**CRM Tools:** Salesforce, HubSpot, LinkedIn Sales Navigator, Pipedrive, Outreach.io  
**Soft Skills:** Communication, Relationship Building, Presentation, Strategic Planning, Team Leadership

---

## Certifications

- Salesforce Certified Sales Professional
- HubSpot Inbound Sales Certification
- Strategic Selling Certification

---

## Achievements

- Top 5% performer nationwide for 4 consecutive years
- Closed largest deal in company history: $2.8M contract
- Featured speaker at National Sales Conference 2022
- Winner of President's Club Award (2019, 2021, 2022)
- Built $15M+ pipeline in first year at TechCorp`,
  },
  {
    id: "modern",
    name: "Modern Template",
    description: "Ideal for Managers & Team Leads",
    color: "#7c3aed",
    font: "Calibri, sans-serif",
    markdown: `# Michael Chen
[m.chen@email.com](mailto:m.chen@email.com) | LinkedIn: linkedin.com/in/mchen | San Francisco, CA

---

## Executive Summary

Strategic Product Manager with 10+ years leading cross-functional teams at high-growth startups and Fortune 500 companies. Expert in Agile methodologies, product strategy, stakeholder management, and data-driven decision making. Proven track record of launching products that generate $25M+ in revenue.

---

## Professional Experience

### Senior Product Manager | InnovateTech
*2021 - Present*

- Lead a team of 15 across engineering, design, and marketing
- Launched 3 major products generating $10M ARR in first year
- Improved team velocity by 40% through process optimization
- Reduced customer churn by 25% through feature improvements
- Established product analytics framework adopted company-wide

### Product Manager | StartupXYZ
*2018 - 2021*

- Managed product roadmap for flagship SaaS platform serving 50K+ users
- Coordinated releases across 5 engineering teams
- Increased user engagement by 60% through data-driven decisions
- Led redesign initiative improving NPS score from 32 to 67
- Drove adoption of OKR framework for product team

### Associate Product Manager | TechGiant Corp
*2015 - 2018*

- Conducted user research with 500+ customers globally
- Defined product requirements and user stories for 12 features
- Collaborated with engineering on implementation strategies
- Managed beta testing programs with 1,000+ participants

---

## Education

### MBA, Product Management | Business School
*2013 - 2015*
- Specialization in Technology Strategy
- Case Competition Winner

### Bachelor of Science in Computer Science | Tech University
*2009 - 2013*
- Summa Cum Laude
- President, Tech Entrepreneurs Club

---

## Skills

**Product:** Roadmap Planning, User Research, A/B Testing, Analytics, PRDs, Feature Prioritization  
**Management:** Agile/Scrum, Team Leadership, Stakeholder Management, OKRs, Cross-functional Collaboration  
**Tools:** JIRA, Figma, Mixpanel, Google Analytics, Amplitude, ProductBoard, Notion

---

## Certifications

- Certified Scrum Product Owner (CSPO)
- Google Analytics Certified
- Product School Product Management Certificate
- AWS Cloud Practitioner

---

## Speaking & Publications

- Speaker at ProductCon 2023: "Building Products Users Love"
- Featured in TechCrunch: "The Future of B2B SaaS"
- Guest lecturer at Stanford d.school`,
  },
  {
    id: "minimal",
    name: "Minimal Template",
    description: "Best for Software Engineers & Developers",
    color: "#4b5563",
    font: "Calibri, 'Gill Sans', sans-serif",
    markdown: `# Alex Kumar
alex.kumar@email.com | github.com/alexk | Portfolio: alexkumar.dev | Seattle, WA

---

## Summary

Full-stack Software Engineer with 7+ years of experience building scalable distributed systems. Passionate about clean code, system design, and open-source contribution. Strong background in cloud architecture and DevOps practices.

---

## Skills

**Languages:** JavaScript, Python, TypeScript, Go, Rust, Java  
**Frontend:** React, Next.js, Vue.js, TailwindCSS, Redux, GraphQL  
**Backend:** Node.js, Django, FastAPI, PostgreSQL, Redis, MongoDB  
**DevOps:** Docker, Kubernetes, AWS, GCP, Terraform, CI/CD, GitHub Actions  
**Tools:** Git, Linux, Vim, VS Code, Datadog, New Relic

---

## Experience

### Senior Software Engineer | CloudScale Inc
*2021 - Present*

- Architected microservices handling 10M+ daily requests with 99.99% uptime
- Reduced API latency by 60% through caching and query optimization
- Led migration from monolith to microservices, reducing deployment time by 80%
- Designed event-driven architecture processing 500K events/minute
- Mentored team of 4 engineers, conducted 100+ code reviews

### Software Engineer | DevShop
*2018 - 2021*

- Built real-time collaboration features using WebSockets serving 50K concurrent users
- Implemented automated testing suite reducing production bugs by 45%
- Designed and built GraphQL API layer for mobile applications
- Led initiative to improve CI/CD pipeline, reducing build times by 70%
- Mentored 5 junior developers through pair programming sessions

### Junior Developer | StartupLab
*2016 - 2018*

- Developed RESTful APIs serving 100K+ users with comprehensive documentation
- Built admin dashboard using React and Redux
- Contributed to open-source projects gaining 200+ stars
- Implemented monitoring and alerting using Prometheus and Grafana

---

## Education

### Bachelor of Computer Science | Tech University
*2012 - 2016*

- GPA: 3.9/4.0
- Focus: Distributed Systems & Algorithms
- Teaching Assistant for Data Structures course

---

## Open Source & Projects

- **react-query-toolkit** - State management library, 2.5K GitHub stars
- **go-microservice-template** - Production-ready microservice boilerplate
- **devops-handbook** - Comprehensive DevOps learning resources
- **Technical Blog** - 50K+ monthly readers covering system design

---

## Certifications

- AWS Solutions Architect Professional
- Kubernetes Administrator (CKA)
- Google Cloud Professional Developer

---

## Certifications

- AWS Certified Solutions Architect
- Kubernetes Certified Administrator`,
  },
];

const TemplatePreview = ({ markdown, color, font }: { markdown: string; color?: string; font?: string }) => {
  const [html, setHtml] = useState("");
  const primaryColor = color || "#3b82f6";
  const fontFamily = font || "Arial, sans-serif";

  useEffect(() => {
    if (!markdown) {
      setHtml("");
      return;
    }

    import("markdown-it").then((MarkdownIt) => {
      const md = new MarkdownIt.default({
        html: true,
        linkify: true,
        typographer: true,
      });
      setHtml(md.render(markdown));
    });
  }, [markdown]);

  if (!markdown) {
    return (
      <div className="w-full bg-white border-2 border-dashed border-slate-300 flex items-center justify-center hover:border-slate-400 transition-colors" style={{ aspectRatio: "210/297" }}>
        <span className="text-7xl text-slate-300">+</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-slate-300 overflow-hidden relative hover:border-slate-400 transition-colors" style={{ aspectRatio: "210/297" }}>
      <div
        className="resume-page-content"
        style={{
          transform: "scale(0.24)",
          transformOrigin: "top left",
          width: "417%",
          height: "417%",
          padding: "56px",
          boxSizing: "border-box",
          fontFamily: fontFamily,
          fontSize: "11px",
          lineHeight: "1.45",
          color: "#333333",
          // @ts-expect-error - CSS custom properties
          "--heading-color": primaryColor,
          "--subheading-color": primaryColor,
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default function Home() {
  const [savedDocs, setSavedDocs] = useState<SavedDocument[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Load saved documents from localStorage
    const loadDocs = () => {
      const docs = JSON.parse(localStorage.getItem("resume-documents") || "[]");
      setSavedDocs(docs);
    };
    loadDocs();
  }, []);

  const handleDeleteClick = (docId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDocToDelete(docId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!docToDelete) return;
    
    const docs = JSON.parse(localStorage.getItem("resume-documents") || "[]");
    const filtered = docs.filter((d: SavedDocument) => d.id !== docToDelete);
    localStorage.setItem("resume-documents", JSON.stringify(filtered));
    setSavedDocs(filtered);
    setDeleteDialogOpen(false);
    setDocToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "MakeMyResume",
              "description": "Free online resume builder with professional templates. Create ATS-friendly resumes for software engineers, sales professionals, managers, and more.",
              "url": "https://makemyresume.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Free resume builder",
                "Professional templates",
                "Live markdown editor",
                "Instant PDF download",
                "ATS-friendly formats",
                "No signup required",
                "Customizable fonts and colors",
                "Auto-save functionality"
              ],
              "screenshot": "https://makemyresume.com/screenshot.png",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250"
              }
            })
          }}
        />

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-4 text-slate-900">
            MakeMyResume - Free Resume Builder
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Create professional, ATS-friendly resumes in minutes. Choose from expert-designed templates and download as PDF instantly. No signup required.
          </p>
        </div>

        {/* Templates - Create New */}
        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-slate-900">Create New</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {templates.map((template) => (
              <Link key={template.id} href={`/editor?template=${template.id}`}>
                <div className="h-full border border-slate-200 hover:border-slate-400 transition-colors cursor-pointer bg-white/80 backdrop-blur-sm">
                  <div className="p-4">
                    <TemplatePreview 
                      markdown={template.markdown} 
                      color={template.color}
                      font={template.font}
                    />
                    <h3 className="text-lg font-semibold mt-4 mb-2">{template.name}</h3>
                    <p className="text-sm text-slate-600">{template.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Saved Documents */}
        {savedDocs.length > 0 && (
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-slate-900">Your Resumes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {savedDocs.map((doc) => (
                <div key={doc.id} className="relative group">
                  <Link href={`/editor?id=${doc.id}`}>
                    <div className="h-full border border-slate-200 hover:border-slate-400 transition-colors cursor-pointer bg-white/80 backdrop-blur-sm">
                      <div className="p-4">
                        <TemplatePreview 
                          markdown={doc.markdown} 
                          color={COLOR_SCHEMES[doc.colorScheme as keyof typeof COLOR_SCHEMES]?.primary || "#3b82f6"}
                          font={FONTS[doc.fontFamily as keyof typeof FONTS]?.family || "Arial, sans-serif"}
                        />
                        <h3 className="text-lg font-semibold mt-4 mb-1">{doc.name}</h3>
                        <p className="text-xs text-slate-500">Edited {formatDate(doc.lastEdited)}</p>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => handleDeleteClick(doc.id, e)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-left">Delete resume?</DialogTitle>
            <DialogDescription className="text-base pt-4 text-left">
              This action cannot be undone. This will permanently delete your resume.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-3 justify-end pt-4">
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              variant="outline"
              className="bg-white hover:bg-gray-50 text-black border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SEO Content - Hidden from users, visible to crawlers */}
      <div className="sr-only" aria-hidden="true">
        <h2>About MakeMyResume - Free Online Resume Builder</h2>
        <p>
          MakeMyResume is the best free resume builder online that helps job seekers create professional, 
          ATS-friendly resumes quickly and easily. Our resume maker tool is completely free, requires no signup, 
          and offers instant PDF downloads. Whether you are a software engineer, sales professional, manager, 
          or just starting your career, we have the perfect resume template for you.
        </p>
        
        <h3>Why Choose Our Free Resume Builder?</h3>
        <p>
          Our online resume builder offers professional resume templates designed by HR experts. Create a 
          winning resume with our intuitive markdown editor, real-time preview, and customizable formatting. 
          Download your resume as PDF instantly - no watermarks, no hidden fees, completely free forever.
        </p>

        <h3>Resume Templates for Every Profession</h3>
        <p>
          Choose from our curated collection of resume templates: Professional template for sales and business 
          development, Modern template for managers and team leads, Minimal template for software engineers and 
          developers. All templates are ATS-compliant and optimized for applicant tracking systems.
        </p>

        <h3>Features of Our Resume Maker</h3>
        <ul>
          <li>Free resume builder with no signup required</li>
          <li>Professional CV templates for all industries</li>
          <li>Live preview and markdown editor</li>
          <li>Instant PDF download</li>
          <li>ATS-friendly resume formats</li>
          <li>Customizable fonts, colors, and text sizes</li>
          <li>Auto-save functionality</li>
          <li>Mobile-friendly resume creator</li>
        </ul>

        <h3>Create Your Perfect Resume Today</h3>
        <p>
          Build a professional resume in minutes with MakeMyResume. Our free resume builder helps you stand 
          out from the competition with clean, modern designs that pass ATS screening. Start creating your 
          resume now - no credit card needed, no email required. Join thousands of job seekers who landed 
          their dream jobs using our resume maker.
        </p>

        <h3>Popular Resume Keywords</h3>
        <p>
          resume builder, free resume maker, CV builder, resume templates, create resume online, professional 
          resume builder, resume generator, online CV maker, resume creator free, best resume builder, resume 
          maker app, free CV builder, resume format, job resume, resume examples, resume writing, modern resume 
          templates, ATS resume, resume design, resume download PDF, simple resume maker, resume builder for 
          freshers, executive resume, tech resume, sales resume, engineering resume
        </p>

        <nav>
          <h4>Quick Links</h4>
          <span>Home - Free Resume Builder - https://makemyresume.com/</span>
          <span>Resume Editor - Create Resume Online - https://makemyresume.com/editor</span>
          <span>Professional Resume Template - https://makemyresume.com/editor?template=professional</span>
          <span>Modern Resume Template - https://makemyresume.com/editor?template=modern</span>
          <span>Minimal Resume Template - https://makemyresume.com/editor?template=minimal</span>
        </nav>
      </div>
    </div>
  );
}
