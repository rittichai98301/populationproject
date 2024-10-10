const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// เชื่อมต่อ MongoDB
mongoose.connect('mongodb://localhost:27017/populationDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// สร้าง Schema สำหรับประชากร
const populationSchema = new mongoose.Schema({
    Year: Number,
    'Country name': String,
    Population: Number
    // เพิ่มฟิลด์อื่น ๆ ตามที่คุณต้องการ
});

// สร้างโมเดล
const Population = mongoose.model('Population', populationSchema, 'populationDB');

// สร้าง Express app
const app = express();
app.use(cors()); // เพื่อให้ Frontend สามารถเข้าถึง API ได้

// API ที่ดึงข้อมูลประชากรตามปี
app.get('/api/population/:year', async (req, res) => {
  const year = parseInt(req.params.year); // แปลงปีที่รับมาเป็นตัวเลข
  try {
    // หาและเรียงข้อมูลตามจำนวนประชากรจากมากไปน้อย
    const data = await Population.find({ Year: year }).sort({ Population: -1 }); // ค้นหาโดยปีและเรียงตามจำนวนประชากร
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch population data' });
  }
});

// เริ่มเซิร์ฟเวอร์
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
