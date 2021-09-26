import { render } from 'preact';

import { App } from './components/App';
import './index.css';

const targetElement = document.getElementById('app');

if (targetElement) {
  render(<App />, targetElement);
}
