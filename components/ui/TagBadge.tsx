import clsx from 'clsx';
import s from './TagBadge.module.css';

export type TagBadgeVariant = 'progress' | 'locked' | 'badge' | 'success' | 'danger';

interface TagBadgeProps {
  label: string;
  color?: string;
  variant?: TagBadgeVariant;
}

export function TagBadge({ label, color, variant }: TagBadgeProps) {
  const legacyStyle =
    !variant && color
      ? { color, backgroundColor: color + '22' }
      : undefined;

  return (
    <span
      className={clsx(s.base, variant && s[variant])}
      style={legacyStyle}
    >
      {label}
    </span>
  );
}
