import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Recommender from './components/Recommender';
import CleanVersion from './components/CleanVersion';
import FacialRecognition from './components/FacialRecognition';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recommender" element={<Recommender />} />
        <Route path="/clean-version" element={<CleanVersion />} />
        <Route path="/facial-recognition" element={<FacialRecognition />} />
      </Routes>
    </Router>
  );
}

export default App;
