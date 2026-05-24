export default function Loading() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100dvh', background: 'var(--color-bg-card)',
    }}>
      <span style={{ color: 'var(--color-muted)' }}>Loading…</span>
    </div>
  );
}
