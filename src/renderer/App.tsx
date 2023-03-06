import './App.css';
import { useState, useEffect } from 'react';
import { Titlebar } from './components/Titlebar';
import { Nav } from './components/Nav';
import { TabManager } from './components/TabManager';
import { SettingsWidgetContent, Widget } from './components/Widgets';

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
  const [bunker, setBunker] = useState<Directory | undefined>(undefined);

  function handleWidget(to: widgets) {
    if (widget === to) {
      setWidget('null');
    } else {
      setWidget(to);
    }
  }

  function enterBunker() {
    window.electron.ipcRenderer.on('load-vault', (arg) => {
      console.log('bunker', arg as Directory);
      setBunker(arg as Directory);
    });
    window.electron.ipcRenderer.sendMessage('load-vault', []);
  }

  function exitBunker() {}

  useEffect(() => {
    enterBunker();
  }, []);

  return (
    <div id="cotnainer">
      <Titlebar menuState={menuState} setMenuState={setMenuState} />
      <Nav
        setFileSearchHidden={setFileSearchHidden}
        fileSearchHidden={fileSearchHidden}
        menuState={menuState}
        setMenuState={setMenuState}
        widget={widget}
        setWidget={handleWidget}
        bunker={bunker}
      />
      <TabManager
        menuState={menuState}
        setMenuState={setMenuState}
        widgetHandler={handleWidget}
      />
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
          content={<SettingsWidgetContent />}
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
  );
}
