import React from 'react';

export default function LoadedButton({children, ...props}: any) {
  return <button {...props}>{children}</button>
}