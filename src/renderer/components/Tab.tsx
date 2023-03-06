import { useEffect, useState } from 'react';
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
  const [fsData, setFsData] = useState<Directory>();

  useEffect(() => {
    console.log(fsData);
  }, [fsData]);

  useEffect(() => {
    window.electron.ipcRenderer.on('load-vault', (arg) => {
      console.log('vault', arg);
      setFsData(arg as Directory);
    });

    window.electron.ipcRenderer.sendMessage('load-vault', []);
  }, []);

  if (props.path === null)
    return (
      <EmptyTab
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

  return (
    <>
      <div
        className={['tab', props.id.toString()].join(' ')}
        data-active={props.active.valueOf().toString()}
      >
        <Menu state={props.menuState} data={fsData} />
        <Editor filePath="" mode="edit" contents={''} />
      </div>
    </>
  );
}

function Editor({
  filePath,
  mode,
  contents,
}: {
  filePath: string;
  mode: 'edit' | 'view' | 'draw';
  contents: any;
}) {
  const [raw, setRaw] = useState(contents);
  const [parsed, setParsed] = useState(parseFromRaw(raw));

  function parseFromRaw(raw: string) {
    return parse(raw);
  }

  useEffect(() => {
    window.electron.ipcRenderer.getFileContents('get-file-contents', (res) => {
      console.log('res', new TextDecoder().decode(res));
      setRaw(new TextDecoder().decode(res));
    });

    window.electron.ipcRenderer.requestFileContents('get-file-contents', {
      path: filePath,
    });
  }, []);

  return (
    <div>
      <textarea value={raw} onChange={(e) => setRaw(e.target.value)}></textarea>
      <div dangerouslySetInnerHTML={{ __html: parseFromRaw(raw) }}></div>
    </div>
  );
}

function getContents(path: string) {}

function EmptyTab(props: tabProps) {
  return (
    <div className="tab empty">
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
