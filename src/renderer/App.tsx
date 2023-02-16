import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { Titlebar } from './components/Titlebar';
import { Nav } from './components/Nav';
import { TabManager } from './components/TabManager';

export type tab = {
  title: string;
  position: number;
  collapsed: boolean;
  filePath: string | null;
  mode: tabMode;
};

export type tabMode = 'fileview' | 'graphview' | 'daily' | 'calendar';

export function App() {
  const [navExpanded, setNavExpanded] = useState(true);
  const [tabs, setTabs] = useState<tab[]>([]);

  useEffect(() => {
    setTabs([
      {
        title: 'open a file',
        collapsed: false,
        filePath: null,
        mode: 'fileview',
        position: 0,
      },
    ]);
  }, []);

  return (
    <>
      <div className="titlebar">
        <Titlebar tabs={tabs} setTabs={setTabs} />
      </div>
      <div className="main-content-container">
        <Nav />
        <TabManager tabs={tabs} setTabs={setTabs} />
      </div>
    </>
  );
}
