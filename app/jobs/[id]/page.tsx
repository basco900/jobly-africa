import Link from "next/link";
import { notFound } from "next/navigation";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Briefcase01Icon,
  Clock01Icon,
  Location01Icon,
  ShieldCheckIcon,
} from "@hugeicons/core-free-icons";
import { JobDetailActions } from "@/components/job-detail-actions";
import jobsData from "../../data/jobs.json";

const iconProps = { strokeWidth: 1.7 } as const;

function Icon({ icon, size = 19 }: { icon: IconSvgElement; size?: number }) {
  const keyedIcon = icon.map(([element, attributes], index) => [element, { ...attributes, key: attributes.key ?? String(index) }]) as IconSvgElement;
  return <HugeiconsIcon icon={keyedIcon} size={size} {...iconProps} />;
}

function formatPosted(days: number) {
  if (days === 0) return "Posted today";
  return days === 1 ? "Posted yesterday" : `Posted ${days} days ago`;
}

export default async function JobDetailPage({ params }: PageProps<"/jobs/[id]">) {
  const { id } = await params;
  const job = jobsData.find((item) => item.id === id);

  if (!job) notFound();

  return (
    <main className="job-detail-page">
      <div className="job-detail-shell">
        <Link href="/jobs" className="job-detail-back"><Icon icon={ArrowLeft01Icon} size={17} /> All jobs</Link>

        <div className="job-detail-grid">
          <article className="job-detail-content">
            <header className="job-detail-heading">
              <div className="job-detail-company-mark" aria-hidden="true">{job.initials}</div>
              <div className="job-detail-heading-copy">
                <div className="job-detail-eyebrow">
                  <span>{job.category}</span><i aria-hidden="true" />{formatPosted(job.posted)}
                </div>
                <h1>{job.title}</h1>
                <div className="job-detail-company-line">
                  <span>{job.company}</span>
                  {job.verified && <span className="job-detail-verified"><Icon icon={ShieldCheckIcon} size={15} /> Verified employer</span>}
                </div>
              </div>
            </header>

            <section className="job-detail-intro">
              <div className="job-detail-quick-facts">
                <span><Icon icon={Location01Icon} />{job.location}</span>
                <span><Icon icon={Briefcase01Icon} />{job.type}</span>
                <span><Icon icon={Clock01Icon} />Closes in {job.closing} days</span>
              </div>
            </section>

            <section className="job-detail-section">
              <p className="job-detail-kicker">ABOUT THE ROLE</p>
              <h2>Role overview</h2>
              <p className="job-detail-body">{job.blurb}</p>
            </section>

            <section className="job-detail-section job-detail-skills-section">
              <p className="job-detail-kicker">GOOD TO KNOW</p>
              <h2>Skills and role signals</h2>
              <div className="job-detail-tags">
                {job.tags.map((tag) => <span key={tag}>{tag}</span>)}
                <span>{job.level}</span>
                <span>{job.mode}</span>
              </div>
            </section>

            <section className="job-detail-safety">
              <span className="job-detail-safety-icon"><Icon icon={ShieldCheckIcon} size={20} /></span>
              <div><h2>Keep your search safe</h2><p>Never pay a recruiter or employer to apply for a job. Be cautious with requests for money or sensitive personal information.</p></div>
            </section>
          </article>

          <aside className="job-detail-aside" aria-label="Job summary">
            <section className="job-summary-card">
              <p className="job-detail-kicker">ROLE SUMMARY</p>
              <p className="job-summary-salary">{job.salary}</p>
              <p className="job-summary-salary-caption">Compensation shared by the employer</p>
              <div className="job-summary-facts">
                <div><span>Location</span><strong>{job.location}</strong></div>
                <div><span>Employment</span><strong>{job.type}</strong></div>
                <div><span>Experience</span><strong>{job.level}</strong></div>
                <div><span>Application closes</span><strong>{job.closing} days</strong></div>
              </div>
              <JobDetailActions jobId={job.id} />
              <p className="job-summary-footnote">No pressure. Save it, show interest, or keep exploring.</p>
            </section>

            <section className="job-company-card">
              <p className="job-detail-kicker">THE EMPLOYER</p>
              <div className="job-company-card-row">
                <span className="job-detail-company-mark" aria-hidden="true">{job.initials}</span>
                <div><h2>{job.company}</h2><p>{job.country}</p></div>
              </div>
              {job.verified && <p className="job-company-verification"><Icon icon={ShieldCheckIcon} size={15} /> Employer verified by Jobly</p>}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
