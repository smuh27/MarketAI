import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import SearchTickerPage from './components/pages/SearchTickerPage';
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
     <img src="/marketailogo.jpg" alt="" width="300" />
      <Router>
        <Routes>
          <Route exact path='/' element={<SignUpPage />} />
          <Route exact path='/search' element={<SearchTickerPage />} />
          <Route exact path='/dashboard' element={<DashBoardPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
