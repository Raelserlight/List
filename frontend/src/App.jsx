
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/grudges';

function App() {
  const [grudges, setGrudges] = useState([]);
  const [text, setText] = useState('');

  
  const fetchGrudges = async () => {
    const res = await axios.get(API_URL);
    setGrudges(res.data);
  };

  useEffect(() => {
    fetchGrudges();
  }, []);

  
  const addGrudge = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await axios.post(API_URL, { text });
    setGrudges([res.data, ...grudges]);
    setText('');
  };

  
  const toggleResolved = async (id) => {
    const res = await axios.put(`${API_URL}/${id}`);
    setGrudges(grudges.map(g => (g._id === id ? res.data : g)));
  };

  
  const deleteGrudge = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setGrudges(grudges.filter(g => g._id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center py-12 px-4 font-sans">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-red-600 mb-8 text-center tracking-wider drop-shadow-md">
          THE TO DO LIST
        </h1>

        {/* Input Form - Glassmorphism */}
        <form onSubmit={addGrudge} className="mb-8 flex gap-4 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="อยากลิสต์อะไรก็ลิสต์มา..."
            className="flex-1 bg-transparent border-b-2 border-red-800 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors p-2 text-lg"
          />
          <button
            type="submit"
            className="bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all border border-red-500/30"
          >
            บันทึก
          </button>
        </form>

        {/* List - Glassmorphism */}
        <div className="space-y-4">
          {grudges.map((grudge) => (
            <div
              key={grudge._id}
              className={`flex items-center justify-between p-5 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                grudge.isResolved
                  ? 'bg-neutral-900/40 border-neutral-800'
                  : 'bg-black/60 border-red-900/40 shadow-[0_4px_20px_rgba(220,38,38,0.05)]'
              }`}
            >
              <span
                className={`text-lg flex-1 cursor-pointer select-none transition-all ${
                  grudge.isResolved ? 'line-through text-neutral-600' : 'text-gray-100'
                }`}
                onClick={() => toggleResolved(grudge._id)}
              >
                {grudge.text}
              </span>

              <div className="flex gap-3">
                <button
                  onClick={() => toggleResolved(grudge._id)}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold border transition-colors ${
                    grudge.isResolved
                      ? 'border-neutral-700 text-neutral-500 hover:bg-neutral-800'
                      : 'border-green-800 text-green-500 hover:bg-green-900/30'
                  }`}
                >
                  {grudge.isResolved ? 'ย้อนกลับ' : 'เรียบร้อยเเล้ว'}
                </button>
                <button
                  onClick={() => deleteGrudge(grudge._id)}
                  className="px-3 py-1.5 rounded-md text-sm font-semibold bg-red-950 text-red-500 border border-red-900 hover:bg-red-900 hover:text-white transition-colors"
                >
                  ลบทิ้ง
                </button>
              </div>
            </div>
          ))}
          {grudges.length === 0 && (
            <p className="text-center text-gray-600 mt-10">ยังไม่มีรายการ...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;