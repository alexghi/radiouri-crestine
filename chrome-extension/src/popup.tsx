import React from 'react';
import ReactDOM from 'react-dom/client';
import { ExtensionPlayer } from './components/ExtensionPlayer';
import './popup.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ExtensionPlayer />
  </React.StrictMode>
);
