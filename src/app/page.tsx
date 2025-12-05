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
import { trackEvent, EVENTS } from "@/lib/analytics";
import SiteStats from "@/components/SiteStats";

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
    markdown: `# Your Full Name

[your.email@example.com](mailto:your.email@example.com) | [Phone Number](tel:+1234567890) | [LinkedIn](https://linkedin.com/in/yourname) | [Portfolio/GitHub](https://github.com/yourname)

---

## Summary

Write a brief professional summary (2-3 sentences) highlighting your experience, skills, and career goals.

---

## Experience

### Job Title | Company Name
*Start Date - End Date*

- Key achievement or responsibility with quantifiable results
- Another important achievement or project
- Impact you made or skills you developed

### Previous Job Title | Previous Company
*Start Date - End Date*

- Achievement or responsibility
- Another achievement
- Results or impact

---

## Education

### Degree Name | University Name
*Graduation Year*

- Relevant coursework, honors, or achievements
- GPA (if above 3.5)

---

## Skills

**Category 1:** Skill 1, Skill 2, Skill 3  
**Category 2:** Skill 4, Skill 5, Skill 6  
**Category 3:** Skill 7, Skill 8

---

## Projects / Certifications / Achievements

- Project or certification name with brief description
- Another achievement or certification
- Relevant accomplishment`,
    color: "#3b82f6",
    font: "Arial, sans-serif",
    size: "90",
  },
  {
    id: "engineer",
    name: "Systems Engineer",
    description: "For Backend, DevOps & AI Engineers",
    color: "#1e40af",
    font: "var(--font-merriweather), Georgia, serif",
    size: "100",
    markdown: `# Aditya Kumar Mandal

📧 [adityanick08@gmail.com](mailto:adityanick08@gmail.com) | 📱 [9709094xxx](tel:9709094xxx) | 💼 [linkedin](https://linkedin.com/in/adityakmandal) | 🐙 [github](https://github.com/akm-akm)

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
  {
    id: "professional",
    name: "Sales Professional",
    description: "Perfect for Sales & Business Development",
    color: "#3b82f6",
    font: "Arial, sans-serif",
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
  {
    id: "modern",
    name: "Product Manager",
    description: "Ideal for Managers & Team Leads",
    color: "#7c3aed",
    font: "Calibri, sans-serif",
    size: "110",
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
  {
    id: "minimal",
    name: "Full-Stack Developer",
    description: "Best for Software Engineers & Developers",
    color: "#4b5563",
    font: "Calibri, 'Gill Sans', sans-serif",
    size: "100",
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
];

const TemplatePreview = ({ markdown, color, font, size }: { markdown: string; color?: string; font?: string; size?: string }) => {
  const [html, setHtml] = useState("");
  const primaryColor = color || "#3b82f6";
  const fontFamily = font || "Arial, sans-serif";
  const fontSize = size ? (11 * parseInt(size) / 100) : 11;

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
          fontSize: `${fontSize}px`,
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
              "url": "https://makemyresume.veeboo.in",
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
              "screenshot": "https://makemyresume.veeboo.in/screenshot.png",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250"
              }
            })
          }}
        />

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-4 text-slate-900">
            MakeMyResume - Free Resume Builder
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Create professional, ATS-friendly resumes in minutes. Choose from expert-designed templates and download as PDF instantly. No signup required.
          </p>
          
          {/* Create New Resume Button - Always First */}
          <div className="max-w-7xl mx-auto mb-12">
            <Link href="/editor?template=blank">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg font-semibold">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Resume
              </Button>
            </Link>
          </div>
        </div>

        {/* Your Resumes - Show if exists */}
        {savedDocs.length > 0 && (
          <div className="max-w-7xl mx-auto mb-16">
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
                          size={doc.fontSize || "90"}
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

        {/* Templates - Show if no saved resumes, or below saved resumes */}
        {savedDocs.length === 0 && (
          <div className="max-w-7xl mx-auto mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-slate-900">Or Start from a Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {templates.filter(t => t.id !== "blank").map((template) => (
                <Link 
                  key={template.id} 
                  href={`/editor?template=${template.id}`}
                  onClick={() => trackEvent(EVENTS.TEMPLATE_CLICK(template.id), `Template: ${template.name}`)}
                >
                  <div className="h-full border border-slate-200 hover:border-slate-400 transition-colors cursor-pointer bg-white/80 backdrop-blur-sm">
                    <div className="p-4">
                      <TemplatePreview 
                        markdown={template.markdown} 
                        color={template.color}
                        font={template.font}
                        size={template.size}
                      />
                      <h3 className="text-lg font-semibold mt-4 mb-2">{template.name}</h3>
                      <p className="text-sm text-slate-600">{template.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Templates - Show below saved resumes if they exist */}
        {savedDocs.length > 0 && (
          <div className="max-w-7xl mx-auto mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-slate-900">Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {templates.filter(t => t.id !== "blank").map((template) => (
                <Link 
                  key={template.id} 
                  href={`/editor?template=${template.id}`}
                  onClick={() => trackEvent(EVENTS.TEMPLATE_CLICK(template.id), `Template: ${template.name}`)}
                >
                  <div className="h-full border border-slate-200 hover:border-slate-400 transition-colors cursor-pointer bg-white/80 backdrop-blur-sm">
                    <div className="p-4">
                      <TemplatePreview 
                        markdown={template.markdown} 
                        color={template.color}
                        font={template.font}
                        size={template.size}
                      />
                      <h3 className="text-lg font-semibold mt-4 mb-2">{template.name}</h3>
                      <p className="text-sm text-slate-600">{template.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Stats - Fixed at bottom */}
        <div className="fixed bottom-4 right-4 z-50">
          <SiteStats />
        </div>
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
          <span>Home - Free Resume Builder - https://makemyresume.veeboo.in/</span>
          <span>Resume Editor - Create Resume Online - https://makemyresume.veeboo.in/editor</span>
          <span>Professional Resume Template - https://makemyresume.veeboo.in/editor?template=professional</span>
          <span>Modern Resume Template - https://makemyresume.veeboo.in/editor?template=modern</span>
          <span>Minimal Resume Template - https://makemyresume.veeboo.in/editor?template=minimal</span>
        </nav>
      </div>
    </div>
  );
}
