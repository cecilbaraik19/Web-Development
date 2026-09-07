import dns from 'dns';

dns.setServers([
  '8.8.8.8',
  '1.1.1.1'
]);

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import Investigation from './models/Investigation.js';
import threatIntelRoutes from './routes/threatIntel.js';

dotenv.config();


const app = express();


// ============================================================
// CORS
// ============================================================

app.use(
  cors({
    origin: [
      'https://certi-mail-forensic.vercel.app',
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ],
    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'OPTIONS'
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ]
  })
);


app.use(express.json({ limit: '2mb' }));


// ============================================================
// ROOT
// ============================================================

app.get('/', (req, res) => {

  res.json({

    status: 'success',

    message:
      'CertiMail Forensic Backend is Live!',

    endpoints: {

      investigate:
        'POST /api/investigate',

      history:
        'GET /api/history',

      intel:
        'GET /api/intel'
    }
  });

});


// ============================================================
// MONGODB
// ============================================================

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/certimailforensic';


mongoose
  .connect(MONGODB_URI, {

    dbName: 'certimailforensic',

    family: 4,

    serverSelectionTimeoutMS: 10000

  })

  .then(() => {

    console.log(
      `Connected to MongoDB. Active Database: ${mongoose.connection.name}`
    );

  })

  .catch((error) => {

    console.error(
      'MongoDB connection error:',
      error.message
    );

  });


// ============================================================
// THREAT INTELLIGENCE
// ============================================================

app.use(
  '/api/intel',
  threatIntelRoutes
);


// ============================================================
// INVESTIGATE EMAIL
// ============================================================

app.post(
  '/api/investigate',
  async (req, res) => {

    try {

      console.log(
        '--> Incoming request received at /api/investigate'
      );


      const {
        emailContent
      } = req.body;


      // --------------------------------------------------------
      // Validate input
      // --------------------------------------------------------

      if (
        !emailContent ||
        typeof emailContent !== 'string'
      ) {

        return res.status(400).json({

          status: 'error',

          message:
            'emailContent is required'
        });

      }


      // --------------------------------------------------------
      // Python AI Service
      // --------------------------------------------------------

      const pythonBaseUrl =
        process.env.PYTHON_AI_URL ||
        'https://certimail-forensic-ai-service.onrender.com';


      console.log(
        '--> Sending email to Python AI service:',
        pythonBaseUrl
      );


      const aiResponse =
        await axios.post(

          `${pythonBaseUrl}/analyze`,

          {
            raw_text: emailContent
          },

          {
            timeout: 30000,

            headers: {
              'Content-Type':
                'application/json'
            }
          }

        );


      const data =
        aiResponse.data;


      console.log(
        '--> Python AI analysis completed'
      );


      // --------------------------------------------------------
      // Save investigation
      // --------------------------------------------------------

      let recordId =
        'demo-case-998877';


      try {

        const newRecord =
          new Investigation({

            rawEmail:
              emailContent,

            verdict:
              data.verdict,

            riskScore:
              data.risk_score,

            confidence:
              data.confidence,

            authentication:
              data.authentication,

            extractedIp:
              data.extracted_ip,

            estimatedGeo:
              data.estimated_geo,

            nlpIndicators:
              data.nlp_indicators

          });


        await newRecord.save();


        recordId =
          newRecord._id.toString();


        console.log(
          '--> Investigation saved:',
          recordId
        );

      }

      catch (dbError) {

        console.error(
          '--> MongoDB save failed:',
          dbError.message
        );

      }


      // --------------------------------------------------------
      // Return result
      // --------------------------------------------------------

      return res.json({

        status: 'success',

        report: data,

        caseId: recordId

      });

    }

    catch (error) {

      console.error(
        'Critical Endpoint Error:',
        error.message
      );


      if (error.response) {

        console.error(
          'Python response:',
          error.response.data
        );

      }


      return res.status(500).json({

        status: 'error',

        message:
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          'Failed to connect to Python analyzer service'

      });

    }

  }
);


// ============================================================
// HISTORY
// ============================================================

app.get(
  '/api/history',
  async (req, res) => {

    try {

      const history =
        await Investigation
          .find()
          .sort({
            createdAt: -1
          })
          .limit(10);


      return res.json(
        history
      );

    }

    catch (error) {

      console.error(
        'History error:',
        error.message
      );


      return res.status(500).json({

        status: 'error',

        message:
          'Failed to fetch history'

      });

    }

  }
);


// ============================================================
// PORT
// ============================================================

const PORT =
  process.env.PORT || 5000;


app.listen(
  PORT,
  () => {

    console.log(
      `Node backend running on port ${PORT}`
    );

    console.log(
      `Python AI URL: ${
        process.env.PYTHON_AI_URL ||
        'https://certimail-forensic-ai-service.onrender.com'
      }`
    );

  }
);