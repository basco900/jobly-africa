"use client";

import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Bookmark02Icon,
  Briefcase01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  FilterHorizontalIcon,
  HeartAddIcon,
  InformationCircleIcon,
  Location01Icon,
  MoreHorizontalCircle01Icon,
  Navigation03Icon,
  Search01Icon,
  ShieldCheckIcon,
} from "@hugeicons/core-free-icons";
import jobsData from "./data/jobs.json";

type Job = (typeof jobsData)[number];
type JobAction = "interested" | "maybe" | "notInterested" | "passed";
type ChoiceKey = "industries" | "levels" | "locations" | "salary";

type Preferences = {
  industries: string[];
  levels: string[];
  locations: string[];
  salary: string[];
};

type LearningState = {
  categories: Record<string, number>;
  levels: Record<string, number>;
  modes: Record<string, number>;
  countries: Record<string, number>;
};

const iconProps = {
  strokeWidth: 1.7,
} as const;

const conciergeSteps: Array<{
  key: ChoiceKey;
  eyebrow: string;
  title: string;
  description: string;
  options: string[];
}> = [
  {
    key: "industries",
    eyebrow: "First, your direction",
    title: "What kind of work are you looking for?",
    description: "Pick as many as you like. We will use this to shape your first stack.",
    options: [
      "Technology",
      "Design",
      "Marketing",
      "Finance",
      "Operations",
      "Sales",
      "Healthcare",
      "Education",
      "Creative work",
      "Customer experience",
    ],
  },
  {
    key: "levels",
    eyebrow: "A little more context",
    title: "What level feels right for you?",
    description: "Choose one or more. You can always change this later.",
    options: ["Internship", "Graduate trainee", "Entry-level", "Mid-level", "Senior", "Open to anything"],
  },
  {
    key: "locations",
    eyebrow: "Make it realistic",
    title: "Where should we look?",
    description: "Tell us where work can fit into your life, not the other way around.",
    options: ["Remote", "Lagos", "Abuja", "Nairobi", "Accra", "Johannesburg", "Anywhere in Africa"],
  },
  {
    key: "salary",
    eyebrow: "The practical bit",
    title: "What kind of pay are you looking for?",
    description: "This stays private and helps us avoid showing you obvious mismatches.",
    options: ["Just show me the range", "Under ₦200k / month", "₦200k–₦500k / month", "₦500k+ / month"],
  },
];

const defaultPreferences: Preferences = {
  industries: [],
  levels: [],
  locations: [],
  salary: [],
};

const emptyLearning: LearningState = {
  categories: {},
  levels: {},
  modes: {},
  countries: {},
};

function Icon({ icon, size = 20, className = "" }: { icon: IconSvgElement; size?: number; className?: string }) {
  const keyedIcon = icon.map(([element, attributes], index) => [element, { ...attributes, key: attributes.key ?? String(index) }]) as IconSvgElement;
  return <HugeiconsIcon icon={keyedIcon} size={size} className={className} {...iconProps} />;
}

function shuffleJobs(items: Job[]) {
  return [...items].sort((a, b) => {
    const aScore = (Number(a.id.slice(-3)) * 37) % 101;
    const bScore = (Number(b.id.slice(-3)) * 37) % 101;
    return aScore - bScore;
  });
}

function bump(map: Record<string, number>, key: string, amount: number) {
  return { ...map, [key]: (map[key] ?? 0) + amount };
}

function scoreJob(job: Job, learning: LearningState, preferences: Preferences) {
  const preferenceBoost =
    (preferences.industries.includes(job.category) ? 14 : 0) +
    (preferences.levels.includes(job.level) ? 8 : 0) +
    (preferences.locations.some((location) => job.location.includes(location) || job.mode === location) ? 8 : 0);
  const learningBoost =
    (learning.categories[job.category] ?? 0) * 5 +
    (learning.levels[job.level] ?? 0) * 3 +
    (learning.modes[job.mode] ?? 0) * 2 +
    (learning.countries[job.country] ?? 0) * 2;
  return job.match + preferenceBoost + learningBoost + (job.verified ? 2 : 0) - job.posted * 0.15;
}

