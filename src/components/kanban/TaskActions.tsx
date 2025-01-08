import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/kanban";

interface TaskActionsProps {
  task: Task;
}

export function TaskActions({ task }: TaskActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="icon" title="View task">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" title="Edit task">
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}
