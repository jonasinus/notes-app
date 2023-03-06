import './App.css';
import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { Titlebar } from './components/Titlebar';
import { Nav } from './components/Nav';
import { TabManager } from './components/TabManager';
import { Widget } from './components/Widgets';
import { tab } from './components/Tab';
import AddFileIcon from '../icons/addFile.svg';
import AddFolderIcon from '../icons/addFolder.svg';
import ChangeOrder from '../icons/changeOrder.svg';
import { Menu } from './components/Menu';

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

  function handleWidget(to: widgets) {
    if (widget === to) {
      setWidget('null');
    } else {
      setWidget(to);
    }
  }

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
      />
      <TabManager menuState={menuState} setMenuState={setMenuState} />
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
  );
}

function restartApp() {}
