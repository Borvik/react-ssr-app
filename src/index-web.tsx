import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { App } from './app';

loadableReady(() => {
  hydrate(
    <React.StrictMode>
      <Router basename='/'>
        <App />
      </Router>
    </React.StrictMode>,
    document.getElementById('root')
  )
});