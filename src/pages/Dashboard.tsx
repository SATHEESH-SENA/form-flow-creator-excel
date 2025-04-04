
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  BarChart2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFormContext } from '@/context/FormContext';

const Dashboard = () => {
  const { forms, submissions } = useFormContext();
  
  // Calculate stats
  const totalForms = forms.length;
  const totalSubmissions = Object.values(submissions).flat().length;
  const recentForms = [...forms]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 3);
  
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Overview of your forms and submissions
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 text-sm font-medium">Total Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-500 mr-2" />
              <span className="text-3xl font-bold">{totalForms}</span>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/forms">View all forms</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart2 className="h-8 w-8 text-success mr-2" />
              <span className="text-3xl font-bold">{totalSubmissions}</span>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/forms">View submissions</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-col space-y-2">
              <Button asChild variant="outline" className="justify-start">
                <Link to="/forms/new" className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Form
                </Link>
              </Button>
              {totalForms > 0 && (
                <Button asChild variant="outline" className="justify-start">
                  <Link to={`/forms/${forms[0].id}/edit`} className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Edit Latest Form
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Forms */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Forms</h2>
          <Button asChild variant="outline" size="sm">
            <Link to="/forms">View all</Link>
          </Button>
        </div>
        
        {recentForms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentForms.map((form) => (
              <Card key={form.id} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <CardTitle>{form.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{form.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      Updated {new Date(form.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <BarChart2 className="h-4 w-4 mr-1" />
                    <span>
                      {submissions[form.id]?.length || 0} submissions
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button asChild variant="ghost" size="sm">
                    <Link to={`/forms/${form.id}`}>View</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/forms/${form.id}/edit`}>Edit</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No forms yet</h3>
              <p className="text-gray-500 text-center mb-4">
                Create your first form to get started
              </p>
              <Button asChild>
                <Link to="/forms/new" className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Form
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
