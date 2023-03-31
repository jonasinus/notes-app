import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Editor, tab, Tab } from './Tab';
import { Titlebar } from './Titlebar';
import { Directory, menuStates } from 'renderer/App';
import { Menu } from './Menu';

interface Props {
  menuState: { now: menuStates; before: menuStates };
  setMenuState: Function;
  widgetHandler: Function;
  bunker: Directory | 'error' | undefined;
  tabs: tab[];
  setTabs: Function;
}

export const TabManager = (props: Props) => {
  const [currentTab, setCurrentTab] = useState<tab>({
    title: 'string',
    id: 0,
    collapsed: true,
    filePath: null,
    mode: 'fileview',
    active: true,
  });

  const [currentTabEl, setCurrentTabEl] = useState(<></>);

  useEffect(() => {
    console.log('tabs', { tabs: props.tabs });

    const { t, changed } = correctTabActive(props.tabs, currentTab);

    if (changed) {
      props.setTabs(t);
      return;
    }
    if (props.tabs.length <= 0) {
      createTab();
      return;
    }
    let activeTab = props.tabs.find((e) => e.active === true);
    if (activeTab === undefined) {
      setActiveTab(props.tabs[0].id);
    }

    let tab = props.tabs.find((e) => e.active == true);
    let fsData: Directory | 'error' = 'error';
    if (tab)
      setCurrentTabEl(
        <>
          <Tab
            path={tab.filePath}
            id={tab.id}
            active={true}
            mode={tab.mode}
            title={tab.title}
            menuState={{
              now: menuStates.COLLAPSED,
              before: menuStates.FILES,
            }}
            setMenuState={props.setMenuState}
            widgetHandler={props.widgetHandler}
            bunker={props.bunker}
          />
          {/*
          <div
            className={['tab', tab.id.toString()].join(' ')}
            data-active={true.valueOf().toString()}
          >
            <Menu state={props.menuState} data={fsData} />
            <Editor
              filePath={tab.filePath ?? ''}
              mode="view"
              contents={'*wait a sec, we are opening your file....*'}
            />
          </div>*/}
        </>
      );
    else setCurrentTabEl(<>empty tab</>);
  }, [props.tabs]);

  function correctTabActive(tabs: tab[], currentTab: tab) {
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
        filePath: './index.md',
      };
    }
    tab.id = getUnusedTabId(props.tabs);
    tab.title = `new tab [${tab.id}]`;
    console.log('created a new tab:', tab);
    props.setTabs([...props.tabs, tab]);
    setCurrentTab(tab);
  }

  function setActiveTab(id: number) {
    let aT: tab = currentTab;
    let t: tab[] = [];
    for (let i = 0; i < props.tabs.length; i++) {
      let cTab = props.tabs[i];
      cTab.active = cTab.id === id;
      if (cTab.id === id) {
        aT = cTab;
      }
      t.push(cTab);
    }
    setCurrentTab(aT);
    props.setTabs(t);
  }

  function removeTab(id: number) {
    let t: tab[] = [];
    let rmTab: tab | undefined = undefined;
    for (let i = 0; i < props.tabs.length; i++) {
      let cTab = props.tabs[i];
      if (cTab.id === id) {
        rmTab = cTab;
      } else {
        t.push(cTab);
      }
    }
    props.setTabs(t);
    if (rmTab !== undefined) console.log('removed a tab: ', rmTab.id);
    else console.error(`ERROR: unable to remove tab with id: ${id}`);
  }

  useEffect(() => {
    createTab();
  }, []);

  return (
    <div className="tab-manager">
      <TabBar
        tabs={props.tabs}
        removeTab={removeTab}
        createTab={createTab}
        activate={setActiveTab}
      />
      <div
        className={[
          'tabs',
          props.menuState.now === menuStates.COLLAPSED
            ? 'menu-collapsed'
            : 'menu-expanded',
        ].join(' ')}
        menu-open={(props.menuState.now !== menuStates.COLLAPSED)
          .valueOf()
          .toString()}
      >
        {currentTabEl}
        {/*props.tabs.map((e, i) => {
          return (
            <Tab
              id={e.id}
              path={e.filePath}
              active={e.active}
              mode={e.mode}
              title={e.title}
              menuState={{
                now: menuStates.FILES,
                before: menuStates.COLLAPSED,
              }}
              setMenuState={props.setMenuState}
              widgetHandler={props.widgetHandler}
              bunker={props.bunker}
              key={e.filePath}
            />
          );
        })*/}
      </div>
    </div>
  );
};

function TabBar({
  tabs,
  removeTab,
  createTab,
  activate,
}: {
  tabs: tab[];
  removeTab: Function;
  createTab: Function;
  activate: Function;
}) {
  return (
    <div className="tab-titles">
      {tabs.map((e) => (
        <div key={e.id} data-active={e.active}>
          <p
            onClick={(ev) => {
              activate(e.id);
            }}
          >
            {e.title}
          </p>
          <button onClick={(ev) => removeTab(e.id)}>×</button>
        </div>
      ))}
      <button className="create-tab" onClick={(e) => createTab()}>
        +
      </button>
    </div>
  );
}

function tabHandler() {}

export function getUnusedTabId(tabs: tab[]): number {
  let id = 0;
  let i = tabs.findIndex((e) => e.id === id);
  while (i > -1) {
    id = Math.floor(Math.random() * (1 + tabs.length));
    i = tabs.findIndex((e) => e.id === id);
  }
  return id;
}
