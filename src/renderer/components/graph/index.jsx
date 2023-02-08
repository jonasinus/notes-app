import React from 'react';
import { runForceGraph } from './forceGraphGenerator';

export function ForceGraph({
  linksData,
  nodesData,
  nodeHoverTooltip,
  navOpen,
}) {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runForceGraph(
        containerRef.current,
        linksData,
        nodesData,
        nodeHoverTooltip
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
