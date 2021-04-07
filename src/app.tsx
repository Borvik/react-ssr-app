import React, { useState } from 'react';
import { ReactComponent as Logo } from './logo.svg';
import loadable from '@loadable/component';
import './style.scss';

const LoadedButton = loadable(() => import('./loaded_button'));

export function App() {
  const [c, setC] = useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <Logo style={{ maxHeight: '40vmin' }} className='App-logo' />
        <p>
          Edit <code>src/demo/app.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <LoadedButton onClick={() => setC(d => d + 1)}>Clicked: {c}</LoadedButton>
      </header>
    </div>
  )
}