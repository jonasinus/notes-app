import { useEffect, useState } from 'react';
import { tab, Tab } from './Tab';
import { Titlebar } from './Titlebar';
import { menuStates } from 'renderer/App';

export function TabManager({
  menuState,
  setMenuState,
}: {
  menuState: { now: menuStates; before: menuStates };
  setMenuState: Function;
}) {
  const [tabs, setTabs] = useState<tab[]>([]);
  const [currentTab, setCurrentTab] = useState<tab>({
    title: 'string',
    id: 0,
    collapsed: true,
    filePath: null,
    mode: 'fileview',
    active: true,
    parsed: <></>,
    raw: '',
  });

  useEffect(() => {
    const { t, changed } = correctTabActive(tabs, currentTab);

    if (changed) {
      setTabs(t);
      return;
    }
    if (tabs.length <= 0) {
      createTab();
      return;
    }
    let activeTab = tabs.find((e) => e.active === true);
    if (activeTab === undefined) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs]);

  function correctTabActive(tabs: tab[], tab: tab) {
    let changed = false;
    let t: tab[] = [];
    tabs.forEach((tab) => {
      if (tab.id === currentTab.id) {
        if (tab.active !== true) {
          changed = true;
          tab.active = true;
        }
      } else {
        if (tab.active === true) {
          changed = true;
          tab.active = false;
        }
      }
      t.push(tab);
    });
    return { t: t, changed: changed };
  }

  function createTab(tab?: tab) {
    if (tab === undefined) {
      tab = {
        title: 'new tab [',
        id: 0,
        active: true,
        mode: 'fileview',
        collapsed: false,
        filePath: null,
        raw: '',
        parsed: <></>,
      };
    }
    tab.id = getUnusedTabId();
    tab.title = `new tab [${tab.id}]`;
    console.log('created a new tab:', tab.id);
    setTabs([...tabs, tab]);
    setCurrentTab(tab);
  }

  function setActiveTab(id: number) {
    let aT: tab = currentTab;
    let t: tab[] = [];
    for (let i = 0; i < tabs.length; i++) {
      let cTab = tabs[i];
      cTab.active = cTab.id === id;
      if (cTab.id === id) {
        aT = cTab;
      }
      t.push(cTab);
    }
    setCurrentTab(aT);
    setTabs(t);
  }

  function removeTab(id: number) {
    let t: tab[] = [];
    let rmTab: tab | undefined = undefined;
    for (let i = 0; i < tabs.length; i++) {
      let cTab = tabs[i];
      if (cTab.id === id) {
        rmTab = cTab;
      } else {
        t.push(cTab);
      }
    }
    setTabs(t);
    if (rmTab !== undefined) console.log('removed a tab: ', rmTab.id);
    else console.error(`ERROR: unable to remove tab with id: ${id}`);
  }

  function getUnusedTabId() {
    let id = 0;
    let i = tabs.findIndex((e) => e.id === id);
    while (i > -1) {
      id = Math.floor(Math.random() * (1 + tabs.length));
      i = tabs.findIndex((e) => e.id === id);
    }
    return id;
  }

  useEffect(() => {
    createTab();
  }, []);

  return (
    <div className="tab-manager">
      <TabBar tabs={tabs} removeTab={removeTab} createTab={createTab} />
      <button>+</button>
      <div
        className={[
          'tabs',
          menuState.now === menuStates.COLLAPSED
            ? 'menu-collapsed'
            : 'menu-expanded',
        ].join(' ')}
        menu-open={(menuState.now !== menuStates.COLLAPSED)
          .valueOf()
          .toString()}
      >
        <Tab
          id={currentTab.id}
          active
          mode={currentTab.mode}
          path={currentTab.filePath}
          title={currentTab.title}
        />
      </div>
    </div>
  );
}

function TabBar({
  tabs,
  removeTab,
  createTab,
}: {
  tabs: tab[];
  removeTab: Function;
  createTab: Function;
}) {
  return (
    <div className="tab-titles">
      {tabs.map((e) => (
        <div key={e.id}>
          <p>{e.title}</p>
          <button onClick={(ev) => removeTab(e.id)}>×</button>
        </div>
      ))}
      <button className="create-tab" onClick={(e) => createTab()}>
        +
      </button>
    </div>
  );
}
