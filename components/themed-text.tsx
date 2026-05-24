import { ComponentProps } from 'react';
import s from './themed-text.module.css';

type Variant = 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';

interface Props extends ComponentProps<'span'> {
  type?: Variant;
  lightColor?: string;
  darkColor?: string;
}

export function ThemedText({ type = 'default', className, children, lightColor, darkColor, ...rest }: Props) {
  void lightColor;
  void darkColor;
  return (
    <span className={[s.base, s[type], className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </span>
  );
}
