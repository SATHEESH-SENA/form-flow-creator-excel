
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormContext } from '@/context/FormContext';

// Define the validation schema for the form
const gstFormSchema = z.object({
  proprietorName: z.string().min(2, { message: "Proprietor name must be at least 2 characters." }),
  panCard: z.string().min(10, { message: "PAN Card must be 10 characters." }).max(10),
  aadharCard: z.string().min(12, { message: "Aadhar Card must be 12 digits." }).max(12),
  addressProofType: z.enum(["owned", "rent", "consent"]),
  businessName: z.string().min(3, { message: "Business name is required." }),
  productService: z.string().min(3, { message: "Product/Service details are required." }),
  mobileNumber: z.string().min(10, { message: "Mobile number must be 10 digits." }).max(10),
  emailId: z.string().email({ message: "Invalid email address." }),
  businessAddress: z.string().min(10, { message: "Business address is required." }),
  bankAccountType: z.enum(["currentAccount", "savingsAccount"]),
});

type GstFormValues = z.infer<typeof gstFormSchema>;

const GstRegistrationForm = () => {
  const [proprietorPhoto, setProprietorPhoto] = useState<File | null>(null);
  const [electricityBill, setElectricityBill] = useState<File | null>(null);
  const [rentAgreement, setRentAgreement] = useState<File | null>(null);
  const [consentLetter, setConsentLetter] = useState<File | null>(null);
  const [panCopyOwner, setPanCopyOwner] = useState<File | null>(null);
  const [bankDocument, setBankDocument] = useState<File | null>(null);
  
  const navigate = useNavigate();
  const { createForm } = useFormContext();
  
  const form = useForm<GstFormValues>({
    resolver: zodResolver(gstFormSchema),
    defaultValues: {
      proprietorName: "",
      panCard: "",
      aadharCard: "",
      addressProofType: "owned",
      businessName: "",
      productService: "",
      mobileNumber: "",
      emailId: "",
      businessAddress: "",
      bankAccountType: "currentAccount",
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const onSubmit = (data: GstFormValues) => {
    // In a real application, we would handle file uploads here
    // For this demo, we'll just create a form submission
    const formData = {
      ...data,
      proprietorPhoto: proprietorPhoto?.name || "Not uploaded",
      electricityBill: electricityBill?.name || "Not uploaded",
      rentAgreement: rentAgreement?.name || "Not uploaded",
      consentLetter: consentLetter?.name || "Not uploaded",
      panCopyOwner: panCopyOwner?.name || "Not uploaded",
      bankDocument: bankDocument?.name || "Not uploaded",
    };

    // Create a form in our context (this would normally save to a database)
    try {
      const formId = createForm({
        title: "GST Registration for Proprietorship",
        description: "Application form for GST registration of a proprietorship business",
        fields: [],
        isPublic: true,
      });
      
      // Log the form data for demo purposes
      console.log("Form submission:", formData);
      
      // Show success message
      toast.success("GST Registration form submitted successfully!");
      
      // Navigate back to forms list
      navigate('/forms');
    } catch (error) {
      toast.error("Error submitting form. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="bg-blue-900 text-white">
          <CardTitle className="text-2xl font-bold text-center">
            GST Registration of Proprietorship
          </CardTitle>
          <div className="text-center text-sm opacity-80 mt-2">
            Powered by Trusted Tax Consultants
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <img 
            src="/lovable-uploads/84f8fec7-4af9-408f-9ff3-9fa7c235b39b.png" 
            alt="GST Registration Requirements" 
            className="w-full max-h-48 object-contain mb-6"
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 1. Pan Card of Proprietor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="proprietorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold flex items-center">
                        <span className="inline-block bg-red-500 text-white w-6 h-6 rounded-full text-center mr-2">1</span> 
                        Proprietor Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter proprietor's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="panCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">PAN Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter PAN card number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 2. Photo of Proprietor */}
              <div className="border border-dashed border-gray-300 rounded-md p-4">
                <FormLabel className="font-semibold flex items-center mb-2">
                  <span className="inline-block bg-red-500 text-white w-6 h-6 rounded-full text-center mr-2">2</span> 
                  Photo of Proprietor
                </FormLabel>
                <div className="flex items-center space-x-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setProprietorPhoto)}
                    className="max-w-md"
                  />
                  <div className="text-sm text-gray-500">
                    {proprietorPhoto ? `Selected: ${proprietorPhoto.name}` : "No file selected"}
                  </div>
                </div>
              </div>

              {/* 3. Aadhar Card of Proprietor */}
              <FormField
                control={form.control}
                name="aadharCard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold flex items-center">
                      <span className="inline-block bg-red-500 text-white w-6 h-6 rounded-full text-center mr-2">3</span> 
                      Aadhar Card of Proprietor
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Aadhar card number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 4. Address Proof of Business */}
              <div className="space-y-3">
                <FormLabel className="font-semibold flex items-center">
                  <span className="inline-block bg-red-500 text-white w-6 h-6 rounded-full text-center mr-2">4</span> 
                  Address Proof of Business
                </FormLabel>
                <FormField
                  control={form.control}
                  name="addressProofType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="owned" id="owned" />
                            <Label htmlFor="owned">If owned</Label>
                            <div className="flex-1 ml-4">
                              <Input
                                type="file"
                                onChange={(e) => handleFileChange(e, setElectricityBill)}
                                className="w-full"
                                placeholder="Upload Electricity Bill"
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                {electricityBill ? `Selected: ${electricityBill.name}` : "Upload Electricity Bill"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rent" id="rent" />
                            <Label htmlFor="rent">If on Rent</Label>
                            <div className="flex-1 ml-4 space-y-2">
                              <Input
                                type="file"
                                onChange={(e) => handleFileChange(e, setElectricityBill)}
                                className="w-full"
                                placeholder="Upload Electricity Bill"
                              />
                              <div className="text-xs text-gray-500">
                                {electricityBill ? `Electricity Bill: ${electricityBill.name}` : "Upload Electricity Bill"}
                              </div>
                              <Input
                                type="file"
                                onChange={(e) => handleFileChange(e, setRentAgreement)}
                                className="w-full"
                                placeholder="Upload Rent Agreement"
                              />
                              <div className="text-xs text-gray-500">
                                {rentAgreement ? `Rent Agreement: ${rentAgreement.name}` : "Upload Rent Agreement"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="consent" id="consent" />
                            <Label htmlFor="consent">If on Consent</Label>
                            <div className="flex-1 ml-4 space-y-2">
                              <Input
                                type="file"
                                onChange={(e) => handleFileChange(e, setConsentLetter)}
                                className="w-full"
                                placeholder="Upload Consent Letter"
                              />
                              <div className="text-xs text-gray-500">
                                {consentLetter ? `Consent Letter: ${consentLetter.name}` : "Upload Consent Letter"}
                              </div>
                              <Input
                                type="file"
                                onChange={(e) => handleFileChange(e, setElectricityBill)}
                                className="w-full"
                                placeholder="Upload Electricity Bill"
                              />
                              <div className="text-xs text-gray-500">
                                {electricityBill ? `Electricity Bill: ${electricityBill.name}` : "Upload Electricity Bill"}
                              </div>
                              <Input
                                type="file"
                                onChange={(e) => handleFileChange(e, setPanCopyOwner)}
                                className="w-full"
                                placeholder="Upload PAN Copy of Owner"
                              />
                              <div className="text-xs text-gray-500">
                                {panCopyOwner ? `PAN Copy: ${panCopyOwner.name}` : "Upload PAN Copy of Owner"}
                              </div>
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address fields */}
              <FormField
                control={form.control}
                name="businessAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Business Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter complete business address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 5. Bank Account Proof */}
              <div className="space-y-3">
                <FormLabel className="font-semibold flex items-center">
                  <span className="inline-block bg-red-500 text-white w-6 h-6 rounded-full text-center mr-2">5</span> 
                  Cancelled cheque or First page of passbook or bank statement
                </FormLabel>
                <div className="border border-dashed border-gray-300 rounded-md p-4">
                  <FormField
                    control={form.control}
                    name="bankAccountType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="currentAccount" id="currentAccount" />
                              <Label htmlFor="currentAccount">Current Account in name of business</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="savingsAccount" id="savingsAccount" />
                              <Label htmlFor="savingsAccount">Saving Bank Account of Proprietor</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-3">
                    <Input
                      type="file"
                      onChange={(e) => handleFileChange(e, setBankDocument)}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {bankDocument ? `Selected: ${bankDocument.name}` : "Upload bank document"}
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Name of Proprietorship Business */}
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold flex items-center">
                      <span className="inline-block bg-red-500 text-white w-6 h-6 rounded-full text-center mr-2">6</span> 
                      Name of Proprietorship Business
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 7. Product/Service dealing in */}
              <FormField
                control={form.control}
                name="productService"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold flex items-center">
                      <span className="inline-block bg-red-500 text-white w-6 h-6 rounded-full text-center mr-2">7</span> 
                      Product/Service dealing in
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe products or services" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 8. Mobile Number */}
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold flex items-center">
                      <span className="inline-block bg-red-500 text-white w-6 h-6 rounded-full text-center mr-2">8</span> 
                      Mobile Number
                    </FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 9. Email Id */}
              <FormField
                control={form.control}
                name="emailId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold flex items-center">
                      <span className="inline-block bg-red-500 text-white w-6 h-6 rounded-full text-center mr-2">9</span> 
                      Email Id
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 space-y-4">
                <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800">
                  <Upload className="mr-2 h-4 w-4" />
                  Submit GST Registration Application
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <div className="font-semibold mb-2">Contact Information:</div>
            <div>admin@trustedtaxconsultants.com | 9751325000</div>
            <div className="mt-1">HO - B-26, Ramalinga Nagar I Main Road, Woriyur, Trichy - 620003</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GstRegistrationForm;
