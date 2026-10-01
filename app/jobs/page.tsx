"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Briefcase01Icon,
  Clock01Icon,
  Location01Icon,
  Search01Icon,
  ShieldCheckIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import jobsData from "../data/jobs.json";

type Job = (typeof jobsData)[number] & {
  remoteEligibility?: string;
  remoteEligibleCountries?: string[];
};

type AfricanCountry = { name: string; code: string; regions?: string[] };

const africanCountries: AfricanCountry[] = [
  { name: "Algeria", code: "DZ" }, { name: "Angola", code: "AO" }, { name: "Benin", code: "BJ" },
  { name: "Botswana", code: "BW" }, { name: "Burkina Faso", code: "BF" }, { name: "Burundi", code: "BI" },
  { name: "Cabo Verde", code: "CV" }, { name: "Cameroon", code: "CM" }, { name: "Central African Republic", code: "CF" },
  { name: "Chad", code: "TD" }, { name: "Comoros", code: "KM" }, { name: "Côte d’Ivoire", code: "CI" },
  { name: "Democratic Republic of the Congo", code: "CD" }, { name: "Djibouti", code: "DJ" }, { name: "Egypt", code: "EG" },
  { name: "Equatorial Guinea", code: "GQ" }, { name: "Eritrea", code: "ER" }, { name: "Eswatini", code: "SZ" },
  { name: "Ethiopia", code: "ET" }, { name: "Gabon", code: "GA" }, { name: "The Gambia", code: "GM" },
  { name: "Ghana", code: "GH", regions: ["Ashanti Region", "Greater Accra Region", "Western Region"] },
  { name: "Guinea", code: "GN" }, { name: "Guinea-Bissau", code: "GW" }, { name: "Kenya", code: "KE", regions: ["Kisumu County", "Mombasa County", "Nairobi County"] },
  { name: "Lesotho", code: "LS" }, { name: "Liberia", code: "LR" }, { name: "Libya", code: "LY" },
  { name: "Madagascar", code: "MG" }, { name: "Malawi", code: "MW" }, { name: "Mali", code: "ML" },
  { name: "Mauritania", code: "MR" }, { name: "Mauritius", code: "MU" }, { name: "Morocco", code: "MA" },
  { name: "Mozambique", code: "MZ" }, { name: "Namibia", code: "NA" }, { name: "Niger", code: "NE" },
  { name: "Nigeria", code: "NG", regions: ["Federal Capital Territory", "Lagos State", "Oyo State"] },
  { name: "Republic of the Congo", code: "CG" }, { name: "Rwanda", code: "RW", regions: ["Kigali City", "Northern Province", "Southern Province"] },
  { name: "São Tomé and Príncipe", code: "ST" }, { name: "Senegal", code: "SN" }, { name: "Seychelles", code: "SC" },
  { name: "Sierra Leone", code: "SL" }, { name: "Somalia", code: "SO" },
  { name: "South Africa", code: "ZA", regions: ["Gauteng", "KwaZulu-Natal", "Western Cape"] },
  { name: "South Sudan", code: "SS" }, { name: "Sudan", code: "SD" }, { name: "Tanzania", code: "TZ" },
  { name: "Togo", code: "TG" }, { name: "Tunisia", code: "TN" }, { name: "Uganda", code: "UG", regions: ["Jinja District", "Kampala District", "Wakiso District"] },
  { name: "Zambia", code: "ZM" }, { name: "Zimbabwe", code: "ZW" },
];

const africanCountryCodes = new Set(africanCountries.map((country) => country.code));
const africanCountryNames = new Set(africanCountries.map((country) => country.name));
const regionByCity: Record<string, string> = {
  Accra: "Greater Accra Region", Abuja: "Federal Capital Territory", "Cape Town": "Western Cape", Durban: "KwaZulu-Natal",
  Entebbe: "Wakiso District", Huye: "Southern Province", Ibadan: "Oyo State", Jinja: "Jinja District",
  Johannesburg: "Gauteng", Kampala: "Kampala District", Kigali: "Kigali City", Kisumu: "Kisumu County",
  Kumasi: "Ashanti Region", Lagos: "Lagos State", Mombasa: "Mombasa County", Musanze: "Northern Province",
  Nairobi: "Nairobi County", Takoradi: "Western Region",
};

