const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const User = require('../models/user.js');
const nodemailer = require('nodemailer');

// Apply for job
router.post('/', async (req, res) => {
  const { jobId, studentEmail } = req.body;

  try {
    console.log("📥 Application request received:", { jobId, studentEmail });

    // 1. Find student by email
    const student = await User.findOne({ email: studentEmail });
    if (!student) {
      return res.status(404).json({ error: 'Your profile was not found.' });
    }

    // 2. Check if resume exists - UPDATED: Check both resume data and resumeUrl
    if ((!student.resume || !student.resume.data) && !student.resumeUrl) {
      return res.status(400).json({ error: 'Please upload a resume to your profile before applying.' });
    }

    // 3. Check if already applied
    const existingApplication = await Application.findOne({ 
      job: jobId, 
      student: student._id 
    });
    if (existingApplication) {
      return res.status(409).json({ error: 'You have already applied for this job.' });
    }

    // 4. Create application - Use resume URL based on what's available
    const resumeUrl = student.resumeUrl || `/api/resume?email=${studentEmail}`;
    
    const newApplication = new Application({
      job: jobId,
      student: student._id,
      resumeUrl: resumeUrl,
    });

    await newApplication.save();
    
    // 5. Notify admin
    console.log(`🎯 ADMIN NOTIFICATION: New application from ${student.name} for job ${jobId}`);
    
    res.status(201).json({ 
      message: 'Application submitted successfully!',
      studentName: student.name 
    });

  } catch (err) {
    console.error('Application error:', err.message);
    res.status(500).json({ error: 'Server Error: ' + err.message });
  }
});

// Get applications by student
router.get('/student', async (req, res) => {
  try {
    const studentEmail = req.headers["user-email"];
    if (!studentEmail) return res.status(400).json({ error: 'Student email required' });

    const student = await User.findOne({ email: studentEmail });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const applications = await Application.find({ student: student._id })
      .populate('job')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error('Fetch applications error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get applications by job ID (for admin)
router.get('/job/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const applications = await Application.find({ job: jobId })
      .populate({
        path: 'student',
        select: 'name email usn branch cgpa phone' // Explicitly select all fields
      })
      .populate('job', 'title company location ctc')
      .sort({ appliedAt: -1 });

    console.log("📋 Applications fetched:", applications.length);
    console.log("👤 First applicant data:", applications[0]?.student);
    
    res.json(applications);
  } catch (err) {
    console.error('Fetch applications by job error:', err);
    res.status(500).json({ error: 'Server error fetching applicants' });
  }
});

// Email applications to company
router.post('/job/:jobId/send-to-company', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { companyEmail, customMessage } = req.body;

    console.log("📧 Sending applications to company:", { jobId, companyEmail });

    // Get applications with student and job details
    const applications = await Application.find({ job: jobId })
      .populate('student', 'name email usn branch cgpa phone')
      .populate('job', 'title company location ctc');

    if (applications.length === 0) {
      return res.status(404).json({ error: 'No applications found for this job' });
    }

    const job = applications[0].job;

    // Create professional email content
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #f4f4f4; padding: 20px; border-radius: 5px; }
        .applicant { background: #f9f9f9; margin: 10px 0; padding: 15px; border-left: 4px solid #007cba; }
        .resume-link { color: #007cba; text-decoration: none; }
    </style>
</head>
<body>
    <div class="header">
        <h2>📋 Job Applications Summary</h2>
        <p><strong>Position:</strong> ${job.title}</p>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Location:</strong> ${job.location || 'Not specified'}</p>
        <p><strong>CTC:</strong> ${job.ctc}</p>
        <p><strong>Total Applicants:</strong> ${applications.length}</p>
    </div>

    <h3>Applicant Details:</h3>
    ${applications.map((app, index) => `
    <div class="applicant">
        <h4>${index + 1}. ${app.student.name}</h4>
        <p><strong>Email:</strong> ${app.student.email}</p>
        <p><strong>USN:</strong> ${app.student.usn || 'N/A'}</p>
        <p><strong>Branch:</strong> ${app.student.branch || 'N/A'}</p>
        <p><strong>CGPA:</strong> ${app.student.cgpa || 'N/A'}</p>
        <p><strong>Phone:</strong> ${app.student.phone || 'N/A'}</p>
        <p><strong>Applied:</strong> ${new Date(app.appliedAt).toLocaleDateString()}</p>
        <p><strong>Resume:</strong> <a href="http://localhost:5000/api/resume/download/${app.student.email}" class="resume-link">Download Resume</a></p>
    </div>
    `).join('')}

    ${customMessage ? `<div style="background: #e7f3ff; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <strong>Additional Message from Placement Cell:</strong><br>${customMessage}
    </div>` : ''}

    <div style="margin-top: 30px; padding: 15px; background: #f4f4f4; border-radius: 5px;">
        <p><strong>Best regards,</strong><br>
        College Placement Cell<br>
        [Jyothy Institute Of Technology]<br>
        [Contact: placement@college.edu | Phone:+91 1234567891 ]</p>
    </div>
</body>
</html>
    `;

    // Create transporter (using Gmail - you need to configure this)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sshreepadmavathi@gmail.com', // Change this to your college email
        pass: 'doff brjg auyz ecep' // Use App Password, not regular password
      }
    });

    // Email options
    const mailOptions = {
      from: '"College Placement Cell" <sshreepadmavathi@gmail.com>',
      to: companyEmail,
      subject: `Applications for ${job.title} - ${applications.length} Candidates`,
      html: emailHTML
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);

    res.json({ 
      success: true,
      message: `📧 Applications sent successfully to ${companyEmail}`,
      applicantsCount: applications.length,
      messageId: info.messageId
    });

  } catch (err) {
    console.error('Email sending error:', err);
    res.status(500).json({ error: 'Failed to send email: ' + err.message });
  }
});

module.exports = router;
