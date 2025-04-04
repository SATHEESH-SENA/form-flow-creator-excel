
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useFormContext } from '@/context/FormContext';
import PreviewForm from '@/components/form-builder/PreviewForm';

const PublicForm = () => {
  const { id } = useParams<{ id: string }>();
  const { getForm, addSubmission } = useFormContext();
  
  const [form, setForm] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }
    
    const formData = getForm(id);
    if (formData && formData.isPublic) {
      setForm(formData);
    } else {
      setNotFound(true);
    }
    setIsLoading(false);
  }, [id, getForm]);
  
  const handleSubmit = (data: Record<string, any>) => {
    if (!id) return;
    
    addSubmission(id, data);
    setIsSubmitted(true);
    window.scrollTo(0, 0);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }
  
  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">Form Not Found</h1>
              <p className="text-gray-600 mt-2">
                The form you're looking for doesn't exist or is not available for public access.
              </p>
            </div>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link to="/">
              <Button>Go to Dashboard</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg mx-auto">
          <CardContent className="pt-6 pb-8">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">Form Submitted</h1>
              <p className="text-gray-600 mt-2 mb-6">
                Thank you! Your response has been recorded.
              </p>
              <div className="space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsSubmitted(false)}
                >
                  Submit Another Response
                </Button>
                <Link to="/">
                  <Button className="bg-primary-500 hover:bg-primary-600">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <PreviewForm form={form} onSubmit={handleSubmit} />
        <div className="mt-6 text-center text-gray-500 text-sm">
          Powered by FormFlow
        </div>
      </div>
    </div>
  );
};

export default PublicForm;
