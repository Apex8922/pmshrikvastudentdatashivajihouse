import { StudentHouse } from "@shared/schema";

// Class options for form
export const classOptions = [
  { value: "1", label: "Class 1" },
  { value: "2", label: "Class 2" },
  { value: "3", label: "Class 3" },
  { value: "4", label: "Class 4" },
  { value: "5", label: "Class 5" },
  { value: "6", label: "Class 6" },
  { value: "7", label: "Class 7" },
  { value: "8", label: "Class 8" },
  { value: "9", label: "Class 9" },
  { value: "10", label: "Class 10" },
  { value: "11", label: "Class 11" },
  { value: "12", label: "Class 12" },
];

// Section options for form
export const sectionOptions = [
  { value: "A", label: "Section A" },
  { value: "B", label: "Section B" },
];

// House options for form
export const houseOptions: { value: StudentHouse; label: string; color: string }[] = [
  { value: "Shivaji", label: "Shivaji", color: "bg-blue-100 text-blue-800" },
  { value: "Tagore", label: "Tagore", color: "bg-yellow-100 text-yellow-800" },
  { value: "Ashoka", label: "Ashoka", color: "bg-green-100 text-green-800" },
  { value: "Raman", label: "Raman", color: "bg-purple-100 text-purple-800" },
];

// Get color class for a house
export function getHouseColor(house: StudentHouse | string): string {
  const foundHouse = houseOptions.find(h => h.value === house);
  return foundHouse?.color || "bg-gray-100 text-gray-800";
}

// Format date to human-readable format
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Export student data to CSV
export function exportToCSV(students: any[]) {
  // Define headers
  const headers = ['Name', 'Class', 'Section', 'House', 'Date Added', 'Notes'];
  
  // Create CSV content
  const csvRows = [
    headers.join(','), // Headers row
    ...students.map(student => {
      const formattedDate = formatDate(student.createdAt);
      const values = [
        `"${student.name}"`, // Add quotes to handle commas in names
        student.class,
        student.section,
        student.house,
        `"${formattedDate}"`,
        `"${student.notes || ''}"`
      ];
      return values.join(',');
    })
  ];
  
  // Join rows with newlines
  const csvContent = csvRows.join('\n');
  
  // Create a blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `student_data_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
