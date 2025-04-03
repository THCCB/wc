import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
// Import https for SSL configuration
import https from 'https';
import { API_URL } from '../config';

const ThankYouContainer = styled.div`
  max-width: 800px;
  margin: 100px auto;
  padding: 40px;
  background: linear-gradient(145deg, #f6f8fa 0%, #ffffff 100%);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  text-align: center;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
`;

const PhotoContainer = styled.div`
  margin: 20px auto;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: fit-content;
  text-align: center;
`;

const Photo = styled.img`
  max-width: 200px;
  max-height: 240px;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const PhotoLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const ThankYouHeader = styled.h1`
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 600;
  position: relative;
  padding-bottom: 15px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
    border-radius: 2px;
  }
`;

const Message = styled.p`
  color: #34495e;
  font-size: 1.2rem;
  margin: 20px 0 30px;
  line-height: 1.6;
`;

const Button = styled.button`
  display: inline-block;
  padding: 14px 24px;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0 10px;
  
  &:hover {
    background: linear-gradient(90deg, #43A047, #7CB342);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const HomeButton = styled(Link)`
  display: inline-block;
  padding: 14px 24px;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0 10px;
  
  &:hover {
    background: linear-gradient(90deg, #43A047, #7CB342);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const PrintButton = styled(Button)`
  background: linear-gradient(90deg, #3498db, #2980b9);
  
  &:hover {
    background: linear-gradient(90deg, #2980b9, #3498db);
  }
`;

const EditButton = styled(Button)`
  background: linear-gradient(90deg, #f39c12, #e67e22);
  
  &:hover {
    background: linear-gradient(90deg, #e67e22, #f39c12);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submissionId, setSubmissionId] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    // Check if we have a submission ID from the location state
    if (location.state && location.state.submissionId) {
      setSubmissionId(location.state.submissionId);
      
      // Fetch the submission data
      const fetchSubmissionData = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/submissions/${location.state.submissionId}`, {
            // Add these options to handle SSL issues
            httpsAgent: new https.Agent({
              rejectUnauthorized: false // Note: Only use in development, not recommended for production
            })
          });
          setSubmissionData(response.data);
          if (response.data.photoPath) {
            setPhotoUrl(`${API_URL}/uploads/${response.data.photoPath.split('\\').pop()}`);
          }
        } catch (error) {
          console.error('Error fetching submission data:', error);
        }
      };
      
      fetchSubmissionData();
    }
  }, [location]);

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow || !submissionData) return;
    
    // Generate HTML content for printing
    // Update photo URL in printContent
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Welfare Committee Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1 { color: #2c3e50; text-align: center; margin-bottom: 20px; }
          h2 { color: #34495e; margin: 20px 0 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .section { margin-bottom: 20px; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; }
          .value { margin-left: 10px; }
          .child-card { border: 1px solid #eee; padding: 10px; margin: 10px 0; border-radius: 5px; }
          .photo-container { text-align: center; margin: 20px 0; }
          .photo { max-width: 150px; max-height: 180px; border-radius: 5px; border: 1px solid #ddd; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          .header-with-photo { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
          .header-content { flex: 1; }
          @media print { body { padding: 0; } button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header-with-photo">
          <div class="header-content">
            <h1>Welfare Committee Form Submission</h1>
          </div>
          ${submissionData.photoPath ? `
          <div class="photo-container">
            <img src="${API_URL}/uploads/${submissionData.photoPath.split('\\').pop()}" alt="Profile Photo" class="photo" />
          </div>` : ''}
        </div>
        
        <div class="section">
          <h2>Personal Information</h2>
          <div class="field"><span class="label">Name:</span> <span class="value">${submissionData.name}</span></div>
          <div class="field"><span class="label">Designation:</span> <span class="value">${submissionData.designation}</span></div>
          <div class="field"><span class="label">Gender:</span> <span class="value">${submissionData.gender}</span></div>
          <div class="field"><span class="label">Employee Code:</span> <span class="value">${submissionData.employeeCode}</span></div>
          <div class="field"><span class="label">Mobile:</span> <span class="value">${submissionData.mobile}</span></div>
          ${submissionData.alternateMobile ? `<div class="field"><span class="label">Alternate Mobile:</span> <span class="value">${submissionData.alternateMobile}</span></div>` : ''}
          ${submissionData.landline ? `<div class="field"><span class="label">Landline:</span> <span class="value">${submissionData.landline}</span></div>` : ''}
          <div class="field"><span class="label">Official Email:</span> <span class="value">${submissionData.officialEmail}</span></div>
          ${submissionData.personalEmail ? `<div class="field"><span class="label">Personal Email:</span> <span class="value">${submissionData.personalEmail}</span></div>` : ''}
          ${submissionData.joiningDate ? `<div class="field"><span class="label">Joining Date:</span> <span class="value">${submissionData.joiningDate}</span></div>` : ''}
          <div class="field"><span class="label">Retirement Date:</span> <span class="value">${submissionData.retirementDate}</span></div>
          <div class="field"><span class="label">Blood Group:</span> <span class="value">${submissionData.bloodGroup}</span></div>
          <div class="field"><span class="label">Present Address:</span> <span class="value">${submissionData.presentAddress}</span></div>
          <div class="field"><span class="label">Permanent Address:</span> <span class="value">${submissionData.permanentAddress}</span></div>
        </div>
        
        <div class="section">
          <h2>Spouse Information</h2>
          <div class="field"><span class="label">Spouse Name:</span> <span class="value">${submissionData.spouseName}</span></div>
          <div class="field"><span class="label">Working Status:</span> <span class="value">${submissionData.spouseWorking === 'Yes' ? 'Working' : 'Non-Working'}</span></div>
          <div class="field"><span class="label">Medical Facility:</span> <span class="value">${submissionData.spouseMedicalFacility === 'Yes' ? 'Availed' : 'Not Availed'}${submissionData.spouseMedicalFacility === 'Yes' && submissionData.spouseMedicalThroughOffice === 1 ? ' (Through Office)' : ''}</span></div>
        </div>
        
        ${submissionData.numberOfChildren > 0 ? `
        <div class="section">
          <h2>Children Information</h2>
          <div class="field"><span class="label">Number of Children:</span> <span class="value">${submissionData.numberOfChildren}</span></div>
          <div class="field"><span class="label">Medical Facility:</span> <span class="value">${submissionData.childrenMedicalFacility === 'Yes' ? 'Availed' : 'Not Availed'}</span></div>
          
          ${submissionData.children && submissionData.children.length > 0 ? 
            submissionData.children.map((child, index) => `
              <div class="child-card">
                <div class="field"><span class="label">Name:</span> <span class="value">${child.name}</span></div>
                <div class="field"><span class="label">Date of Birth:</span> <span class="value">${child.dob}</span></div>
                <div class="field"><span class="label">Gender:</span> <span class="value">${child.gender}</span></div>
              </div>
            `).join('') : ''}
        </div>
        ` : ''}
        
        ${submissionData.pwdCategory === 'Yes' ? `
        <div class="section">
          <h2>PWD Information</h2>
          <div class="field"><span class="label">PWD Category:</span> <span class="value">Yes</span></div>
          <div class="field"><span class="label">Name:</span> <span class="value">${submissionData.pwdName}</span></div>
        </div>
        ` : ''}
        
        ${(submissionData.motherName || submissionData.fatherName) ? `
        <div class="section">
          <h2>Parents Information</h2>
          ${submissionData.motherName ? `
            <div class="field"><span class="label">Mother's Name:</span> <span class="value">${submissionData.motherName}</span></div>
            ${submissionData.motherDOB ? `<div class="field"><span class="label">Mother's DOB:</span> <span class="value">${submissionData.motherDOB}</span></div>` : ''}
            <div class="field"><span class="label">Mother Beneficiary:</span> <span class="value">${submissionData.motherBeneficiary}</span></div>
          ` : ''}
          
          ${submissionData.fatherName ? `
            <div class="field"><span class="label">Father's Name:</span> <span class="value">${submissionData.fatherName}</span></div>
            ${submissionData.fatherDOB ? `<div class="field"><span class="label">Father's DOB:</span> <span class="value">${submissionData.fatherDOB}</span></div>` : ''}
            <div class="field"><span class="label">Father Beneficiary:</span> <span class="value">${submissionData.fatherBeneficiary}</span></div>
          ` : ''}
        </div>
        ` : ''}
        
        ${submissionData.additionalInfo ? `
        <div class="section">
          <h2>Additional Information</h2>
          <div class="field">${submissionData.additionalInfo}</div>
        </div>
        ` : ''}
        
        <button onclick="window.print(); window.close();">Print</button>
      </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Trigger print when content is loaded
    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
    };
  };

  const handleEdit = () => {
    if (submissionId) {
      navigate('/', { state: { editMode: true, submissionData } });
    }
  };

  return (
    <ThankYouContainer>
      <ThankYouHeader>Thank You!</ThankYouHeader>
      <Message>
        Your form has been successfully submitted to the Welfare Committee.
        We appreciate your participation and will process your information promptly.
      </Message>
      {photoUrl && (
        <PhotoContainer>
          <Photo src={photoUrl} alt="Profile Photo" />
          <PhotoLabel>Photo</PhotoLabel>
        </PhotoContainer>
      )}
      <ButtonContainer>
        <HomeButton to="/">Return to Home</HomeButton>
        {submissionId && (
          <>
            <PrintButton onClick={handlePrint}>Print Form</PrintButton>
            <EditButton onClick={handleEdit}>Edit Form</EditButton>
          </>
        )}
      </ButtonContainer>
    </ThankYouContainer>
  );
};

export default ThankYou;