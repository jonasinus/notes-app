import { menuStates, tab } from 'renderer/App';
import { useState } from 'react';
import ArrowBack from 'icons/arrowBack.svg';
import ArrowForward from 'icons/arrowForward.svg';
import SearchFileIcon from 'icons/searchFile.svg';
import SearchGlassIcon from 'icons/searchGlass.svg';
import StarIcon from 'icons/star.svg';
import FolderOpenIcon from 'icons/folderOpen.svg';

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
  menuState: { before: menuStates; now: menuStates };
  setMenuState: Function;
}) {
  return (
    <div className="titlebar">
      <div className="buttons">
        <button
          onClick={(e) => {
            console.log('menustate rn: ', menuStates[menuState.now]);
            menuState.now === menuStates.COLLAPSED
              ? setMenuState({ before: menuState.now, now: menuState.before })
              : setMenuState({
                  before: menuState.now,
                  now: menuStates.COLLAPSED,
                });
          }}
        >
          {menuState.now !== menuStates.COLLAPSED ? (
            <ArrowBack />
          ) : (
            <ArrowForward />
          )}
        </button>
        <button>
          <FolderOpenIcon />
        </button>
        <button>
          <SearchGlassIcon />
        </button>
        <button>
          <StarIcon />
        </button>
        <button>media</button>
      </div>
      <div className="tab-headers" key={tabs.length}>
        {tabs.map((tab) => (
          <div
            className={['tab-header', tab.active ? 'open' : ''].join(' ')}
            key={'tabId_' + tab.id}
          >
            <p
              className="tab-header-title"
              data-id={tab.id}
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
        ))}
        <button
          className="add-tab"
          onClick={(e) => {
            addTab();
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
