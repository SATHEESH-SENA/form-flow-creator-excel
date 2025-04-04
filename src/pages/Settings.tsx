
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Save, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useFormContext } from '@/context/FormContext';

const Settings = () => {
  const { forms, submissions } = useFormContext();
  const [fileStoragePath, setFileStoragePath] = useState<string>(
    localStorage.getItem('fileStoragePath') || 'file-uploads'
  );
  const [autoSave, setAutoSave] = useState<boolean>(
    localStorage.getItem('autoSave') === 'true'
  );
  
  const handleSaveSettings = () => {
    localStorage.setItem('fileStoragePath', fileStoragePath);
    localStorage.setItem('autoSave', String(autoSave));
    toast.success('Settings saved successfully');
  };
  
  const handleExportAllData = () => {
    const data = JSON.stringify({ forms, submissions }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `formflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('All data exported successfully');
  };
  
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        // Validate the data structure
        if (!data.forms || !Array.isArray(data.forms)) {
          throw new Error('Invalid forms data structure');
        }
        
        // In a real app, we would update the context with the imported data
        toast.success('Data imported successfully');
        toast.info('Note: In this demo, data import is simulated');
      } catch (error) {
        console.error(error);
        toast.error('Failed to import data: Invalid file format');
      }
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">
          Configure your form builder preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure basic settings for your form builder
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file-path">File Upload Storage Path</Label>
              <Input 
                id="file-path"
                value={fileStoragePath}
                onChange={(e) => setFileStoragePath(e.target.value)}
                placeholder="e.g., file-uploads"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Relative path where uploaded files will be stored
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
              <Label htmlFor="auto-save">Auto-save form while editing</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSaveSettings}
              className="flex items-center bg-primary-500 hover:bg-primary-600"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Export or import your forms and submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Export Data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download all your forms and submissions as a JSON file
              </p>
              <Button 
                variant="outline" 
                onClick={handleExportAllData}
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Import Data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Import forms and submissions from a previously exported file
              </p>
              <div className="flex items-center gap-4">
                <Input
                  id="import-file"
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                />
                <Button 
                  variant="outline"
                  className="flex items-center whitespace-nowrap"
                  onClick={() => document.getElementById('import-file')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Note: This will merge with your existing data
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
