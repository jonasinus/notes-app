import { tab } from 'renderer/App';

export function Nav({
  currentTab,
  setCurrentTab,
}: {
  currentTab: tab;
  setCurrentTab: Function;
}) {
  return (
    <>
      <nav>
        <ul>
          <li>srh</li>
          <li>gra</li>
          <li>can</li>
          <li>cal</li>
          <li>&gt;_</li>
        </ul>
      </nav>
      <menu>menu</menu>
    </>
  );
}
