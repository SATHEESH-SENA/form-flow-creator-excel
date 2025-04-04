
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Types
export type FieldType = 'text' | 'number' | 'email' | 'textarea' | 'date' | 'select' | 'checkbox' | 'radio' | 'file';

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  options?: string[];
  validation: FieldValidation;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: number;
  updatedAt: number;
  shareUrl?: string;
  isPublic: boolean;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: number;
}

interface FormContextType {
  forms: Form[];
  submissions: Record<string, FormSubmission[]>;
  currentForm: Form | null;
  createForm: (form: Omit<Form, 'id' | 'createdAt' | 'updatedAt' | 'shareUrl'>) => string;
  updateForm: (form: Form) => void;
  deleteForm: (id: string) => void;
  getForm: (id: string) => Form | undefined;
  addSubmission: (formId: string, data: Record<string, any>) => void;
  getFormSubmissions: (formId: string) => FormSubmission[];
  setCurrentForm: (form: Form | null) => void;
  exportToExcel: (formId: string) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [forms, setForms] = useState<Form[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, FormSubmission[]>>({});
  const [currentForm, setCurrentForm] = useState<Form | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedForms = localStorage.getItem('forms');
    const storedSubmissions = localStorage.getItem('submissions');
    
    if (storedForms) {
      setForms(JSON.parse(storedForms));
    }
    
    if (storedSubmissions) {
      setSubmissions(JSON.parse(storedSubmissions));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('forms', JSON.stringify(forms));
  }, [forms]);

  useEffect(() => {
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }, [submissions]);

  const createForm = (formData: Omit<Form, 'id' | 'createdAt' | 'updatedAt' | 'shareUrl'>) => {
    const timestamp = Date.now();
    const id = uuidv4();
    const newForm: Form = {
      ...formData,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
      shareUrl: `${window.location.origin}/form/${id}`,
      isPublic: formData.isPublic
    };
    
    setForms((prevForms) => [...prevForms, newForm]);
    toast.success('Form created successfully');
    return id;
  };

  const updateForm = (updatedForm: Form) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === updatedForm.id
          ? { ...updatedForm, updatedAt: Date.now() }
          : form
      )
    );
    toast.success('Form updated successfully');
  };

  const deleteForm = (id: string) => {
    setForms((prevForms) => prevForms.filter((form) => form.id !== id));
    // Also delete submissions for this form
    setSubmissions((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    toast.success('Form deleted successfully');
  };

  const getForm = (id: string) => {
    return forms.find((form) => form.id === id);
  };

  const addSubmission = (formId: string, data: Record<string, any>) => {
    const submission: FormSubmission = {
      id: uuidv4(),
      formId,
      data,
      submittedAt: Date.now(),
    };
    
    setSubmissions((prev) => ({
      ...prev,
      [formId]: [...(prev[formId] || []), submission],
    }));
    
    toast.success('Form submitted successfully');
  };

  const getFormSubmissions = (formId: string) => {
    return submissions[formId] || [];
  };

  const exportToExcel = (formId: string) => {
    // In a real application, this would create an Excel file
    // For this demo, we'll just create a JSON representation
    const form = getForm(formId);
    const formSubmissions = getFormSubmissions(formId);
    
    if (!form || formSubmissions.length === 0) {
      toast.error('No submissions to export');
      return;
    }
    
    // Create a data URL for the JSON file
    const data = JSON.stringify({
      form,
      submissions: formSubmissions
    }, null, 2);
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title}-submissions.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Data exported successfully');
  };

  return (
    <FormContext.Provider
      value={{
        forms,
        submissions,
        currentForm,
        createForm,
        updateForm,
        deleteForm,
        getForm,
        addSubmission,
        getFormSubmissions,
        setCurrentForm,
        exportToExcel
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
