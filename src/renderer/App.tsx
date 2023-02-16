import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { Titlebar } from './components/Titlebar';
import { Nav } from './components/Nav';
import { TabManager } from './components/TabManager';

export default function App() {
  const [navExpanded, setNavExpanded] = useState(true);
  return (
    <>
      <div className="titlebar-container">
        <Titlebar />
      </div>
      <div className="main-content-container">
        <Nav />
        <TabManager />
      </div>
    </>
  );
}
