import { Fragment, createElement } from 'react';
import { renderToString } from 'react-dom/server';

export function parse(s: string): string {
  s = s.replace(
    /^(#+)\s*(.*)$/gm,
    (match, p1, p2) => `<h${p1.length}>${p2.trim()}</h${p1.length}>`
  ); // #×x for heading [x]
  s = s.replace(/(\*\*)(.*?)(\*\*)/g, JSXToString(<strong>$2</strong>)); // **...** for <strong></strong>
  s = s.replace(/(\*)(.*?)(\*)/g, JSXToString(<i>$2</i>)); // *...* for <italic></italic>
  s = s.replace(
    /(\|)(.*?)(\|)/g,
    JSXToString(<span className="blurred-text">$2</span>)
  ); // |...| for blurring text between
  s = s.replace(/(\[\[)(.*?)(\]\])/g, JSXToString(<p>$2</p>)); // [[...]] for creating a  link

  return s;
}

export const JSXToString = (el: JSX.Element) => renderToString(el);

type JSXElement = React.ReactElement<
  any,
  string | React.JSXElementConstructor<any>
>;

export function stringToTSX(input: string): JSXElement {
  return createElement(Fragment, null, input);
}
