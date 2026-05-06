import { Task, Priority, Status } from "@/types/task";

const STORAGE_KEY = "team-tasks-data";

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "디자인 시스템 컴포넌트 정의",
    description: "공통 버튼, 인풋, 카드 등 기본 컴포넌트 설계 및 문서화",
    status: "done",
    priority: "high",
    assignee: "이서연",
    dueDate: "2026-05-01",
    createdAt: "2026-04-20T09:00:00Z",
    updatedAt: "2026-05-01T14:00:00Z",
    tags: ["디자인", "문서화"],
  },
  {
    id: "2",
    title: "API 엔드포인트 구현",
    description: "사용자 인증 및 팀 일감 CRUD REST API 개발",
    status: "in_progress",
    priority: "urgent",
    assignee: "박도현",
    dueDate: "2026-05-10",
    createdAt: "2026-04-22T10:00:00Z",
    updatedAt: "2026-05-05T09:30:00Z",
    tags: ["백엔드", "API"],
  },
  {
    id: "3",
    title: "프론트엔드 메인 화면 개발",
    description: "대시보드 레이아웃 및 일감 목록 페이지 구현",
    status: "in_progress",
    priority: "high",
    assignee: "김민준",
    dueDate: "2026-05-12",
    createdAt: "2026-04-23T11:00:00Z",
    updatedAt: "2026-05-06T08:00:00Z",
    tags: ["프론트엔드"],
  },
  {
    id: "4",
    title: "QA 테스트 시나리오 작성",
    description: "주요 기능별 테스트 케이스 및 시나리오 문서 작성",
    status: "review",
    priority: "medium",
    assignee: "최지우",
    dueDate: "2026-05-08",
    createdAt: "2026-04-25T13:00:00Z",
    updatedAt: "2026-05-05T16:00:00Z",
    tags: ["QA", "문서화"],
  },
  {
    id: "5",
    title: "성능 최적화 및 번들 분석",
    description: "Lighthouse 점수 개선 및 번들 크기 최적화",
    status: "todo",
    priority: "medium",
    assignee: "정하은",
    dueDate: "2026-05-20",
    createdAt: "2026-05-01T09:00:00Z",
    updatedAt: "2026-05-01T09:00:00Z",
    tags: ["성능", "프론트엔드"],
  },
  {
    id: "6",
    title: "모바일 반응형 UI 적용",
    description: "전체 화면 모바일 대응 및 터치 인터랙션 개선",
    status: "todo",
    priority: "low",
    assignee: "이서연",
    dueDate: "2026-05-25",
    createdAt: "2026-05-02T10:00:00Z",
    updatedAt: "2026-05-02T10:00:00Z",
    tags: ["UI", "모바일"],
  },
];

function loadTasks(): Task[] {
  if (typeof window === "undefined") return INITIAL_TASKS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return INITIAL_TASKS;
  try {
    return JSON.parse(raw) as Task[];
  } catch {
    return INITIAL_TASKS;
  }
}

function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function getTasks(): Task[] {
  return loadTasks();
}

export function createTask(
  data: Omit<Task, "id" | "createdAt" | "updatedAt">
): Task {
  const tasks = loadTasks();
  const now = new Date().toISOString();
  const newTask: Task = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  saveTasks([...tasks, newTask]);
  return newTask;
}

export function updateTask(id: string, data: Partial<Omit<Task, "id" | "createdAt">>): Task | null {
  const tasks = loadTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const updated: Task = {
    ...tasks[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  tasks[index] = updated;
  saveTasks(tasks);
  return updated;
}

export function deleteTask(id: string): boolean {
  const tasks = loadTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  if (filtered.length === tasks.length) return false;
  saveTasks(filtered);
  return true;
}

export function updateTaskStatus(id: string, status: Status): Task | null {
  return updateTask(id, { status });
}

export function getStats(tasks: Task[]) {
  return {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    review: tasks.filter((t) => t.status === "review").length,
    done: tasks.filter((t) => t.status === "done").length,
    urgent: tasks.filter((t) => t.priority === "urgent").length,
  };
}
