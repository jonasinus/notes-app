import './App.css';
import { useState, useEffect, useRef } from 'react';
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
  path: string;
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
  const [bunker, setBunker] = useState<Directory | 'error' | undefined>(
    undefined
  );
  const tabManagerRef = useRef<any>(null);

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

  function createTab() {
    console.log('creating new tab.....');

    if (tabManagerRef.current != null) tabManagerRef.current.createTab();
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
        bunker={bunker}
        menuState={menuState}
        setMenuState={setMenuState}
        widgetHandler={handleWidget}
        tabManagerRef={tabManagerRef}
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
          content={
            <SearchWidgetContext createTab={createTab} bunker={bunker} />
          }
          classname={['widget', 'search']}
          showTitle={false}
          visible={widget === 'search'}
          hide={handleWidget}
        />
      </div>
    </div>
  );
}

function searchFiles(bunker: Directory, term: string) {
  let elements: File[] = [];
  bunker.contents.forEach((e, i) => {
    if (e.isDir) elements.push(...searchFiles(e, term));
    else {
      if (e.basename.includes(term)) elements.push(e);
    }
  });
  return elements;
}

function searchDir2(
  bunker: Directory,
  term: string,
  mode: 'file' | 'dir' | 'all'
) {
  let elements: (File | Directory)[] = [];

  bunker.contents.forEach((e, i) => {
    if (mode == 'file') {
      if (e.isDir) elements.push(...searchDir2(e, term, 'file'));
      else {
        const basenameParts = e.basename.split(' ');
        const termParts = term.split(' ');
        const matchingParts = basenameParts.filter((part) =>
          termParts.some((termPart) => part.includes(termPart))
        );
        if (matchingParts.length > 0) elements.push(e);
      }
    }
    if (mode == 'all') {
      if (e.isDir) {
        elements.push(...searchDir2(e, term, 'all'));
        const nameParts = e.name.split(' ');
        const termParts = term.split(' ');
        const matchingParts = nameParts.filter((part) =>
          termParts.some((termPart) => part.includes(termPart))
        );
        if (matchingParts.length > 0) elements.push(e);
      } else {
        const basenameParts = e.basename.split(' ');
        const termParts = term.split(' ');
        const matchingParts = basenameParts.filter((part) =>
          termParts.some((termPart) => part.includes(termPart))
        );
        if (matchingParts.length > 0) elements.push(e);
      }
    }
    if (mode == 'dir') {
      e.contents.forEach((j) => {
        if (j.isDir) elements.push(...searchDir2(j, term, 'dir'));
      });
      if (e.isDir) {
        const nameParts = e.name.split(' ');
        const termParts = term.split(' ');
        const matchingParts = nameParts.filter((part) =>
          termParts.some((termPart) => part.includes(termPart))
        );
        if (matchingParts.length > 0) elements.push(e);
      }
    }
  });
  return elements;
}

function SearchWidgetContext({
  bunker,
  createTab,
}: {
  bunker: Directory | 'error' | undefined;
  createTab: Function;
}) {
  if (bunker == 'error' || bunker == undefined)
    return <div>you have to open a bunker before you can access it</div>;

  let [input, setInput] = useState('');
  const [mode, setMode] = useState<'file' | 'dir' | 'all'>('all');
  const [searchResults, setSearchResults] = useState<(File | Directory)[]>([]);

  const highlightMatches = (inputValue: string, s: string) => {
    if (inputValue && s.includes(inputValue)) {
      const startIndex = s.indexOf(inputValue);
      const endIndex = startIndex + inputValue.length;
      const beforeMatch = s.slice(0, startIndex);
      const match = s.slice(startIndex, endIndex);
      const afterMatch = s.slice(endIndex);
      return (
        <>
          {beforeMatch}
          <span className="highlight">{match}</span>
          {afterMatch}
        </>
      );
    }
    return s;
  };

  return (
    <>
      <input
        type="text"
        value={' '}
        onInput={(e) => {
          setInput(e.currentTarget.value);
          setSearchResults(searchDir2(bunker, e.currentTarget.value, mode));
        }}
      />
      <div>
        <input type="button" value="file" onClick={(e) => setMode('file')} />
        <input type="button" value="dir" onClick={(e) => setMode('dir')} />
        <input type="button" value="all" onClick={(e) => setMode('all')} />
      </div>
      <ul className="search-results">
        {searchResults
          .sort((a, b) => {
            return a.isDir && !b.isDir ? 1 : !a.isDir && b.isDir ? -1 : 0;
          })
          .map((e, i) => {
            console.log(e, e.path);

            return (
              <li
                key={e.path}
                onClick={(e) => {
                  console.log(e);

                  createTab;
                }}
              >
                {highlightMatches(input, e.name)}
              </li>
            );
          })}
      </ul>
    </>
  );
}
