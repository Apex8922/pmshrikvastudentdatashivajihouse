import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2, FileDown } from "lucide-react";
import { Student } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getHouseColor, formatDate, exportToCSV } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface StudentDataTableProps {
  data: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export function StudentDataTable({ 
  data, 
  onEdit, 
  onDelete,
  isLoading 
}: StudentDataTableProps) {
  const { toast } = useToast();
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const handleExport = () => {
    if (data.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no student records to export.",
        variant: "destructive"
      });
      return;
    }
    
    exportToCSV(data);
    toast({
      title: "Export successful",
      description: "Student data has been exported to CSV file.",
    });
  };

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <div className="flex items-center">
          <span>Name</span>
          <ArrowUpDown 
            className="ml-2 h-4 w-4 cursor-pointer" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} 
          />
        </div>
      ),
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "class",
      header: ({ column }) => (
        <div className="flex items-center">
          <span>Class</span>
          <ArrowUpDown 
            className="ml-2 h-4 w-4 cursor-pointer" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} 
          />
        </div>
      ),
    },
    {
      accessorKey: "section",
      header: ({ column }) => (
        <div className="flex items-center">
          <span>Section</span>
          <ArrowUpDown 
            className="ml-2 h-4 w-4 cursor-pointer" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} 
          />
        </div>
      ),
    },
    {
      accessorKey: "house",
      header: ({ column }) => (
        <div className="flex items-center">
          <span>House</span>
          <ArrowUpDown 
            className="ml-2 h-4 w-4 cursor-pointer" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} 
          />
        </div>
      ),
      cell: ({ row }) => {
        const house = row.original.house;
        const colorClass = getHouseColor(house);
        
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
            {house}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div className="flex items-center">
          <span>Date Added</span>
          <ArrowUpDown 
            className="ml-2 h-4 w-4 cursor-pointer" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} 
          />
        </div>
      ),
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original;
        
        return (
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(student)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  onClick={() => setStudentToDelete(student)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Student Record</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {student.name}'s record? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => onDelete(student.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          onClick={handleExport}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <FileDown className="h-4 w-4" />
          Export Data
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={data} 
        searchField="name"
        searchPlaceholder="Search students..." 
      />
    </div>
  );
}

export default StudentDataTable;
