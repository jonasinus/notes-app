import { useEffect, useRef, useState } from 'react';

export function WidgetTitleBar({
  title,
  moveable,
  pos,
  setPos,
  showTitle,
  hide,
  Ref,
}: {
  title: string;
  moveable: 'left' | 'right' | 'left-right' | false;
  pos: 'left' | 'middle' | 'right';
  setPos: Function;
  showTitle: boolean;
  hide: Function;
  Ref: any;
}) {
  return (
    <div className="widget-titlebar" ref={Ref}>
      {showTitle ? <h1>{title}</h1> : <h1></h1>}
      <div className="move-menu">
        {!moveable ? (
          <></>
        ) : (
          <>
            {moveable == 'left' || moveable == 'left-right' ? (
              <button
                data-highlighted={pos === 'left'}
                onClick={(e) => setPos('left')}
              >
                &lt;&lt;
              </button>
            ) : (
              <></>
            )}
            <button
              data-highlighted={pos === 'middle'}
              onClick={(e) => setPos('middle')}
            >
              {pos === 'left' ? '>' : '<'}
            </button>
            {moveable == 'right' || moveable == 'left-right' ? (
              <button
                data-highlighted={pos === 'right'}
                onClick={(e) => setPos('right')}
              >
                &gt;&gt;
              </button>
            ) : (
              <></>
            )}
            <button onClick={(e) => hide('null')}>×</button>
          </>
        )}
      </div>
    </div>
  );
}

interface widgetProps {
  title: string;
  moveable: 'left' | 'right' | 'left-right' | false;
  content: JSX.Element;
  classname?: string[];
  showTitle: boolean;
  visible: boolean;
  hide: Function;
}

export function Widget(props: widgetProps) {
  const [pos, setPos] = useState<'left' | 'right' | 'middle'>('middle');

  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.visible) {
      let i = 0;
      function handleClick(event: MouseEvent) {
        if (
          widgetRef.current?.contains(event.target as Node) &&
          !widgetBarRef.current?.contains(event.target as Node)
        ) {
        } else {
          if (i > 0) props.hide('null');
          else i++;
        }
      }
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [props.visible]);

  return (
    <div className={props.classname?.join(' ')} data-pos={pos} ref={widgetRef}>
      <WidgetTitleBar
        hide={props.hide}
        title={props.title}
        moveable={props.moveable}
        pos={pos}
        setPos={setPos}
        showTitle={props.showTitle}
        Ref={widgetBarRef}
      />
      <div>{props.content}</div>
    </div>
  );
}

export function SettingsWidgetContent() {
  return (
    <div>
      <div>
        <h3>Privacy</h3>
        <ul>
          <li>
            <h4>serverless</h4>
            <input type="checkbox" defaultChecked />
          </li>
          <li>
            <h4>encrypt local bunker</h4>
            <input type="checkbox" defaultChecked />
          </li>
          <li>
            <h4>set encryption key</h4>
            <input type="password" defaultValue="****" />
          </li>
          <li>
            <h4>connect to vibeo-sync™</h4>
            <button type="button">connect through browser</button>
          </li>
          <li>
            <h4>use a custom server</h4>
            <input type="text" placeholder="url to configured server" />
          </li>
        </ul>
      </div>
      <div>
        <h3>Font</h3>
        <ul>
          <li>
            <h4>custom-font</h4>
            <input type="text" defaultValue="none" />
          </li>
          <li>
            <h4>font-scaling (%)</h4>
            <input type="range" min="1" max="200" defaultValue="100" />
          </li>
        </ul>
      </div>
      <div>
        <h3>Theme</h3>
        <ul>
          <li>
            <h4>mode</h4>
            <select>
              <option value="light">light</option>
              <option value="dark">dark</option>
              <option value="system">system preffered</option>
            </select>
          </li>
        </ul>
      </div>
      <div>
        <h3>Developer</h3>
        <ul>
          <li>
            <h4>use code-highlighting</h4>
            <input type="checkbox" defaultChecked />
          </li>
          <li>
            <h4>use internal terminal</h4>
            <input type="checkbox" />
          </li>
        </ul>
      </div>
      <div className="manageChanges">
        <button>Undo</button>
        <button>Redo</button>
        <button>Apply</button>
        <button>Reset</button>
      </div>
    </div>
  );
}
