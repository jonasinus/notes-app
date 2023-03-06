import { Directory, File, menuStates, widgets } from 'renderer/App';
import { tab } from './Tab';
import { restartApp, shuffle } from './util/system';

import SearchFileIcon from 'icons/searchFile.svg';
import GraphIcon from 'icons/graph.svg';
import DrawIcon from 'icons/draw.svg';
import CalendarIcon from 'icons/calendar.svg';
import TerminalIcon from 'icons/terminal.svg';
import QuestionMarkIcon from 'icons/questionMark.svg';
import SettingsIcon from 'icons/settings.svg';
import { useState } from 'react';
import { Menu } from './Menu';

export function Nav({
  fileSearchHidden,
  setFileSearchHidden,
  menuState,
  setMenuState,
  widget,
  setWidget,
  bunker,
}: {
  fileSearchHidden: boolean;
  setFileSearchHidden: Function;
  menuState: { before: menuStates; now: menuStates };
  setMenuState: Function;
  widget: widgets;
  setWidget: Function;
  bunker: Directory | undefined;
}) {
  const [focus, setFocus] = useState<string | null>(null);

  return (
    <>
      <nav className="side-nav main-nav">
        <ul>
          <li>
            <button onClick={(e) => setWidget('search')}>
              <SearchFileIcon />
            </button>
          </li>
          <li>
            <button>
              <GraphIcon />
            </button>
          </li>
          <li>
            <button>
              <DrawIcon />
            </button>
          </li>
          <li>
            <button>
              <CalendarIcon />
            </button>
          </li>
          <li>
            <button>
              <TerminalIcon />
            </button>
          </li>
          <li>
            <button onClick={(e) => setWidget('help')}>
              <QuestionMarkIcon />
            </button>
          </li>
          <li>
            <button onClick={(e) => setWidget('settings')}>
              <SettingsIcon />
            </button>
          </li>
        </ul>
      </nav>
      <Menu
        state={{
          before: menuState.before,
          now: menuState.now,
        }}
        data={bunker}
      />
    </>
  );

  function changeOrder(array: any[], direction: 'rev' | 'rnd') {
    if (direction === 'rev') return array.reverse();
    if (direction === 'rnd') return shuffle(array);
  }

  function createElement(
    type: 'note' | 'collection' | 'canvas',
    name: string
  ) {}
}

// ├ └ ┬ |
