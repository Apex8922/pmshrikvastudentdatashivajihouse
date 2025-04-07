import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Student, InsertStudent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { formatDate, exportToCSV } from "@/lib/data";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import StudentDataTable from "@/components/StudentDataTable";
import { classOptions, houseOptions } from "@/lib/data";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StudentForm from "./StudentForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [classFilter, setClassFilter] = useState(" ");
  const [houseFilter, setHouseFilter] = useState(" ");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Fetch students data
  const { data: students = [], isLoading, isError } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  // Delete student mutation
  const { mutate: deleteStudent } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/students/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      toast({
        title: "Student deleted",
        description: "Student record has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete student: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Edit student mutation
  const { mutate: updateStudent } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertStudent> }) => {
      const response = await apiRequest("PATCH", `/api/students/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      setEditingStudent(null);
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      toast({
        title: "Student updated",
        description: "Student record has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update student: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Filter students based on active filters
  const filteredStudents = students.filter(student => {
    // Apply class filter
    if (classFilter && classFilter !== " " && student.class !== classFilter) {
      return false;
    }
    
    // Apply house filter
    if (houseFilter && houseFilter !== " " && student.house !== houseFilter) {
      return false;
    }
    
    // Apply search query (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return student.name.toLowerCase().includes(query);
    }
    
    return true;
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setClassFilter(" ");
    setHouseFilter(" ");
    
    if (value === "byClass") {
      setClassFilter(classOptions[0].value);
    } else if (value === "byHouse") {
      setHouseFilter(houseOptions[0].value);
    }
  };

  // Handle edit student
  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setEditingStudent(null);
  };

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="card-header-blue text-white flex justify-between items-start flex-col md:flex-row">
        <div>
          <CardTitle className="text-xl">Admin Dashboard</CardTitle>
          <CardDescription className="text-blue-100">
            View and manage student records
          </CardDescription>
        </div>
        <div className="mt-2 md:mt-0 text-right">
          <div className="text-white text-sm font-medium">
            Welcome, Administrator
          </div>
          <div className="text-blue-100 text-xs">
            {currentDate}
          </div>
        </div>
      </CardHeader>
      
      {/* Statistics Summary */}
      {!isLoading && !isError && (
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Total Students</div>
              <div className="text-2xl font-bold">{students.length}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Admin Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <div className="bg-white border-b border-neutral-200">
          <TabsList className="bg-transparent h-auto p-0">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 font-medium"
            >
              All Records
            </TabsTrigger>
            <TabsTrigger 
              value="byClass" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 font-medium"
            >
              By Class
            </TabsTrigger>
            <TabsTrigger 
              value="byHouse" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 font-medium"
            >
              By House
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-center">
            <div className="relative w-full sm:w-64">
              <Input 
                type="text" 
                placeholder="Search students..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All Classes</SelectItem>
                  {classOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={houseFilter} onValueChange={setHouseFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Houses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All Houses</SelectItem>
                  {houseOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                className="flex items-center gap-1 border-blue-300 text-blue-600 hover:text-blue-800"
                onClick={() => exportToCSV(filteredStudents)}
                disabled={filteredStudents.length === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </Button>
            </div>
          </div>
        </div>
        
        <TabsContent value="all" className="p-0 m-0">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : isError ? (
              <div className="p-6 text-center">
                <p className="text-destructive">Error loading student records. Please try again.</p>
              </div>
            ) : (
              <StudentDataTable 
                data={filteredStudents} 
                onEdit={handleEditStudent}
                onDelete={deleteStudent}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="byClass" className="p-0 m-0">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <StudentDataTable 
                data={filteredStudents} 
                onEdit={handleEditStudent}
                onDelete={deleteStudent}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="byHouse" className="p-0 m-0">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <StudentDataTable 
                data={filteredStudents} 
                onEdit={handleEditStudent}
                onDelete={deleteStudent}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
      
      {/* Edit Student Dialog */}
      {editingStudent && (
        <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>
                Update student information. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            
            <StudentForm 
              initialData={editingStudent} 
              onSubmit={(data) => updateStudent({ id: editingStudent.id, data })}
              onCancel={handleCloseEditDialog}
            />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
