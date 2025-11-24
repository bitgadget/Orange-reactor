import React from 'react';
import { Theme } from '../types';

interface Props {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  theme?: Theme;
}

const GlitchText: React.FC<Props> = ({ text, className = '', as: Component = 'span', theme = 'CYBER' }) => {
  if (theme === 'MINIMAL') {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component className={`relative inline-block hover:animate-pulse ${className}`} data-text={text}>
      <span className="relative z-10">{text}</span>
    </Component>
  );
};

export default GlitchText;