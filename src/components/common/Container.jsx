export function Container({ as: Tag = 'div', size = 'default', className = '', children, ...props }) {
  return <Tag className={`container container--${size} ${className}`.trim()} {...props}>{children}</Tag>;
}
