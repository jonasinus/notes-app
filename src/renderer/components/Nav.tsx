import { menuStates, tab, widgets } from 'renderer/App';
import { restartApp, shuffle } from './util/system';

import AddFolder from '../../icons/addFolder.svg';
import AddFile from 'icons/addFile.svg';
import ChangeOrder from 'icons/changeOrder.svg';
import SearchFileIcon from 'icons/searchFile.svg';
import GraphIcon from 'icons/graph.svg';
import DrawIcon from 'icons/draw.svg';
import CalendarIcon from 'icons/calendar.svg';
import TerminalIcon from 'icons/terminal.svg';
import QuestionMarkIcon from 'icons/questionMark.svg';
import SettingsIcon from 'icons/settings.svg';

export function Nav({
  currentTab,
  setCurrentTab,
  fileSearchHidden,
  setFileSearchHidden,
  menuState,
  setMenuState,
  widget,
  setWidget,
}: {
  currentTab: tab;
  setCurrentTab: Function;
  fileSearchHidden: boolean;
  setFileSearchHidden: Function;
  menuState: { before: menuStates; now: menuStates };
  setMenuState: Function;
  widget: widgets;
  setWidget: Function;
}) {
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
      <menu
        className={[
          'file-menu',
          menuState.now === menuStates.COLLAPSED ? 'collapsed' : 'expanded',
        ].join(' ')}
        data-state-now={menuStates[menuState.now]}
        data-state-before={menuStates[menuState.before]}
      >
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

  function Menu({ state }: { state: { before: menuStates; now: menuStates } }) {
    if (
      state.now === menuStates.FILES ||
      (menuState.before === menuStates.FILES &&
        menuState.now === menuStates.COLLAPSED)
    ) {
      return (
        <>
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
        </>
      );
    }

    return (
      <div className="menu-side error">
        <p>error opening the menu, restart the app</p>
        <button type="button" onClick={(e) => restartApp()}>
          restart now //does not work rn
        </button>
      </div>
    );
  }
}
