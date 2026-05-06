import { Task, Status, STATUS_CONFIG } from "@/types/task";

interface Props {
  tasks: Task[];
}

const STATUSES: Status[] = ["todo", "in_progress", "review", "done"];

export function StatsBar({ tasks }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STATUSES.map((s) => {
        const conf = STATUS_CONFIG[s];
        const count = tasks.filter((t) => t.status === s).length;
        return (
          <div key={s} className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-semibold">{count}</p>
            <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-xs font-medium ${conf.color}`}>
              {conf.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
