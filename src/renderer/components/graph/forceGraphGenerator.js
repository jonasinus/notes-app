import * as d3 from 'd3';
import { CONSTANTS } from './forceGraph.constants.js';

export function runForceGraph(
  container,
  linksData,
  nodesData,
  nodeHoverTooltip
) {
  const links = linksData.map((d) => Object.assign({}, d));
  const nodes = nodesData.map((d) => Object.assign({}, d));

  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;

  const drag = (simulation) => {
    const dragstarted = (e, d) => {
      if (!e.active)
        simulation.alphaTarget(CONSTANTS.simulation.snapiness).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (e, d) => {
      d.fx = e.x;
      d.fy = e.y;
    };

    const dragended = (e, d) => {
      if (!e.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    return d3
      .drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };

  // Add the tooltip element to the graph
  const tooltip = document.querySelector('#graph-tooltip');
  if (!tooltip) {
    const tooltipDiv = document.createElement('div');
    //tooltipDiv.classList.add(styles.tooltip);
    tooltipDiv.style.opacity = '0';
    tooltipDiv.id = 'graph-tooltip';
    //document.getElementById('forceGraph').parentElement.appendChild(tooltipDiv);
  }
  const div = d3.select('#graph-tooltip');

  const hideAll = () => {
    let all = [node, link, label];

    all.forEach((el) => {
      for (let i = 0; i < el._groups[0].length; i++) {
        el._groups[0][i].classList.add('hi');
      }
    });
  };

  const unHideAll = () => {
    let all = [node, link, label];

    all.forEach((el) => {
      for (let i = 0; i < el._groups[0].length; i++) {
        el._groups[0][i].classList.remove('hi');
      }
    });
  };

  const addTooltip = (hoverTooltip, d, x, y) => {
    div
      .transition()
      .duration(CONSTANTS.tooltip.transition.duration)
      .style('opacity', CONSTANTS.tooltip.opacity);
    div
      .html(hoverTooltip(d))
      .style('left', `${x + CONSTANTS.tooltip.offset.x}px`)
      .style('top', `${y + CONSTANTS.tooltip.offset.y}px`);
  };

  const removeTooltip = () => {
    div
      .transition()
      .duration(CONSTANTS.tooltip.transition.duration)
      .style('opacity', 0);
  };

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3.forceLink(links).id((d) => d.id)
    )
    .force(
      'charge',
      d3.forceManyBody().strength(CONSTANTS.simulation.force.charge)
    )
    .force('x', d3.forceX())
    .force('y', d3.forceY())
    .force(
      'center',
      d3.forceCenter().strength(CONSTANTS.simulation.force.center)
    );

  const svg = d3
    .select(container)
    .append('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .call(
      d3.zoom().on('zoom', function (e) {
        if (!CONSTANTS.svg.scale.current) {
          e.transform.k += CONSTANTS.svg.scale.initial;
          CONSTANTS.svg.scale.current = true;
        }
        svg.attr('transform', e.transform);
      })
    )
    .attr('class', 'fg')
    .attr('transform', (e) => {
      return `scale(${CONSTANTS.svg.scale.initial})`;
    });

  const link = svg
    .append('g')
    .attr('class', 'links')
    .attr('stroke', CONSTANTS.links.color)
    .attr('stroke-opacity', CONSTANTS.links.opacity)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', '1')
    .attr('class', (d) => {
      return 'link';
    });

  const node = svg
    .append('g')
    .attr('class', 'nodes')
    .attr('stroke', CONSTANTS.nodes.color.outline)
    .attr('stroke-width', CONSTANTS.nodes.size.offset)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', (d) => {
      return CONSTANTS.nodes.size.radius * (d.importance || 0);
    })
    .attr('fill', CONSTANTS.nodes.color.background)
    .attr('stroke-width', '0.5')
    .call(drag(simulation))
    .on('mouseover', (e, d) => {
      hideAll();
      let linkIds = [];
      for (let i = 0; i < link._groups[0].length; i++) {
        let el = link._groups[0][i];
        let ld = linksData[i];
        if (d.id == ld.source || d.id == ld.target) {
          el.classList.add('h');
          el.classList.remove('hi');
          linkIds.push(ld);
        }
      }

      linkIds.forEach((lId) => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id == lId.source || nodes[i].id == lId.target) {
            node._groups[0][i].classList.remove('hi');
            label._groups[0][i].classList.remove('hi');
          }
        }
      });
    })
    .on('mouseout', (e, d) => {
      unHideAll();
      for (let i = 0; i < link._groups[0].length; i++) {
        let el = link._groups[0][i];
        let ld = linksData[i];
        el.classList.remove('h');
      }
    })
    .attr('class', 'node');

  const label = svg
    .append('g')
    .attr('class', 'labels')
    .selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('font-size', `${CONSTANTS.nodes.label.font.size}px`)
    .attr('class', `label`)
    .attr('fill', CONSTANTS.nodes.label.font.color)
    .attr('dominant-baseline', 'center')
    .attr('text-anchor', 'middle')
    .style(
      'translate',
      `0px   ${CONSTANTS.nodes.size.radius + CONSTANTS.nodes.label.font.size}px`
    )
    .text((d) => d.label);
  //.call(drag(simulation));

  label
    .on('mouseover', (e, d) => {
      addTooltip(nodeHoverTooltip, d, e.pageX, e.pageY);
    })
    .on('mouseout', () => {
      removeTooltip();
    });

  simulation.on('tick', () => {
    //update link positions
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    // update node positions
    node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

    // update label positions
    label
      .attr('x', (d) => {
        return d.x;
      })
      .attr('y', (d) => {
        return d.y;
      });
  });

  return {
    destroy: () => {
      simulation.stop();
    },
    nodes: () => {
      return svg.node();
    },
  };
}
