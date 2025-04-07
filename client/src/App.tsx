import { Switch, Route, useRoute, useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import StudentForm from "@/pages/StudentForm";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLogin from "@/pages/AdminLogin";
import { BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  const [location, setLocation] = useLocation();
  const [isFormActive, matchForm] = useRoute("/");
  const [isAdminActive, matchAdmin] = useRoute("/admin");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loading screen for 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  // Set default route to form if no route is active
  useEffect(() => {
    if (location === "/" || location === "") {
      setLocation("/");
    }
  }, [location, setLocation]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-800">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}
      
      {/* Header */}
      <header className="bg-gradient-blue shadow-md text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-white" />
            <h1 className="ml-2 text-xl font-semibold">ShivajiKvastudentdata</h1>
          </div>
          
          {/* Navigation Toggle */}
          <div className="flex items-center">
            <button 
              onClick={() => setLocation("/")} 
              className={`py-2 px-4 text-sm font-medium rounded-l-md ${
                isFormActive ? 'bg-white text-blue-600' : 'bg-blue-700 text-white hover:bg-blue-800'
              } focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-70 border border-blue-400`}
            >
              Student Form
            </button>
            <button 
              onClick={() => setLocation("/admin")} 
              className={`py-2 px-4 text-sm font-medium rounded-r-md ${
                isAdminActive ? 'bg-white text-blue-600' : 'bg-blue-700 text-white hover:bg-blue-800'
              } focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-70 border border-blue-400 border-l-0`}
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Switch>
          <Route path="/" component={() => <StudentForm />} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/admin" component={() => <ProtectedRoute component={AdminDashboard} />} />
          <Route path="/dashboard" component={() => <ProtectedRoute component={AdminDashboard} />} /> {/* Alternative route for admin dashboard */}
          <Route component={NotFound} />
        </Switch>
        {/* Info text at the bottom of the page */}
        <div className="mt-8 pt-4 text-center text-sm text-gray-500 border-t border-gray-200">
          <p>To access the admin dashboard after deployment, navigate to <code className="bg-gray-100 px-1 py-0.5 rounded">/admin</code> or <code className="bg-gray-100 px-1 py-0.5 rounded">/dashboard</code></p>
        </div>
      </main>
    </div>
  );
}

export default App;
