import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL, axiosConfig } from '../config';
import {
  FormContainer,
  FormHeader,
  SectionHeader,
  StyledForm,
  FormField,
  Label,
  Input,
  TextArea,
  Select,
  CheckboxContainer,
  Checkbox,
  CheckboxLabel,
  ChildDetailsContainer,
  ChildCard,
  ChildField,
  ConditionalField,
  SubmitButton
} from './FormStyles';

const FormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    designation: '',
    gender: 'Male',
    employeeCode: '',
    mobile: '',
    alternateMobile: '',
    landline: '',
    officialEmail: '',
    personalEmail: '',
    otherEmail: '',
    joiningDate: '',
    retirementDate: '',
    bloodGroup: '',
    presentAddress: '',
    permanentAddress: '',
    photo: null,

    // Spouse Information
    spouseName: '',
    spouseWorking: 'Yes',
    spouseMedicalFacility: 'Yes',
    spouseMedicalThroughOffice: false,

    // Children Information
    numberOfChildren: 0,
    childrenDetails: [],
    childrenMedicalFacility: 'Yes',

    // PWD Information
    pwdCategory: 'No',
    pwdName: '',

    // Parents Information
    motherName: '',
    motherDOB: '',
    motherBeneficiary: 'No',
    fatherName: '',
    fatherDOB: '',
    fatherBeneficiary: 'No',

    // Other Information
    additionalInfo: '',
    undertaking: false
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  // Check if we're in edit mode and pre-populate form data
  useEffect(() => {
    if (location.state && location.state.editMode && location.state.submissionData) {
      const editData = location.state.submissionData;
      
      // Create a new form data object with the edit data
      const newFormData = {
        ...formData,
        name: editData.name || '',
        designation: editData.designation || '',
        gender: editData.gender || 'Male',
        employeeCode: editData.employeeCode || '',
        mobile: editData.mobile || '',
        alternateMobile: editData.alternateMobile || '',
        landline: editData.landline || '',
        officialEmail: editData.officialEmail || '',
        personalEmail: editData.personalEmail || '',
        otherEmail: editData.otherEmail || '',
        joiningDate: editData.joiningDate || '',
        retirementDate: editData.retirementDate || '',
        bloodGroup: editData.bloodGroup || '',
        presentAddress: editData.presentAddress || '',
        permanentAddress: editData.permanentAddress || '',
        // Don't set photo as it can't be pre-populated
        
        spouseName: editData.spouseName || '',
        spouseWorking: editData.spouseWorking || 'Yes',
        spouseMedicalFacility: editData.spouseMedicalFacility || 'Yes',
        spouseMedicalThroughOffice: editData.spouseMedicalThroughOffice === 1,
        
        numberOfChildren: editData.numberOfChildren || 0,
        childrenDetails: editData.children || [],
        childrenMedicalFacility: editData.childrenMedicalFacility || 'Yes',
        
        pwdCategory: editData.pwdCategory || 'No',
        pwdName: editData.pwdName || '',
        
        motherName: editData.motherName || '',
        motherDOB: editData.motherDOB || '',
        motherBeneficiary: editData.motherBeneficiary || 'No',
        fatherName: editData.fatherName || '',
        fatherDOB: editData.fatherDOB || '',
        fatherBeneficiary: editData.fatherBeneficiary || 'No',
        
        additionalInfo: editData.additionalInfo || '',
        undertaking: false
      };
      
      setFormData(newFormData);
    }
  }, [location]);

  // Update the API URL in the handleSubmit function
  const validateForm = () => {
    // Check if children details are properly filled when children are present
    if (formData.numberOfChildren > 0) {
      for (let i = 0; i < formData.childrenDetails.length; i++) {
        const child = formData.childrenDetails[i];
        if (!child.name || !child.name.trim()) {
          throw new Error(`Please enter the name for child ${i + 1}`);
        }
        if (!child.dob) {
          throw new Error(`Please enter the date of birth for child ${i + 1}`);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form data before submission
      validateForm();
    } catch (validationError) {
      alert(validationError.message);
      return;
    }
    
    // Define apiEndpoint outside try/catch so it's available in both blocks
    const apiEndpoint = `${API_URL}/api/submit`;
    
    try {
      // Create a FormData object to handle file uploads
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'childrenDetails' && Array.isArray(value)) {
          // Convert array to JSON string for proper transmission
          form.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          form.append(key, value);
        }
      });
  
      // If we're in edit mode, include the submission ID
      if (location.state && location.state.editMode && location.state.submissionData) {
        form.append('id', location.state.submissionData._id); // Using MongoDB's _id
      }
      
      console.log('Submitting form to:', apiEndpoint);
      
      // Use a more robust axios configuration with error handling
      const response = await axios.post(apiEndpoint, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Enhanced configuration for better reliability
        timeout: 120000, // Extended timeout for larger form data (2 minutes)
        withCredentials: false, // Avoid CORS issues with credentials
        maxContentLength: 10 * 1024 * 1024, // 10MB max content length
        maxBodyLength: 10 * 1024 * 1024, // 10MB max body length
        validateStatus: function (status) {
          return status >= 200 && status < 300; // Only resolve for success status codes
        }
      });
      
      // Navigate to thank you page with MongoDB _id for print/edit functionality
      navigate('/thank-you', { state: { submissionId: response.data._id } });
    } catch (error) {
      console.error('Submission failed:', error);
      // Enhanced error handling with more details
      let errorMessage = error.message;
      
      // Log detailed error information for debugging
      console.log('Form Submission Error Details:', {
        url: apiEndpoint,
        errorCode: error.code,
        errorMessage: error.message,
        errorStack: error.stack,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : 'No response data'
      });
      
      // Handle specific error types with appropriate messages
      if (error.code === 'ERR_SSL_VERSION_OR_CIPHER_MISMATCH' || 
          error.code === 'ERR_NETWORK') {
        errorMessage = 'There was a network or SSL connection issue. Please check your internet connection and try again.';
        // Suggest alternative actions to the user
        alert(`Form submission failed: ${errorMessage}\n\nTry these solutions:\n1. Refresh the page and try again\n2. Clear your browser cache\n3. Try using a different browser\n4. Try using a different network connection\n5. Contact support if the issue persists`);
        return;
      } else if (error.response && error.response.status === 500) {
        // Handle 500 Internal Server Error specifically
        errorMessage = 'The server encountered an internal error. This might be due to server load or a temporary issue.';
        alert(`Form submission failed: ${errorMessage}\n\nPlease try again in a few minutes. If the problem persists, contact support with the following information:\n- Time of submission: ${new Date().toLocaleString()}\n- Form data: ${formData.name}, ${formData.employeeCode}`);
        return;
      } else if (error.response && error.response.status === 413) {
        // Handle payload too large error
        errorMessage = 'The form data (likely the photo) is too large to upload.';
        alert(`Form submission failed: ${errorMessage}\n\nPlease reduce the size of your photo to under 200KB and try again.`);
        return;
      }
      
      // For other types of errors, provide a more generic message
      alert(`Form submission failed: ${errorMessage}. Please try again or contact support.`);
    }
  };

  return (
    <FormContainer>
      <FormHeader>e-Form for Welfare Committee</FormHeader>
      <StyledForm onSubmit={handleSubmit}>
        {/* Personal Information Fields */}
        <SectionHeader>Personal Information</SectionHeader>
        <FormField>
          <Label htmlFor="name" required>Name of Officer/Official (as per office record)</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField>
          <Label htmlFor="designation" required>Designation</Label>
          <Input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField>
          <Label required>Gender</Label>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
        </FormField>

        <FormField>
          <Label htmlFor="employeeCode" required>Employee Code</Label>
          <Input
            type="text"
            id="employeeCode"
            name="employeeCode"
            value={formData.employeeCode}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField>
          <Label htmlFor="mobile" required>Mobile No. (as per office record)</Label>
          <Input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField>
          <Label htmlFor="alternateMobile">Alternate Mobile No.</Label>
          <Input
            type="tel"
            id="alternateMobile"
            name="alternateMobile"
            value={formData.alternateMobile}
            onChange={handleChange}
          />
        </FormField>

        <FormField>
          <Label htmlFor="landline">Landline No. (if any)</Label>
          <Input
            type="tel"
            id="landline"
            name="landline"
            value={formData.landline}
            onChange={handleChange}
          />
        </FormField>

        <FormField>
          <Label htmlFor="officialEmail" required>Email ID (as per office record)</Label>
          <Input
            type="email"
            id="officialEmail"
            name="officialEmail"
            value={formData.officialEmail}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField>
          <Label htmlFor="personalEmail">Email (Personal)</Label>
          <Input
            type="email"
            id="personalEmail"
            name="personalEmail"
            value={formData.personalEmail}
            onChange={handleChange}
          />
        </FormField>

        <FormField>
          <Label htmlFor="otherEmail">Email (if any)</Label>
          <Input
            type="email"
            id="otherEmail"
            name="otherEmail"
            value={formData.otherEmail}
            onChange={handleChange}
          />
        </FormField>

        <FormField>
          <Label htmlFor="joiningDate">Date of Joining (as per office record)</Label>
          <Input
            type="date"
            id="joiningDate"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
          />
        </FormField>

        <FormField>
          <Label htmlFor="retirementDate" required>Date of Retirement (if already retired-as per office record)</Label>
          <Input
            type="date"
            id="retirementDate"
            name="retirementDate"
            value={formData.retirementDate}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField>
          <Label htmlFor="bloodGroup" required>Blood Group</Label>
          <Input
            type="text"
            id="bloodGroup"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField>
          <Label htmlFor="presentAddress" required>Present Address (as per office record)</Label>
          <TextArea
            id="presentAddress"
            name="presentAddress"
            value={formData.presentAddress}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField>
          <Label htmlFor="permanentAddress" required>Permanent Address (as per office record)</Label>
          <TextArea
            id="permanentAddress"
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField>
          <Label htmlFor="photo" required>Upload Your Recent Passport Size Photo (Size 200KB)</Label>
          <Input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </FormField>

        {/* Spouse Information Fields */}
        <SectionHeader>Details of Spouse</SectionHeader>
        <FormField>
          <Label htmlFor="spouseName" required>Name of Spouse</Label>
          <Input
            type="text"
            id="spouseName"
            name="spouseName"
            value={formData.spouseName}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField>
          <Label required>Whether Spouse is working or non-Working</Label>
          <Select
            name="spouseWorking"
            value={formData.spouseWorking}
            onChange={handleChange}
            required
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Select>
        </FormField>

        <FormField>
          <Label required>Whether Spouse availed Medical Facilities</Label>
          <Select
            name="spouseMedicalFacility"
            value={formData.spouseMedicalFacility}
            onChange={handleChange}
            required
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Select>
        </FormField>

        {formData.spouseMedicalFacility === 'Yes' && (
          <ConditionalField>
            <Label>If Yes (Through this office or not)</Label>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                name="spouseMedicalThroughOffice"
                checked={formData.spouseMedicalThroughOffice}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  spouseMedicalThroughOffice: e.target.checked
                }))}
              />
              <CheckboxLabel>Through this office</CheckboxLabel>
            </CheckboxContainer>
          </ConditionalField>
        )}

        {/* Children Information Fields */}
        <SectionHeader>Details of Children</SectionHeader>
        <FormField>
          <Label required>No. of Children</Label>
          <Select
            name="numberOfChildren"
            value={formData.numberOfChildren}
            onChange={(e) => {
              const count = parseInt(e.target.value);
              setFormData(prev => ({
                ...prev,
                numberOfChildren: count,
                childrenDetails: Array(count).fill().map((_, i) => 
                  prev.childrenDetails[i] || { name: '', dob: '', gender: 'Male' }
                )
              }));
            }}
            required
          >
            {[...Array(13).keys()].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </Select>
        </FormField>

        {formData.numberOfChildren > 0 && (
          <FormField>
            <Label>Name of Children (Name, Date of Birth, Gender)</Label>
            <ChildDetailsContainer>
              {formData.childrenDetails.map((child, index) => (
                <ChildCard key={index}>
                  <ChildField>
                    <Label required>Name:</Label>
                    <Input
                      type="text"
                      value={child.name}
                      onChange={(e) => {
                        const updatedChildren = [...formData.childrenDetails];
                        updatedChildren[index].name = e.target.value;
                        setFormData(prev => ({ ...prev, childrenDetails: updatedChildren }));
                      }}
                      required
                    />
                  </ChildField>
                  <ChildField>
                    <Label required>Date of Birth:</Label>
                    <Input
                      type="date"
                      value={child.dob}
                      onChange={(e) => {
                        const updatedChildren = [...formData.childrenDetails];
                        updatedChildren[index].dob = e.target.value;
                        setFormData(prev => ({ ...prev, childrenDetails: updatedChildren }));
                      }}
                      required
                    />
                  </ChildField>
                  <ChildField>
                    <Label>Gender:</Label>
                    <Select
                      value={child.gender}
                      onChange={(e) => {
                        const updatedChildren = [...formData.childrenDetails];
                        updatedChildren[index].gender = e.target.value;
                        setFormData(prev => ({ ...prev, childrenDetails: updatedChildren }));
                      }}
                    >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    </Select>
                  </ChildField>
                </ChildCard>
              ))}
            </ChildDetailsContainer>
          </FormField>
        )}

        <FormField>
          <Label>Whether Children availed Medical Facility as beneficiary</Label>
          <Select
            name="childrenMedicalFacility"
            value={formData.childrenMedicalFacility}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Select>
        </FormField>

        <FormField>
          <Label>Whether Spouse or any of the children are under PWD Category</Label>
          <Select
            name="pwdCategory"
            value={formData.pwdCategory}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Select>
        </FormField>

        {formData.pwdCategory === 'Yes' && (
          <ConditionalField>
            <Label htmlFor="pwdName">If yes, then specify the Name of Spouse/Children</Label>
            <Input
              type="text"
              id="pwdName"
              name="pwdName"
              value={formData.pwdName}
              onChange={handleChange}
            />
          </ConditionalField>
        )}

        {/* Parents Information Fields */}
        <SectionHeader>Details of Parents</SectionHeader>
        <FormField>
          <Label htmlFor="motherName">Name of Mother</Label>
          <Input
            type="text"
            id="motherName"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
          />
        </FormField>

        <FormField>
          <Label htmlFor="motherDOB">Date of Birth</Label>
          <Input
            type="date"
            id="motherDOB"
            name="motherDOB"
            value={formData.motherDOB}
            onChange={handleChange}
          />
        </FormField>

        <FormField>
          <Label>Whether beneficiary</Label>
          <Select
            name="motherBeneficiary"
            value={formData.motherBeneficiary}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Select>
        </FormField>

        <FormField>
          <Label htmlFor="fatherName">Name of Father</Label>
          <Input
            type="text"
            id="fatherName"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
          />
        </FormField>

        <FormField>
          <Label htmlFor="fatherDOB">Date of Birth</Label>
          <Input
            type="date"
            id="fatherDOB"
            name="fatherDOB"
            value={formData.fatherDOB}
            onChange={handleChange}
          />
        </FormField>

        <FormField>
          <Label>Whether beneficiary</Label>
          <Select
            name="fatherBeneficiary"
            value={formData.fatherBeneficiary}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Select>
        </FormField>

        {/* Other Information Fields */}
        <SectionHeader>Additional Information</SectionHeader>
        <FormField>
          <Label htmlFor="additionalInfo">Any other information wishes to share</Label>
          <TextArea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
          />
        </FormField>

        <FormField>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              name="undertaking"
              checked={formData.undertaking}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                undertaking: e.target.checked
              }))}
              required
            />
            <CheckboxLabel>Undertaking*: I undertake that the above information shared by me is true, correct and as per office record.</CheckboxLabel>
          </CheckboxContainer>
        </FormField>

        <SubmitButton type="submit">Submit</SubmitButton>
      </StyledForm>
    </FormContainer>
  );
};

export default FormPage;