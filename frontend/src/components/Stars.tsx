export default function Stars({ rating }: { rating: number }) {
  const pct = Math.max(0, Math.min(5, rating)) / 5 * 100;
  return (
    <span className="stars" aria-label={`Rated ${rating.toFixed(1)} out of 5`} title={`${rating.toFixed(1)} / 5`}>
      <span className="stars-bg">★★★★★</span>
      <span className="stars-fg" style={{ width: `${pct}%` }}>★★★★★</span>
    </span>
  );
}
