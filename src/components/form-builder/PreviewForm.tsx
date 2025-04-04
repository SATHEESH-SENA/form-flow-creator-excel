
import React, { useState } from 'react';
import { Form } from '@/context/FormContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface PreviewFormProps {
  form: Form;
  onSubmit?: (data: Record<string, any>) => void;
}

const PreviewForm: React.FC<PreviewFormProps> = ({ form, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    
    // Clear error when field is changed
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    form.fields.forEach(field => {
      const value = formData[field.id];
      const validation = field.validation || {};
      
      // Required validation
      if (validation.required && (!value || (typeof value === 'string' && !value.trim()))) {
        newErrors[field.id] = 'This field is required';
        return;
      }
      
      if (value) {
        // Min length validation
        if (validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
          newErrors[field.id] = `Must be at least ${validation.minLength} characters`;
          return;
        }
        
        // Max length validation
        if (validation.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
          newErrors[field.id] = `Cannot exceed ${validation.maxLength} characters`;
          return;
        }
        
        // Min value validation
        if (validation.min !== undefined && typeof value === 'number' && value < validation.min) {
          newErrors[field.id] = `Must be at least ${validation.min}`;
          return;
        }
        
        // Max value validation
        if (validation.max !== undefined && typeof value === 'number' && value > validation.max) {
          newErrors[field.id] = `Cannot exceed ${validation.max}`;
          return;
        }
        
        // Pattern validation
        if (validation.pattern && typeof value === 'string') {
          const regex = new RegExp(validation.pattern);
          if (!regex.test(value)) {
            newErrors[field.id] = 'Invalid format';
            return;
          }
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateForm();
    if (!isValid) return;
    
    if (onSubmit) {
      onSubmit(formData);
    }
  };
  
  const renderField = (field: Form['fields'][0]) => {
    const { id, type, label, placeholder, options, validation } = field;
    const isRequired = validation?.required || false;
    const error = errors[id];
    
    switch (type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div key={id} className="mb-4">
            <Label 
              htmlFor={id}
              className={`${isRequired ? 'after:content-["*"] after:ml-0.5 after:text-destructive' : ''}`}
            >
              {label}
            </Label>
            <Input
              id={id}
              type={type}
              placeholder={placeholder}
              value={formData[id] || ''}
              onChange={(e) => handleInputChange(id, type === 'number' ? Number(e.target.value) : e.target.value)}
              className={cn("mt-1", error ? "border-destructive" : "")}
            />
            {error && <p className="text-destructive text-sm mt-1">{error}</p>}
          </div>
        );
        
      case 'textarea':
        return (
          <div key={id} className="mb-4">
            <Label 
              htmlFor={id}
              className={`${isRequired ? 'after:content-["*"] after:ml-0.5 after:text-destructive' : ''}`}
            >
              {label}
            </Label>
            <Textarea
              id={id}
              placeholder={placeholder}
              value={formData[id] || ''}
              onChange={(e) => handleInputChange(id, e.target.value)}
              className={cn("mt-1", error ? "border-destructive" : "")}
            />
            {error && <p className="text-destructive text-sm mt-1">{error}</p>}
          </div>
        );
        
      case 'select':
        return (
          <div key={id} className="mb-4">
            <Label 
              htmlFor={id}
              className={`${isRequired ? 'after:content-["*"] after:ml-0.5 after:text-destructive' : ''}`}
            >
              {label}
            </Label>
            <Select 
              value={formData[id] || ''}
              onValueChange={(value) => handleInputChange(id, value)}
            >
              <SelectTrigger id={id} className={cn("mt-1", error ? "border-destructive" : "")}>
                <SelectValue placeholder={placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option, i) => (
                  <SelectItem key={i} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-destructive text-sm mt-1">{error}</p>}
          </div>
        );
        
      case 'checkbox':
        return (
          <div key={id} className="mb-4">
            <Label className={`${isRequired ? 'after:content-["*"] after:ml-0.5 after:text-destructive' : ''}`}>
              {label}
            </Label>
            <div className="mt-1 space-y-2">
              {options?.map((option, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${id}-${i}`}
                    checked={Array.isArray(formData[id]) ? formData[id]?.includes(option) : false}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(formData[id]) ? [...formData[id]] : [];
                      if (checked) {
                        handleInputChange(id, [...currentValues, option]);
                      } else {
                        handleInputChange(id, currentValues.filter(value => value !== option));
                      }
                    }}
                  />
                  <Label htmlFor={`${id}-${i}`}>{option}</Label>
                </div>
              ))}
            </div>
            {error && <p className="text-destructive text-sm mt-1">{error}</p>}
          </div>
        );
        
      case 'radio':
        return (
          <div key={id} className="mb-4">
            <Label className={`${isRequired ? 'after:content-["*"] after:ml-0.5 after:text-destructive' : ''}`}>
              {label}
            </Label>
            <RadioGroup 
              value={formData[id] || ''}
              onValueChange={(value) => handleInputChange(id, value)}
              className="mt-1 space-y-2"
            >
              {options?.map((option, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${id}-${i}`} />
                  <Label htmlFor={`${id}-${i}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {error && <p className="text-destructive text-sm mt-1">{error}</p>}
          </div>
        );
        
      case 'date':
        return (
          <div key={id} className="mb-4">
            <Label 
              htmlFor={id}
              className={`${isRequired ? 'after:content-["*"] after:ml-0.5 after:text-destructive' : ''}`}
            >
              {label}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id={id}
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    error ? "border-destructive" : "",
                    !formData[id] && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData[id] ? format(new Date(formData[id]), 'PPP') : (placeholder || 'Pick a date')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData[id] ? new Date(formData[id]) : undefined}
                  onSelect={(date) => handleInputChange(id, date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {error && <p className="text-destructive text-sm mt-1">{error}</p>}
          </div>
        );
        
      case 'file':
        return (
          <div key={id} className="mb-4">
            <Label 
              htmlFor={id}
              className={`${isRequired ? 'after:content-["*"] after:ml-0.5 after:text-destructive' : ''}`}
            >
              {label}
            </Label>
            <Input
              id={id}
              type="file"
              onChange={(e) => handleInputChange(id, e.target.files && e.target.files[0])}
              className={cn("mt-1", error ? "border-destructive" : "")}
            />
            {error && <p className="text-destructive text-sm mt-1">{error}</p>}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 border rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-gray-600 mb-6">{form.description}</p>
        )}
        
        <form onSubmit={handleSubmit}>
          {form.fields.map(renderField)}
          
          {onSubmit && (
            <Button 
              type="submit" 
              className="mt-6 bg-primary-500 hover:bg-primary-600"
            >
              Submit
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PreviewForm;
