import mongoose from 'mongoose';

// Define the Child Schema
const childSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true }
});

// Define the Submission Schema
const submissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  gender: { type: String, required: true },
  employeeCode: { type: String, required: true },
  mobile: { type: String, required: true },
  alternateMobile: String,
  landline: String,
  officialEmail: { type: String, required: true },
  personalEmail: String,
  otherEmail: String,
  joiningDate: String,
  retirementDate: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  photoPath: { type: String, required: true },
  spouseName: { type: String, required: true },
  spouseWorking: { type: String, required: true },
  spouseMedicalFacility: { type: String, required: true },
  spouseMedicalThroughOffice: { type: Boolean, default: false },
  numberOfChildren: { type: Number, required: true },
  childrenMedicalFacility: String,
  pwdCategory: String,
  pwdName: String,
  motherName: String,
  motherDOB: String,
  motherBeneficiary: String,
  fatherName: String,
  fatherDOB: String,
  fatherBeneficiary: String,
  additionalInfo: String,
  submissionDate: { type: Date, default: Date.now },
  children: [childSchema]
});

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;