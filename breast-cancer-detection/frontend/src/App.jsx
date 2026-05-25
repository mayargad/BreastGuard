import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import About from './pages/About';
import SelfExam from './pages/SelfExam';
import LabResults from './pages/LabResults';
import './index.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/about"      element={<About />} />
          <Route path="/self-exam"  element={<SelfExam />} />
          <Route path="/lab"        element={<LabResults />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
