import { Link } from 'react-router-dom';
import { Icon } from '../common/Icon';
import { SmartImage } from '../common/SmartImage';
import { formatDate } from '../../utils/formatDate';

export function ArticleCard({ article, featured = false, basePath = '/blog' }) {
  const articlePath = `${basePath}/${article.slug}`;
  return (
    <article className={`article-card${featured ? ' article-card--featured' : ''}`}>
      <Link className="article-card__image" to={articlePath} tabIndex="-1" aria-hidden="true">
        <SmartImage src={article.featuredImage} alt="" width="512" height="279" />
      </Link>
      <div className="article-card__body">
        <span className="eyebrow">{article.category}</span>
        <h3><Link to={articlePath}>{article.title}</Link></h3>
        <p>{article.excerpt}</p>
        <div className="article-meta"><span><Icon name="calendar" size={14} />{formatDate(article.publishedAt)}</span><span><Icon name="clock" size={14} />{article.readingTime}</span></div>
        <Link className="text-link" to={articlePath}>Leer artículo <Icon name="arrow" size={15} /></Link>
      </div>
    </article>
  );
}
