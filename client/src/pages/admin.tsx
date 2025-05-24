import { useState } from "react";
import { FileText, Eye, UserCircle, Plus, Lock } from "lucide-react";
import PageForm from "@/components/page-form";
import PagesList from "@/components/pages-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import type { Page } from "@shared/schema";

export default function Admin() {
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEditPage = (page: Page) => {
    setEditingPage(page);
  };

  const handleCancelEdit = () => {
    setEditingPage(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "TOTO") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Enter the password to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full"
                  required
                />
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Access Admin Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-slate-900">openPage</h1>
              </div>
              <span className="text-sm text-slate-500 hidden sm:inline">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900"
              >
                <Eye className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Preview Mode</span>
              </Button>
              <div className="h-6 w-px bg-slate-300 hidden sm:block"></div>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900"
              >
                <UserCircle className="h-5 w-5" />
                <span className="hidden sm:inline text-sm ml-2">Admin</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAuthenticated(false)}
                className="text-slate-600 hover:text-slate-900"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <PageForm editingPage={editingPage} onCancelEdit={handleCancelEdit} />
          </div>
          <div className="lg:col-span-2">
            <PagesList onEditPage={handleEditPage} />
          </div>
        </div>
      </main>
    </div>
  );
}
