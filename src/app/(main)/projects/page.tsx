// app/projects/page.tsx
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock data for projects. In a real app, you would fetch this from your database.
const mockProjects = [
  {
    id: "1",
    name: "DeSci Peer Review Platform",
    key: "DSCI",
  },
  {
    id: "2",
    name: "Job Post Aggregator",
    key: "JOBS",
  },
  {
    id: "3",
    name: "Autonomous Orbital Robotics",
    key: "AOR",
  },
];

// Reusable component for the "Create Project" dialog
function CreateProjectDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Give your new project a name and a unique key. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" placeholder="E.g., Marketing Campaign" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="key" className="text-right">
              Key
            </Label>
            <Input id="key" placeholder="E.g., MKT" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Reusable component for a single project card
function ProjectCard({ name, projectKey }: { name: string; projectKey: string }) {
  return (
    <Card className="cursor-pointer hover:border-primary">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{projectKey}</CardDescription>
      </CardHeader>
    </Card>
  );
}

// The main page component
export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Header section */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <CreateProjectDialog />
      </header>

      {/* Grid for project cards */}
      <main>
        {mockProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((project) => (
              <ProjectCard
                key={project.id}
                name={project.name}
                projectKey={project.key}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
             <h2 className="text-xl font-semibold">No Projects Found</h2>
             <p className="text-muted-foreground mt-2">
                Click "Create Project" to get started.
             </p>
          </div>
        )}
      </main>
    </div>
  );
}