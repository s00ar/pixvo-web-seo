import { useState } from 'react';
import { Icon } from './Icon';

export function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        return (
          <div className={`faq-item${open ? ' is-open' : ''}`} key={item.question}>
            <h3>
              <button id={buttonId} aria-controls={panelId} aria-expanded={open} onClick={() => setOpenIndex(open ? -1 : index)}>
                <span>{item.question}</span><Icon name={open ? 'minus' : 'plus'} />
              </button>
            </h3>
            <div id={panelId} aria-labelledby={buttonId} className="faq-item__panel" hidden={!open}><p>{item.answer}</p></div>
          </div>
        );
      })}
    </div>
  );
}
