import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'https://list-api-z07h.onrender.com/api/grudges';

let userId = localStorage.getItem('my_secret_id');
if (!userId) {
  userId = crypto.randomUUID(); 
  localStorage.setItem('my_secret_id', userId);
}

const axiosConfig = { headers: { userid: userId } };

function App() {
  const [grudges, setGrudges] = useState([]);
  const [text, setText] = useState('');

  const fetchGrudges = async () => {
    try {
      const res = await axios.get(API_URL, axiosConfig);
      setGrudges(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGrudges();
  }, []);

const addGrudge = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // 1. สร้างของปลอมขึ้นมาโชว์หน้าเว็บทันทีก่อน
    const tempId = crypto.randomUUID(); 
    const optimisticGrudge = { _id: tempId, text, isResolved: false };
    
    setGrudges([optimisticGrudge, ...grudges]); // อัปเดต UI ทันที
    setText(''); // เคลียร์ช่องพิมพ์ทันที

    // 2. แอบส่งไปให้หลังบ้านจัดการเงียบๆ
    try {
      const res = await axios.post(API_URL, { optimisticGrudge: text, text }, axiosConfig);
      // พอหลังบ้านเซฟเสร็จ ค่อยเอา ID จริงมาเปลี่ยนทับของปลอม
      setGrudges(prev => prev.map(g => g._id === tempId ? res.data : g));
    } catch (err) {
      // ถ้าเน็ตหลุด เซฟไม่ติด ก็ลบของปลอมทิ้ง
      setGrudges(prev => prev.filter(g => g._id !== tempId)); 
      console.error(err);
    }
  };

  const toggleResolved = async (id) => {
    // อัปเดตหน้าเว็บทันที ไม่ต้องรอ
    setGrudges(grudges.map(g => (g._id === id ? { ...g, isResolved: !g.isResolved } : g)));
    try {
      await axios.put(`${API_URL}/${id}`, {}, axiosConfig);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteGrudge = async (id) => {
    // อัปเดตหน้าเว็บทันที ลบหายวับไปเลย
    setGrudges(grudges.filter(g => g._id !== id));
    try {
      await axios.delete(`${API_URL}/${id}`, axiosConfig);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    // จัดให้อยู่ตรงกลางจอ พื้นหลังดำ
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-4 font-sans selection:bg-white/30">
      
      {/* แสงเรืองๆ พื้นหลังตรงกลาง (Glow Effect) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* กรอบเนื้อหาหลัก */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg flex flex-col max-h-[85vh]"
      >
        <h1 className="text-3xl font-medium text-white/90 mb-8 text-center tracking-wide">
          My List
        </h1>

        {/* ฟอร์มกรอกข้อมูลสไตล์แอป iOS */}
        <form onSubmit={addGrudge} className="mb-6 relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="เพิ่มรายการใหม่..."
            className="w-full bg-white/10 backdrop-blur-xl border border-white/10 text-white placeholder-white/40 rounded-2xl py-4 pl-5 pr-24 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all shadow-[0_8px_32px_rgba(255,255,255,0.02)] text-lg"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-all backdrop-blur-md active:scale-95"
          >
            บันทึก
          </button>
        </form>

        {/* พื้นที่แสดงรายการแบบเลื่อนได้ (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar pb-4">
          <AnimatePresence mode="popLayout">
            {grudges.map((grudge) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                transition={{ duration: 0.25 }}
                key={grudge._id}
                className={`group relative overflow-hidden backdrop-blur-xl border rounded-2xl p-4 flex items-center justify-between transition-all duration-300 ${
                  grudge.isResolved
                    ? 'bg-white/5 border-white/5'
                    : 'bg-white/10 border-white/10 shadow-[0_4px_24px_rgba(255,255,255,0.02)]'
                }`}
              >
                {/* วงกลมติ๊กถูก และ ข้อความ */}
                <div 
                  className="flex items-center gap-4 flex-1 cursor-pointer"
                  onClick={() => toggleResolved(grudge._id)}
                >
                  <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${
                    grudge.isResolved ? 'border-white/30 bg-white/20' : 'border-white/40'
                  }`}>
                    {grudge.isResolved && <span className="w-2.5 h-2.5 bg-white rounded-full shadow-sm"></span>}
                  </div>
                  
                  <span
                    className={`text-base select-none transition-all duration-300 ${
                      grudge.isResolved ? 'line-through text-white/30' : 'text-white/80'
                    }`}
                  >
                    {grudge.text}
                  </span>
                </div>

                {/* ปุ่มลบทิ้งเป็นไอคอนถังขยะแบบคลีนๆ */}
                <button
                  onClick={() => deleteGrudge(grudge._id)}
                  className="opacity-100 sm:opacity-0 group-hover:opacity-100 ml-4 p-2 text-white/30 hover:text-white/80 hover:bg-white/10 rounded-xl transition-all active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {grudges.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center text-white/20 pt-10"
            >
              ยังไม่มีรายการ...
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default App;