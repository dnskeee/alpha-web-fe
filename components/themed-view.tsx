import { ComponentProps } from 'react';

interface Props extends ComponentProps<'div'> {
  lightColor?: string;
  darkColor?: string;
}

export function ThemedView({ className, style, children, lightColor, darkColor, ...rest }: Props) {
  void lightColor;
  void darkColor;
  return (
    <div className={className} style={{ background: 'var(--color-bg-card)', ...style }} {...rest}>
      {children}
    </div>
  );
}
