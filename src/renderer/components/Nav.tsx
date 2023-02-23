import { menuStates, tab } from 'renderer/App';
import { restartApp, shuffle } from './util/system';

import AddFolder from '../../icons/addFolder.svg';
import AddFile from 'icons/addFile.svg';
import ChangeOrder from 'icons/changeOrder.svg';
import Graph from 'icons/graph.svg';
import Draw from 'icons/draw.svg';
import SearchGlass from 'icons/searchGlass.svg';
import Calendar from 'icons/calendar.svg';
import Terminal from 'icons/terminal.svg';
import QuestionMark from 'icons/questionMark.svg';
import Settings from 'icons/settings.svg';

export function Nav({
  currentTab,
  setCurrentTab,
  fileSearchHidden,
  setFileSearchHidden,
  menuState,
  setMenuState,
}: {
  currentTab: tab;
  setCurrentTab: Function;
  fileSearchHidden: boolean;
  setFileSearchHidden: Function;
  menuState: menuStates;
  setMenuState: Function;
}) {
  return (
    <>
      <nav>
        <ul>
          <li>
            <button onClick={(e) => setFileSearchHidden(!fileSearchHidden)}>
              <SearchGlass />
            </button>
          </li>
          <li>
            <button>
              <Graph />
            </button>
          </li>
          <li>
            <button>
              <Draw />
            </button>
          </li>
          <li>
            <button>
              <Calendar />
            </button>
          </li>
          <li>
            <button>
              <Terminal />
            </button>
          </li>
          <li>
            <button>
              <QuestionMark />
            </button>
          </li>
          <li>
            <button>
              <Settings />
            </button>
          </li>
        </ul>
      </nav>
      <menu className="file-menu">
        <Menu state={menuState} />
      </menu>
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

  function Menu({ state }: { state: menuStates }) {
    if (state === menuStates.FILES) {
      return (
        <div>
          <menu className="top">
            <button type="button" onClick={(e) => {}}>
              <AddFile />
            </button>
            <button type="button" onClick={(e) => {}}>
              <AddFolder />
            </button>
            <button type="button" onClick={(e) => {}}>
              <ChangeOrder />
            </button>
          </menu>
          <div className="bottom"></div>
        </div>
      );
    }

    return (
      <div>
        <p>error opening the menu, restart the app</p>
        <button type="button" onClick={(e) => restartApp()}>
          restart now
        </button>
      </div>
    );
  }
}
