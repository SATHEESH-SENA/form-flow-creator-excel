
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Edit, 
  Trash, 
  ExternalLink, 
  Download, 
  AlertCircle, 
  BarChart2,
  Calendar,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useFormContext, Form, FormSubmission } from '@/context/FormContext';
import PreviewForm from '@/components/form-builder/PreviewForm';

const FormDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getForm, getFormSubmissions, deleteForm, addSubmission, exportToExcel } = useFormContext();
  
  const [form, setForm] = useState<Form | undefined>(undefined);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    if (!id) return;
    
    const formData = getForm(id);
    if (formData) {
      setForm(formData);
      setSubmissions(getFormSubmissions(id));
    } else {
      toast.error('Form not found');
      navigate('/forms');
    }
  }, [id, getForm, getFormSubmissions, navigate]);
  
  if (!form) {
    return <div>Loading...</div>;
  }
  
  const handleSubmit = (data: Record<string, any>) => {
    if (!id) return;
    addSubmission(id, data);
    setSubmissions(getFormSubmissions(id));
    toast.success('Form submitted successfully');
    setActiveTab('submissions');
  };
  
  const handleExport = () => {
    if (!id) return;
    exportToExcel(id);
  };
  
  const handleDelete = () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this form? All submissions will be lost.')) {
      deleteForm(id);
      navigate('/forms');
    }
  };
  
  const copyShareLink = () => {
    const shareUrl = form.shareUrl || `${window.location.origin}/form/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard');
  };
  
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '-';
    } else if (typeof value === 'object' && value instanceof Date) {
      return new Date(value).toLocaleDateString();
    } else if (typeof value === 'object' && value instanceof File) {
      return value.name;
    } else if (Array.isArray(value)) {
      return value.join(', ');
    } else {
      return String(value);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
          <p className="text-gray-600 mt-1">{form.description || 'No description provided'}</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyShareLink}
            className="flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="flex items-center"
            disabled={submissions.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button 
            asChild
            variant="outline" 
            size="sm" 
            className="flex items-center"
          >
            <Link to={`/forms/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Form
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDelete}
            className="flex items-center text-destructive hover:text-destructive"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="preview">Fill Form</TabsTrigger>
          <TabsTrigger value="submissions">
            Submissions ({submissions.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600 text-sm font-medium">Total Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChart2 className="h-8 w-8 text-primary-500 mr-2" />
                  <span className="text-3xl font-bold">{submissions.length}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600 text-sm font-medium">Date Created</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-primary-500 mr-2" />
                  <span className="text-lg">
                    {new Date(form.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600 text-sm font-medium">Form Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-primary-500 mr-2" />
                  <span className="text-3xl font-bold">{form.fields.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Form Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field Label</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Required</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {form.fields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium">{field.label}</TableCell>
                      <TableCell>{field.type}</TableCell>
                      <TableCell>
                        {field.validation?.required ? 'Yes' : 'No'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveTab('preview')}
                className="flex items-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Form
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Fill Out Form</CardTitle>
            </CardHeader>
            <CardContent>
              <PreviewForm form={form} onSubmit={handleSubmit} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {submissions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      {form.fields.map((field) => (
                        <TableHead key={field.id}>{field.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          {new Date(submission.submittedAt).toLocaleString()}
                        </TableCell>
                        {form.fields.map((field) => (
                          <TableCell key={field.id}>
                            {formatValue(submission.data[field.id])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No submissions yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    This form has not received any submissions yet.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('preview')} 
                    className="flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Fill out form
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport}
                className="flex items-center"
                disabled={submissions.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button 
                onClick={() => setTab('preview')} 
                size="sm"
                className="flex items-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                Submit New Response
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormDetail;
