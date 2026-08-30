import { Button } from '../common/Button';

function ArticleBlock({ block }) {
  if (block.type === 'heading') {
    const Tag = block.level === 3 ? 'h3' : 'h4';
    return <Tag id={block.id}>{block.title}</Tag>;
  }
  if (block.type === 'paragraph') return <p>{block.text}</p>;
  if (block.type === 'list') return <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
  if (block.type === 'quote') return <blockquote><p>{block.text}</p>{block.cite && <cite>{block.cite}</cite>}</blockquote>;
  if (block.type === 'table') return <div className="article-table-wrap"><table><thead><tr>{block.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{block.rows.map((row) => <tr key={row.join('-')}>{row.map((cell, index) => <td key={`${cell}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></div>;
  if (block.type === 'code') return <div className="code-block"><span>{block.language}</span><pre><code>{block.code}</code></pre></div>;
  if (block.type === 'cta') return <aside className="inline-cta"><div><h3>{block.title}</h3><p>{block.text}</p></div><Button to="/contacto" icon="arrow">Hablemos</Button></aside>;
  return null;
}

export function ArticleContent({ content }) {
  return (
    <div className="article-content">
      {content.map((section) => (
        <section key={section.id} aria-labelledby={section.id}>
          <h2 id={section.id}>{section.title}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.blocks.map((block, index) => <ArticleBlock key={`${block.type}-${block.id || block.title || index}`} block={block} />)}
        </section>
      ))}
    </div>
  );
}
