import { workflow, type WorkflowStatus } from "@/lib/mock-data";

type StatusTimelineProps = {
  currentStatus?: WorkflowStatus;
};

export function StatusTimeline({ currentStatus = "under_review" }: StatusTimelineProps) {
  const currentIndex = workflow.findIndex((step) => step.key === currentStatus);
  const pct = Math.round(((currentIndex + 1) / workflow.length) * 100);

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8 flex items-center gap-4">
        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #991b1b, #ef4444)"
            }}
          />
        </div>
        <span className="flex-shrink-0 text-sm font-semibold text-red-400">
          {currentIndex + 1} / {workflow.length}
        </span>
      </div>

      {/* Step grid */}
      <div className="grid gap-3 lg:grid-cols-4">
        {workflow.map((step, index) => {
          const done    = index < currentIndex;
          const active  = index === currentIndex;
          const pending = index > currentIndex;

          return (
            <div
              key={step.key}
              className="rounded-2xl border p-5 transition-all duration-300"
              style={
                active
                  ? {
                      borderColor: "rgba(239,68,68,0.35)",
                      background: "rgba(239,68,68,0.09)",
                      boxShadow: "0 8px 24px rgba(185,28,28,0.14)"
                    }
                  : done
                  ? {
                      borderColor: "rgba(239,68,68,0.18)",
                      background: "rgba(239,68,68,0.05)"
                    }
                  : {
                      borderColor: "rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.02)"
                    }
              }
            >
              {/* Step number + owner */}
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                  style={
                    active
                      ? { background: "#ef4444", color: "#fff" }
                      : done
                      ? { background: "rgba(239,68,68,0.2)", color: "#f87171" }
                      : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.28)" }
                  }
                >
                  {done ? "✓" : index + 1}
                </span>
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: active ? "#f87171" : "rgba(255,255,255,0.22)" }}
                >
                  {step.owner}
                </span>
              </div>

              {/* Title */}
              <div
                className="text-sm font-semibold"
                style={{ color: pending ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.92)" }}
              >
                {step.title}
              </div>

              {/* Detail */}
              <p
                className="mt-1.5 text-xs leading-5"
                style={{ color: pending ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.42)" }}
              >
                {step.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
