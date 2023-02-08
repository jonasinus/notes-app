//provided colors are a fallback,for if there is an error loading the css file

export const CONSTANTS = {
  tooltip: {
    offset: {
      x: 28,
      y: 28,
    },
    color: {
      background: '',
      foreground: '',
    },
    size: {
      height: '1rem',
      width: '3rem',
    },
    transition: {
      duration: 200,
    },
    opacity: 0.9,
  },
  links: {
    color: '#3f3',
    opacity: 1,
    size: {},
  },
  nodes: {
    color: {
      background: '#21324d',
      foreground: '',
      outline: '#f9f9f9',
    },
    label: {
      text: 'label',
      font: {
        family: '',
        size: 5,
        color: '#fff',
      },
    },
    size: {
      offset: 0,
      radius: 5,
    },
  },
  svg: {
    color: {
      background: '#000',
    },
    scale: {
      initial: 3,
      current: false,
    },
  },
  simulation: {
    snapiness: 0.3,
    force: {
      charge: -400,
      center: 0.5,
    },
  },
};
