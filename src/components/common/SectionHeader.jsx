export function SectionHeader({ eyebrow, title, description, align = 'center', as: Tag = 'h2' }) {
  return (
    <header className={`section-header section-header--${align}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag>{title}</Tag>
      {description && <p>{description}</p>}
    </header>
  );
}
