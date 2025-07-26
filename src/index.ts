import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import zod from 'zod'
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Brainly API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});