function formatPosted(days: number) {
  return days === 1 ? "Posted yesterday" : `Posted ${days} days ago`;
}

function CompanyMark({ job, large = false }: { job: Job; large?: boolean }) {
  return (
    <div className={`company-mark ${large ? "company-mark-large" : ""}`} aria-hidden="true">
      {job.initials}
    </div>
  );
}

function JobCard({
  job,
  offset,
  dragX,
  dragY,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onOpen,
}: {
  job: Job;
  offset: number;
  dragX: number;
  dragY: number;
  onPointerDown?: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove?: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp?: () => void;
  onOpen?: () => void;
}) {
  const rotation = offset === 0 ? dragX / 18 : offset * -1.35;
  const translateX = offset === 0 ? dragX : 0;
  const translateY = offset === 0 ? dragY : offset * 6;
  const scale = offset === 0 ? 1 : 1 - offset * 0.02;

  return (
    <div
      className={`job-card ${offset === 0 ? "job-card-active" : "job-card-behind"}`}
      style={{ transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotation}deg) scale(${scale})`, zIndex: 10 - offset, transition: offset === 0 && (dragX !== 0 || dragY !== 0) ? "none" : undefined }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={offset === 0 ? onOpen : undefined}
    >
      <div className="job-card-topline">
        <div className="job-company-lockup">
          <CompanyMark job={job} />
          <div>
            <p className="company-name">{job.company}</p>
            <p className="job-time">{formatPosted(job.posted)}</p>
          </div>
        </div>
        <button className="icon-button quiet-button" aria-label="More job actions" onClick={(event) => event.stopPropagation()}>
          <Icon icon={MoreHorizontalCircle01Icon} size={23} />
        </button>
      </div>

      <div className="job-card-context">
        <span>{job.category}</span>
        <span>{job.level}</span>
        <span>{job.mode}</span>
      </div>

      <div className="job-card-copy">
        <div className="job-title-row">
          <h3>{job.title}</h3>
          {job.verified && (
            <span className="verified-mark" title="Verified employer">
              <Icon icon={ShieldCheckIcon} size={18} />
            </span>
          )}
        </div>
        <p className="job-blurb">{job.blurb}</p>
      </div>

      <div className="job-meta-grid">
        <span className="job-meta-item">
          <Icon icon={Location01Icon} size={17} />
          {job.location}
        </span>
        <span className="job-meta-item">
          <Icon icon={Briefcase01Icon} size={17} />
          {job.type}
        </span>
        <span className="job-meta-item">
          <Icon icon={Clock01Icon} size={17} />
          Closes in {job.closing}d
        </span>
        <span className="job-meta-item job-meta-pay">{job.salary}</span>
      </div>

      <div className="job-card-footer">
        <div className="job-tags">
          {job.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="soft-tag">
              {tag}
            </span>
          ))}
        </div>
        <span className="match-score">
          <span className="match-dot" />
          {job.match}% fit
        </span>
      </div>

      <div className="card-open-hint">
        <span>Tap to view full role</span>
        <Icon icon={ArrowRight01Icon} size={16} />
      </div>
    </div>
  );
}

function ConciergeModal({
  step,
  preferences,
  onToggle,
  onBack,
  onNext,
  onSkip,
}: {
  step: number;
  preferences: Preferences;
  onToggle: (key: ChoiceKey, option: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const currentStep = conciergeSteps[step];
  const selected = preferences[currentStep.key];

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="concierge-title">
      <div className="concierge-modal">
        <div className="modal-head">
          <div className="brand-lockup compact-brand">
            <span className="brand-wordmark">jobly</span>
            <span className="brand-pulse" />
          </div>
          <button className="text-button" onClick={onSkip}>
            Skip for now
          </button>
        </div>

        <div className="progress-rail" aria-label={`Step ${step + 1} of ${conciergeSteps.length}`}>
          {conciergeSteps.map((item, index) => (
            <span key={item.key} className={`progress-segment ${index <= step ? "progress-segment-active" : ""}`} />
          ))}
        </div>

        <div className="concierge-heading">
          <p className="eyebrow">{currentStep.eyebrow}</p>
          <h2 id="concierge-title">{currentStep.title}</h2>
          <p>{currentStep.description}</p>
        </div>

        <div className="choice-grid">
          {currentStep.options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                className={`choice-pill ${isSelected ? "choice-pill-selected" : ""}`}
                onClick={() => onToggle(currentStep.key, option)}
                aria-pressed={isSelected}
              >
                <span>{option}</span>
                {isSelected && <Icon icon={CheckmarkCircle02Icon} size={17} />}
              </button>
            );
          })}
        </div>

        <div className="modal-footer">
          {step > 0 ? (
            <button className="back-button" onClick={onBack}>
              <Icon icon={ArrowLeft01Icon} size={18} />
              Back
            </button>
          ) : (
            <span className="step-caption">No commitment. Just better recommendations.</span>
          )}
          <button className="primary-button modal-next-button" onClick={onNext}>
            {step === conciergeSteps.length - 1 ? "Show my jobs" : "Continue"}
            <Icon icon={ArrowRight01Icon} size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function JobDetails({
  job,
  onClose,
  onDecision,
}: {
  job: Job;
  onClose: () => void;
  onDecision: (action: JobAction) => void;
}) {
  return (
    <div className="modal-backdrop details-backdrop" role="dialog" aria-modal="true" aria-labelledby="job-details-title">
      <div className="details-modal">
        <div className="details-handle" />
        <div className="details-head">
          <CompanyMark job={job} large />
          <button className="icon-button close-button" aria-label="Close job details" onClick={onClose}>
            <Icon icon={Cancel01Icon} size={22} />
          </button>
        </div>
        <div className="details-title-block">
          <div className="details-title-row">
            <h2 id="job-details-title">{job.title}</h2>
            {job.verified && (
              <span className="verified-label">
                <Icon icon={ShieldCheckIcon} size={16} /> Verified employer
              </span>
            )}
          </div>
          <p>{job.company}</p>
          <div className="details-location">
            <Icon icon={Location01Icon} size={17} />
            {job.location}
            <span className="details-divider" />
            {job.type}
          </div>
        </div>

        <div className="details-highlight-row">
          <div>
            <span>Pay range</span>
            <strong>{job.salary}</strong>
          </div>
          <div>
            <span>Match</span>
            <strong className="highlight-fit">{job.match}% fit</strong>
          </div>
          <div>
            <span>Closes</span>
            <strong>{job.closing} days</strong>
          </div>
        </div>

        <div className="details-section">
          <p className="eyebrow">The short version</p>
          <p className="details-blurb">{job.blurb} This is a role where thoughtful execution, clear communication, and a desire to make work better will be valued.</p>
        </div>

        <div className="details-section">
          <div className="section-heading-row">
            <p className="eyebrow">Why it is showing up</p>
            <span className="match-explainer">
              <Icon icon={InformationCircleIcon} size={16} /> Based on your activity
            </span>
          </div>
          <div className="match-reasons">
            <span>Role family is a strong match</span>
            <span>{job.mode} work preference</span>
            <span>Freshly verified listing</span>
          </div>
        </div>

        <div className="safety-note">
          <Icon icon={ShieldCheckIcon} size={21} />
          <div>
            <strong>Stay safe while applying</strong>
            <p>Jobly will never ask you to pay to apply. Keep your application inside trusted channels.</p>
          </div>
        </div>

        <div className="details-actions">
          <button className="secondary-button" onClick={() => onDecision("maybe")}>
            <Icon icon={Bookmark02Icon} size={19} /> Maybe
          </button>
          <button className="primary-button" onClick={() => onDecision("interested")}>
            <Icon icon={HeartAddIcon} size={20} /> Interested
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [isConciergeOpen, setIsConciergeOpen] = useState(true);
  const [conciergeStep, setConciergeStep] = useState(0);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [deck, setDeck] = useState<Job[]>(() => shuffleJobs(jobsData));
  const [learning, setLearning] = useState<LearningState>(emptyLearning);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All jobs");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dragValue = useRef({ x: 0, y: 0 });
  const suppressClick = useRef(false);

  const visibleJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return deck
      .filter((job) => {
        const searchable = `${job.title} ${job.company} ${job.category} ${job.location} ${job.tags.join(" ")}`.toLowerCase();
        const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
        const matchesFilter =
          activeFilter === "All jobs" ||
          (activeFilter === "Remote" && job.mode === "Remote") ||
          (activeFilter === "Entry-level" && (job.level === "Entry-level" || job.level === "Internship" || job.level === "Graduate trainee")) ||
          (activeFilter === "Verified" && job.verified);
        return matchesQuery && matchesFilter;
      })
      .slice(0, 4);
  }, [activeFilter, deck, query]);

  const activeJob = visibleJobs[0];

  const updatePreferences = (key: ChoiceKey, option: string) => {
    setPreferences((current) => {
      const selected = current[key];
      return { ...current, [key]: selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option] };
    });
  };

  const handleDecision = (jobId: string, action: JobAction) => {
    const target = deck.find((job) => job.id === jobId);
    if (!target) return;

    const amount = action === "interested" ? 2 : action === "notInterested" ? -2 : action === "maybe" ? 1 : 0;
    const nextLearning: LearningState = {
      categories: bump(learning.categories, target.category, amount),
      levels: bump(learning.levels, target.level, amount),
      modes: bump(learning.modes, target.mode, amount),
      countries: bump(learning.countries, target.country, amount),
    };

    setLearning(nextLearning);
    setDeck((current) => {
      const remaining = current.filter((job) => job.id !== jobId);
      return remaining.sort((a, b) => scoreJob(b, nextLearning, preferences) - scoreJob(a, nextLearning, preferences));
    });
    setDrag({ x: 0, y: 0 });
    dragValue.current = { x: 0, y: 0 };
  };

  const decisionForActive = (action: JobAction) => {
    if (activeJob) handleDecision(activeJob.id, action);
  };

  const moveThroughStack = (direction: "previous" | "next") => {
    if (!activeJob || visibleJobs.length < 2) return;

    const activeIndex = visibleJobs.findIndex((job) => job.id === activeJob.id);
    const nextIndex = direction === "next"
      ? (activeIndex + 1) % visibleJobs.length
      : (activeIndex - 1 + visibleJobs.length) % visibleJobs.length;
    const target = visibleJobs[nextIndex];

    setDeck((current) => {
      const next = current.filter((job) => job.id !== target.id);
      return [target, ...next];
    });
    setDrag({ x: 0, y: 0 });
    dragValue.current = { x: 0, y: 0 };
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!activeJob) return;
    dragStart.current = { x: event.clientX, y: event.clientY };
    suppressClick.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const value = { x: event.clientX - dragStart.current.x, y: (event.clientY - dragStart.current.y) * 0.35 };
    dragValue.current = value;
    if (Math.abs(value.x) > 8) suppressClick.current = true;
    setDrag(value);
  };

  const handlePointerUp = () => {
    if (!dragStart.current) return;
    const distance = Math.abs(dragValue.current.x);
    dragStart.current = null;
    if (distance > 96) {
      decisionForActive("passed");
    } else {
      setDrag({ x: 0, y: 0 });
      dragValue.current = { x: 0, y: 0 };
    }
  };

  const openJob = () => {
    if (!suppressClick.current && activeJob) setSelectedJob(activeJob);
    suppressClick.current = false;
  };

  const finishConcierge = () => {
    setIsConciergeOpen(false);
    setDeck((current) => [...current].sort((a, b) => scoreJob(b, learning, preferences) - scoreJob(a, learning, preferences)));
  };

  const focusStack = () => {
    setIsConciergeOpen(false);
    window.requestAnimationFrame(() => {
      document.getElementById("stack")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  return (
    <div className="jobly-page">
      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <h1>
              Find work that <em>fits</em> your life.
            </h1>
            <p className="hero-description">
              A calmer way for Africans to find work that fits. Browse real opportunities, make a few thoughtful choices, and let Jobly learn what feels right for you.
            </p>
            <div className="hero-cta-row">
              <button className="primary-button hero-button" onClick={focusStack}>
                Start Swiping
                <Icon icon={ArrowRight01Icon} size={19} />
              </button>
              <Link className="text-link-button" href="/jobs">
                Browse all jobs
                <Icon icon={ArrowRight01Icon} size={17} />
              </Link>
            </div>
            <div className="hero-trust-row">
              <div className="trust-avatars" aria-hidden="true">
                <span>AM</span>
                <span>KO</span>
                <span>ZN</span>
                <span>TB</span>
                <span className="trust-more">+</span>
              </div>
              <p>Trusted by Thousands of Africans.</p>
            </div>
          </div>
        </section>

        <section className="discovery-section" id="discover">
          <div className="discovery-toolbar">
            <label className="search-field">
              <Icon icon={Search01Icon} size={20} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search roles, skills or companies" aria-label="Search jobs" />
            </label>
            <div className="toolbar-actions">
              <button className="filter-button" onClick={() => setFilterOpen((current) => !current)} aria-expanded={filterOpen}>
                <Icon icon={FilterHorizontalIcon} size={19} />
                <span>Filters</span>
                {activeFilter !== "All jobs" && <b>1</b>}
              </button>
              <button className="location-button" aria-label="Current location">
                <Icon icon={Location01Icon} size={18} />
                <span>Anywhere in Africa</span>
              </button>
            </div>
          </div>

          {filterOpen && (
            <div className="filter-panel">
              <span className="filter-label">Show me</span>
              {["All jobs", "Remote", "Entry-level", "Verified"].map((filter) => (
                <button key={filter} className={`filter-chip ${activeFilter === filter ? "filter-chip-active" : ""}`} onClick={() => { setActiveFilter(filter); setFilterOpen(false); }}>
                  {filter}
                </button>
              ))}
            </div>
          )}

          <div className="discovery-grid">
            <div className="deck-column" id="stack">
              <div className="deck-header">
                <button className="view-toggle" onClick={() => setIsConciergeOpen(true)}>
                  Tune my feed <Icon icon={ArrowRight01Icon} size={16} />
                </button>
                <div className="deck-header-actions">
                  <div className="deck-nav" aria-label="Browse job stack">
                    <button className="deck-nav-button" onClick={() => moveThroughStack("previous")} disabled={visibleJobs.length < 2} aria-label="Previous job">
                      <Icon icon={ArrowLeft01Icon} size={17} />
                    </button>
                    <button className="deck-nav-button" onClick={() => moveThroughStack("next")} disabled={visibleJobs.length < 2} aria-label="Next job">
                      <Icon icon={ArrowRight01Icon} size={17} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="job-deck" aria-live="polite">
                {visibleJobs.length > 0 ? visibleJobs.slice(0, 3).map((job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    offset={index}
                    dragX={drag.x}
                    dragY={drag.y}
                    onPointerDown={index === 0 ? handlePointerDown : undefined}
                    onPointerMove={index === 0 ? handlePointerMove : undefined}
                    onPointerUp={index === 0 ? handlePointerUp : undefined}
                    onOpen={index === 0 ? openJob : undefined}
                  />
                )) : (
                  <div className="empty-deck">
                    <div className="empty-icon"><Icon icon={Search01Icon} size={28} /></div>
                    <h3>No roles found yet.</h3>
                    <p>Try a lighter search or clear the filter and let us surprise you.</p>
                    <button className="secondary-button" onClick={() => { setQuery(""); setActiveFilter("All jobs"); }}>Reset view</button>
                  </div>
                )}
              </div>

              {activeJob && (
                <div className="deck-actions" aria-label="React to this job">
                  <button className="deck-action deck-action-pass" onClick={() => decisionForActive("notInterested")}>
                    <span><Icon icon={Cancel01Icon} size={21} /></span>
                    <small>Not interested</small>
                  </button>
                  <button className="deck-action deck-action-maybe" onClick={() => decisionForActive("maybe")}>
                    <span><Icon icon={Bookmark02Icon} size={21} /></span>
                    <small>Maybe</small>
                  </button>
                  <button className="deck-action deck-action-love" onClick={() => decisionForActive("interested")}>
                    <span><Icon icon={HeartAddIcon} size={22} /></span>
                    <small>Interested</small>
                  </button>
                </div>
              )}
            </div>

            <aside className="discovery-sidebar">
              <div className="sidebar-card sidebar-card-dark">
                <div className="sidebar-card-topline">
                  <span className="mini-label">HOW JOBLY LEARNS</span>
                  <Icon icon={Navigation03Icon} size={21} />
                </div>
                <h3>Your feed gets more <em>you</em> with every choice.</h3>
                <p>Interested, Maybe, Not interested, or simply passing — every signal helps us tune the next role.</p>
                <div className="signal-row">
                  <span className="signal signal-love"><Icon icon={HeartAddIcon} size={16} /></span>
                  <span className="signal signal-maybe"><Icon icon={Bookmark02Icon} size={16} /></span>
                  <span className="signal signal-pass"><Icon icon={Cancel01Icon} size={16} /></span>
                  <span className="signal-text">Your choices stay in your hands.</span>
                </div>
              </div>
              <div className="sidebar-card sidebar-card-light" id="safety">
                <div className="safety-card-icon"><Icon icon={ShieldCheckIcon} size={22} /></div>
                <div>
                  <h3>Real roles. Clear signals.</h3>
                  <p>Verified employers and no pay-to-apply surprises.</p>
                </div>
                <Icon icon={ArrowRight01Icon} size={18} />
              </div>
            </aside>
          </div>
        </section>

        <section className="principles-section" id="how-it-works">
          <div className="principles-heading">
            <p className="eyebrow">A better way to look</p>
            <h2>Less noise.<br /><em>More possibility.</em></h2>
          </div>
          <div className="principle-list">
            <div className="principle-item"><span className="principle-number">01</span><div><h3>Start with your reality</h3><p>Location, level, pay, and work style come before a feed full of noise.</p></div></div>
            <div className="principle-item"><span className="principle-number">02</span><div><h3>Explore without pressure</h3><p>Save, pass, or keep looking. A quick look is not a commitment.</p></div></div>
            <div className="principle-item"><span className="principle-number">03</span><div><h3>Know what you are getting</h3><p>We make the important details — pay, location, trust, and fit — easy to see.</p></div></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="brand-lockup compact-brand"><span className="brand-wordmark">jobly</span><span className="brand-pulse" /></div>
        <p>Work that moves Africa forward.</p>
        <div className="footer-links"><a href="#safety">Safety</a><a href="#how-it-works">About</a><a href="#top">Back to top <Icon icon={ArrowRight01Icon} size={14} /></a></div>
      </footer>

      {isConciergeOpen && (
        <ConciergeModal
          step={conciergeStep}
          preferences={preferences}
          onToggle={updatePreferences}
          onBack={() => setConciergeStep((current) => Math.max(current - 1, 0))}
          onNext={() => conciergeStep === conciergeSteps.length - 1 ? finishConcierge() : setConciergeStep((current) => current + 1)}
          onSkip={() => setIsConciergeOpen(false)}
        />
      )}

      {selectedJob && <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} onDecision={(action) => { handleDecision(selectedJob.id, action); setSelectedJob(null); }} />}
    </div>
  );
}
