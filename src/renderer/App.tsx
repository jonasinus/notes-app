import { FC, useRef, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';

interface tabheader {
  title: string;
  open: boolean;
}

function App() {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
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
        <main id="mainWorkspace">
          <Tab edit="**hello**" parsed="<strong>hello</strong>" />
        </main>
      </div>
    </>
  );
}

export default App;

function Tab({ edit, parsed }: { edit: string; parsed: string }) {
  const [editmode, setEditmode] = useState(true);
  const editContainerRef = useRef<HTMLTextAreaElement>(null);
  const viewContainerRef = useRef<HTMLDivElement>(null);

  function EditContainer({ text }: { text: string }) {
    return (
      <textarea
        defaultValue={text}
        ref={editContainerRef}
        onChange={(e) => (edit = e.currentTarget.value)}
      ></textarea>
    );
  }

  function ViewContainer({ text }: { text: string }) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: text }}
        ref={viewContainerRef}
      ></div>
    );
  }

  function parseEditString(s: string): string {
    return s;
  }

  return (
    <div className="tab">
      <nav className="tabNav">
        <button
          onClick={(e) => setEditmode(!editmode)}
          className="toggleModeButton"
        >
          {editmode ? 'view' : 'edit'}
        </button>
      </nav>
      <div>
        {editmode ? (
          <EditContainer text={edit} />
        ) : (
          <ViewContainer text={parseEditString(edit)} />
        )}
      </div>
    </div>
  );
}
