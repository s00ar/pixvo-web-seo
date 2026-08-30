export function SchemaScript({ data }) {
  return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}
