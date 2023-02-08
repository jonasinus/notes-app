import { FC, useRef, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { mainModule } from 'process';

interface tabheader {
  title: string;
  open: boolean;
}

function App() {
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
              <button type="button">sr</button>
            </li>
            <li>
              <button type="button">gv</button>
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
          {mode === 'file' ? <Tab initialValue="" /> : <main></main>}
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

const Graph = ({
  nodes,
  settings,
}: {
  nodes: node[];
  settings: {};
}): JSX.Element => {
  return <div></div>;
};

type node = {
  label: string;
  hover: string;
};
