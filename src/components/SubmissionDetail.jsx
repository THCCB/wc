import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { API_URL } from '../config';

// Styled components for the submission detail page
const DetailContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background: linear-gradient(145deg, #f6f8fa 0%, #ffffff 100%);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
`;

const DetailHeader = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
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

const SectionHeader = styled.h2`
  color: #34495e;
  margin: 30px 0 20px;
  font-weight: 500;
  font-size: 1.5rem;
  border-left: 4px solid #4CAF50;
  padding-left: 12px;
`;

const DetailSection = styled.div`
  margin-bottom: 30px;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const DetailLabel = styled.div`
  flex: 0 0 200px;
  font-weight: 600;
  color: #2c3e50;
`;

const DetailValue = styled.div`
  flex: 1;
  color: #34495e;
`;

const PhotoContainer = styled.div`
  margin: 20px 0;
  text-align: center;
`;

const Photo = styled.img`
  max-width: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ChildrenList = styled.div`
  margin-top: 15px;
`;

const ChildCard = styled.div`
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
`;

const BackButton = styled(Link)`
  display: inline-block;
  padding: 12px 20px;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: linear-gradient(90deg, #43A047, #7CB342);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #e74c3c;
  background-color: #fdecea;
  border-radius: 8px;
  margin: 20px 0;
`;

const SubmissionDetail = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissionDetail = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/submissions/${id}`);
        setSubmission(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch submission details');
        setLoading(false);
        console.error(err);
      }
    };

    fetchSubmissionDetail();
  }, [id]);

  if (loading) return <LoadingMessage>Loading...</LoadingMessage>;
  if (error) return <ErrorMessage>Error: {error}</ErrorMessage>;
  if (!submission) return <ErrorMessage>Submission not found</ErrorMessage>;

  return (
    <DetailContainer>
      <DetailHeader>Submission Details</DetailHeader>
      
      <DetailSection>
        <SectionHeader>Personal Information</SectionHeader>
        
        <DetailRow>
          <DetailLabel>Submission Date:</DetailLabel>
          <DetailValue>{new Date(submission.submissionDate).toLocaleString()}</DetailValue>
        </DetailRow>
        
        <PhotoContainer>
          {submission.photoPath && (
            <Photo src={`${API_URL}/uploads/${submission.photoPath.split('\\').pop()}`} alt="Profile Photo" />
          )}
        </PhotoContainer>
        
        <DetailRow>
          <DetailLabel>Name:</DetailLabel>
          <DetailValue>{submission.name}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Designation:</DetailLabel>
          <DetailValue>{submission.designation}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Gender:</DetailLabel>
          <DetailValue>{submission.gender}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Employee Code:</DetailLabel>
          <DetailValue>{submission.employeeCode}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Mobile:</DetailLabel>
          <DetailValue>{submission.mobile}</DetailValue>
        </DetailRow>
        
        {submission.alternateMobile && (
          <DetailRow>
            <DetailLabel>Alternate Mobile:</DetailLabel>
            <DetailValue>{submission.alternateMobile}</DetailValue>
          </DetailRow>
        )}
        
        {submission.landline && (
          <DetailRow>
            <DetailLabel>Landline:</DetailLabel>
            <DetailValue>{submission.landline}</DetailValue>
          </DetailRow>
        )}
        
        <DetailRow>
          <DetailLabel>Official Email:</DetailLabel>
          <DetailValue>{submission.officialEmail}</DetailValue>
        </DetailRow>
        
        {submission.personalEmail && (
          <DetailRow>
            <DetailLabel>Personal Email:</DetailLabel>
            <DetailValue>{submission.personalEmail}</DetailValue>
          </DetailRow>
        )}
        
        {submission.otherEmail && (
          <DetailRow>
            <DetailLabel>Other Email:</DetailLabel>
            <DetailValue>{submission.otherEmail}</DetailValue>
          </DetailRow>
        )}
        
        {submission.joiningDate && (
          <DetailRow>
            <DetailLabel>Joining Date:</DetailLabel>
            <DetailValue>{submission.joiningDate}</DetailValue>
          </DetailRow>
        )}
        
        <DetailRow>
          <DetailLabel>Retirement Date:</DetailLabel>
          <DetailValue>{submission.retirementDate}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Blood Group:</DetailLabel>
          <DetailValue>{submission.bloodGroup}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Present Address:</DetailLabel>
          <DetailValue>{submission.presentAddress}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Permanent Address:</DetailLabel>
          <DetailValue>{submission.permanentAddress}</DetailValue>
        </DetailRow>
      </DetailSection>
      
      <DetailSection>
        <SectionHeader>Spouse Information</SectionHeader>
        
        <DetailRow>
          <DetailLabel>Spouse Name:</DetailLabel>
          <DetailValue>{submission.spouseName}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Working Status:</DetailLabel>
          <DetailValue>{submission.spouseWorking === 'Yes' ? 'Working' : 'Non-Working'}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Medical Facility:</DetailLabel>
          <DetailValue>
            {submission.spouseMedicalFacility === 'Yes' ? 'Availed' : 'Not Availed'}
            {submission.spouseMedicalFacility === 'Yes' && submission.spouseMedicalThroughOffice === 1 && ' (Through Office)'}
          </DetailValue>
        </DetailRow>
      </DetailSection>
      
      {submission.numberOfChildren > 0 && (
        <DetailSection>
          <SectionHeader>Children Information</SectionHeader>
          
          <DetailRow>
            <DetailLabel>Number of Children:</DetailLabel>
            <DetailValue>{submission.numberOfChildren}</DetailValue>
          </DetailRow>
          
          <DetailRow>
            <DetailLabel>Medical Facility:</DetailLabel>
            <DetailValue>{submission.childrenMedicalFacility === 'Yes' ? 'Availed' : 'Not Availed'}</DetailValue>
          </DetailRow>
          
          {submission.children && submission.children.length > 0 && (
            <ChildrenList>
              {submission.children.map((child, index) => (
                <ChildCard key={index}>
                  <DetailRow>
                    <DetailLabel>Name:</DetailLabel>
                    <DetailValue>{child.name}</DetailValue>
                  </DetailRow>
                  
                  <DetailRow>
                    <DetailLabel>Date of Birth:</DetailLabel>
                    <DetailValue>{child.dob}</DetailValue>
                  </DetailRow>
                  
                  <DetailRow>
                    <DetailLabel>Gender:</DetailLabel>
                    <DetailValue>{child.gender}</DetailValue>
                  </DetailRow>
                </ChildCard>
              ))}
            </ChildrenList>
          )}
        </DetailSection>
      )}
      
      {submission.pwdCategory === 'Yes' && (
        <DetailSection>
          <SectionHeader>PWD Information</SectionHeader>
          
          <DetailRow>
            <DetailLabel>PWD Category:</DetailLabel>
            <DetailValue>Yes</DetailValue>
          </DetailRow>
          
          <DetailRow>
            <DetailLabel>Name:</DetailLabel>
            <DetailValue>{submission.pwdName}</DetailValue>
          </DetailRow>
        </DetailSection>
      )}
      
      {(submission.motherName || submission.fatherName) && (
        <DetailSection>
          <SectionHeader>Parents Information</SectionHeader>
          
          {submission.motherName && (
            <>
              <DetailRow>
                <DetailLabel>Mother's Name:</DetailLabel>
                <DetailValue>{submission.motherName}</DetailValue>
              </DetailRow>
              
              {submission.motherDOB && (
                <DetailRow>
                  <DetailLabel>Mother's DOB:</DetailLabel>
                  <DetailValue>{submission.motherDOB}</DetailValue>
                </DetailRow>
              )}
              
              <DetailRow>
                <DetailLabel>Mother Beneficiary:</DetailLabel>
                <DetailValue>{submission.motherBeneficiary}</DetailValue>
              </DetailRow>
            </>
          )}
          
          {submission.fatherName && (
            <>
              <DetailRow>
                <DetailLabel>Father's Name:</DetailLabel>
                <DetailValue>{submission.fatherName}</DetailValue>
              </DetailRow>
              
              {submission.fatherDOB && (
                <DetailRow>
                  <DetailLabel>Father's DOB:</DetailLabel>
                  <DetailValue>{submission.fatherDOB}</DetailValue>
                </DetailRow>
              )}
              
              <DetailRow>
                <DetailLabel>Father Beneficiary:</DetailLabel>
                <DetailValue>{submission.fatherBeneficiary}</DetailValue>
              </DetailRow>
            </>
          )}
        </DetailSection>
      )}
      
      {submission.additionalInfo && (
        <DetailSection>
          <SectionHeader>Additional Information</SectionHeader>
          
          <DetailRow>
            <DetailValue>{submission.additionalInfo}</DetailValue>
          </DetailRow>
        </DetailSection>
      )}
      
      <BackButton to="/admin">Back to Admin Dashboard</BackButton>
    </DetailContainer>
  );
};

export default SubmissionDetail;