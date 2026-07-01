const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Grudge = require('./models/Grudge'); 

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb+srv://pozpx:pozpx999@cluster0.c0q1vy7.mongodb.net/grudgelist?appName=Cluster0';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB เรียบร้อย!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.get('/api/grudges', async (req, res) => {
  const userId = req.headers.userid;
  const grudges = await Grudge.find(userId ? { userId: userId } : {}).sort({ createdAt: -1 });
  res.json(grudges);
});

app.post('/api/grudges', async (req, res) => {
  const userId = req.headers.userid;
  const newGrudge = new Grudge({ 
    text: req.body.text,
    userId: userId || 'anonymous'
  });
  await newGrudge.save();
  res.json(newGrudge);
});

app.put('/api/grudges/:id', async (req, res) => {
  const grudge = await Grudge.findById(req.params.id);
  grudge.isResolved = !grudge.isResolved;
  await grudge.save();
  res.json(grudge);
});

app.delete('/api/grudges/:id', async (req, res) => {
  await Grudge.findByIdAndDelete(req.params.id);
  res.json({ message: 'ลบข้อมูลสำเร็จ' });
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));