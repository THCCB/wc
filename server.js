import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import fs from 'fs';
import ExcelJS from 'exceljs';

// ES module support
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Environment variables for configuration
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || join(__dirname, 'welfare_committee.db');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Create uploads directory if it doesn't exist
const uploadsDir = process.env.UPLOADS_DIR || join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Increased to 5MB limit for photos
});

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use('/uploads', express.static(uploadsDir));

// Database setup
let db;

async function initializeDatabase() {
  db = await open({
    filename: DATABASE_URL,
    driver: sqlite3.Database
  });
  
  // Create exports directory if it doesn't exist
  const exportsDir = process.env.EXPORTS_DIR || join(__dirname, 'exports');
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      designation TEXT NOT NULL,
      gender TEXT NOT NULL,
      employeeCode TEXT NOT NULL,
      mobile TEXT NOT NULL,
      alternateMobile TEXT,
      landline TEXT,
      officialEmail TEXT NOT NULL,
      personalEmail TEXT,
      otherEmail TEXT,
      joiningDate TEXT,
      retirementDate TEXT NOT NULL,
      bloodGroup TEXT NOT NULL,
      presentAddress TEXT NOT NULL,
      permanentAddress TEXT NOT NULL,
      photoPath TEXT NOT NULL,
      spouseName TEXT NOT NULL,
      spouseWorking TEXT NOT NULL,
      spouseMedicalFacility TEXT NOT NULL,
      spouseMedicalThroughOffice INTEGER,
      numberOfChildren INTEGER NOT NULL,
      childrenMedicalFacility TEXT,
      pwdCategory TEXT,
      pwdName TEXT,
      motherName TEXT,
      motherDOB TEXT,
      motherBeneficiary TEXT,
      fatherName TEXT,
      fatherDOB TEXT,
      fatherBeneficiary TEXT,
      additionalInfo TEXT,
      submissionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS children (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submissionId INTEGER,
      name TEXT,
      dob TEXT,
      gender TEXT,
      FOREIGN KEY (submissionId) REFERENCES submissions(id)
    );
  `);

  console.log('Database initialized');
}

// API Routes

// Submit form data
app.post('/api/submit', upload.single('photo'), async (req, res) => {
  try {
    const formData = req.body;
    const photoPath = req.file ? req.file.path : null;
    
    // Check if this is an update to an existing submission
    if (formData.id) {
      // This is an update operation
      const existingSubmission = await db.get('SELECT photoPath FROM submissions WHERE id = ?', [formData.id]);
      
      if (!existingSubmission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      // Use existing photo if no new photo is uploaded
      const updatedPhotoPath = photoPath || existingSubmission.photoPath;
      
      // Extract children details if present
      let childrenDetails = [];
      if (formData.childrenDetails && typeof formData.childrenDetails === 'string') {
        try {
          childrenDetails = JSON.parse(formData.childrenDetails);
        } catch (error) {
          console.error('Error parsing children details:', error);
        }
      }
      
      // Update the submission
      await db.run(`
        UPDATE submissions SET
          name = ?, designation = ?, gender = ?, employeeCode = ?, mobile = ?, 
          alternateMobile = ?, landline = ?, officialEmail = ?, personalEmail = ?, 
          otherEmail = ?, joiningDate = ?, retirementDate = ?, bloodGroup = ?, 
          presentAddress = ?, permanentAddress = ?, photoPath = ?, spouseName = ?,
          spouseWorking = ?, spouseMedicalFacility = ?, spouseMedicalThroughOffice = ?,
          numberOfChildren = ?, childrenMedicalFacility = ?, pwdCategory = ?, pwdName = ?,
          motherName = ?, motherDOB = ?, motherBeneficiary = ?, fatherName = ?, 
          fatherDOB = ?, fatherBeneficiary = ?, additionalInfo = ?
        WHERE id = ?
      `, [
        formData.name,
        formData.designation,
        formData.gender,
        formData.employeeCode,
        formData.mobile,
        formData.alternateMobile || null,
        formData.landline || null,
        formData.officialEmail,
        formData.personalEmail || null,
        formData.otherEmail || null,
        formData.joiningDate || null,
        formData.retirementDate,
        formData.bloodGroup,
        formData.presentAddress,
        formData.permanentAddress,
        updatedPhotoPath,
        formData.spouseName,
        formData.spouseWorking,
        formData.spouseMedicalFacility,
        formData.spouseMedicalThroughOffice ? 1 : 0,
        formData.numberOfChildren,
        formData.childrenMedicalFacility || null,
        formData.pwdCategory || null,
        formData.pwdName || null,
        formData.motherName || null,
        formData.motherDOB || null,
        formData.motherBeneficiary || null,
        formData.fatherName || null,
        formData.fatherDOB || null,
        formData.fatherBeneficiary || null,
        formData.additionalInfo || null,
        formData.id
      ]);
      
      // Delete existing children records
      await db.run('DELETE FROM children WHERE submissionId = ?', [formData.id]);
      
      // Insert updated children details
      if (childrenDetails.length > 0) {
        for (const child of childrenDetails) {
          await db.run(`
            INSERT INTO children (submissionId, name, dob, gender)
            VALUES (?, ?, ?, ?)
          `, [formData.id, child.name, child.dob, child.gender]);
        }
      }
      
      return res.status(200).json({ message: 'Form updated successfully', id: formData.id });
    }
    
    // This is a new submission
    if (!photoPath) {
      return res.status(400).json({ error: 'Photo is required' });
    }

    // Extract children details if present
    let childrenDetails = [];
    if (formData.childrenDetails && typeof formData.childrenDetails === 'string') {
      try {
        childrenDetails = JSON.parse(formData.childrenDetails);
      } catch (error) {
        console.error('Error parsing children details:', error);
      }
    }

    // Insert main submission
    const result = await db.run(`
      INSERT INTO submissions (
        name, designation, gender, employeeCode, mobile, alternateMobile, landline,
        officialEmail, personalEmail, otherEmail, joiningDate, retirementDate,
        bloodGroup, presentAddress, permanentAddress, photoPath, spouseName,
        spouseWorking, spouseMedicalFacility, spouseMedicalThroughOffice,
        numberOfChildren, childrenMedicalFacility, pwdCategory, pwdName,
        motherName, motherDOB, motherBeneficiary, fatherName, fatherDOB,
        fatherBeneficiary, additionalInfo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      formData.name,
      formData.designation,
      formData.gender,
      formData.employeeCode,
      formData.mobile,
      formData.alternateMobile || null,
      formData.landline || null,
      formData.officialEmail,
      formData.personalEmail || null,
      formData.otherEmail || null,
      formData.joiningDate || null,
      formData.retirementDate,
      formData.bloodGroup,
      formData.presentAddress,
      formData.permanentAddress,
      photoPath,
      formData.spouseName,
      formData.spouseWorking,
      formData.spouseMedicalFacility,
      formData.spouseMedicalThroughOffice ? 1 : 0,
      formData.numberOfChildren,
      formData.childrenMedicalFacility || null,
      formData.pwdCategory || null,
      formData.pwdName || null,
      formData.motherName || null,
      formData.motherDOB || null,
      formData.motherBeneficiary || null,
      formData.fatherName || null,
      formData.fatherDOB || null,
      formData.fatherBeneficiary || null,
      formData.additionalInfo || null
    ]);

    const submissionId = result.lastID;

    // Insert children details if any
    if (childrenDetails.length > 0) {
      for (const child of childrenDetails) {
        await db.run(`
          INSERT INTO children (submissionId, name, dob, gender)
          VALUES (?, ?, ?, ?)
        `, [submissionId, child.name, child.dob, child.gender]);
      }
    }

    res.status(201).json({ message: 'Form submitted successfully', id: submissionId });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

