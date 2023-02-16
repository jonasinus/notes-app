import { tab } from 'renderer/App';

export function Titlebar({
  tabs,
  setTabs,
}: {
  tabs: tab[];
  setTabs: Function;
}) {
  console.log(tabs);
  return (
    <>
      <button>←</button>
      <button>f</button>
      <button>s</button>
      <button>l</button>
      <div className="tab-headers">
        {tabs.length === 0 ? (
          <div>
            <p>no tab open, restart the app</p>
          </div>
        ) : (
          tabs.map((e, i) => {
            return <TitleBarTab tab={e} />;
          })
        )}
      </div>
    </>
  );
}

export function TitleBarTab({ tab }: { tab: tab }) {
  return (
    <div className="tab-header">
      <p>{tab.title}</p>
      <button>×</button>
    </div>
  );
}
