import { useEffect, useRef, useState } from 'react';
import DigitalClock from './DigitalClock';
import { parse } from './util/parse';
import { Menu } from './Menu';
import { Directory, menuStates } from 'renderer/App';

export type tabStates = 'fileview' | 'graph' | 'daily' | 'calendar' | 'canvas';

export interface tabProps {
  path: string | null;
  id: number;
  active: boolean;
  mode: tabStates;
  title: string;
  menuState: { now: menuStates; before: menuStates };
  setMenuState: Function;
  widgetHandler: Function;
  bunker: Directory | 'error' | undefined;
}

export type tab = {
  title: string;
  id: number;
  collapsed: boolean;
  filePath: string | null;
  mode: tabStates;
  active: boolean;
  parsed: JSX.Element;
  raw: string;
};

export function Tab(props: tabProps) {
  if (props.path === null)
    return (
      <EmptyTab
        bunker={props.bunker}
        active
        id={props.id}
        mode={props.mode}
        path={props.path}
        title={props.title}
        menuState={props.menuState}
        setMenuState={props.setMenuState}
        widgetHandler={props.widgetHandler}
      />
    );

  const [fsData, setFsData] = useState<Directory>();

  useEffect(() => {
    console.log(fsData);
  }, [fsData]);

  useEffect(() => {
    window.electron.ipcRenderer.getFileContents('get-file-contents', (arg) => {
      console.log('file', arg);
      //setFsData(arg as Directory);
    });

    window.electron.ipcRenderer.sendMessage('get-file-contents', [props.path]);
  }, []);

  return (
    <>
      <div
        className={['tab', props.id.toString()].join(' ')}
        data-active={props.active.valueOf().toString()}
      >
        <Menu state={props.menuState} data={fsData} />
        <Editor filePath={props.path} mode="edit" contents={''} />
      </div>
    </>
  );

  function EmptyTab(props: tabProps) {
    return (
      <div className="tab empty">
        <Menu
          state={{
            before: props.menuState.before,
            now: props.menuState.now,
          }}
          data={props.bunker}
        />
        <ul className="options">
          <li
            className="option"
            onClick={(e) => {
              props.widgetHandler('search');
            }}
          >
            create a file
          </li>
          <li className="option">open a file</li>
          <li className="option">search recent files</li>
        </ul>
      </div>
    );
  }
}

function Editor({
  filePath,
  mode,
  contents,
}: {
  filePath: string | null;
  mode: 'edit' | 'view' | 'draw';
  contents: any;
}) {
  const [raw, setRaw] = useState(contents);
  const [parsed, setParsed] = useState(parseFromRaw(raw));
  const [fp, setFp] = useState(filePath);

  function parseFromRaw(raw: string) {
    return parse(raw);
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('save-all', (args) => {
      console.log('save all');
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.getFileContents('get-file-contents', (res) => {
      setRaw(res);
    });

    window.electron.ipcRenderer.requestFileContents('get-file-contents', {
      path: fp !== null ? fp : '',
    });
  }, [fp]);

  useEffect(() => {
    setParsed(parse(raw));
  }, [raw]);

  const input = useRef<any>();

  return (
    <div className="editor">
      <button
        type="button"
        onClick={(e) => {
          window.electron.ipcRenderer.sendMessage('save-file', [filePath, raw]);
        }}
      >
        save
      </button>
      <input
        type="text"
        ref={input}
        placeholder="file path"
        onChange={(e) => setFp(e.target.value)}
      />
      <textarea value={raw} onChange={(e) => setRaw(e.target.value)}></textarea>
      <div dangerouslySetInnerHTML={{ __html: parsed }}></div>
    </div>
  );
}