const iconProps = { strokeWidth: 1.7 } as const;
const categories = ["All industries", ...Array.from(new Set(jobsData.map((job) => job.category)))];
const categoryCounts = Object.fromEntries(categories.map((name) => [
  name,
  name === "All industries" ? jobsData.length : jobsData.filter((job) => job.category === name).length,
])) as Record<string, number>;
const levels = ["Internship", "GTP", "Entry-level", "Mid-level", "Senior", "All levels"];
const workStyleOptions = ["Remote", "Hybrid", "On-site"];

function getRemoteEligibility(job: Job) {
  if (job.remoteEligibility) return job.remoteEligibility;
  if (job.location === "Remote · Africa") return "africa";
  if (job.location === "Remote · Worldwide") return "worldwide";
  return null;
}

function canWorkRemotelyFrom(job: Job, countryCode: string) {
  const eligibility = getRemoteEligibility(job);
  if (eligibility === "worldwide" || eligibility === "africa") return true;
  if (job.remoteEligibleCountries?.includes(countryCode)) return true;
  return job.country === africanCountries.find((country) => country.code === countryCode)?.name;
}

function matchesLocation(job: Job, selection: string) {
  if (selection === "africa") {
    if (job.mode === "Remote") {
      return getRemoteEligibility(job) === "africa" || getRemoteEligibility(job) === "worldwide" ||
        (job.remoteEligibleCountries?.some((code) => africanCountryCodes.has(code)) ?? false);
    }
    return africanCountryNames.has(job.country);
  }

  if (selection === "remote-worldwide") return job.mode === "Remote" && getRemoteEligibility(job) === "worldwide";

  const [scope, countryCode, region] = selection.split(":");
  const country = africanCountries.find((item) => item.code === countryCode);
  if (scope === "country" && country) {
    return job.mode === "Remote" ? canWorkRemotelyFrom(job, countryCode) : job.country === country.name;
  }
  if (scope === "region" && country && region) {
    if (job.mode === "Remote") return canWorkRemotelyFrom(job, countryCode);
    const city = job.location.split(",")[0];
    return job.country === country.name && regionByCity[city] === region;
  }
  return true;
}

function Icon({ icon, size = 20, className }: { icon: IconSvgElement; size?: number; className?: string }) {
  const keyedIcon = icon.map(([element, attributes], index) => [element, { ...attributes, key: attributes.key ?? String(index) }]) as IconSvgElement;
  return <HugeiconsIcon icon={keyedIcon} size={size} className={className} {...iconProps} />;
}

