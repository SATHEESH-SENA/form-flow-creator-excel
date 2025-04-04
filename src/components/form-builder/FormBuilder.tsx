
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Save,
  Plus, 
  Copy, 
  Trash, 
  ArrowUp, 
  ArrowDown, 
  Grip, 
  ExternalLink,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useFormContext, Form, FormField, FieldType } from '@/context/FormContext';
import FieldEditor from './FieldEditor';
import PreviewForm from './PreviewForm';

const FormBuilder = () => {
  const { id } = useParams();
  const { getForm, createForm, updateForm } = useFormContext();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('editor');
  const [formState, setFormState] = useState<Form>({
    id: '',
    title: 'New Form',
    description: '',
    fields: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPublic: true
  });
  
  // Load form data if editing an existing form
  useEffect(() => {
    if (id) {
      const existingForm = getForm(id);
      if (existingForm) {
        setFormState(existingForm);
      } else {
        toast.error('Form not found');
        navigate('/forms');
      }
    }
  }, [id, getForm, navigate]);
  
  const handleFormChange = (field: string, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };
  
  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${type} field`,
      placeholder: `Enter ${type}...`,
      validation: { required: false },
    };
    
    if (type === 'select' || type === 'radio') {
      newField.options = ['Option 1', 'Option 2', 'Option 3'];
    }
    
    setFormState((prev) => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    
    toast.success(`Added new ${type} field`);
  };
  
  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormState((prev) => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };
  
  const deleteField = (fieldId: string) => {
    setFormState((prev) => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    toast.success('Field deleted');
  };
  
  const duplicateField = (fieldId: string) => {
    const fieldToDuplicate = formState.fields.find(field => field.id === fieldId);
    if (fieldToDuplicate) {
      const duplicatedField: FormField = {
        ...fieldToDuplicate,
        id: `field-${Date.now()}`,
        label: `${fieldToDuplicate.label} (copy)`,
      };
      
      setFormState((prev) => ({
        ...prev,
        fields: [...prev.fields, duplicatedField]
      }));
      toast.success('Field duplicated');
    }
  };
  
  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const fieldIndex = formState.fields.findIndex(field => field.id === fieldId);
    if (
      (direction === 'up' && fieldIndex === 0) || 
      (direction === 'down' && fieldIndex === formState.fields.length - 1)
    ) {
      return;
    }
    
    const newFields = [...formState.fields];
    const newIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
    
    const [movedField] = newFields.splice(fieldIndex, 1);
    newFields.splice(newIndex, 0, movedField);
    
    setFormState((prev) => ({
      ...prev,
      fields: newFields
    }));
  };
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const newFields = [...formState.fields];
    const [movedField] = newFields.splice(result.source.index, 1);
    newFields.splice(result.destination.index, 0, movedField);
    
    setFormState((prev) => ({
      ...prev,
      fields: newFields
    }));
  };
  
  const saveForm = () => {
    if (!formState.title.trim()) {
      toast.error('Form title is required');
      return;
    }
    
    if (formState.fields.length === 0) {
      toast.error('Form must have at least one field');
      return;
    }
    
    try {
      if (id) {
        updateForm(formState);
      } else {
        const newId = createForm({
          title: formState.title,
          description: formState.description,
          fields: formState.fields,
          isPublic: formState.isPublic
        });
        navigate(`/forms/${newId}/edit`);
      }
    } catch (error) {
      toast.error('Failed to save form');
      console.error(error);
    }
  };
  
  const previewForm = () => {
    setActiveTab('preview');
  };
  
  const viewShareLink = () => {
    const shareUrl = formState.shareUrl || `${window.location.origin}/form/${formState.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard');
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Edit Form' : 'Create Form'}
          </h1>
          <p className="text-gray-600 mt-1">
            {id ? 'Modify your form and save changes' : 'Design your form by adding fields and setting validation rules'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          {id && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={viewShareLink}
              className="flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Share Link
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={previewForm}
            className="flex items-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={saveForm} 
            size="sm"
            className="bg-primary-500 hover:bg-primary-600 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Form
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="editor">Form Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Form Settings */}
              <Card className="mb-8">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Form Details</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Form Title</Label>
                    <Input 
                      id="title"
                      placeholder="Enter form title"
                      value={formState.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      placeholder="Enter form description (optional)"
                      value={formState.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="public-form"
                      checked={formState.isPublic}
                      onCheckedChange={(checked) => handleFormChange('isPublic', checked)}
                    />
                    <Label htmlFor="public-form">Public Form (anyone can submit)</Label>
                  </div>
                </CardContent>
              </Card>
              
              {/* Form Fields */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-xl font-semibold">Form Fields</h2>
                  <p className="text-sm text-gray-500">{formState.fields.length} fields</p>
                </CardHeader>
                <CardContent>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="form-fields">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-4"
                        >
                          {formState.fields.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-md">
                              <p className="text-gray-500 mb-4">No fields added yet</p>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => addField('text')}
                                className="flex items-center"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add your first field
                              </Button>
                            </div>
                          ) : (
                            formState.fields.map((field, index) => (
                              <Draggable key={field.id} draggableId={field.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="border rounded-md p-4 bg-white hover:shadow-sm transition-shadow"
                                  >
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center">
                                        <div 
                                          {...provided.dragHandleProps}
                                          className="text-gray-400 hover:text-gray-600 cursor-move mr-3"
                                        >
                                          <Grip className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-medium">{field.label}</h3>
                                        <span className="ml-2 text-xs uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                          {field.type}
                                        </span>
                                      </div>
                                      <div className="flex space-x-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => moveField(field.id, 'up')}
                                          disabled={index === 0}
                                          className="h-8 w-8 p-0"
                                        >
                                          <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => moveField(field.id, 'down')}
                                          disabled={index === formState.fields.length - 1}
                                          className="h-8 w-8 p-0"
                                        >
                                          <ArrowDown className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => duplicateField(field.id)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => deleteField(field.id)}
                                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                        >
                                          <Trash className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                    <FieldEditor 
                                      field={field} 
                                      onChange={(updates) => updateField(field.id, updates)} 
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Add Fields</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => addField('text')}
                      className="justify-start"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Text Field
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => addField('email')}
                      className="justify-start"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Email Field
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => addField('number')}
                      className="justify-start"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Number Field
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => addField('textarea')}
                      className="justify-start"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Text Area
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => addField('date')}
                      className="justify-start"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Date Field
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => addField('select')}
                      className="justify-start"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Select Dropdown
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => addField('checkbox')}
                      className="justify-start"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Checkbox
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => addField('radio')}
                      className="justify-start"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Radio Buttons
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => addField('file')}
                      className="justify-start"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      File Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card>
            <CardContent className="pt-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveTab('editor')}
                className="mb-6"
              >
                Back to Editor
              </Button>
              <PreviewForm form={formState} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormBuilder;
