import React from 'react';
import { IconType } from 'react-icons';

interface IconProps {
  icon: IconType;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const IconWrapper: React.FC<IconProps> = ({ 
  icon, 
  size = 24, 
  color, 
  className = '',
  style = {}
}) => {
  // Create the icon element using the function directly
  const iconElement = icon({ size, color });
  
  return (
    <div 
      className={`icon-wrapper ${className}`} 
      style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {iconElement}
    </div>
  );
};
