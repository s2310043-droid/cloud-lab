require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Kết nối MongoDB Atlas (Ép buộc dbName tại tham số kết nối)
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('LỖI: Chưa cấu hình MONGODB_URI trong file .env');
} else {
  mongoose.connect(MONGODB_URI, {
    dbName: 'mern-demo' // Ép Mongoose tạo/ghi dữ liệu chính xác vào database này
  })
    .then(() => console.log(' Connect MongoDB Atlas successfully -> Database: mern-demo'))
    .catch((err) => console.error(' Connect MongoDB Atlas failed:', err.message));
}

// 2. Định nghĩa Schema & Model Student (Câu 35)
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

// 3. Các REST API Routes (Câu 22, 36 - 39)

// API Hello Test
app.get('/api/hello', (req, res) => {
  res.json({ message: "Backend dang hoat dong tot tren Linux Server!" });
});

// GET: Lấy danh sách toàn bộ sinh viên
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi lấy danh sách sinh viên: ' + err.message });
  }
});

// POST: Thêm mới một sinh viên
app.post('/api/students', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;
    if (!studentId || !name || !email) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ studentId, name và email!' });
    }
    const newStudent = await Student.create({ studentId, name, email });
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: 'Lỗi thêm sinh viên (có thể trùng studentId): ' + err.message });
  }
});

// PUT: Cập nhật thông tin sinh viên theo ID
app.put('/api/students/:id', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { studentId, name, email },
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Không tìm thấy sinh viên để cập nhật' });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: 'Lỗi cập nhật sinh viên: ' + err.message });
  }
});

// DELETE: Xóa sinh viên theo ID
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Không tìm thấy sinh viên để xóa' });
    }
    res.json({ message: 'Xóa sinh viên thành công!' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi xóa sinh viên: ' + err.message });
  }
});

// 4. Khởi chạy Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(` Server dang chay tren port ${PORT}`);
});