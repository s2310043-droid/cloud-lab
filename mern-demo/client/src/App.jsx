import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Tự động nhận diện URL Backend trên Codespaces & Localhost
  const getApiBaseUrl = () => {
    const { hostname, protocol } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api/students';
    }
    // Đổi suffix port từ 5173 thành 5000 cho Codespaces
    const backendHost = hostname.replace('-5173', '-5000').replace('-3000', '-5000');
    return `${protocol}//${backendHost}/api/students`;
  };

  const API_URL = getApiBaseUrl();

  const fetchStudents = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Không thể kết nối đến Backend API!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Thêm sinh viên thất bại');

      setForm({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>QUẢN LÝ SINH VIÊN</h1>
      
      {errorMsg && (
        <div style={{ padding: '10px 15px', backgroundColor: '#ffebe9', color: '#cf222e', borderRadius: '6px', marginBottom: '15px', border: '1px solid #ff8182' }}>
          <strong>Lỗi: </strong>{errorMsg}
        </div>
      )}

      <div style={{ backgroundColor: '#f6f8fa', padding: '20px', borderRadius: '8px', border: '1px solid #d0d7de', marginBottom: '25px' }}>
        <h3>Thêm Sinh Viên Mới</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="MSSV"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              required
              style={{ flex: '1', padding: '8px' }}
            />
            <input
              type="text"
              placeholder="Họ và tên"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              style={{ flex: '2', padding: '8px' }}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={{ flex: '2', padding: '8px' }}
            />
          </div>
          <div>
            <button type="submit" style={{ backgroundColor: '#1f883d', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Thêm Sinh Viên
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2>Danh Sách Sinh Viên ({students.length})</h2>
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#24292f', color: '#ffffff', textAlign: 'left' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>MSSV</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Họ và Tên</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((sv) => (
                <tr key={sv._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>{sv.studentId}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{sv.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{sv.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;