import { Card } from './Card';

export function TestimonialCard({ testimonial }) {
  return (
    <Card className="testimonial-card">
      <span className="testimonial-card__quote" aria-hidden="true">“</span>
      <blockquote><p>{testimonial.quote}</p><footer><strong>{testimonial.author}</strong><span>{testimonial.role}</span></footer></blockquote>
    </Card>
  );
}
