// gateway/src/index.ts
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';

config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${process.env.USERS_URL}${req.url}`,
      data: req.body,
      headers: {
        Authorization: req.headers.authorization,
        'Content-Type': 'application/json',
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in User Service:', error);
    res.status(500).json({ message: 'Error in User Service' });
  }
});

app.use('/api/posts', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${process.env.POSTS_URL}${req.url}`,
      data: req.body,
      headers: { Authorization: req.headers.authorization, 'Content-Type': 'application/json' },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in Post Service:', error);
    res.status(500).json({ message: 'Error in Post Service' });
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
