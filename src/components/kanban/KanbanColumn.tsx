import { Plus } from "lucide-react";
    import { Button } from "@/components/ui/button";
    import { useState } from "react";
    import { TaskDialog } from "./TaskDialog";
    import { Status } from "@/types/kanban";
    import { cn } from "@/lib/utils";
    
    interface KanbanColumnProps {
      title: string;
      count: number;
      children: React.ReactNode;
      status?: Status;
    }
    
    export function KanbanColumn({ title, count, children, status }: KanbanColumnProps) {
      const [dialogOpen, setDialogOpen] = useState(false);
    
      return (
        <div className="bg-accent/50 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{title}</h2>
              <span className={cn("px-2 py-1 rounded-full text-sm font-bold text-red-500 bg-transparent",
                status === "not_started" && "bg-white text-red-500 font-bold",
                status === "in_progress" && "bg-white text-red-500 font-bold",
                status === "done" && "bg-white text-red-500 font-bold",
              )}>
                {count}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              title="Add new task"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">{children}</div>
          <TaskDialog 
            open={dialogOpen} 
            onOpenChange={setDialogOpen}
            status={status}
            projects={[]}
            tags={[]}
            onCreateTask={() => {}}
          />
        </div>
      );
    }
