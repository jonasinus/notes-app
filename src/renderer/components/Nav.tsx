import { tab } from 'renderer/App';

export function Nav({
  currentTab,
  setCurrentTab,
  fileSearchHidden,
  setFileSearchHidden,
}: {
  currentTab: tab;
  setCurrentTab: Function;
  fileSearchHidden: boolean;
  setFileSearchHidden: Function;
}) {
  return (
    <>
      <nav>
        <ul>
          <li>
            <button onClick={(e) => setFileSearchHidden(!fileSearchHidden)}>
              srh
            </button>
          </li>
          <li>
            <button>gra</button>
          </li>
          <li>
            <button>can</button>
          </li>
          <li>
            <button>cal</button>
          </li>
          <li>
            <button>&gt;_</button>
          </li>
          <li>
            <button>hlp</button>
          </li>
          <li>
            <button>set</button>
          </li>
        </ul>
      </nav>
      <menu className="file-menu">menu</menu>
    </>
  );
}
