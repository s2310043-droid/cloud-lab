const mongoose = require('mongoose');

// Định nghĩa Mongoose Schema cho đối tượng Student
const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Mã số sinh viên là bắt buộc'],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Họ tên sinh viên là bắt buộc'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      trim: true,
      lowercase: true
    }
  },
  {
    // Tự động thêm 2 trường createdAt và updatedAt cho mỗi bản ghi
    timestamps: true
  }
);

// Tạo Model từ Schema và xuất ra ngoài (mặc định Mongoose sẽ lưu vào collection tên 'students')
module.exports = mongoose.model('Student', studentSchema);