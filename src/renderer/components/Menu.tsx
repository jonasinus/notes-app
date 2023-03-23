import AddFileIcon from 'icons/addFile.svg';
import { FolderIcon } from 'icons/FolderIcon';
import { useEffect, useState } from 'react';
import { menuStates, Directory, File } from 'renderer/App';
import { restartApp } from './util/system';
import { MenuItem } from './MenuItem';
import AddfolderIcon from 'icons/addFolder.svg';
import ChangeOrderIcon from 'icons/changeOrder.svg';

export function Menu({
  state,
  data,
}: {
  state: { before: menuStates; now: menuStates };
  data: Directory | 'error' | undefined;
}) {
  if (
    state.now === menuStates.FILES ||
    (state.before === menuStates.FILES && state.now === menuStates.COLLAPSED)
  ) {
    function mapDir(
      e: Directory | File,
      index: number,
      startCollapsed: boolean,
      openItems: string[],
      setOpenItems: Function
    ) {
      return (
        <MenuItem
          e={e}
          n={0}
          totalItems={e.contents.length}
          position={index}
          open
          openItems={openItems}
          setOpenItems={setOpenItems}
        />
      );
    }

    const [startCollapsed, setStartCollapsed] = useState(true);

    const [openItems, setOpenItems] = useState<string[]>([]);

    function handleOpenItem(id: string) {
      console.log('opeing menu at id:', id);
      if (openItems.includes(id)) {
        setOpenItems(openItems.filter((i) => i !== id));
      } else {
        setOpenItems([...openItems, id]);
      }
    }

    useEffect(() => {
      let loc = localStorage.getItem('menuOpenItems');
      if (loc) {
        setOpenItems(JSON.parse(loc));
      }
    }, []);

    useEffect(() => {
      localStorage.setItem('menuOpenItems', JSON.stringify(openItems));
    }, [openItems]);

    return (
      <div
        className={[
          'main-menu',
          state.now === menuStates.COLLAPSED ? 'collapsed' : 'expanded',
        ].join(' ')}
        data-state-now={menuStates[state.now]}
        data-state-before={menuStates[state.before]}
      >
        <menu className="top">
          <button type="button" onClick={(e) => {}}>
            <AddFileIcon />
          </button>
          <button type="button" onClick={(e) => {}}>
            <AddfolderIcon />
          </button>
          <button type="button" onClick={(e) => {}}>
            <ChangeOrderIcon />
          </button>
        </menu>
        <menu className="bottom file-list">
          {data !== undefined && data !== 'error' ? (
            <div>
              <h4 className="vault-name">{data.name}</h4>
              <div className="contents">
                {mapDir(data, 0, startCollapsed, openItems, handleOpenItem)}
              </div>
            </div>
          ) : data !== 'error' ? (
            <>
              indexing your bunker. is your bunker is very large (thousands of
              items) this might take a while
            </>
          ) : (
            <>
              there was an error accessing your bunker. make sure the path you
              specified is correct and the programm has enough permissions to
              access it
            </>
          )}
        </menu>
      </div>
    );
  }

  return (
    <div className="main-menu error">
      <p>error opening the menu, restart the app</p>
      <button type="button" onClick={(e) => restartApp()}>
        restart now //does not work rn
      </button>
    </div>
  );
}
