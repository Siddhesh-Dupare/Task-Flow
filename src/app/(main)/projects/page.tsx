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
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";

import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  projectName: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  template: z.enum(["Kanban", "Scrum"]),
  key: z.string().min(2, {
    message: "Key must be at least 2 characters.",
  }).max(5, {
    message: "Key must not be longer than 5 characters.",
  }).refine(s => s === s.toUpperCase(), {
    message: "Key must be uppercase."
  }),
});

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

  // Function to handle moving back to the selection view
  const handleBack = () => setStep('selection');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      template: "Kanban",
      key: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    // Here you would typically call an API to create the project.
  }
  
  // Function to handle selecting a template
  const handleTemplateSelect = (template: 'Kanban' | 'Scrum') => {
    form.setValue("template", template);
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
              {/* Your Kanban Card code with the onClick handler */}
              <div
                onClick={() => handleTemplateSelect('Kanban')}
                className="border rounded-lg p-6 flex flex-col gap-4 cursor-pointer transition-all hover:border-primary hover:shadow-lg"
              >
                 <div className="h-32 bg-muted rounded-md flex items-center justify-center p-4">
                  <div className="w-full h-full bg-blue-600 rounded-sm flex items-center gap-2 p-2 shadow-inner">
                    <div className="h-full w-1/3 bg-background/80 rounded-sm p-1 flex flex-col gap-1">
                      <div className="h-4 w-full bg-blue-300 rounded-sm"></div>
                    </div>
                    <div className="h-full w-1/3 bg-background/80 rounded-sm p-1 flex flex-col gap-1">
                      <div className="h-4 w-full bg-green-300 rounded-sm"></div>
                      <div className="h-4 w-full bg-green-300 rounded-sm"></div>
                    </div>
                    <div className="h-full w-1/3 bg-background/80 rounded-sm p-1">
                      <div className="h-4 w-full bg-yellow-300 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Kanban</h3>
                  <Badge variant="secondary">SIMPLE</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Visualize and optimize your workflow with a continuous flow of tasks.</p>
              </div>

              {/* Your Scrum Card code with the onClick handler */}
              <div
                onClick={() => handleTemplateSelect('Scrum')}
                className="border rounded-lg p-6 flex flex-col gap-4 cursor-pointer transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="h-32 bg-muted rounded-md flex items-center justify-center p-4 relative overflow-hidden">
                  <div className="absolute h-24 w-24 border-4 border-dashed border-purple-400 rounded-full animate-spin [animation-duration:10s]"></div>
                  <div className="h-10 w-10 bg-purple-500 rounded-md flex items-center justify-center text-white font-bold shadow-lg">[]</div>
                </div>
                <h3 className="text-lg font-semibold">Scrum</h3>
                <p className="text-sm text-muted-foreground">Plan, execute, and deliver work in structured sprints or iterations.</p>
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

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-8 py-4 px-12">
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Marketing Campaign" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be the name of your new project.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Kanban">Kanban</SelectItem>
                            <SelectItem value="Scrum">Scrum</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This determines the board type for your project.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. MKT" {...field} />
                        </FormControl>
                        <FormDescription>
                          A short, unique, uppercase identifier for your project.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-fit">Create Project</Button>
                </div>
                <div className="bg-slate-900 rounded-lg flex items-center justify-center p-8">
                  <div className="w-full h-32 bg-slate-800 rounded-md border border-slate-700"></div>
                </div>
              </form>
            </Form>
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
