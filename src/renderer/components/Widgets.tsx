import { useEffect, useRef, useState } from 'react';

export function WidgetTitleBar({
  title,
  moveable,
  pos,
  setPos,
  showTitle,
}: {
  title: string;
  moveable: 'left' | 'right' | 'left-right' | false;
  pos: 'left' | 'middle' | 'right';
  setPos: Function;
  showTitle: boolean;
}) {
  return (
    <div className="widget-titlebar">
      {showTitle ? <h4>{title}</h4> : <h4></h4>}
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
            <button>×</button>
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
  const el = useRef(null);

  useEffect(() => {
    if (props.visible) {
      const listener = (e: MouseEvent) => {
        console.log('clicked on widget: ', el.current === e.target);
      };
      document.addEventListener('click', listener);
      return () => document.removeEventListener('click', listener);
    }
  }, [props.visible]);

  return (
    <div className={props.classname?.join(' ')} data-pos={pos} ref={el}>
      <WidgetTitleBar
        title={props.title}
        moveable={props.moveable}
        pos={pos}
        setPos={setPos}
        showTitle={props.showTitle}
      />
      <div>{props.content}</div>
    </div>
  );
}
