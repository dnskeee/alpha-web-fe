import { ComponentProps } from 'react';

type Props = Omit<ComponentProps<'a'>, 'target' | 'rel'>;

export function ExternalLink({ children, ...rest }: Props) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}
