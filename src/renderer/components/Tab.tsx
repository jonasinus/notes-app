import DigitalClock from './DigitalClock';

export type tabStates = 'fileview' | 'graph' | 'daily' | 'calendar' | 'canvas';

export function Tab(props: tabProps) {
  if (props.path === null) return <EmptyTab />;
  return (
    <>
      <div className="tab">
        id: {props.id}
        <DigitalClock />
      </div>
    </>
  );
}

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

function EmptyTab() {
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

function TabHeader() {}
