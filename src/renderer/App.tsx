import './App.css';
import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { Titlebar } from './components/Titlebar';
import { Nav } from './components/Nav';
import { TabManager } from './components/TabManager';

export type tab = {
  title: string;
  id: number;
  collapsed: boolean;
  filePath: string | null;
  mode: tabMode;
  open: boolean;
};

export enum menuStates {
  'FILES',
  'SEARCH',
  'FAVORITES',
  'LISTS',
  'COLLAPSED',
}

export type tabMode = 'fileview' | 'graphview' | 'daily' | 'calendar';

export function App() {
  const [navExpanded, setNavExpanded] = useState(true);
  const [tabs, setTabs] = useState<tab[]>([]);
  const [currentTab, setCurrentTab] = useState<tab>({
    title: 'open a file',
    collapsed: false,
    filePath: '',
    id: 0,
    mode: 'fileview',
    open: true,
  });
  const [fileSearchHidden, setFileSearchHidden] = useState(true);
  const [menuState, setMenuState] = useState<menuStates>(menuStates.FILES);

  function openTab(id: number) {
    let t: tab[] = [];
    tabs.forEach((e) => {
      e.open = false;
      if (e.id === id) {
        e.open = true;
        setCurrentTab(e);
      }
      t.push(e);
    });
    setTabs(t);
  }

  useEffect(() => {
    setTabs([
      {
        title: 'open a file',
        collapsed: false,
        filePath: null,
        mode: 'fileview',
        id: 0,
        open: true,
      },
      {
        title: 'open a file',
        collapsed: false,
        filePath: null,
        mode: 'fileview',
        id: 1,
        open: false,
      },
      {
        title: 'open a file',
        collapsed: false,
        filePath: null,
        mode: 'fileview',
        id: 2,
        open: false,
      },
    ]);
  }, []);

  useEffect(() => {
    console.log('open tabs', tabs);
  }, [tabs]);

  function getUnusedTabId() {
    let id = 0;
    let i = tabs.findIndex((e) => e.id === id);
    while (i > -1) {
      id = Math.floor(Math.random() * (1 + tabs.length));
      i = tabs.findIndex((e) => e.id === id);
    }
    return id;
  }

  function addTab(tab?: tab) {
    if (tab === undefined) {
      tab = {
        title: 'open a file',
        collapsed: false,
        filePath: '',
        id: 0,
        mode: 'fileview',
        open: true,
      };
    }
    tab.id = getUnusedTabId();
    setTabs([...tabs, tab]);
    openTab(tab.id);
  }

  function removeTab(id: number) {
    let t: tab[] = [];
    let rm: tab[] = [];
    tabs.forEach((e) => {
      if (e.id !== id) {
        t.push(e);
      } else rm.push(e);
    });
    setTabs(t);
    console.log('removed tabs', rm);
  }

  return (
    <>
      <div
        className={['fileSearch', fileSearchHidden ? 'hidden' : ''].join(' ')}
      >
        <input type="text" placeholder="find or create a file" />
        <div className="searchResults"></div>
        <div className="tooltips"></div>
      </div>
      <div className="titlebar">
        <Titlebar
          tabs={tabs}
          setTabs={setTabs}
          openTab={openTab}
          addTab={addTab}
          removeTab={removeTab}
          currentTab={currentTab}
          menuState={menuState}
          setMenuState={setMenuState}
        />
      </div>
      <div className="main-content-container">
        <Nav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          setFileSearchHidden={setFileSearchHidden}
          fileSearchHidden={fileSearchHidden}
          menuState={menuState}
          setMenuState={setMenuState}
        />
        <TabManager tabs={tabs} setTabs={setTabs} currentTab={currentTab} />
      </div>
    </>
  );
}

window.electron.ipcRenderer.on('load-vault', (arg) => {
  console.log('vault', arg);
});

window.electron.ipcRenderer.sendMessage('load-vault', []);
