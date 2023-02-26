import { Directory, File, menuStates, widgets } from 'renderer/App';
import { tab } from './Tab';
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
import { useState } from 'react';
import { start } from 'repl';
import AddfolderIcon from '../../icons/addFolder.svg';
import AddFileIcon from 'icons/addFile.svg';

export function Nav({
  currentTab,
  setCurrentTab,
  fileSearchHidden,
  setFileSearchHidden,
  menuState,
  setMenuState,
  widget,
  setWidget,
  fsData,
  setFsData,
}: {
  currentTab: tab;
  setCurrentTab: Function;
  fileSearchHidden: boolean;
  setFileSearchHidden: Function;
  menuState: { before: menuStates; now: menuStates };
  setMenuState: Function;
  widget: widgets;
  setWidget: Function;
  fsData: Directory | undefined;
  setFsData: Function;
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
      <menu
        className={[
          'file-menu',
          menuState.now === menuStates.COLLAPSED ? 'collapsed' : 'expanded',
        ].join(' ')}
        data-state-now={menuStates[menuState.now]}
        data-state-before={menuStates[menuState.before]}
      >
        <Menu state={menuState} data={fsData} />
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

  function Menu({
    state,
    data,
  }: {
    state: { before: menuStates; now: menuStates };
    data: Directory | undefined;
  }) {
    if (
      state.now === menuStates.FILES ||
      (menuState.before === menuStates.FILES &&
        menuState.now === menuStates.COLLAPSED)
    ) {
      function mapDir(
        e: Directory | File,
        index: number,
        startCollapsed: boolean
      ) {
        return (
          <MenuItem
            e={e}
            n={0}
            totalItems={e.contents.length}
            position={index}
            open={!startCollapsed}
          />
        );
      }

      const [startCollapsed, setStartCollapsed] = useState(true);

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
          <div className="bottom file-list">
            {data !== undefined ? (
              <div>
                <h4 className="vault-name">{data.name}</h4>
                <div className="contents">
                  {mapDir(data, 0, startCollapsed)}
                </div>
              </div>
            ) : (
              <>
                there was an error accessing your vault. make sure the path you
                specified is correct and the programm has enough permissions to
                access it
              </>
            )}
          </div>
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

function MenuItem({
  e,
  n,
  totalItems,
  position,
  open,
}: {
  e: File | Directory;
  n: number;
  totalItems: number;
  position: number;
  open: boolean;
}) {
  let ud = <p>|</p>; //up down
  let lrd = <p>┬</p>; //left right down
  let urd = <p>├</p>; //up right down
  let ur = <p>└</p>; //up right
  let lr = <p>—</p>; //left right

  function getIndicators(
    e: File | Directory,
    n: number,
    maxN: number,
    pos: number
  ) {
    console.log({
      name: e.name,
      layer: n,
      itemsInLLayer: maxN,
      posInLLayer: pos,
    });
    let r: JSX.Element[] = [];
    let m = n;

    while (n > 0) {
      if (n >= 2) r.push(ud);
      else if (pos !== 0) r.push(ud);
      else r.push(urd);
      n--;
    }

    if (pos === 0 && maxN === 1) r.push(lr);
    else if (pos === 0) r.push(lrd);
    else if (pos === maxN - 1) r.push(ur);
    else r.push(urd);

    return <>{r.map((e) => e)}</>;
  }

  if (e.isDir)
    return (
      <details className="dir" open={open}>
        <summary>
          <div className="indicators">
            <FolderIcon open={false} />
            {/*getIndicators(e, n, totalItems, position)*/}
          </div>
          <p>D:{e.name}</p>
        </summary>
        {e.contents
          .sort((e, b) => (e.isDir && !b.isDir ? -1 : 1))
          .map((i, ind) => (
            <MenuItem
              e={i}
              n={n + 1}
              totalItems={e.contents.length}
              position={ind}
              open={open}
            />
          ))}
      </details>
    );

  return (
    <div className="file">
      <div className="indicators">
        {/*getIndicators(e, n, totalItems, position)*/}
        <AddFileIcon />
      </div>
      <p>F:{e.name}</p>
    </div>
  );
}

// ├ └ ┬ |

function FolderIcon({ open }: { open: boolean }) {
  if (open)
    return (
      <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
        <path d="M7 40q-1.15 0-2.075-.925Q4 38.15 4 37V11q0-1.15.925-2.075Q5.85 8 7 8h14.05l3 3H41q1.15 0 2.075.925Q44 12.85 44 14H22.75l-3-3H7v26l5.1-20H47l-5.35 20.7q-.3 1.2-1.1 1.75T38.5 40Zm3.15-3h28.6l4.2-17h-28.6Zm0 0 4.2-17-4.2 17ZM7 14v-3 3Z" />
      </svg>
    );
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      viewBox="0 96 960 960"
      width="48"
    >
      <path d="M141 896q-24 0-42-18.5T81 836V316q0-23 18-41.5t42-18.5h280l60 60h340q23 0 41.5 18.5T881 376v460q0 23-18.5 41.5T821 896H141Zm0-580v520h680V376H456l-60-60H141Zm0 0v520-520Z" />
    </svg>
  );
}
