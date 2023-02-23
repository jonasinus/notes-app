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
  active: boolean;
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
    title: 'string',
    id: 0,
    collapsed: true,
    filePath: null,
    mode: 'fileview',
    active: true,
  });
  const [fileSearchHidden, setFileSearchHidden] = useState(true);
  const [menuState, setMenuState] = useState<{
    before: menuStates;
    now: menuStates;
  }>({ before: menuStates.COLLAPSED, now: menuStates.FILES });

  useEffect(() => {
    createTab();
  }, []);

  useEffect(() => {
    const { t, changed } = correctTabActive(tabs, currentTab);

    if (changed) setTabs(t);
    if (tabs.length <= 0) createTab();
  }, [tabs]);

  function correctTabActive(tabs: tab[], tab: tab) {
    let changed = false;
    let t: tab[] = [];
    tabs.forEach((tab) => {
      if (tab.id === currentTab.id) {
        if (tab.active !== true) {
          changed = true;
          tab.active = true;
        }
      } else {
        if (tab.active === true) {
          changed = true;
          tab.active = false;
        }
      }
      t.push(tab);
    });
    return { t: t, changed: changed };
  }

  function createTab(tab?: tab) {
    if (tab === undefined) {
      tab = {
        title: 'new tab',
        id: 0,
        active: true,
        mode: 'fileview',
        collapsed: false,
        filePath: null,
      };
    }
    tab.id = getUnusedTabId();
    tab.title += tab.id;
    console.log('created a new tab:', tab.id);
    setTabs([...tabs, tab]);
    setCurrentTab(tab);
  }

  function setActiveTab(id: number) {
    let aT: tab = currentTab;
    let t: tab[] = [];
    for (let i = 0; i < tabs.length; i++) {
      let cTab = tabs[i];
      cTab.active = cTab.id === id;
      if (cTab.id === id) {
        aT = cTab;
      }
      t.push(cTab);
    }
    setCurrentTab(aT);
    setTabs(t);
  }

  function removeTab(id: number) {
    let t: tab[] = [];
    let rmTab: tab | undefined = undefined;
    for (let i = 0; i < tabs.length; i++) {
      let cTab = tabs[i];
      if (cTab.id === id) {
        rmTab = cTab;
      } else {
        t.push(cTab);
      }
    }
    setTabs(t);
    if (rmTab !== undefined) console.log('removed a tab: ', rmTab.id);
    else console.error(`ERROR: unable to remove tab with id: ${id}`);
  }

  function getUnusedTabId() {
    let id = 0;
    let i = tabs.findIndex((e) => e.id === id);
    while (i > -1) {
      id = Math.floor(Math.random() * (1 + tabs.length));
      i = tabs.findIndex((e) => e.id === id);
    }
    return id;
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
      <Titlebar
        tabs={tabs}
        setTabs={setTabs}
        openTab={setActiveTab}
        addTab={createTab}
        removeTab={removeTab}
        currentTab={currentTab}
        menuState={menuState}
        setMenuState={setMenuState}
      />
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
