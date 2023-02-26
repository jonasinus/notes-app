import './App.css';
import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { Titlebar } from './components/Titlebar';
import { Nav } from './components/Nav';
import { TabManager } from './components/TabManager';
import { Widget } from './components/Widgets';
import { tab } from './components/Tab';

export enum menuStates {
  'FILES',
  'SEARCH',
  'FAVORITES',
  'LISTS',
  'COLLAPSED',
}

export interface Directory {
  createdAt: Number;
  editedAt: Number;
  contents: (File | Directory)[];
  contentSize: string;
  contentSizeBytes: number;
  name: string;
  isDir: true;
}

export interface File {
  createdAt: Number;
  editedAt: Number;
  contentSizeBytes: number;
  path: string;
  basename: string;
  name: string;
  contents: [];
  isDir: false;
}

export type widgets = 'help' | 'settings' | 'link' | 'search' | 'null';

export function App() {
  const [navExpanded, setNavExpanded] = useState(true);
  const [fileSearchHidden, setFileSearchHidden] = useState(true);
  const [menuState, setMenuState] = useState<{
    before: menuStates;
    now: menuStates;
  }>({ before: menuStates.COLLAPSED, now: menuStates.FILES });
  const [widget, setWidget] = useState<widgets>('null');

  const [fsData, setFsData] = useState<Directory>();

  useEffect(() => {
    createTab();
    window.electron.ipcRenderer.on('load-vault', (arg) => {
      console.log('vault', arg);
      setFsData(arg as Directory);
    });

    window.electron.ipcRenderer.sendMessage('load-vault', []);
  }, []);

  useEffect(() => {
    console.log(fsData);
  }, [fsData]);

  function handleWidget(to: widgets) {
    if (widget === to) {
      setWidget('null');
    } else {
      setWidget(to);
    }
  }

  return (
    <div id="cotnainer">
      <div className="titlebar">
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
      </div>
      <div className="main-content-container">
        <Nav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          setFileSearchHidden={setFileSearchHidden}
          fileSearchHidden={fileSearchHidden}
          menuState={menuState}
          setMenuState={setMenuState}
          widget={widget}
          setWidget={handleWidget}
          fsData={fsData}
          setFsData={setFsData}
        />
        <TabManager tabs={tabs} setTabs={setTabs} currentTab={currentTab} />
        <div className="widgets" data-widget-visible={widget.toString()}>
          <Widget
            title={'help'}
            moveable={'left-right'}
            content={<>hello</>}
            classname={['widget', 'help']}
            showTitle={false}
            visible={widget === 'help'}
            hide={handleWidget}
          />
          <Widget
            title={'settings'}
            moveable={'left-right'}
            content={<>hello</>}
            classname={['widget', 'settings']}
            showTitle={false}
            visible={widget === 'settings'}
            hide={handleWidget}
          />
          <Widget
            title={'link'}
            moveable={false}
            content={<>hello</>}
            classname={['widget', 'link']}
            showTitle={false}
            visible={widget === 'link'}
            hide={handleWidget}
          />
          <Widget
            title={'search / create'}
            moveable={'left-right'}
            content={<>hello</>}
            classname={['widget', 'search']}
            showTitle={false}
            visible={widget === 'search'}
            hide={handleWidget}
          />
        </div>
      </div>
    </div>
  );
}
