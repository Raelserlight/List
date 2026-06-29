
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Grudge = require('./models/Grudge'); 

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/grudgelist')
  .then(() => console.log('✅ Connected to MongoDB เรียบร้อย!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


app.get('/api/grudges', async (req, res) => {
  const grudges = await Grudge.find().sort({ createdAt: -1 });
  res.json(grudges);
});


app.post('/api/grudges', async (req, res) => {
  const newGrudge = new Grudge({ text: req.body.text });
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