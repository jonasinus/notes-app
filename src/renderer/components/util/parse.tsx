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
  s = s.replace(
    /(\[\[)(.*?)(\]\])/g,
    JSXToString(<span className="link">$2</span>)
  ); // [[...]] for creating a  link
  s = s.replace(
    /(\`\`\`)(([^\s]+))([\s\S]*?)(\`\`\`)/gms, // ```lang ... ``` for code blocks
    JSXToString(
      <>
        <br />
        <span className={['codeblock', '$3'].join(' ')}>[$3]$4</span>
        <br />
      </>
    )
  );
  s = s.replace(
    /(\>\>)(.*?)(\<\<)/g,
    JSXToString(<span className="justify center">$2</span>)
  );
  s = s.replace(
    /(\>\>)(.*?)(\|)/g,
    JSXToString(<span className="justify right">$2</span>)
  );
  s = s.replace(
    /(\|)(.*?)(\<\<)/g,
    JSXToString(<span className="justify left">$2</span>)
  );
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
