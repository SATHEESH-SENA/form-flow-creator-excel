
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Clock, 
  BarChart2, 
  FileText, 
  MoreVertical, 
  Copy, 
  Trash, 
  Link as LinkIcon,
  AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useFormContext, Form } from '@/context/FormContext';
import { toast } from 'sonner';

const FormList = () => {
  const { forms, submissions, deleteForm } = useFormContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredForms = forms.filter(form => 
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const copyShareLink = (form: Form) => {
    navigator.clipboard.writeText(form.shareUrl || `${window.location.origin}/form/${form.id}`);
    toast.success('Share link copied to clipboard');
  };
  
  const duplicateForm = (form: Form) => {
    // This functionality would be implemented in FormContext
    toast.info('This feature is coming soon!');
  };
  
  const handleDeleteForm = (id: string) => {
    if (confirm('Are you sure you want to delete this form? All submissions will be lost.')) {
      deleteForm(id);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
          <p className="mt-1 text-gray-600">
            Create, manage, and view submissions for your forms
          </p>
        </div>
        <Button 
          className="mt-4 sm:mt-0 bg-primary-500 hover:bg-primary-600"
          asChild
        >
          <Link to="/forms/new" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create Form
          </Link>
        </Button>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search forms..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Forms Grid */}
      {filteredForms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="truncate pr-4">{form.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => copyShareLink(form)} className="cursor-pointer">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        <span>Copy Share Link</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateForm(form)} className="cursor-pointer">
                        <Copy className="h-4 w-4 mr-2" />
                        <span>Duplicate Form</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteForm(form.id)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        <span>Delete Form</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                  {form.description || 'No description provided'}
                </p>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    Updated {new Date(form.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <BarChart2 className="h-4 w-4 mr-1" />
                  <span>{submissions[form.id]?.length || 0} submissions</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>{form.fields.length} fields</span>
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
            {forms.length === 0 ? (
              <>
                <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No forms yet</h3>
                <p className="text-gray-500 text-center mb-4">
                  Create your first form to get started
                </p>
              </>
            ) : (
              <>
                <Search className="h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No forms found</h3>
                <p className="text-gray-500 text-center mb-4">
                  Try adjusting your search term
                </p>
              </>
            )}
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
  );
};

export default FormList;
