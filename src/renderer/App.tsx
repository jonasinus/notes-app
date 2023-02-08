import { FC, useRef, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { mainModule } from 'process';
import { ForceGraph } from './components/graph';

interface tabheader {
  title: string;
  open: boolean;
}

function App() {
  return (
    <ForceGraph linksData={data.links} nodesData={data.nodes} navOpen={true} />
  );
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [mode, setMode] = useState<'file' | 'graph'>('file');
  const [tabs, setTabs] = useState<tabheader[]>([
    { title: 'hello world', open: true },
    { title: 'second tab', open: false },
  ]);
  return (
    <>
      <menu id="titleBar">
        <div>
          <button
            onClick={(e) => setSideBarCollapsed(!sideBarCollapsed)}
            type="button"
          >
            {sideBarCollapsed ? 'exp' : 'col'}
          </button>
          <button type="button">fls</button>
          <button type="button">srh</button>
          <button type="button">lke</button>
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
            <button>c n</button>
            <button>c c</button>
            <button>s a</button>
            <button>idk</button>
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

export default App;

interface Props {
  initialValue: string;
}

const Tab: React.FC<Props> = ({ initialValue }) => {
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [editValue, setEditValue] = useState(initialValue);
  const [viewValue, setViewValue] = useState('');

  const handleValueChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditValue(event.target.value);
    setViewValue(parse(event.target.value));
  };

  function parse(s: string): string {
    return s.replace(/(\*\*)(.*?)(\*\*)/g, '<strong>$2</strong>');
  }

  return (
    <div>
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
          dangerouslySetInnerHTML={{
            __html: viewValue.length === 0 ? 'this file is empty' : viewValue,
          }}
          className="tab-view-container"
        />
      )}
    </div>
  );
};

const Graph = (): JSX.Element => {
  return <div></div>;
};

type node = {
  label: string;
  hover: string;
  linksTo: number;
  id: number;
};

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
