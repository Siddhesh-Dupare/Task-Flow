'use client'

import { useState } from "react";

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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { ArrowLeft } from "lucide-react";

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
  // State to manage the current view ('selection' or 'details')
  const [step, setStep] = useState<'selection' | 'details'>('selection');
  // State to store the chosen template
  const [selectedTemplate, setSelectedTemplate] = useState<'Kanban' | 'Scrum'>('Kanban');

  // Function to handle moving back to the selection view
  const handleBack = () => setStep('selection');
  
  // Function to handle selecting a template
  const handleTemplateSelect = (template: 'Kanban' | 'Scrum') => {
    setSelectedTemplate(template);
    setStep('details');
  };

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setStep('selection')}>
      <DialogTrigger asChild>
        <Button>Create Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        {step === 'selection' ? (
          <>
            {/* STEP 1: Template Selection View */}
            <DialogHeader>
              <DialogTitle className="text-2xl">Create project</DialogTitle>
              <DialogDescription>
                Choose a template to get started with a new project.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {/* Kanban Card */}
              <div
                onClick={() => handleTemplateSelect('Kanban')}
                className="border rounded-lg p-6 flex flex-col gap-4 cursor-pointer transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="h-32 bg-muted rounded-md flex items-center justify-center p-4">
                  {/* Visual representation of a Kanban board */}
                  <div className="w-full h-full bg-blue-500 rounded-sm flex items-center gap-2 p-2">
                    <div className="h-full w-1/3 bg-slate-100/80 rounded-sm"></div>
                    <div className="h-full w-1/3 bg-slate-100/80 rounded-sm flex flex-col gap-1">
                        <div className="h-1/2 w-full bg-lime-300 rounded-sm"></div>
                        <div className="h-1/2 w-full bg-lime-300 rounded-sm"></div>
                    </div>
                    <div className="h-full w-1/3 bg-slate-100/80 rounded-sm"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Kanban</h3>
                    <Badge variant="outline">LAST CREATED</Badge>
                </div>
                <p className="text-sm text-muted-foreground">...</p>
              </div>
              
              {/* CORRECTED: Scrum Card */}
              <div
                onClick={() => handleTemplateSelect('Scrum')}
                className="border rounded-lg p-6 flex flex-col gap-4 cursor-pointer transition-all hover:border-primary hover:shadow-lg"
              >
                {/* The visual container needs 'relative' for the absolute positioned dots to work correctly */}
                <div className="h-32 bg-muted rounded-md flex items-center justify-center p-4 relative">
                    {/* All visual elements are now properly nested inside the visual container */}
                    <div className="absolute h-20 w-20 border-4 border-dashed border-purple-400 rounded-full"></div>
                    <div className="h-10 w-10 bg-purple-500 rounded-md flex items-center justify-center text-white font-bold">[]</div>
                    <div className="absolute h-3 w-3 bg-red-500 rounded-full top-6 right-10"></div>
                    <div className="absolute h-3 w-3 bg-blue-500 rounded-full top-10 left-10"></div>
                    <div className="absolute h-3 w-3 bg-yellow-500 rounded-full bottom-6 right-12"></div>
                    <div className="absolute h-3 w-3 bg-green-500 rounded-full bottom-8 left-14"></div>
                </div>
                <h3 className="text-lg font-semibold">Scrum</h3>
                <p className="text-sm text-muted-foreground">...</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* STEP 2: Project Details Form */}
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Create project
              </DialogTitle>
              <DialogDescription className="pl-12">
                Required fields are marked with an asterisk *
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-8 py-4 px-12">
              {/* Left Side: Form Fields */}
              <div className="flex flex-col gap-6">
                <div>
                  <Label htmlFor="project-name">Project name *</Label>
                  <Input id="project-name" placeholder="e.g. Marketing Campaign" className="mt-2"/>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will be the name of your new project.
                  </p>
                </div>
                <div>
                  <Label>Template</Label>
                   <Select value={selectedTemplate} onValueChange={(val: 'Kanban' | 'Scrum') => setSelectedTemplate(val)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kanban">Kanban</SelectItem>
                        <SelectItem value="Scrum">Scrum</SelectItem>
                      </SelectContent>
                    </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    This determines the board type for your project.
                  </p>
                </div>
                <div>
                  <Label htmlFor="project-key">Key *</Label>
                  <Input id="project-key" placeholder="e.g. MKT" className="mt-2"/>
                   <p className="text-sm text-muted-foreground mt-1">
                    A short, unique identifier for your project.
                  </p>
                </div>
                 <Button type="submit" className="w-fit">Create Project</Button>
              </div>

              {/* Right Side: Visual Placeholder */}
              <div className="bg-slate-900 rounded-lg flex items-center justify-center p-8">
                  <div className="w-full h-32 bg-slate-800 rounded-md border border-slate-700"></div>
              </div>
            </div>
          </>
        )}
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
