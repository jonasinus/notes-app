import { menuStates, tab } from 'renderer/App';
import { useState } from 'react';
import ArrowBack from 'icons/arrowBack.svg';
import ArrowForward from 'icons/arrowForward.svg';

export function Titlebar({
  tabs,
  setTabs,
  openTab,
  addTab,
  removeTab,
  currentTab,
  menuState,
  setMenuState,
}: {
  tabs: tab[];
  setTabs: (t: tab[]) => void;
  openTab: (id: number) => void;
  addTab: () => void;
  removeTab: (id: number) => void;
  currentTab: tab;
  menuState: menuStates;
  setMenuState: Function;
}) {
  return (
    <>
      <button onClick={(e) => setMenuState(menuStates.COLLAPSED)}>
        {menuState !== menuStates.COLLAPSED ? <ArrowBack /> : <ArrowForward />}
      </button>
      <button>f</button>
      <button>s</button>
      <button>l</button>
      <div className="tab-headers" key={tabs.length}>
        {tabs.length === 0 ? (
          <div>
            <p>no tab open, restart the app</p>
          </div>
        ) : (
          tabs.map((tab) => (
            <div
              className={['tab-header', tab.open ? 'open' : ''].join(' ')}
              key={'tabId_' + tab.id}
            >
              <p
                className="tab-header-title"
                onClick={(e) => {
                  openTab(tab.id);
                }}
              >
                {tab.title}
              </p>
              <button
                onClick={(e) => {
                  removeTab(tab.id);
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
        <button className="add-tab" onClick={(e) => addTab()}>
          +
        </button>
      </div>
    </>
  );
}
