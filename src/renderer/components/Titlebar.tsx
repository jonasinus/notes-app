import { menuStates } from 'renderer/App';
import { useState } from 'react';
import ArrowBack from 'icons/arrowBack.svg';
import ArrowForward from 'icons/arrowForward.svg';
import SearchFileIcon from 'icons/searchFile.svg';
import SearchGlassIcon from 'icons/searchGlass.svg';
import StarIcon from 'icons/star.svg';
import FolderOpenIcon from 'icons/folderOpen.svg';
import { tab } from './Tab';

export function Titlebar({
  menuState,
  setMenuState,
}: {
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
    </div>
  );
}
