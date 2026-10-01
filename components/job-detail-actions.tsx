"use client";

import { useState } from "react";
import { Bookmark02Icon, HeartAddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

export function JobDetailActions({ jobId }: { jobId: string }) {
  const [interested, setInterested] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="job-summary-actions" data-job-id={jobId}>
      <Button
        type="button"
        className="job-interest-button"
        variant={interested ? "subtle" : "default"}
        aria-pressed={interested}
        onClick={() => setInterested((value) => !value)}
      >
        <HugeiconsIcon icon={HeartAddIcon} size={19} strokeWidth={1.7} />
        {interested ? "Interest noted" : "I’m interested"}
      </Button>
      <Button
        type="button"
        className="job-save-button"
        variant={saved ? "subtle" : "outline"}
        aria-pressed={saved}
        onClick={() => setSaved((value) => !value)}
      >
        <HugeiconsIcon icon={Bookmark02Icon} size={18} strokeWidth={1.7} />
        {saved ? "Saved for later" : "Save role"}
      </Button>
    </div>
  );
}
