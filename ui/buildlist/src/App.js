import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Buildlist from './pages/buildlist';
import Sku from './pages/sku';

function App() {
  return (
   <>
    <Routes>
      <Route path="/" exact element={<Buildlist/>} /> 
      <Route path="/sku" element={<Sku/>} />
      
      {/* 404 - Not Found */}
      <Route component={() => <div>404 Not Found</div>} />
    </Routes>
  </>
  );
};

export default App;
