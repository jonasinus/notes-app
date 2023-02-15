import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { mainModule } from 'process';
import { ForceGraph } from './components/graph';
import { renderToString } from 'react-dom/server';

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
            {sideBarCollapsed ? 'exp' : 'col'}
          </button>
          <button type="button" onClick={(e) => setMenuMode('files')}>
            fls
          </button>
          <button type="button" onClick={(e) => setMenuMode('search')}>
            srh
          </button>
          <button type="button" onClick={(e) => setMenuMode('liked')}>
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
    setViewValue(parse(event.target.value));
  };

  function parse(s: string) {
    s = s.replace(
      /^(#+)\s*(.*)$/gm,
      (match, p1, p2) => `<h${p1.length}>${p2.trim()}</h${p1.length}>`
    ); // #×x for heading [x]
    s = s.replace(/(\*\*)(.*?)(\*\*)/g, JSXToString(<strong>$2</strong>)); // **...** for <strong></strong>
    s = s.replace(/(\*)(.*?)(\*)/g, JSXToString(<i>$2</i>)); // *...* for <italic></italic>
    s = s.replace(
      /(\|)(.*?)(\|)/g,
      JSXToString(<span className="blurred-text">$2</span>)
    ); // |...| for blurring text between
    s = s.replace(/(\[\[)(.*?)(\]\])/g, JSXToString(<p>$2</p>)); // [[...]] for creating a  link

    let parsed = parseMarkdown(s, '**#*|');
    console.log(parsed);

    return <div dangerouslySetInnerHTML={{ __html: parsed }}></div>;
  }

  const JSXToString = (el: JSX.Element) => renderToString(el);

  function parseMarkdown(text: string, markers: string) {
    const markerRegex = new RegExp(
      `^((?:\\\\[${markers}]|[^${markers}])+)([${markers}])\\s*(.*)$`,
      'gm'
    );
    return text.replace(markerRegex, (match, p1, p2, p3) => {
      if (p1.endsWith('\\')) {
        return match.slice(0, -1) + p2 + ' ' + p3;
      }
      switch (p2) {
        case '**':
          return `<strong>${p3.trim()}</strong>`;
        case '*':
          return `<em>${p3.trim()}</em>`;
        case '#':
          return `<h${p2.length}>${p3.trim()}</h${p2.length}>`;
        case '|':
          return `<div class="separator">${p3.trim()}</div>`;
        default:
          return match;
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
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
        <div className="tab-view-container">{viewValue}</div>
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
