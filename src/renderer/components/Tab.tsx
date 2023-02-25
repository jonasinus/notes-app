import DigitalClock from './DigitalClock';

export type tabStates = 'fileview' | 'graph' | 'daily' | 'calendar' | 'canvas';

export function Tab(props: tabProps) {
  return (
    <>
      {props.id}
      <DigitalClock />
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
