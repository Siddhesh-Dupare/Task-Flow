'use client';

import { useState } from "react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge }
from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetTitle, SheetContent, SheetDescription, SheetHeader } from "@/components/ui/sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Search, ChevronRight, Plus, ArrowUp, ArrowDown, MoreHorizontal, Calendar } from "lucide-react";

import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors, DragStartEvent, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

// MOCK DATA - In a real app, you would fetch this based on projectId
const mockData = {
  // We'll use this to decide whether to show Scrum UI elements
  projectType: "Scrum", // Can be "Kanban" or "Scrum"
  projectName: "Autonomous Orbital Robotics",
  sprint: {
    name: "AOR Sprint 1 (Active)",
    startDate: "Oct 16",
    endDate: "Oct 30, 2025",
  },
  columns: [
    { id: "todo", title: "To Do", issues: [
      { id: "TASK-101", title: "Implement user authentication", assignee: "JD", priority: "high" },
      { id: "TASK-102", title: "Design database schema", assignee: "AB", priority: "medium" },
    ]},
    { id: "inprogress", title: "In Progress", issues: [
      { id: "TASK-103", title: "Develop API for issue tracking", assignee: "CD", priority: "high" },
    ]},
    { id: "done", title: "Done", issues: [
      { id: "TASK-104", title: "Set up project repository", assignee: "JD", priority: "low" },
      { id: "TASK-105", title: "Configure CI/CD pipeline", assignee: "EF", priority: "low" },
    ]},
  ],
  assignees: [
    { id: "JD", name: "Jane Doe", avatar: "/avatars/01.png" },
    { id: "AB", name: "Alice Bob", avatar: "/avatars/02.png" },
    { id: "CD", name: "Charlie Day", avatar: "/avatars/03.png" },
    { id: "EF", name: "Eve F.", avatar: "/avatars/04.png" },
  ]
};