function formatPosted(days: number) {
  return days === 1 ? "Posted yesterday" : `Posted ${days} days ago`;
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  counts,
  contentClassName,
  triggerClassName,
  align,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  counts?: Record<string, number>;
  contentClassName?: string;
  triggerClassName?: string;
  align?: "start" | "center" | "end";
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`jobs-select-trigger ${triggerClassName ?? ""}`} aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className={`jobs-select-content ${contentClassName ?? ""}`} align={align}>
        {options.map((option) => (
          <SelectItem key={option} value={option} count={counts?.[option]} className="jobs-select-item">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function LocationFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="jobs-location-field">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="jobs-select-trigger jobs-location-trigger" aria-label="Filter by location">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="jobs-select-content jobs-location-menu" align="start">
          <SelectGroup>
            <SelectLabel>Browse</SelectLabel>
            <SelectItem value="africa" className="jobs-select-item">Across Africa</SelectItem>
            <SelectItem value="remote-worldwide" className="jobs-select-item">Remote worldwide</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>African countries</SelectLabel>
            {africanCountries.map((country) => (
              <SelectItem key={country.code} value={`country:${country.code}`} className="jobs-select-item">
                {country.name}
              </SelectItem>
            ))}
          </SelectGroup>
          {africanCountries.filter((country) => country.regions).map((country) => (
            <SelectGroup key={country.code}>
              <SelectLabel>States & regions · {country.name}</SelectLabel>
              {country.regions?.map((region) => (
                <SelectItem key={region} value={`region:${country.code}:${region}`} className="jobs-select-item">
                  {region}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function WorkStyleFilter({ selected, onToggle }: { selected: string[]; onToggle: (style: string) => void }) {
  return (
    <fieldset className="jobs-work-style-options" aria-label="Work style">
      {workStyleOptions.map((style) => (
        <label className="jobs-work-style-option" key={style}>
          <input type="checkbox" checked={selected.includes(style)} onChange={() => onToggle(style)} />
          <span>{style}</span>
        </label>
      ))}
    </fieldset>
  );
}

function BrowseRow({ job }: { job: Job }) {
  const tone = Number(job.id.match(/\d+/)?.[0] ?? 0) % 4;

  return (
    <article className="jobs-list-card" id={`job-${job.id}`}>
      <Link className="jobs-company-logo" data-tone={tone} href={`/jobs/${job.id}`} aria-label={`${job.company} logo — view ${job.title}`}>
        {job.initials}
      </Link>

      <div className="jobs-list-main">
        <div className="jobs-company-line">
          <p className="jobs-company-name">{job.company}</p>
          {job.verified && (
            <span className="jobs-verified">
              <Icon icon={ShieldCheckIcon} size={14} /> Verified
            </span>
          )}
        </div>
        <h2><Link href={`/jobs/${job.id}`}>{job.title}</Link></h2>
        <div className="jobs-row-eyebrow">
          <p className="jobs-category-label">{job.category}</p>
          <span className="jobs-eyebrow-dot" aria-hidden="true" />
          <span className="jobs-posted">{formatPosted(job.posted)}</span>
        </div>
        <p className="jobs-list-blurb">{job.blurb}</p>
      </div>

      <div className="jobs-list-aside">
        <span className="jobs-fit"><span aria-hidden="true" />{job.match}% fit</span>
        <div className="jobs-list-tags" aria-label="Relevant skills">
          {job.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <span className="jobs-closing-note"><Icon icon={Clock01Icon} size={14} /> Closes in {job.closing}d</span>
      </div>

      <div className="jobs-list-meta">
        <span><Icon icon={Location01Icon} size={15} />{job.location}</span>
        <span><Icon icon={Briefcase01Icon} size={15} />{job.type}</span>
        <strong>{job.salary}</strong>
      </div>
    </article>
  );
}

export default function JobsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All industries");
  const [level, setLevel] = useState("All levels");
  const [location, setLocation] = useState("africa");
  const [workStyles, setWorkStyles] = useState<string[]>([]);
  const [sort, setSort] = useState("Best match");
  const [visibleCount, setVisibleCount] = useState(18);

  const updateQuery = (value: string) => {
    setQuery(value);
    setVisibleCount(18);
  };

  const updateCategory = (value: string) => {
    setCategory(value);
    setVisibleCount(18);
  };

  const updateLevel = (value: string) => {
    setLevel(value);
    setVisibleCount(18);
  };

  const updateLocation = (value: string) => {
    setLocation(value);
    setVisibleCount(18);
  };

  const toggleWorkStyle = (style: string) => {
    setWorkStyles((current) => current.includes(style)
      ? current.filter((item) => item !== style)
      : [...current, style]);
    setVisibleCount(18);
  };

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const next = jobsData.filter((job) => {
      const searchable = `${job.title} ${job.company} ${job.category} ${job.location} ${job.tags.join(" ")}`.toLowerCase();
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesCategory = category === "All industries" || job.category === category;
      const matchesLevel = level === "All levels" || (level === "GTP" ? job.level === "Graduate trainee" : job.level === level);
      const matchesSelectedLocation = matchesLocation(job, location);
      const matchesMode = workStyles.length === 0 || workStyles.includes(job.mode);
      return matchesQuery && matchesCategory && matchesLevel && matchesSelectedLocation && matchesMode;
    });

    return next.sort((a, b) => {
      if (sort === "Newest") return a.posted - b.posted || b.match - a.match;
      if (sort === "Closing soon") return a.closing - b.closing || b.match - a.match;
      return b.match - a.match || a.posted - b.posted;
    });
  }, [category, level, location, query, sort, workStyles]);

  const popularCategories = categories
    .filter((item) => item !== "All industries")
    .slice(0, 5)
    .map((name) => ({ name, count: jobsData.filter((job) => job.category === name).length }));

  const resetFilters = () => {
    setQuery("");
    setCategory("All industries");
    setLevel("All levels");
    setLocation("africa");
    setWorkStyles([]);
    setSort("Best match");
    setVisibleCount(18);
  };

  return (
    <div className="jobs-page">
      <main className="jobs-main">
        <section className="jobs-browser" aria-label="Browse all jobs">
          <div className="jobs-heading-row">
            <h1>Explore work that <em>fits.</em></h1>
          </div>

          <div className="jobs-content-grid">
            <div className="jobs-results-column">
              <div className="jobs-search-row">
                <div className="jobs-search-field" role="search">
                  <Icon icon={Search01Icon} size={19} />
                  <Input
                    className="jobs-search-input"
                    value={query}
                    onChange={(event) => updateQuery(event.target.value)}
                    placeholder="Search roles, skills or companies"
                    aria-label="Search all jobs"
                  />
                  {query && (
                    <button type="button" className="jobs-search-clear" aria-label="Clear search" onClick={() => updateQuery("")}>
                      <span aria-hidden="true">×</span>
                    </button>
                  )}
                </div>
                <div className="jobs-level-field">
                  <FilterSelect
                    label="Experience level"
                    value={level}
                    options={levels}
                    onChange={updateLevel}
                    triggerClassName="jobs-level-trigger"
                  />
                </div>
                <div className="jobs-industry-field">
                  <FilterSelect
                    label="Industry"
                    value={category}
                    options={categories}
                    onChange={updateCategory}
                    counts={categoryCounts}
                    contentClassName="jobs-industry-menu"
                    align="start"
                  />
                </div>
                <LocationFilter value={location} onChange={updateLocation} />
              </div>

              <div className="jobs-filter-row" aria-label="Refine job results">
                <WorkStyleFilter selected={workStyles} onToggle={toggleWorkStyle} />
              </div>

              <div className="jobs-results-heading">
                <p aria-live="polite"><strong>{filteredJobs.length}</strong><span>{filteredJobs.length === 1 ? "role to explore" : "roles to explore"}</span></p>
                <div className="jobs-results-actions">
                  {(query || category !== "All industries" || level !== "All levels" || location !== "africa" || workStyles.length > 0) && (
                    <Button variant="ghost" size="sm" className="jobs-clear-button" onClick={resetFilters}>Clear filters</Button>
                  )}
                  <FilterSelect
                    label="Sort jobs"
                    value={sort}
                    options={["Best match", "Newest", "Closing soon"]}
                    onChange={setSort}
                    triggerClassName="jobs-sort-trigger"
                    contentClassName="jobs-sort-menu"
                    align="end"
                  />
                </div>
              </div>

              {filteredJobs.length > 0 ? (
                <div className="jobs-list">
                  {filteredJobs.slice(0, visibleCount).map((job) => <BrowseRow key={job.id} job={job} />)}
                </div>
              ) : (
                <div className="jobs-empty-state">
                  <span className="jobs-empty-icon"><Icon icon={Search01Icon} size={22} /></span>
                  <h2>No roles found this time.</h2>
                  <p>Try a different search or loosen one of your filters.</p>
                  <Button variant="subtle" onClick={resetFilters}>Clear search & filters</Button>
                </div>
              )}

              {filteredJobs.length > visibleCount && (
                <div className="jobs-load-more-wrap">
                  <span>Showing {Math.min(visibleCount, filteredJobs.length)} of {filteredJobs.length}</span>
                  <Button variant="subtle" className="jobs-load-more" onClick={() => setVisibleCount((count) => count + 18)}>
                    Show more roles <Icon icon={ArrowRight01Icon} size={16} />
                  </Button>
                </div>
              )}
            </div>

            <aside className="jobs-sidebar" aria-label="Job discovery sidebar">
              <section className="jobs-sidebar-section">
                <div className="jobs-sidebar-heading">
                  <div><span>EXPLORE</span><h2>Popular fields</h2></div>
                </div>
                <div className="jobs-popular-list">
                  {popularCategories.map((item, index) => (
                    <button key={item.name} type="button" aria-pressed={category === item.name} onClick={() => updateCategory(item.name)}>
                      <span className="jobs-popular-number">0{index + 1}</span>
                      <span className="jobs-popular-name">{item.name}</span>
                      <span className="jobs-popular-count">{item.count}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="jobs-sidebar-note">
                <span className="jobs-note-icon"><Icon icon={ShieldCheckIcon} size={19} /></span>
                <p>JOBLY SAFETY</p>
                <h2>Your next move should feel safe.</h2>
                <span>Never pay to apply. Take your time and check every opportunity.</span>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
