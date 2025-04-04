
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash, Plus } from 'lucide-react';
import { FormField } from '@/context/FormContext';

interface FieldEditorProps {
  field: FormField;
  onChange: (updates: Partial<FormField>) => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onChange }) => {
  const updateValidation = (key: keyof FormField['validation'], value: any) => {
    onChange({
      validation: {
        ...field.validation,
        [key]: value
      }
    });
  };
  
  const addOption = () => {
    if (!field.options) return;
    onChange({
      options: [...field.options, `Option ${field.options.length + 1}`]
    });
  };
  
  const updateOption = (index: number, value: string) => {
    if (!field.options) return;
    const newOptions = [...field.options];
    newOptions[index] = value;
    onChange({ options: newOptions });
  };
  
  const removeOption = (index: number) => {
    if (!field.options) return;
    const newOptions = field.options.filter((_, i) => i !== index);
    onChange({ options: newOptions });
  };
  
  const renderBasicFields = () => (
    <>
      <div className="mb-4">
        <Label htmlFor={`${field.id}-label`}>Field Label</Label>
        <Input
          id={`${field.id}-label`}
          value={field.label}
          onChange={(e) => onChange({ label: e.target.value })}
          className="mt-1"
        />
      </div>
      
      <div className="mb-4">
        <Label htmlFor={`${field.id}-placeholder`}>Placeholder</Label>
        <Input
          id={`${field.id}-placeholder`}
          value={field.placeholder || ''}
          onChange={(e) => onChange({ placeholder: e.target.value })}
          className="mt-1"
        />
      </div>
    </>
  );
  
  const renderOptions = () => {
    if (!['select', 'radio', 'checkbox'].includes(field.type) || !field.options) return null;
    
    return (
      <div className="mb-4">
        <Label>Options</Label>
        <div className="space-y-2 mt-1">
          {field.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
              />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => removeOption(index)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                disabled={field.options && field.options.length <= 1}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm"
            onClick={addOption}
            className="mt-2 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>
      </div>
    );
  };
  
  const renderValidation = () => {
    const { validation } = field;
    
    return (
      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium mb-3">Validation</h4>
        
        <div className="flex items-center space-x-2 mb-3">
          <Switch
            id={`${field.id}-required`}
            checked={validation.required || false}
            onCheckedChange={(checked) => updateValidation('required', checked)}
          />
          <Label htmlFor={`${field.id}-required`}>Required field</Label>
        </div>
        
        {['text', 'textarea', 'email'].includes(field.type) && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label htmlFor={`${field.id}-min-length`}>Min Length</Label>
                <Input
                  id={`${field.id}-min-length`}
                  type="number"
                  value={validation.minLength || ''}
                  onChange={(e) => updateValidation('minLength', e.target.value ? Number(e.target.value) : undefined)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`${field.id}-max-length`}>Max Length</Label>
                <Input
                  id={`${field.id}-max-length`}
                  type="number"
                  value={validation.maxLength || ''}
                  onChange={(e) => updateValidation('maxLength', e.target.value ? Number(e.target.value) : undefined)}
                  className="mt-1"
                />
              </div>
            </div>
          </>
        )}
        
        {field.type === 'number' && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <Label htmlFor={`${field.id}-min`}>Min Value</Label>
              <Input
                id={`${field.id}-min`}
                type="number"
                value={validation.min || ''}
                onChange={(e) => updateValidation('min', e.target.value ? Number(e.target.value) : undefined)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`${field.id}-max`}>Max Value</Label>
              <Input
                id={`${field.id}-max`}
                type="number"
                value={validation.max || ''}
                onChange={(e) => updateValidation('max', e.target.value ? Number(e.target.value) : undefined)}
                className="mt-1"
              />
            </div>
          </div>
        )}
        
        {['text', 'email'].includes(field.type) && (
          <div>
            <Label htmlFor={`${field.id}-pattern`}>Regex Pattern</Label>
            <Input
              id={`${field.id}-pattern`}
              value={validation.pattern || ''}
              onChange={(e) => updateValidation('pattern', e.target.value || undefined)}
              placeholder="e.g., ^[a-zA-Z0-9]{3,}$"
              className="mt-1"
            />
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div>
      {renderBasicFields()}
      {renderOptions()}
      {renderValidation()}
    </div>
  );
};

export default FieldEditor;
