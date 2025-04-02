import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          form.append(key, value);
        }
      });
  
      // If we're in edit mode, include the submission ID
      if (location.state && location.state.editMode && location.state.submissionData) {
        form.append('id', location.state.submissionData.id);
      }
  
      const response = await axios.post(`${API_URL}/api/submit`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Navigate to thank you page with submission ID for print/edit functionality
      navigate('/thank-you', { state: { submissionId: response.data.id } });
    } catch (error) {
      console.error('Submission failed:', error);
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
                    <Label>Name:</Label>
                    <Input
                      type="text"
                      value={child.name}
                      onChange={(e) => {
                        const updatedChildren = [...formData.childrenDetails];
                        updatedChildren[index].name = e.target.value;
                        setFormData(prev => ({ ...prev, childrenDetails: updatedChildren }));
                      }}
                    />
                  </ChildField>
                  <ChildField>
                    <Label>Date of Birth:</Label>
                    <Input
                      type="date"
                      value={child.dob}
                      onChange={(e) => {
                        const updatedChildren = [...formData.childrenDetails];
                        updatedChildren[index].dob = e.target.value;
                        setFormData(prev => ({ ...prev, childrenDetails: updatedChildren }));
                      }}
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