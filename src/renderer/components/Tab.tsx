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
  bunker: Bunker;
}

type Bunker = Directory | 'error' | undefined;

export type tab = {
  title: string;
  id: number;
  collapsed: boolean;
  filePath: string | null;
  mode: tabStates;
  active: boolean;
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

  const [fsData, setFsData] = useState(props.bunker);

  const [c, cC] = useState('');

  useEffect(() => {
    console.log('path', props.path);
  }, []);

  return (
    <>
      <div
        className={['tab', props.id.toString()].join(' ')}
        data-active={props.active.valueOf().toString()}
      >
        <Menu state={props.menuState} data={fsData} />
        {props.path}
        <Editor
          filePath={props.path}
          mode="view"
          contents={'*wait a sec, we are opening your file....*'}
        />
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
        <div className="content">
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
      </div>
    );
  }
}

export function Editor({
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
  const [editorMode, setEditorMode] = useState<'edit' | 'view' | 'draw'>(mode);

  function parseFromRaw(raw: string) {
    return parse(raw);
  }

  useEffect(() => {
    console.log('editor: ', { filePath, mode, raw, parsed });
    window.electron.ipcRenderer.on('save-all', (args) => {
      //window.electron.ipcRenderer.sendMessage('save-file', [filePath, raw]);
    });

    window.electron.ipcRenderer.getFileContents('get-file-contents', (res) => {
      console.log('editor[' + filePath + '] res:', res);

      setRaw(res);
    });

    console.log('editor', { filePath });

    window.electron.ipcRenderer.sendMessage('get-file-contents', [filePath]);
  }, [filePath]);

  useEffect(() => {
    setParsed(parse(raw));
  }, [raw]);

  return (
    <div data-editor-mode={editorMode} className="content" data-path={filePath}>
      {filePath}
      <div className="navigation">
        <button
          type="button"
          onClick={(e) => {
            window.electron.ipcRenderer.sendMessage('save-file', [
              filePath,
              raw,
            ]);
          }}
        >
          save
        </button>
        <button
          onClick={(e) => {
            setEditorMode('draw');
          }}
        >
          draw
        </button>
        <button
          onClick={(e) => setEditorMode(editorMode == 'edit' ? 'view' : 'edit')}
        >
          {editorMode == 'edit' ? 'view' : 'edit'}
        </button>
      </div>
      <div className={['editor', mode].join(' ')}>
        {/*<input
        type="text"
        ref={input}
        placeholder="file path"
        onChange={(e) => setFp(e.target.value)}
      />*/}
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className="edit"
        ></textarea>
        <div
          dangerouslySetInnerHTML={{ __html: parsed }}
          className="view"
        ></div>
      </div>
    </div>
  );
}
