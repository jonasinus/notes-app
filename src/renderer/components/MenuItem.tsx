import { FolderIcon } from 'icons/FolderIcon';
import AddFileIcon from 'icons/addFile.svg';
import { Directory, File } from 'renderer/App';

export function MenuItem({
  e,
  n,
  totalItems,
  position,
  open,
}: {
  e: File | Directory;
  n: number;
  totalItems: number;
  position: number;
  open: boolean;
}) {
  let ud = <p>|</p>; //up down
  let lrd = <p>┬</p>; //left right down
  let urd = <p>├</p>; //up right down
  let ur = <p>└</p>; //up right
  let lr = <p>—</p>; //left right

  function getIndicators(
    e: File | Directory,
    n: number,
    maxN: number,
    pos: number
  ) {
    console.log({
      name: e.name,
      layer: n,
      itemsInLLayer: maxN,
      posInLLayer: pos,
    });
    let r: JSX.Element[] = [];
    let m = n;

    while (n > 0) {
      if (n >= 2) r.push(ud);
      else if (pos !== 0) r.push(ud);
      else r.push(urd);
      n--;
    }

    if (pos === 0 && maxN === 1) r.push(lr);
    else if (pos === 0) r.push(lrd);
    else if (pos === maxN - 1) r.push(ur);
    else r.push(urd);

    return <>{r.map((e) => e)}</>;
  }

  if (e.isDir)
    return (
      <details
        className="dir"
        open={open}
        key={e.name + e.contentSizeBytes + e.contents.length}
      >
        <summary>
          <div className="indicators">
            <FolderIcon open={false} />
            {/*getIndicators(e, n, totalItems, position)*/}
          </div>
          <p>D:{e.name}</p>
        </summary>
        {e.contents
          .sort((e, b) => (e.isDir && !b.isDir ? -1 : 1))
          .map((i, ind) => (
            <MenuItem
              e={i}
              n={n + 1}
              totalItems={e.contents.length}
              position={ind}
              open={open}
            />
          ))}
      </details>
    );

  return (
    <div className="file" key={e.name + e.contentSizeBytes + e.contents.length}>
      <div className="indicators">
        {/*getIndicators(e, n, totalItems, position)*/}
        <AddFileIcon />
      </div>
      <p>F:{e.name}</p>
    </div>
  );
}
