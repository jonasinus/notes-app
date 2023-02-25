import { useRef, useEffect } from 'react';
import { tab } from './Tab';
import DigitalClock from './DigitalClock';
import { Tab } from './Tab';

export function TabManager({
  tabs,
  setTabs,
  currentTab,
}: {
  tabs: tab[];
  setTabs: Function;
  currentTab: tab;
}) {
  return (
    <div className="tabs">
      <Tab
        id={currentTab.id}
        active
        mode={currentTab.mode}
        path={currentTab.filePath}
        title={currentTab.title}
      />
    </div>
  );
}
