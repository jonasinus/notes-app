import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { mainModule } from 'process';
import { ForceGraph } from './components/graph';
import { renderToString } from 'react-dom/server';
import { JSXToString, parse, stringToTSX } from './components/util/parse';

interface tabheader {
  title: string;
  open: boolean;
}

enum tabTypes {
  'GRAPH',
  'FILE',
}

export function App() {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(true);
  const [mode, setMode] = useState<'file' | 'graph'>('file');
  const [tabs, setTabs] = useState<tabheader[]>([
    { title: 'hello world', open: true },
  ]);
  const [menuMode, setMenuMode] = useState<'files' | 'search' | 'liked'>(
    'files'
  );

  return (
    <>
      <menu id="titleBar">
        <div>
          <button
            onClick={(e) => setSideBarCollapsed(!sideBarCollapsed)}
            type="button"
          >
            {sideBarCollapsed ? '→' : '←'}
          </button>
          <button
            type="button"
            onClick={(e) => {
              if (sideBarCollapsed) setSideBarCollapsed(false);
              setMenuMode('files');
            }}
          >
            fls
          </button>
          <button
            type="button"
            onClick={(e) => {
              if (sideBarCollapsed) setSideBarCollapsed(false);
              setMenuMode('search');
            }}
          >
            srh
          </button>
          <button
            type="button"
            onClick={(e) => {
              if (sideBarCollapsed) setSideBarCollapsed(false);
              setMenuMode('liked');
            }}
          >
            lke
          </button>
          <div className="tab-headers">
            {tabs.map((e, i) => {
              console.log(e);
              return (
                <div key={'tabheader-index:' + i} className="tab-header">
                  <p className="title">{e.title}</p>
                  <button type="button" className="closeButton">
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </menu>
      <div id="bottom">
        <nav id="mainNav" data-collapsed={sideBarCollapsed}>
          <ul>
            <li>
              <button type="button" onClick={(e) => setMode('file')}>
                sr
              </button>
            </li>
            <li>
              <button type="button" onClick={(e) => setMode('graph')}>
                gv
              </button>
            </li>
            <li>
              <button type="button">cl</button>
            </li>
            <li>
              <button type="button">cp</button>
            </li>
            <li>
              <button type="button">se</button>
            </li>
          </ul>
        </nav>
        <menu
          className={[sideBarCollapsed ? 'hidden' : '', 'nav-menu'].join(' ')}
        >
          <div className="actions">
            {menuMode == 'files' ? (
              <>
                <p>all ur notes</p>
              </>
            ) : menuMode == 'search' ? (
              <>
                <p>what u searchin for?</p>
              </>
            ) : menuMode == 'liked' ? (
              <>
                <p>your favorite notes</p>
              </>
            ) : (
              <></>
            )}
          </div>
          <div>a</div>
        </menu>
        <main id="mainWorkspace" className="file" data-mode={mode}>
          {mode === 'file' ? <Tab initialValue="" /> : <Graph />}
        </main>
      </div>
    </>
  );
}

interface Props {
  initialValue: string;
}

const Tab: React.FC<Props> = ({ initialValue }) => {
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [editValue, setEditValue] = useState(initialValue);
  const [viewValue, setViewValue] = useState(
    <div>file has no default content</div>
  );

  const handleValueChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditValue(event.target.value);
    setViewValue(stringToTSX(parse(event.target.value)));
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key == 'Tab') e.preventDefault();
    if (e.ctrlKey && e.key == 'm') setMode(mode == 'view' ? 'edit' : 'view');
  }

  return (
    <div onKeyDown={handleKeyDown}>
      <nav className="tab-nav">
        <button onClick={() => setMode(mode === 'edit' ? 'view' : 'edit')}>
          {mode === 'edit' ? 'View' : 'Edit'}
        </button>
        <button>localGraph</button>
      </nav>
      {mode === 'edit' ? (
        <textarea
          value={editValue}
          onChange={handleValueChange}
          className="tab-edit-container"
        />
      ) : (
        <div
          className="tab-view-container"
          dangerouslySetInnerHTML={{ __html: JSXToString(viewValue) }}
        ></div>
      )}
    </div>
  );
};

const Graph = (): JSX.Element => {
  return (
    <ForceGraph linksData={data.links} nodesData={data.nodes} navOpen={true} />
  );
};

type node = {
  label: string;
  hover: string;
  linksTo: number;
  id: number;
};

export function Link({ name }: { name: string }) {
  return <p>{name}</p>;
}

export let data = {
  nodes: [
    {
      id: 1,
      label: 'Graph view',

      importance: 1,
    },
    {
      id: 2,
      label: 'Internal link',

      importance: 0.6,
    },
    {
      id: 3,
      label: 'Use callouts',

      importance: 0.6,
    },
    {
      id: 4,
      label: 'Link notes',

      importance: 0.6,
    },
    {
      id: 5,
      label: 'Format your notes',

      importance: 0.6,
    },
    {
      id: 6,
      label: 'Working with multiple notes',

      importance: 0.6,
    },
    {
      id: 7,
      label: 'Obsidian',

      importance: 0.6,
    },
    {
      id: 8,
      label: 'Ribbon',

      importance: 0.6,
    },
    {
      id: 9,
      label: 'Pane Layout',

      importance: 0.6,
    },
    {
      id: 10,
      label: 'Search',

      importance: 0.6,
    },
    {
      id: 11,
      label: 'Add custom Styles',

      importance: 0.6,
    },
  ],
  links: [
    {
      source: 1,
      target: 2,
    },
    {
      source: 1,
      target: 3,
    },
    {
      source: 1,
      target: 4,
    },

    {
      source: 1,
      target: 5,
    },
    {
      source: 1,
      target: 6,
    },
    {
      source: 1,
      target: 7,
    },
    {
      source: 1,
      target: 8,
    },
    {
      source: 1,
      target: 9,
    },
    {
      source: 1,
      target: 10,
    },
    {
      source: 1,
      target: 11,
    },
    {
      source: 2,
      target: 3,
    },
    {
      source: 2,
      target: 5,
    },
    {
      source: 2,
      target: 7,
    },
    {
      source: 3,
      target: 5,
    },
    {
      source: 5,
      target: 7,
    },
    {
      source: 5,
      target: 10,
    },
    {
      source: 6,
      target: 9,
    },
    {
      source: 6,
      target: 10,
    },
  ],
};
