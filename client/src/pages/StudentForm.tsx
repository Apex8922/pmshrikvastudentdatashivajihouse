import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { InsertStudent, insertStudentSchema, StudentHouse, Student } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import HouseSelector from "@/components/HouseSelector";
import DeploymentInfo from "@/components/DeploymentInfo";
import { classOptions, sectionOptions } from "@/lib/data";
import { BookOpen } from "lucide-react";

interface StudentFormProps {
  initialData?: Student;
  onSubmit?: (data: InsertStudent) => void;
  onCancel?: () => void;
}

export default function StudentForm({ initialData, onSubmit: externalSubmit, onCancel }: StudentFormProps = {}) {
  const { toast } = useToast();

  const form = useForm<InsertStudent>({
    resolver: zodResolver(insertStudentSchema),
    defaultValues: {
      name: initialData?.name || "",
      class: initialData?.class || "",
      section: initialData?.section || "",
      house: initialData?.house as StudentHouse || undefined,
      phone: initialData?.phone || "",
      notes: initialData?.notes || "",
    },
  });

  // For create operation
  const { mutate: createStudent, isPending: isCreating } = useMutation({
    mutationFn: async (data: InsertStudent) => {
      const response = await apiRequest("POST", "/api/students", data);
      return response.json();
    },
    onSuccess: () => {
      // Reset form
      form.reset({
        name: "",
        class: "",
        section: "",
        notes: "",
        phone: "",
        house: undefined,
      });
      
      // Show success toast
      toast({
        title: "Success!",
        description: "Student data submitted successfully.",
      });
      
      // Invalidate students query to refresh admin view
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to submit form: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: InsertStudent) {
    if (externalSubmit) {
      externalSubmit(data);
    } else {
      createStudent(data);
    }
  }

  function onReset() {
    form.reset({
      name: "",
      class: "",
      section: "",
      notes: "",
      phone: "",
      house: undefined,
    });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="card-header-blue text-white">
          <CardTitle className="text-xl">Student Registration Form</CardTitle>
          <CardDescription className="text-blue-100">
            Please fill in the student details below
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter student's full name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Class & Section in two columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Class Field */}
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class <span className="text-destructive">*</span></FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Section Field */}
                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section <span className="text-destructive">*</span></FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sectionOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* House Field */}
              <FormField
                control={form.control}
                name="house"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>House <span className="text-destructive">*</span></FormLabel>
                    <HouseSelector 
                      value={field.value as StudentHouse} 
                      onChange={field.onChange}
                      error={form.formState.errors.house?.message}
                    />
                  </FormItem>
                )}
              />
              
              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter phone number (e.g., 9876543210)" 
                        type="tel"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Additional Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional information about the student (optional)" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Form Actions */}
              <div className="pt-4 flex justify-end space-x-3 border-t border-neutral-200">
                {onCancel ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onReset}
                  >
                    Reset Form
                  </Button>
                )}
                <Button 
                  type="submit"
                  disabled={isCreating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isCreating ? "Submitting..." : initialData ? "Update" : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Only show deployment info on the main form page, not in edit mode */}
      {!initialData && <DeploymentInfo />}
    </div>
  );
}