// Get all submissions for admin page
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await db.all('SELECT * FROM submissions ORDER BY submissionDate DESC');
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Export all submissions to Excel
app.get('/api/export-excel', async (req, res) => {
  try {
    // Fetch all submissions with their children
    const submissions = await db.all('SELECT * FROM submissions ORDER BY submissionDate DESC');
    
    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Welfare Committee';
    workbook.created = new Date();
    
    // Add a worksheet for submissions
    const worksheet = workbook.addWorksheet('Submissions');
    
    // Define columns
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Designation', key: 'designation', width: 20 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Employee Code', key: 'employeeCode', width: 15 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'Alternate Mobile', key: 'alternateMobile', width: 15 },
      { header: 'Landline', key: 'landline', width: 15 },
      { header: 'Official Email', key: 'officialEmail', width: 30 },
      { header: 'Personal Email', key: 'personalEmail', width: 30 },
      { header: 'Joining Date', key: 'joiningDate', width: 15 },
      { header: 'Retirement Date', key: 'retirementDate', width: 15 },
      { header: 'Blood Group', key: 'bloodGroup', width: 10 },
      { header: 'Present Address', key: 'presentAddress', width: 40 },
      { header: 'Permanent Address', key: 'permanentAddress', width: 40 },
      { header: 'Spouse Name', key: 'spouseName', width: 30 },
      { header: 'Spouse Working', key: 'spouseWorking', width: 15 },
      { header: 'Spouse Medical Facility', key: 'spouseMedicalFacility', width: 20 },
      { header: 'Number of Children', key: 'numberOfChildren', width: 15 },
      { header: 'Children Medical Facility', key: 'childrenMedicalFacility', width: 20 },
      { header: 'PWD Category', key: 'pwdCategory', width: 15 },
      { header: 'PWD Name', key: 'pwdName', width: 30 },
      { header: 'Mother Name', key: 'motherName', width: 30 },
      { header: 'Mother DOB', key: 'motherDOB', width: 15 },
      { header: 'Mother Beneficiary', key: 'motherBeneficiary', width: 15 },
      { header: 'Father Name', key: 'fatherName', width: 30 },
      { header: 'Father DOB', key: 'fatherDOB', width: 15 },
      { header: 'Father Beneficiary', key: 'fatherBeneficiary', width: 15 },
      { header: 'Additional Info', key: 'additionalInfo', width: 40 },
      { header: 'Submission Date', key: 'submissionDate', width: 20 }
    ];
    
    // Add rows
    for (const submission of submissions) {
      // Fetch children for this submission
      const children = await db.all('SELECT * FROM children WHERE submissionId = ?', [submission.id]);
      
      // Format some fields for better readability
      const formattedSubmission = {
        ...submission,
        spouseWorking: submission.spouseWorking === 'Yes' ? 'Working' : 'Non-Working',
        spouseMedicalFacility: submission.spouseMedicalFacility === 'Yes' ? 'Availed' : 'Not Availed',
        childrenMedicalFacility: submission.childrenMedicalFacility === 'Yes' ? 'Availed' : 'Not Availed',
        pwdCategory: submission.pwdCategory === 'Yes' ? 'Yes' : 'No'
      };
      
      worksheet.addRow(formattedSubmission);
    }
    
    // Add a worksheet for children
    const childrenWorksheet = workbook.addWorksheet('Children');
    
    // Define columns for children
    childrenWorksheet.columns = [
      { header: 'Submission ID', key: 'submissionId', width: 15 },
      { header: 'Parent Name', key: 'parentName', width: 30 },
      { header: 'Child Name', key: 'name', width: 30 },
      { header: 'Date of Birth', key: 'dob', width: 15 },
      { header: 'Gender', key: 'gender', width: 10 }
    ];
    
    // Add rows for children
    for (const submission of submissions) {
      if (submission.numberOfChildren > 0) {
        const children = await db.all('SELECT * FROM children WHERE submissionId = ?', [submission.id]);
        
        for (const child of children) {
          childrenWorksheet.addRow({
            submissionId: submission.id,
            parentName: submission.name,
            name: child.name,
            dob: child.dob,
            gender: child.gender
          });
        }
      }
    }
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=welfare_committee_data.xlsx');
    
    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    res.status(500).json({ error: 'Failed to export data to Excel' });
  }
});

// Get a single submission with its children
app.get('/api/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const submission = await db.get('SELECT * FROM submissions WHERE id = ?', [id]);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    const children = await db.all('SELECT * FROM children WHERE submissionId = ?', [id]);
    
    res.json({ ...submission, children });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

// Serve the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

// Start the server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});