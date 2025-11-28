import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import ProfessionalList from './components/ProfessionalList';
import BookingPage from './components/BookingPage';
import BookingHistory from './components/BookingHistory';
import ProblemReport from './components/ProblemReport';
import ChatBox from './components/ChatBox';
import BookService from './components/BookService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in (simulate with localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setSelectedProfessional(null);
    setChatOpen(false);
  };

  const handleBookProfessional = (professional) => {
    setSelectedProfessional(professional);
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <SignUp onLogin={handleLogin} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/" 
              element={user ? <Home /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/book-service" 
              element={user ? <BookService user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/professionals" 
              element={user ? (
                <ProfessionalList 
                  onBookProfessional={handleBookProfessional}
                  onOpenChat={() => setChatOpen(true)}
                />
              ) : <Navigate to="/login" />} 
            />
            <Route 
              path="/booking" 
              element={user && selectedProfessional ? (
                <BookingPage 
                  professional={selectedProfessional}
                  onBookingComplete={() => setSelectedProfessional(null)}
                />
              ) : <Navigate to="/professionals" />} 
            />
            <Route 
              path="/bookings" 
              element={user ? <BookingHistory /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/report-problem" 
              element={user ? <ProblemReport /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        
        {user && chatOpen && (
          <ChatBox 
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            selectedProfessional={selectedProfessional}
          />
        )}
      </div>
    </Router>
  );
}

export default App;