export function TableOfContents({ content }) {
  const entries = content.flatMap((section) => [
    { id: section.id, title: section.title, level: 2 },
    ...section.blocks.filter((block) => block.type === 'heading').map((block) => ({ id: block.id, title: block.title, level: block.level })),
  ]);
  return (
    <nav className="table-of-contents" aria-label="Índice del artículo">
      <h2>En este artículo</h2>
      <ol>{entries.map((entry) => <li key={entry.id} className={`toc-level-${entry.level}`}><a href={`#${entry.id}`}>{entry.title}</a></li>)}</ol>
    </nav>
  );
}
