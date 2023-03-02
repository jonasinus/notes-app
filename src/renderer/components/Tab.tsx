import { useState } from 'react';
import DigitalClock from './DigitalClock';
import { parse } from './util/parse';

export type tabStates = 'fileview' | 'graph' | 'daily' | 'calendar' | 'canvas';

export interface tabProps {
  path: string | null;
  id: number;
  active: boolean;
  mode: tabStates;
  title: string;
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
        active
        id={props.id}
        mode={props.mode}
        path={props.path}
        title={props.title}
      />
    );
  return (
    <>
      <div className="tab">
        <Editor filePath="" mode="edit" />
      </div>
    </>
  );
}

function Editor({
  filePath,
  mode,
}: {
  filePath: string;
  mode: 'edit' | 'view' | 'draw';
}) {
  const [raw, setRaw] = useState('**hello**');
  const [parsed, setParsed] = useState(parseFromRaw(raw));

  function parseFromRaw(raw: string) {
    return parse(raw);
  }

  return (
    <div>
      <textarea value={raw} onChange={(e) => setRaw(e.target.value)}></textarea>
      <div dangerouslySetInnerHTML={{ __html: parseFromRaw(raw) }}></div>
    </div>
  );
}

function getContents(path: string) {
  window.electron.ipcRenderer.sendMessage('get-file-contents', [
    path.toString(),
  ]);
}

function EmptyTab(props: tabProps) {
  return (
    <div className="tab empty">
      <ul className="options">
        <li className="option">create a file</li>
        <li className="option">open a file</li>
        <li className="option">search recent files</li>
      </ul>
    </div>
  );
}
