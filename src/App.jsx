import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Litepaper from './pages/Litepaper.jsx';

function App() {
  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 md:pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/litepaper" element={<Litepaper />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
