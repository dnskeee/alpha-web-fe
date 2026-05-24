import s from './ModuleSkills.module.css';

interface Skill {
  name: string;
  progress: number;
  active: boolean;
}

interface ModuleSkillsProps {
  skills: Skill[];
}

export function ModuleSkills({ skills }: ModuleSkillsProps) {
  return (
    <div className={s.container}>
      {skills.map((skill) => (
        <div key={skill.name} className={s.card}>
          <span className={s.name}>{skill.name}</span>
          <div className={s.track}>
            <div
              className={s.fill}
              style={{
                width: `${skill.progress}%`,
                background: skill.active ? 'var(--color-accent)' : 'var(--color-muted)',
                opacity: skill.active ? 1 : 0.4,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
