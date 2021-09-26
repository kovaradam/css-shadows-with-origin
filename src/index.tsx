import { render } from 'preact';

import { App } from './App';
import './index.css';

const targetElement = document.getElementById('app');

if (targetElement) {
  render(<App />, targetElement);
}
