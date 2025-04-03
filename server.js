import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/database.js';
import Submission from './models/submission.js';
import cors from 'cors';
import fs from 'fs';
import ExcelJS from 'exceljs';
import { setupHealthCheck } from './healthz.js';

// ES module support
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Environment variables for configuration
const PORT = process.env.PORT || 3000;
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

// Setup health check endpoint for Render.com
setupHealthCheck(app);

// Trust proxy for Render.com's infrastructure
app.set('trust proxy', true);

// Force HTTPS redirect only in production and when not already on HTTPS
app.use((req, res, next) => {
  // Skip HTTPS redirect for health check endpoint
  if (req.path === '/healthz') {
    return next();
  }
  
  // Only redirect in production and when not already on HTTPS
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Enforce modern TLS protocols
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  // More permissive Content-Security-Policy for production
  res.setHeader('Content-Security-Policy', "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'");
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Configure TLS protocol requirements
app.use((req, res, next) => {
  // Skip TLS version check in production environment (Render.com)
  if (process.env.NODE_ENV === 'production') {
    return next();
  }
  
  // Only check TLS version in development with HTTPS
  const tlsVersion = req.connection.getPeerCertificate?.()?.version;
  if (tlsVersion && !['TLSv1.2', 'TLSv1.3'].includes(tlsVersion)) {
    return res.status(403).send('Insecure protocol version detected');
  }
  next();
});
app.use('/uploads', express.static(uploadsDir));

// Initialize database
async function initializeDatabase() {
  // Connect to MongoDB
  await connectDB();
  
  // Create exports directory if it doesn't exist
  const exportsDir = process.env.EXPORTS_DIR || join(__dirname, 'exports');
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

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
      const existingSubmission = await Submission.findById(formData.id);
      
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
      const updatedSubmission = await Submission.findByIdAndUpdate(
        formData.id,
        {
          name: formData.name,
          designation: formData.designation,
          gender: formData.gender,
          employeeCode: formData.employeeCode,
          mobile: formData.mobile,
          alternateMobile: formData.alternateMobile,
          landline: formData.landline,
          officialEmail: formData.officialEmail,
          personalEmail: formData.personalEmail,
          otherEmail: formData.otherEmail,
          joiningDate: formData.joiningDate,
          retirementDate: formData.retirementDate,
          bloodGroup: formData.bloodGroup,
          presentAddress: formData.presentAddress,
          permanentAddress: formData.permanentAddress,
          photoPath: updatedPhotoPath,
          spouseName: formData.spouseName,
          spouseWorking: formData.spouseWorking,
          spouseMedicalFacility: formData.spouseMedicalFacility,
          spouseMedicalThroughOffice: formData.spouseMedicalThroughOffice === '1',
          numberOfChildren: formData.numberOfChildren,
          childrenMedicalFacility: formData.childrenMedicalFacility,
          pwdCategory: formData.pwdCategory,
          pwdName: formData.pwdName,
          motherName: formData.motherName,
          motherDOB: formData.motherDOB,
          motherBeneficiary: formData.motherBeneficiary,
          fatherName: formData.fatherName,
          fatherDOB: formData.fatherDOB,
          fatherBeneficiary: formData.fatherBeneficiary,
          additionalInfo: formData.additionalInfo,
          children: childrenDetails
        },
        { new: true }
      );
      
      return res.status(200).json({ message: 'Form updated successfully', id: updatedSubmission._id });
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

    // Create new submission
    const submission = new Submission({
      name: formData.name,
      designation: formData.designation,
      gender: formData.gender,
      employeeCode: formData.employeeCode,
      mobile: formData.mobile,
      alternateMobile: formData.alternateMobile,
      landline: formData.landline,
      officialEmail: formData.officialEmail,
      personalEmail: formData.personalEmail,
      otherEmail: formData.otherEmail,
      joiningDate: formData.joiningDate,
      retirementDate: formData.retirementDate,
      bloodGroup: formData.bloodGroup,
      presentAddress: formData.presentAddress,
      permanentAddress: formData.permanentAddress,
      photoPath: photoPath,
      spouseName: formData.spouseName,
      spouseWorking: formData.spouseWorking,
      spouseMedicalFacility: formData.spouseMedicalFacility,
      spouseMedicalThroughOffice: formData.spouseMedicalThroughOffice === '1',
      numberOfChildren: formData.numberOfChildren,
      childrenMedicalFacility: formData.childrenMedicalFacility,
      pwdCategory: formData.pwdCategory,
      pwdName: formData.pwdName,
      motherName: formData.motherName,
      motherDOB: formData.motherDOB,
      motherBeneficiary: formData.motherBeneficiary,
      fatherName: formData.fatherName,
      fatherDOB: formData.fatherDOB,
      fatherBeneficiary: formData.fatherBeneficiary,
      additionalInfo: formData.additionalInfo,
      children: childrenDetails
    });

    await submission.save();
    res.status(201).json({ message: 'Form submitted successfully', id: submission._id });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

// Get all submissions for admin page
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submissionDate: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Export all submissions to Excel
app.get('/api/export-excel', async (req, res) => {
  try {
    // Fetch all submissions
    const submissions = await Submission.find().sort({ submissionDate: -1 });
    
    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Welfare Committee';
    workbook.created = new Date();
    
    // Add a worksheet for submissions
    const worksheet = workbook.addWorksheet('Submissions');
    
    // Define columns
    worksheet.columns = [
      { header: 'ID', key: '_id', width: 10 },
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
      // Format some fields for better readability
      const formattedSubmission = {
        ...submission.toObject(),
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
      if (submission.numberOfChildren > 0 && submission.children) {
        for (const child of submission.children) {
          childrenWorksheet.addRow({
            submissionId: submission._id,
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
    
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    res.json(submission);
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
initializeDatabase().then(async () => {
  // In production (like Render.com), use regular HTTP
  if (process.env.NODE_ENV === 'production') {
    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check available at http://localhost:${PORT}/healthz`);
    });
  } else {
    // In development, use HTTPS with self-signed certificate
    try {
      // Import modules dynamically with better error handling for production compatibility
      let selfsigned;
      try {
        // Ensure we're using proper ES module dynamic import
        const selfsignedModule = await import('selfsigned');
        selfsigned = selfsignedModule.default;
      } catch (importError) {
        console.error('Failed to import selfsigned module:', importError.message);
        // Fall back to HTTP server
        app.listen(PORT, () => {
          console.log(`Fallback HTTP server running on port ${PORT} after selfsigned import failure`);
        });
        return; // Exit the outer function to prevent further HTTPS setup attempts
      }
      
      // Import https module dynamically
      const httpsModule = await import('https');
      const https = httpsModule.default;
      
      // Generate self-signed certificate if missing
      const sslDir = join(__dirname, 'ssl');
      if (!fs.existsSync(sslDir)) fs.mkdirSync(sslDir, { recursive: true });
      
      const sslOptions = {
        minVersion: 'TLSv1.2',
        maxVersion: 'TLSv1.3',
        ciphers: [
          'TLS_AES_256_GCM_SHA384',
          'TLS_CHACHA20_POLY1305_SHA256',
          'TLS_AES_128_GCM_SHA256',
          'ECDHE-ECDSA-AES128-GCM-SHA256',
          'ECDHE-RSA-AES128-GCM-SHA256'
        ].join(':'),
        honorCipherOrder: true
      };
      
      // Generate certificates if missing
      const certPath = join(sslDir, 'selfsigned.crt');
      const keyPath = join(sslDir, 'selfsigned.key');
      if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
        const attrs = [{ name: 'commonName', value: 'localhost' }];
        // Ensure we're using the ES module correctly
        const pems = selfsigned.generate(attrs, {
          keySize: 4096,
          algorithm: 'sha256',
          days: 365,
          extensions: [
            { name: 'basicConstraints', cA: true },
            { name: 'keyUsage', keyCertSign: true, digitalSignature: true, nonRepudiation: true, keyEncipherment: true, dataEncipherment: true },
            { name: 'subjectAltName', altNames: [
              { type: 2, value: 'localhost' },
              { type: 7, ip: '127.0.0.1' }
            ]}
          ]
        });
        
        fs.writeFileSync(certPath, pems.cert);
        fs.writeFileSync(keyPath, pems.private);
      }
      
      sslOptions.cert = fs.readFileSync(certPath);
      sslOptions.key = fs.readFileSync(keyPath);
      
      // Only load certs if paths are provided
      if (process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) {
        sslOptions.key = fs.readFileSync(process.env.SSL_KEY_PATH);
        sslOptions.cert = fs.readFileSync(process.env.SSL_CERT_PATH);
      }
      
      const server = https.createServer(sslOptions, app);
      server.listen(PORT, () => {
        console.log(`Secure server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Error setting up HTTPS server:', error);
      // Fallback to HTTP if HTTPS setup fails
      app.listen(PORT, () => {
        console.log(`Fallback HTTP server running on port ${PORT}`);
      });
    }
  }
}).catch(err => {
  console.error('Failed to initialize database:', err);
});