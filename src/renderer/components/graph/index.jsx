import React from 'react';
import { runForceGraph } from './forceGraphGenerator';

export function ForceGraph({ linksData, nodesData, navOpen }) {
  const containerRef = React.useRef(null);
  console.log(nodesData, linksData);

  React.useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runForceGraph(
        containerRef.current,
        linksData,
        nodesData
      );
      destroyFn = destroy;
    }

    return destroyFn;
  }, []);

  return (
    <>
      <ForceGraphMenu />
      <div ref={containerRef} id="forceGraph" className="graph" />
    </>
  );
}

export function ForceGraphMenu() {
  return <div id="forceGarphMenu" className="sideMenu" />;
}
