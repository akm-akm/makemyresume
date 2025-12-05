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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
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
import { trackEvent, EVENTS } from "@/lib/analytics";


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
  engineer: {
    color: "navy",
    font: "merriweather",
    size: "100",
    markdown: `# Aditya Kumar Mandal

📧 [adityanick08@gmail.com](mailto:adityanick08@gmail.com) | 📱 [9709094733](tel:9709094733) | 💼 [linkedin](https://linkedin.com/in/adityakmandal) | 🐙 [github](https://github.com/akm-akm)

---

## SUMMARY

Systems Architect with 4+ years building multi-tenant SaaS, microservices, and LLM/agentic systems. Designed and deployed GenAI platforms using Kubernetes, NestJS, Redis, BullMQ, and LangGraph, with strong expertise in automation and real-time pipelines.

---

## EXPERIENCE

### Lead System Engineer
**MeetPanda** | August 2024 - Present, Remote

- Designed a **multi-tenant SaaS architecture** using NestJS, Redis, PostgreSQL, Qdrant, and microservices to support scalable meeting intelligence.
- Built a **full LLM orchestration layer** with LangGraph, RAG pipelines, tool routing, structured outputs, and domain-specific reasoning.
- Developed the **Google Meet / MS Teams recording engine** using Playwright, FFmpeg, speaker diarization, audio mixing, and auto-reconnect logic.
- Implemented an **AI analytics engine** covering BANT scoring, engineering/sales summaries, MOM generation, sentiment insights, and speaker metrics.
- Built a **Kubernetes deployment pipeline** (GKE2 + ArgoCD) supporting auto-scaling jobs, persistent volumes, node-affinity scheduling, and full observability.
- Architected **event-driven and integration pipelines** using BullMQ, async workers, SQS-style fan-out patterns, daily digests, and integrations with Slack, Notion, GitHub, Jira, Google Calendar, OAuth2, and role-based access for multi-tenant onboarding.

### Freelance Software Developer
**Meetminutes** | April 2025 - August 2025

- **Engineered the core meeting-joining and recording system** used across Meet Minutes, building the full automation workflow that joins Google Meet/Teams calls and reliably captures high-quality audio/video.
- **Designed and implemented a Linux-native recording pipeline** using **PulseAudio**, virtual audio sinks, and low-level Linux kernel configuration to ensure stable, isolated, high-fidelity recording sessions.
- Built a **scalable browser automation layer** leveraging **Headless Chromium**, custom automation scripts, and dynamic DOM event tracking to handle unpredictable browser behavior.
- **Architected support for multiple concurrent recording bots**, ensuring isolation, crash-recovery, and high throughput across distributed workloads.
- **Implemented virtual screen & audio capture**, integrating FFmpeg pipelines, real-time mixing, and stream synchronization for consistent output.
- **Optimized the system for cloud-scale deployment**, enabling horizontal scaling, fault tolerance, and operational visibility across hundreds of active recording jobs.

### Software Developer
**Breezo** | August 2023 - May 2024

- **Led development of a WhatsApp-integrated AI chatbot**, architecting a scalable system using Next.js, Node.js and Socket.io for real-time customer interactions.
- **Implemented PostgreSQL and Redis** for reliable data integrity, fast caching, and low-latency message pipelines.
- **Designed and deployed a microservices architecture on Azure**, supported via robust CI/CD pipeline for seamless releases.
- **Integrated an AI engine capable of autonomous query handling**, enabling the chatbot to execute tasks, answer questions, and manage end-to-end conversations.

### Software Developer
**Polymath AI** | June 2023 - August 2023

- **Developed AI-driven answering platforms** using **LangChain, OpenAI API**, and **Next.js**, handling prompt optimization and end-to-end feature implementation.
- **Implemented Redis-based caching layers** to improve response latency, reliability, and overall system throughput.
- **Designed infrastructure, working with deployment workflows**, and **scalable service components**.
- **Collaborated with the engineering team** to ship features, refine system behavior, and enhance code quality across the **Next.js + Node.js + LangChain** stack.
- **Directed project management** for a 6-month cross-functional software deployment, leveraging JIRA and Asana to track 28 milestones, coordinate weekly stand-ups, and ensure on-time delivery of Next.js and OpenAI API initiatives achieving a 100% sprint completion rate.

---

## INVOLVEMENT

### Secretary
**BIT Sindri • SAE India (Society of Automotive Engineers)** | May 2023 - May 2024

- Collaborated with society leadership to implement strategic plans, goals, and initiatives, contributing to the growth of the organization.
- Participated in SAE NIS Effi-cycle to design and fabricate an electric-human hybrid vehicle. (Role: Powertrain and Manufacturing Head).
- Leading a team of 30 student engineers in designing and building an off-road vehicle for the SAE Baja, overseeing all aspects of the project from concept development to testing and competition.

---

## SKILLS

**Programming Languages**: C++, Java, Python, JavaScript, Solidity, .Net

**Tools/Libraries/Frameworks**: React, Nextjs, Nestjs, Nodejs, .Net, Langchain, Databases

**Tools**: GCP, Azure, Linux, Docker, Kubernetes, ArgoCD, Jenkins, Networking`,
  },
  professional: { 
    color: "blue",
    font: "arial",
    size: "80",
    markdown: `# Sarah Johnson
[sarah.johnson@email.com](mailto:sarah.johnson@email.com) | (555) 123-4567 | New York, NY | [LinkedIn](https://linkedin.com/in/sarahjohnson)

---

## Professional Summary

Results-driven Sales Professional with 8+ years of experience in B2B software sales, consistently exceeding quotas by 150%+ while building long-term client relationships. Expert in enterprise sales cycles, strategic account management, and team leadership with a proven track record of closing multi-million dollar deals.

---

## Experience

### Senior Account Executive | TechCorp Solutions
*January 2020 - Present*

- **Exceeded annual sales quota by 175%** for three consecutive years by implementing strategic prospecting methods, personalized demo sequences, and consultative selling approaches that resonated with enterprise decision-makers.
- **Generated $4.5M in new business revenue** in 2023 alone through targeted account-based marketing campaigns, cold outreach optimization, and strategic partnership development with C-suite executives across Fortune 1000 companies.
- **Built and maintained a portfolio of 50+ enterprise clients**, nurturing relationships through quarterly business reviews, proactive support escalations, and customized solution presentations that drove 92% renewal rates.
- **Developed strategic partnerships with Fortune 500 companies** including Microsoft, Salesforce, and Oracle by identifying mutual value propositions and negotiating co-selling agreements worth $2M+ annually.
- **Mentored and trained a team of 8 junior sales representatives**, creating structured onboarding programs, conducting weekly coaching sessions, and sharing proven scripts that improved team quota attainment by 40%.

### Account Executive | SalesPro Inc
*March 2016 - December 2019*

- **Consistently ranked in top 10% of sales team nationwide** across 200+ reps by maintaining rigorous prospecting cadences, leveraging social selling techniques, and building a referral network that generated 35% of pipeline.
- **Increased territory revenue by 200% over three years** through systematic market expansion, competitive displacement strategies, and development of vertical-specific value propositions for healthcare, finance, and technology sectors.
- **Awarded "Salesperson of the Year" in 2018** after closing the company's first $1M+ deal and bringing in 47 new enterprise logos, setting records that stood for two years.
- **Closed deals ranging from $50K to $500K annually** by mastering complex multi-stakeholder negotiations, ROI-driven presentations, and executive alignment strategies that shortened sales cycles by 25%.
- **Implemented CRM best practices adopted company-wide**, including lead scoring models, pipeline hygiene standards, and forecasting methodologies that improved prediction accuracy from 65% to 89%.

### Sales Development Representative | GlobalTech
*June 2014 - February 2016*

- **Generated 150+ qualified leads per quarter** through multi-channel outreach including cold calling, email sequences, LinkedIn engagement, and event-based networking at trade shows and conferences.
- **Achieved 120% of monthly quota consistently** by developing personalized messaging frameworks, A/B testing outreach templates, and implementing a follow-up system that doubled response rates.
- **Collaborated with marketing on lead generation campaigns** that produced $3M in pipeline, providing frontline feedback on messaging effectiveness and ideal customer profile refinements.

---

## Education

### Bachelor of Business Administration | State University
*2012 - 2016*

- Major: Marketing & Sales, Minor: Psychology
- Dean's List: All semesters (GPA: 3.85/4.0)
- President, Sales Club – Organized 12 networking events with Fortune 500 executives
- Graduated Magna Cum Laude

---

## Skills

**Sales:** B2B Sales, Account Management, Negotiation, Cold Calling, Contract Negotiation, Pipeline Management, Forecasting  
**CRM Tools:** Salesforce, HubSpot, LinkedIn Sales Navigator, Pipedrive, Outreach.io, Gong, Chorus  
**Soft Skills:** Communication, Relationship Building, Presentation, Strategic Planning, Team Leadership, Executive Presence

---

## Certifications

- Salesforce Certified Sales Professional
- HubSpot Inbound Sales Certification
- Strategic Selling Certification (Miller Heiman)
- MEDDIC Sales Methodology Certified

---

## Achievements

- Top 5% performer nationwide for 4 consecutive years across 500+ sales professionals
- Closed largest deal in company history: $2.8M enterprise contract with 5-year commitment
- Featured speaker at National Sales Conference 2022 on "Consultative Selling in the AI Era"
- Winner of President's Club Award (2019, 2021, 2022) – Top 10 performers globally
- Built $15M+ pipeline in first year at TechCorp through strategic prospecting and referral programs`,
  },
  modern: { 
    color: "purple",
    font: "calibri",
    size: "80",
    markdown: `# Michael Chen
[m.chen@email.com](mailto:m.chen@email.com) | LinkedIn: linkedin.com/in/mchen | San Francisco, CA | [Portfolio](https://mchen.pm)

---

## Executive Summary

Strategic Product Manager with 10+ years leading cross-functional teams at high-growth startups and Fortune 500 companies. Expert in Agile methodologies, product strategy, stakeholder management, and data-driven decision making. Proven track record of launching products that generate $25M+ in revenue while maintaining customer satisfaction scores above 90%.

---

## Professional Experience

### Senior Product Manager | InnovateTech
*2021 - Present*

- **Lead a cross-functional team of 15 professionals** spanning engineering, design, marketing, and customer success, conducting weekly syncs, sprint planning, and quarterly OKR reviews that drove 98% goal completion rate.
- **Launched 3 major products generating $10M ARR** in first year through rigorous market research, competitive analysis, beta testing with 500+ users, and iterative feature refinement based on customer feedback loops.
- **Improved team velocity by 40%** by implementing refined Agile ceremonies, introducing story point estimation workshops, reducing meeting overhead by 30%, and establishing clear definition-of-done criteria across all squads.
- **Reduced customer churn by 25%** through systematic analysis of drop-off points, implementation of in-app guidance, proactive feature announcements, and creation of a customer advisory board that influenced 60% of roadmap decisions.
- **Established product analytics framework adopted company-wide**, including event taxonomy standards, dashboard templates, funnel analysis protocols, and A/B testing governance that became the gold standard for all product teams.

### Product Manager | StartupXYZ
*2018 - 2021*

- **Managed product roadmap for flagship SaaS platform** serving 50K+ users across 30 countries, balancing feature requests from enterprise clients, SMB needs, and strategic company initiatives while maintaining 95% stakeholder alignment.
- **Coordinated releases across 5 engineering teams** using a train release model, feature flags, and staged rollouts that reduced deployment incidents by 70% and enabled weekly releases instead of monthly.
- **Increased user engagement by 60%** through data-driven decisions including cohort analysis, user session recordings, NPS surveys, and implementation of personalization features that boosted daily active users from 12K to 19K.
- **Led complete redesign initiative improving NPS score from 32 to 67** over 8 months by conducting 100+ user interviews, creating detailed personas, running usability tests, and iterating on designs through 4 major revisions.
- **Drove adoption of OKR framework for product team**, training 25 team members, facilitating quarterly planning sessions, and creating tracking dashboards that improved strategic alignment from 60% to 95%.

### Associate Product Manager | TechGiant Corp
*2015 - 2018*

- **Conducted user research with 500+ customers globally** across North America, Europe, and Asia, synthesizing insights into actionable recommendations that directly influenced 8 major product decisions and 3 market expansions.
- **Defined product requirements and user stories for 12 features** with detailed acceptance criteria, edge case documentation, and success metrics that reduced engineering clarification requests by 50%.
- **Collaborated with engineering on implementation strategies**, participating in technical design reviews, providing market context for trade-off decisions, and ensuring business requirements translated accurately into technical specifications.
- **Managed beta testing programs with 1,000+ participants**, creating structured feedback collection processes, analyzing usage patterns, and producing weekly insight reports that executives cited in board presentations.

---

## Education

### MBA, Product Management | Business School
*2013 - 2015*
- Specialization in Technology Strategy and Innovation
- Case Competition Winner – McKinsey Product Challenge
- Teaching Assistant for "Digital Product Development" course

### Bachelor of Science in Computer Science | Tech University
*2009 - 2013*
- Summa Cum Laude (GPA: 3.95/4.0)
- President, Tech Entrepreneurs Club – Grew membership 300%
- Senior Thesis: "Predictive Analytics in User Behavior Modeling"

---

## Skills

**Product:** Roadmap Planning, User Research, A/B Testing, Analytics, PRDs, Feature Prioritization, Market Analysis  
**Management:** Agile/Scrum, Team Leadership, Stakeholder Management, OKRs, Cross-functional Collaboration, Executive Communication  
**Tools:** JIRA, Figma, Mixpanel, Google Analytics, Amplitude, ProductBoard, Notion, Miro, Looker, SQL

---

## Certifications

- Certified Scrum Product Owner (CSPO)
- Google Analytics Certified Professional
- Product School Product Management Certificate
- AWS Cloud Practitioner
- Pragmatic Institute Certified (PMC-III)

---

## Speaking & Publications

- Speaker at ProductCon 2023: "Building Products Users Love" – 2,500 attendees
- Featured in TechCrunch: "The Future of B2B SaaS" – 50K+ reads
- Guest lecturer at Stanford d.school – "From Idea to Product-Market Fit"
- Author of popular Medium blog on product management – 15K+ followers`,
  },
  minimal: { 
    color: "gray",
    font: "calibri",
    size: "80",
    markdown: `# Alex Kumar
alex.kumar@email.com | github.com/alexk | Portfolio: alexkumar.dev | Seattle, WA | [LinkedIn](https://linkedin.com/in/alexkumar)

---

## Summary

Full-stack Software Engineer with 7+ years of experience building scalable distributed systems handling millions of daily requests. Passionate about clean code, system design, and open-source contribution with 5K+ GitHub stars across projects. Strong background in cloud architecture, DevOps practices, and technical leadership.

---

## Skills

**Languages:** JavaScript, Python, TypeScript, Go, Rust, Java, SQL  
**Frontend:** React, Next.js, Vue.js, TailwindCSS, Redux, GraphQL, WebSockets  
**Backend:** Node.js, Django, FastAPI, PostgreSQL, Redis, MongoDB, Elasticsearch  
**DevOps:** Docker, Kubernetes, AWS, GCP, Terraform, CI/CD, GitHub Actions, ArgoCD  
**Tools:** Git, Linux, Vim, VS Code, Datadog, New Relic, PagerDuty, Grafana

---

## Experience

### Senior Software Engineer | CloudScale Inc
*2021 - Present*

- **Architected microservices handling 10M+ daily requests** with 99.99% uptime by implementing circuit breakers, retry logic, graceful degradation patterns, and comprehensive health checks across 15 services in a Kubernetes cluster.
- **Reduced API latency by 60%** through multi-layer caching strategies using Redis for hot data, CDN edge caching for static assets, database query optimization with proper indexing, and implementing connection pooling that cut p99 latency from 450ms to 180ms.
- **Led migration from monolith to microservices**, reducing deployment time from 4 hours to 15 minutes by decomposing the codebase into 12 bounded contexts, implementing event sourcing, and creating automated rollback mechanisms.
- **Designed event-driven architecture processing 500K events/minute** using Kafka, implementing exactly-once semantics, dead-letter queues, and replay capabilities that enabled real-time analytics and reduced data inconsistencies by 95%.
- **Mentored team of 4 engineers**, conducting 100+ code reviews, establishing coding standards documentation, leading weekly architecture discussions, and creating onboarding materials that reduced ramp-up time from 3 months to 6 weeks.

### Software Engineer | DevShop
*2018 - 2021*

- **Built real-time collaboration features using WebSockets** serving 50K concurrent users with operational transformation algorithms, presence indicators, and conflict resolution that enabled Google Docs-style simultaneous editing.
- **Implemented automated testing suite reducing production bugs by 45%** through integration tests, contract testing for APIs, chaos engineering experiments, and establishing a culture of TDD that improved code coverage from 40% to 85%.
- **Designed and built GraphQL API layer for mobile applications**, implementing DataLoader for N+1 query prevention, persisted queries for performance, and subscription support that reduced mobile app API calls by 60%.
- **Led initiative to improve CI/CD pipeline**, reducing build times from 25 minutes to 8 minutes through parallelization, caching strategies, incremental builds, and moving to trunk-based development that increased deployment frequency 3x.
- **Mentored 5 junior developers through pair programming sessions**, code reviews, and creating internal documentation that became the go-to resource for onboarding, resulting in 100% retention of mentees over 2 years.

### Junior Developer | StartupLab
*2016 - 2018*

- **Developed RESTful APIs serving 100K+ users** with comprehensive OpenAPI documentation, rate limiting, authentication middleware, and versioning strategies that enabled seamless mobile app integration and third-party partnerships.
- **Built admin dashboard using React and Redux** with role-based access control, real-time data visualization, audit logging, and export functionality that reduced customer support tickets by 30% through self-service capabilities.
- **Contributed to open-source projects gaining 200+ stars**, including bug fixes for major libraries, documentation improvements, and feature additions that were merged into React ecosystem projects.
- **Implemented monitoring and alerting using Prometheus and Grafana**, creating custom dashboards, defining SLIs/SLOs, and establishing on-call runbooks that reduced mean time to detection from 30 minutes to 2 minutes.

---

## Education

### Bachelor of Computer Science | Tech University
*2012 - 2016*

- GPA: 3.9/4.0 – Dean's List all semesters
- Focus: Distributed Systems & Algorithms
- Teaching Assistant for Data Structures course – Taught 150+ students
- Senior Capstone: Distributed key-value store with Raft consensus

---

## Open Source & Projects

- **react-query-toolkit** - State management library with 2.5K GitHub stars, 500K+ npm downloads
- **go-microservice-template** - Production-ready microservice boilerplate used by 50+ companies
- **devops-handbook** - Comprehensive DevOps learning resources with 1K+ GitHub stars
- **Technical Blog** - 50K+ monthly readers covering system design, distributed systems, and career advice

---

## Certifications

- AWS Solutions Architect Professional
- Kubernetes Administrator (CKA)
- Google Cloud Professional Developer
- HashiCorp Terraform Associate`,
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
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [showGuideDialog, setShowGuideDialog] = useState(false);
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

  const handleDownloadPdf = () => {
    trackEvent(EVENTS.DOWNLOAD_PDF, "Download PDF");
    const colors = COLOR_SCHEMES[colorScheme];
    const scale = parseInt(fontSize) / 100;
    const font = FONTS[fontFamily];
    generatePdf(htmlContent, colors, scale, font.family, filename || "Resume");
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

          <Button type="button" onClick={() => setShowGuideDialog(true)} size="sm" className="cursor-pointer font-sans text-[13px] gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </Button>
        </div>
      </header>

      {/* Download Guide Dialog */}
      <Dialog open={showGuideDialog} onOpenChange={setShowGuideDialog}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
          <div className="relative w-full">
            <Image
              src="/guide.png"
              alt="Guide to save as PDF"
              width={1200}
              height={900}
              className="w-full h-auto"
            />
          </div>
          <div className="p-4 pt-0">
            <Button 
              onClick={() => {
                setShowGuideDialog(false);
                handleDownloadPdf();
              }}
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              Got it, open print dialog
            </Button>
          </div>
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

