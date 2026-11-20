import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import XPNotification from './components/XPNotification';

// Pages
import Home from './pages/Home';
import Games from './pages/Games';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import GameWrapper from './pages/GameWrapper';

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#070712] text-slate-100 selection:bg-cyan-500 selection:text-black">
          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<Games />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/game/:id" element={<GameWrapper />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Toast / Level Up Celebrations */}
          <XPNotification />

          {/* Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </GameProvider>
  );
}
