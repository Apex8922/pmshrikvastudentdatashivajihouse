import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required")
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The correct password hardcoded (in a real app, this would be handled server-side)
  const ADMIN_PASSWORD = "8922";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate the password
      loginSchema.parse({ password });

      // Check if password matches
      if (password === ADMIN_PASSWORD) {
        // Store in session storage that user is authenticated
        sessionStorage.setItem("adminAuthenticated", "true");
        
        // Show success toast
        toast({
          title: "Success!",
          description: "You are now logged in to the admin dashboard.",
        });
        
        // Redirect to admin dashboard
        setLocation("/admin");
      } else {
        setError("Invalid password. Please try again.");
        toast({
          title: "Login Failed",
          description: "Invalid password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card className="shadow-lg">
        <CardHeader className="card-header-blue text-white">
          <CardTitle className="flex items-center gap-2">
            <Lock size={20} />
            Admin Login
          </CardTitle>
          <CardDescription className="text-blue-100">
            Enter your password to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>Hint: your x box tag :)</p>
              <p className="mt-2">
                <Button 
                  variant="link" 
                  className="p-0 h-auto" 
                  onClick={() => setLocation("/")}
                >
                  Back to Student Form
                </Button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}