'use client';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, ReactNode } from 'react';
import s from './parallax-scroll-view.module.css';

const HEADER_HEIGHT = 250;

interface Props {
  headerImage: ReactNode;
  headerBackgroundColor?: { light: string; dark: string };
  children: ReactNode;
}

export function ParallaxScrollView({ headerImage, headerBackgroundColor, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });
  const translateY = useTransform(
    scrollY,
    [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
    [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
  );
  const scale = useTransform(scrollY, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]);

  return (
    <div ref={containerRef} className={s.scroll}>
      <motion.div
        className={s.header}
        style={{
          translateY,
          scale,
          ...(headerBackgroundColor ? { background: headerBackgroundColor.light } : {}),
        }}
      >
        {headerImage}
      </motion.div>
      <div className={s.content}>{children}</div>
    </div>
  );
}
