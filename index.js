
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const app = express();
const multer = require('multer');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3001;
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in the .env file');
  process.exit(1);
}

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Counter schema and model
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sequenceValue: { type: Number, required: true }
});

const Counter = mongoose.model('Counter', counterSchema);

// Define Student schema and model
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  collegeName: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  phone: { type: String, required: true, unique: true},
  pursuing: { type: String, required: true },
  studentType: { type: String, required: true },
  poster: { type: String},
  upiTransactionId: { type: String, required: true, unique: true },
  uid: { type: String, required: true, unique: true }
});

const Student = mongoose.model('Student', studentSchema);

// Define Faculty schema and model
const facultySchema = new mongoose.Schema({
  facultyType: { type: String, required: true },
  banquet: { type: String, required: true },
  yourname: { type: String, required: true },
  speciality: { type: String, required: true },
  emailaddress: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  ksdc: { type: String, required: true, unique: true },
  upiTransactionId: { type: String, required: true, unique: true },
  uid: { type: String, required: true, unique: true }
});

const Faculty = mongoose.model('Faculty', facultySchema);



// Function to get next sequence value
async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { name: sequenceName },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequenceValue;
}



// Route to handle form submission for student registration
app.post('/studentregister', async (req, res) => {
  console.log(req.body);
  const { name, collegeName, email, phone, pursuing, studentType, poster, upiTransactionId } = req.body;

  try {
    const nextUid = await getNextSequenceValue('studentUid');
    const formattedUid = nextUid.toString().padStart(4, '0'); // Format UID as 4-digit number

    const newStudent = new Student({
      name,
      collegeName,
      email,
      phone,
      pursuing,
      studentType,
      upiTransactionId,
      poster,
      uid: formattedUid
    });

    await newStudent.save();

    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: 'Registration Confirmation',
      text: `
        We are pleased to confirm your registration for the IDA Dentist Convention-2024, 
        which will be hosted by VS Dental College on July 20th,2024 at Kuvempu Kalakshetra.
        
        Your participation in this convention will contribute significantly to the exchange of knowledge and the advancement of the field. 
        We are confident that the sessions and discussions lined up will provide valuable insights and networking opportunities.
        
        Your unique ID for the conference is ${formattedUid}. Please keep this ID handy for any future reference or communication related to the event.
        
        Should you require any further assistance or have any inquiries, please do not hesitate to contact us. 
        You can reach out to Dr. Jahnavi M.S at 9448112800, Dr. Praveen Jain at 8904726546, or Dr. Dishanth C at 9113999625. 

      
        We are here to ensure that your experience at the conference is seamless and rewarding.
        
        We eagerly anticipate your presence and active participation at the Dentist Convention - 2024.
      `
    };

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    // Registration successful, send response with success alert
    res.send(`
      <script>
        alert("Student registration successful! Please check your email for confirmation.");
        window.location.href = '/';
      </script>
    `);
  } catch (error) {
    console.error('Error processing registration:', error);
    if (error.code === 11000 && error.keyPattern.upiTransactionId) {
      res.send(`
        <script>
          alert("Transaction ID already used for registration. For further details, Contact 91139 99625.");
          window.location.href = '/';
        </script>
      `);
      } 
      else if (error.code === 11000 && error.keyPattern.emailaddress){
      res.send(`
        <script>
          alert("This Email Address has already been used for registration. Please check your email for confirmation. For further details, Contact 91139 99625.");
          window.location.href = '/';
        </script>
      `);

    }
    else if (error.code === 11000 && error.keyPattern.phone){
      res.send(`
        <script>
          alert("This Phone Number has already been used for registration. For further details, Contact 91139 99625.");
          window.location.href = '/';
        </script>
      `);

    }else {
      res.status(500).send('Error processing registration');
    }
  }
});



// Route to handle form submission for faculty registration
app.post('/facultyregister',  async (req, res) => {
  //console.log('hello')
  console.log(req.body);
  const { facultyType, banquet, yourname, speciality, emailaddress, phone, ksdc, upiTransactionId } = req.body;
  

  try {
    const nextUid = await getNextSequenceValue('facultyUid');
    const formattedUid = (1000 + nextUid).toString(); //Starts with 1

    const newFaculty = new Faculty({
      facultyType,
      banquet,
      yourname,
      speciality,
      emailaddress,
      phone,
      ksdc,
      upiTransactionId,
      uid: formattedUid
    });

    await newFaculty.save();

    const mailOptions = {
      from: process.env.USER,
      to: emailaddress,
      subject: 'Registration Confirmation',
      text:`We are pleased to confirm your registration for the IDA Dentist Convention-2024, 
      which will be hosted by VS Dental College on July 20th,2024 at Kuvempu Kalakshetra.
      
      Your participation in this convention will contribute significantly to the exchange of knowledge and the advancement of dental science. 
      We are confident that the sessions and discussions lined up will provide valuable insights and networking opportunities.
      
      Your unique ID for the convention is ${formattedUid}. Please keep this ID handy for any future reference or communication related to the event.
      
      Should you require any further assistance or have any inquiries, please do not hesitate to contact us. 
      You can reach out to Dr. Jahnavi M.S at 9448112800.
      We are here to ensure that your experience at the convention is seamless and rewarding.
      
      We eagerly anticipate your presence and active participation at the Dentist Convention 2024.
    `
    };

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    // Registration successful, send response with success alert
    res.send(`
      <script>
        alert("Faculty registration successful! Please check your email for confirmation.");
        window.location.href = '/';
      </script>
    `);
  } catch (error) {
    console.error('Error processing registration:', error);
    if (error.code === 11000 && error.keyPattern.upiTransactionId) {
      res.send(`
        <script>
          alert("Transaction ID already used for registration. For further details, Contact 91139 99625.");
          window.location.href = '/';
        </script>
      `);
      } 
      else if (error.code === 11000 && error.keyPattern.emailaddress){
      res.send(`
        <script>
          alert("This Email Address has already been used for registration. Please check your email for confirmation. For further details, Contact 91139 99625.");
          window.location.href = '/';
        </script>
      `);

    }
    else if (error.code === 11000 && error.keyPattern.phone){
      res.send(`
        <script>
          alert("This Phone Number has already been used for registration. For further details, Contact 91139 99625.");
          window.location.href = '/';
        </script>
      `);

    }
    else if (error.code === 11000 && error.keyPattern.ksdc){
      res.send(`
        <script>
          alert("A registration has already been made with this KSDC Number. \nFor further details, Contact 91139 99625.");
          window.location.href = '/';
        </script>
      `);

    }
    else {
      res.status(500).send('Error processing registration. For further details, Contact 91139 99625.');
    }
  }
});

app.get("/studentregister", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'studentreg0.html'));
});
app.get("/studentregisterdetails", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'studentreg.html'));
});
app.get("/studentregisterpay", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'studentreg2.html'));
});

app.get("/facultyregister", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'facultyreg0.html'));
});
app.get("/facultyregisterdetails", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'facultyreg.html'));
});
app.get("/facultyregisterpay", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'facultyreg2.html'));
});

// Serve the form HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
