import styled from 'styled-components';

// Form container styling
export const FormContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  background: linear-gradient(145deg, #f6f8fa 0%, #ffffff 100%);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  
  @media (max-width: 850px) {
    margin: 15px;
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    margin: 10px;
    padding: 15px;
  }
`;

// Form header styling
export const FormHeader = styled.h1`
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

// Section header styling
export const SectionHeader = styled.h2`
  color: #34495e;
  margin: 30px 0 20px;
  font-weight: 500;
  font-size: 1.5rem;
  border-left: 4px solid #4CAF50;
  padding-left: 12px;
`;

// Form styling
export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Form field container
export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

// Label styling
export const Label = styled.label`
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.95rem;
  
  ${props => props.required && `
    &:after {
      content: ' *';
      color: #e74c3c;
    }
  `}
`;

// Input styling
export const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  outline: none;
  
  &:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  }
  
  &:hover {
    border-color: #8BC34A;
  }
  
  &[type="file"] {
    padding: 10px;
    background-color: #f8f9fa;
  }
`;

// Textarea styling
export const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1.5;
  
  &:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  }
  
  &:hover {
    border-color: #8BC34A;
  }
  
  &::placeholder {
    color: #aab2bd;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

// Select styling
export const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  outline: none;

  &:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  }

  &:hover {
    border-color: #8BC34A;
  }
`;

// Checkbox container
export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
`;

// Checkbox styling
export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4CAF50;
`;

// Checkbox label
export const CheckboxLabel = styled.span`
  font-size: 0.95rem;
  color: #2c3e50;
`;

// Child details container
export const ChildDetailsContainer = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 5px;
`;

// Child detail card
export const ChildCard = styled.div`
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    border-color: #8BC34A;
    transform: translateY(-3px);
  }
  
  &:before {
    content: 'Child Details';
    position: absolute;
    top: -10px;
    left: 15px;
    background-color: #4CAF50;
    color: white;
    padding: 2px 10px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }
`;

// Child detail field
export const ChildField = styled.div`
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

// Conditional field container
export const ConditionalField = styled.div`
  padding: 15px;
  border-left: 3px solid #4CAF50;
  background-color: #f1f8e9;
  border-radius: 0 8px 8px 0;
  margin: 10px 0;
  animation: fadeIn 0.3s ease-in-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  
  &:before {
    content: 'Additional Information';
    position: absolute;
    top: -10px;
    left: 15px;
    background-color: #4CAF50;
    color: white;
    padding: 2px 10px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// Submit button
export const SubmitButton = styled.button`
  padding: 14px 24px;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: linear-gradient(90deg, #43A047, #7CB342);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;