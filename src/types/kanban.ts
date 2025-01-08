export type Priority = "low" | "medium" | "high";
    export type Status = "not_started" | "in_progress" | "done";
    
    export interface Tag {
      id: string;
      name: string;
      color: string;
    }
    
    export interface SubTask {
      id: string;
      title: string;
      completed: boolean;
    }
    
    export interface Task {
      id: string;
      title: string;
      description: string;
      status: Status;
      priority: Priority;
      projectId: string;
      tags: Tag[];
      subtasks: SubTask[];
      comments: Comment[];
      files: string[];
    }
    
    export interface Project {
      id: string;
      name: string;
      tasks: Task[];
    }
    
    export interface Comment {
      id: string;
      content: string;
      createdAt: string;
      author: string;
    }
    
    export type GroupBy = "status" | "priority" | "project";
