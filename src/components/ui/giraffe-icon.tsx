
import React from 'react';
import { cn } from '@/lib/utils';

interface GiraffeIconProps extends React.SVGProps<SVGSVGElement> {}

const GiraffeIcon: React.FC<GiraffeIconProps> = ({ className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(className)}
      {...props}
    >
      <path d="M13.23,3.75a2,2,0,0,1,1.8-1.07A2.06,2.06,0,0,1,17,4.5a2,2,0,0,1-1.74,2.15,6.54,6.54,0,0,1-.51,1.89L15.68,10a1,1,0,0,1-1,.89H12.44a1,1,0,0,1-1-.89l-.93-1.48a7.08,7.08,0,0,1-1.18-3A2,2,0,0,1,7.5,3.68,2.06,2.06,0,0,1,9.32,1.82a2,2,0,0,1,2.15,1.74A6.54,6.54,0,0,1,12,4.07,6.21,6.21,0,0,1,13.23,3.75Zm-1.5,10.79L10.37,12H14.1l-1.37,2.54Zm.37,6.86a1,1,0,0,1-1.22,0,10.27,10.27,0,0,0-1.89-1.29l.3-.49a1,1,0,0,1,1.38-.2,8.39,8.39,0,0,1,1.44,1,1,1,0,0,1,.19.67l-.2.31Z" />
    </svg>
  );
};

export default GiraffeIcon;
