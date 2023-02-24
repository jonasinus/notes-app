export function SettingsWidget({
  settings,
}: {
  settings: {
    name: string;
    description: string;
    title: string;
    type: 'slider' | 'number' | 'text' | 'boolean';
  }[];
}) {
  return (
    <div className="widget settings">
      <WidgetTitleBar title="settings" moveable />
    </div>
  );
}

export function HelpWidget() {
  return (
    <div className="widget help">
      <WidgetTitleBar title="help" moveable />
    </div>
  );
}

export function SearchCreateFileWidget() {
  return (
    <div className="widget search">
      <WidgetTitleBar title="search / create" moveable />
    </div>
  );
}

export function LinkWidget() {
  return (
    <div className="widget link">
      <WidgetTitleBar title="link" moveable />
    </div>
  );
}

export function WidgetTitleBar({
  title,
  moveable,
}: {
  title: string;
  moveable: boolean;
}) {
  return (
    <div className="widget-titlebar">
      <h4>{title}</h4>
      <div className="move-menu">
        {moveable ? (
          <>
            <button>l</button>
            <button>m</button>
            <button>r</button>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
