import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Import https for SSL configuration
import https from 'https';
import styled from 'styled-components';
import { API_URL } from '../config';

// Admin page styled components
const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background: linear-gradient(145deg, #f6f8fa 0%, #ffffff 100%);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
`;

const AdminHeader = styled.h1`
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

const AdminTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 500px;
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 1rem;
  flex-grow: 1;
  transition: all 0.3s;
  outline: none;
  
  &:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ExportButton = styled.button`
  padding: 10px 16px;
  background: linear-gradient(90deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background: linear-gradient(90deg, #2980b9, #3498db);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const LogoutButton = styled.button`
  padding: 10px 16px;
  background: linear-gradient(90deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: linear-gradient(90deg, #c0392b, #e74c3c);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  outline: none;
  
  &:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const SubmissionsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const SubmissionCard = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const CardTitle = styled.h2`
  color: #2c3e50;
  font-size: 1.3rem;
  margin-bottom: 15px;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 8px;
`;

const CardInfo = styled.p`
  margin: 8px 0;
  color: #34495e;
  
  strong {
    color: #2c3e50;
  }
`;

const ViewButton = styled.button`
  padding: 10px 16px;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: linear-gradient(90deg, #43A047, #7CB342);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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

const EmptyMessage = styled.p`
  text-align: center;
  padding: 30px;
  font-size: 1.1rem;
  color: #7f8c8d;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #dcdfe6;
`;

const AdminPage = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const httpsAgent = new https.Agent({  
          rejectUnauthorized: false
        });
        const response = await axios.get(`${API_URL}/api/submissions`, {
          httpsAgent
        });
        setSubmissions(response.data);
        setFilteredSubmissions(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch submissions');
        setLoading(false);
        console.error(err);
      }
    };

    fetchSubmissions();
  }, []);
  
  useEffect(() => {
    // Filter and sort submissions based on search term, gender filter, and sort option
    let result = [...submissions];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(submission => 
        submission.name.toLowerCase().includes(term) ||
        submission.employeeCode.toLowerCase().includes(term) ||
        submission.designation.toLowerCase().includes(term) ||
        submission.officialEmail.toLowerCase().includes(term)
      );
    }
    
    // Apply gender filter
    if (filterGender !== 'all') {
      result = result.filter(submission => submission.gender === filterGender);
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.submissionDate) - new Date(b.submissionDate));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredSubmissions(result);
  }, [submissions, searchTerm, filterGender, sortBy]);
  
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/login');
  };

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      window.location.href = `${API_URL}/api/export-excel`;
      setTimeout(() => setExporting(false), 2000);
    } catch (error) {
      console.error('Error exporting data:', error);
      setExporting(false);
    }
  };

  if (loading) return <LoadingMessage>Loading...</LoadingMessage>;
  if (error) return <ErrorMessage>Error: {error}</ErrorMessage>;

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const maleCount = submissions.filter(s => s.gender === 'Male').length;
  const femaleCount = submissions.filter(s => s.gender === 'Female').length;
  
  return (
    <AdminContainer>
      <AdminHeader>Admin Dashboard</AdminHeader>
      
      <AdminTopBar>
        <SearchContainer>
          <SearchInput 
            type="text" 
            placeholder="Search by name, employee code, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        <ButtonsContainer>
          <ExportButton onClick={handleExportExcel} disabled={exporting}>
            {exporting ? 'Exporting...' : 'Download All Data (Excel)'}
          </ExportButton>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </ButtonsContainer>
      </AdminTopBar>
      
      <StatsContainer>
        <StatCard>
          <StatValue>{totalSubmissions}</StatValue>
          <StatLabel>Total Submissions</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{maleCount}</StatValue>
          <StatLabel>Male Employees</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{femaleCount}</StatValue>
          <StatLabel>Female Employees</StatLabel>
        </StatCard>
      </StatsContainer>
      
      <FilterContainer>
        <FilterSelect 
          value={filterGender} 
          onChange={(e) => setFilterGender(e.target.value)}
        >
          <option value="all">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </FilterSelect>
        
        <FilterSelect 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name (A-Z)</option>
        </FilterSelect>
      </FilterContainer>
      
      <SubmissionsList>
        {filteredSubmissions.length === 0 ? (
          <EmptyMessage>No submissions found</EmptyMessage>
        ) : (
          filteredSubmissions.map((submission, index) => (
            <SubmissionCard key={index}>
              <CardTitle>{submission.name}</CardTitle>
              <CardInfo><strong>Employee Code:</strong> {submission.employeeCode}</CardInfo>
              <CardInfo><strong>Designation:</strong> {submission.designation}</CardInfo>
              <CardInfo><strong>Contact:</strong> {submission.mobile}</CardInfo>
              <CardInfo><strong>Email:</strong> {submission.officialEmail}</CardInfo>
              <ViewButton onClick={() => navigate(`/submission/${submission.id}`)}>
                View Details
              </ViewButton>
            </SubmissionCard>
          ))
        )}
      </SubmissionsList>
    </AdminContainer>
  );
};

export default AdminPage;