import { tab } from 'renderer/App';

type TabHeaderProps = {
  tab: tab;
  openTab: (id: number) => void;
  removeTab: (id: number) => void;
};

const TabHeader = ({ tab, openTab, removeTab }: TabHeaderProps) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', String(tab.id));
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const sourceId = Number(event.dataTransfer.getData('text'));
    const destId = tab.id;
    if (sourceId !== destId) {
      const sourceIndex = tabs.findIndex((t) => t.id === sourceId);
      const destIndex = tabs.findIndex((t) => t.id === destId);
      const newTabs = [...tabs];
      newTabs.splice(destIndex, 0, newTabs.splice(sourceIndex, 1)[0]);
      setTabs(newTabs);
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className={`tab-header ${tab.open ? 'open' : ''}`}
      onClick={() => openTab(tab.id)}
      draggable
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <p className="tab-title">{tab.title}</p>
      <button className="close-button" onClick={() => removeTab(tab.id)}>
        ×
      </button>
    </div>
  );
};
