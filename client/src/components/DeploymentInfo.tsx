import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DeploymentInfo() {
  return (
    <Card className="mt-8 bg-blue-50">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="text-lg">Deployment Information</CardTitle>
        <CardDescription className="text-blue-100">
          How to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <p>After deploying this application on Render or another hosting service:</p>
        
        <div className="rounded-md bg-blue-100 p-4">
          <h3 className="font-medium text-blue-800 mb-2">Options to Access Admin Dashboard:</h3>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>Navigate to <code className="bg-white px-1 py-0.5 rounded">/admin</code> URL path</li>
            <li>Or use <code className="bg-white px-1 py-0.5 rounded">/dashboard</code> URL path</li>
            <li>Example: <code className="bg-white px-1 py-0.5 rounded">https://your-app.onrender.com/admin</code></li>
          </ul>
          <div className="mt-3 p-2 bg-yellow-100 rounded-md border border-yellow-200">
            <p className="text-yellow-800 font-medium">Admin Login Required</p>
            <p className="text-yellow-700 text-sm">The admin dashboard is now password-protected. Default credentials:</p>
            <ul className="list-disc list-inside text-sm text-yellow-700 mt-1">
              <li>Username: <code className="bg-white px-1 py-0.5 rounded">admin</code></li>
              <li>Password: <code className="bg-white px-1 py-0.5 rounded">8922</code></li>
              <li>Hint: <code className="bg-white px-1 py-0.5 rounded">your x box tag :)</code></li>
            </ul>
          </div>
        </div>
        
        <div className="flex mt-4">
          <button 
            onClick={() => window.location.href = "/admin"}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Go to Admin Dashboard Now
          </button>
        </div>
      </CardContent>
    </Card>
  );
}