// Sub-component for a single issue card
function IssueCard({ issue, onCardClick }: { issue: { id: string; title: string; assignee: string; priority: string; }, onCardClick: (issue: any) => void }) {
  const assignee = mockData.assignees.find(a => a.id === issue.assignee);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id });

  const style = {
  transform: CSS.Translate.toString(transform),
  transition,
  opacity: isDragging ? 0.5 : 1,
};
  
  const priorityIcons = {
    high: <ArrowUp className="h-4 w-4 text-red-500" />,
    medium: <MoreHorizontal className="h-4 w-4 text-yellow-500" />,
    low: <ArrowDown className="h-4 w-4 text-green-500" />,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={() => onCardClick(issue)}>
    <Card className="mb-3 cursor-grab active:cursor-grabbing hover:bg-muted/80">
      <CardContent className="p-3">
        <p className="text-sm font-medium">{issue.title}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {priorityIcons[issue.priority as keyof typeof priorityIcons]}
            <span className="text-xs text-muted-foreground">{issue.id}</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={assignee?.avatar} alt={assignee?.name} />
                  <AvatarFallback>{assignee?.id}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{assignee?.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

// Sub-component for a single column
function BoardColumn({ column, onSelectIssue }: { column: { id: string; title: string; issues: any[] }, onSelectIssue: (issue: any) => void }) {
    const { setNodeRef, isOver } = useDroppable({ id: column.id });
    const issueIds = column.issues.map(issue => issue.id);
  return (
    <div 
      ref={setNodeRef} 
      className={`
        w-72 flex-shrink-0 bg-muted rounded-lg p-3
        transition-colors duration-200 ease-in-out
        ${isOver ? 'bg-primary/10' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-md">{column.title}</h3>
        <Badge variant="secondary">{column.issues.length}</Badge>
      </div>
      <SortableContext items={issueIds} strategy={verticalListSortingStrategy}>
        <div className="h-full space-y-3">
          {column.issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onCardClick={onSelectIssue} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

// Main page component
export default function ProjectBoardPage() {
  const { projectType, projectName, sprint, columns, assignees } = mockData;
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [activeIssue, setActiveIssue] = useState<any | null>(null);

  const [boardData, setBoardData] = useState(mockData);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // This is the key: require the mouse to move 5px before a drag is activated
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // Find the full issue object from our data
    const issue = boardData.columns
      .flatMap(col => col.issues)
      .find(iss => iss.id === active.id);
    setActiveIssue(issue || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setBoardData((prev) => {
        const newColumns = prev.columns.map(col => ({ ...col, issues: [...col.issues] }));

        // Find the active card's column and index
        const activeColumn = newColumns.find(col => col.issues.some(issue => issue.id === activeId));
        if (!activeColumn) return prev;
        const activeIssueIndex = activeColumn.issues.findIndex(issue => issue.id === activeId);
        const activeIssue = activeColumn.issues[activeIssueIndex];

        // Find the target column and index (where the card was dropped)
        let overColumn = newColumns.find(col => col.id === overId);
        if (!overColumn) {
            overColumn = newColumns.find(col => col.issues.some(issue => issue.id === overId));
        }
        if (!overColumn) return prev;

        // --- Logic for SAME column reordering ---
        if (activeColumn.id === overColumn.id) {
            const overIssueIndex = overColumn.issues.findIndex(issue => issue.id === overId);
            if (activeIssueIndex !== overIssueIndex) {
                overColumn.issues = arrayMove(overColumn.issues, activeIssueIndex, overIssueIndex);
            }
        } 
        // --- Logic for DIFFERENT column moving ---
        else {
            // Remove from old column
            activeColumn.issues.splice(activeIssueIndex, 1);

            // Add to new column
            let overIssueIndex = overColumn.issues.findIndex(issue => issue.id === overId);
            // If dropped on column, not issue, add to the end
            if (overIssueIndex === -1) {
                overIssueIndex = overColumn.issues.length;
            }
            overColumn.issues.splice(overIssueIndex, 0, activeIssue);
        }

        setActiveIssue(null);
        return { ...prev, columns: newColumns };
    });
};

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
    <div className="flex flex-col h-full">
      {/* Board Header */}
      <header className="p-4 border-b">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>Projects</span> <ChevronRight className="h-4 w-4" /> 
          <span className="font-semibold text-primary">{projectName}</span> <ChevronRight className="h-4 w-4" />
          <span>Board</span>
        </div>

        {/* Scrum-specific UI */}
        {projectType === 'Scrum' && (
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{sprint.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Calendar className="h-4 w-4" />
                <span>{sprint.startDate} - {sprint.endDate}</span>
              </div>
            </div>
            <Button>Complete Sprint</Button>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search issues..." className="pl-8 w-64" />
            </div>
            <div className="flex -space-x-2">
              {assignees.map(assignee => (
                 <TooltipProvider key={assignee.id}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={assignee.avatar} />
                            <AvatarFallback>{assignee.id}</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent><p>{assignee.name}</p></TooltipContent>
                    </Tooltip>
                 </TooltipProvider>
              ))}
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4"/> Group by
          </Button>
        </div>
      </header>

      {/* Board Container */}
      <main className="flex-1 p-4 overflow-x-auto">
        <div className="flex gap-4 h-full">
          {boardData.columns.map((column) => (
              <BoardColumn 
                key={column.id} 
                column={column} 
                // This prop is crucial for the sheet to open
                onSelectIssue={setSelectedIssue} 
              />
            ))}
        </div>
      </main>

      <Sheet open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
      <SheetContent className="w-[90vw] sm:w-[600px] lg:w-[1200px] p-0">
        {selectedIssue && (
          <div className="flex flex-col h-full">
            {/* Sheet Header */}
            <div className="p-6 border-b">
              <SheetHeader>
                <SheetTitle className="text-2xl">{selectedIssue.title}</SheetTitle>
                <SheetDescription>
                  Details for task {selectedIssue.id}
                </SheetDescription>
              </SheetHeader>
            </div>

            {/* Main Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-3 gap-8">
                {/* Left Column: Description, Comments */}
                <div className="col-span-2 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <Textarea
                      placeholder="Add a description..."
                      defaultValue="This task involves setting up the authentication flow using NextAuth.js, including sign-in, sign-up, and session management."
                      className="min-h-[150px]"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Comments</h3>
                    {/* Future: Add a comment input and list */}
                    <div className="text-sm text-muted-foreground">Comments section coming soon.</div>
                  </div>
                </div>

                {/* Right Column: Status, Assignee, Priority */}
                <div className="col-span-1 space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Status</h4>
                    <Select defaultValue="todo">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="inprogress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Assignee</h4>
                    {/* You would map over real users here */}
                    <Select defaultValue={selectedIssue.assignee}>
                       <SelectTrigger>
                         <SelectValue placeholder="Select assignee" />
                       </SelectTrigger>
                       <SelectContent>
                        {assignees.map(a => (
                           <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                        ))}
                       </SelectContent>
                    </Select>
                  </div>
                   <div>
                    <h4 className="text-sm font-semibold mb-2">Priority</h4>
                    <Select defaultValue={selectedIssue.priority}>
                       <SelectTrigger>
                         <SelectValue placeholder="Select priority" />
                       </SelectTrigger>
                       <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sheet Footer */}
            <div className="p-6 border-t text-xs text-muted-foreground">
              <p>Created: October 15, 2025</p>
              <p>Updated: 2 hours ago</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
    </div>
    <DragOverlay>
        {activeIssue ? <IssueCard issue={activeIssue} onCardClick={() => {}} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
