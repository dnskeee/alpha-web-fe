import s from './SkillBadge.module.css';

interface SkillBadgeProps {
  name: string;
  icon?: React.ReactNode;
}

export function SkillBadge({ name, icon }: SkillBadgeProps) {
  return (
    <div className={s.pill}>
      {icon ? <div className={s.icon}>{icon}</div> : null}
      <span className={s.label}>{name}</span>
    </div>
  );
}
