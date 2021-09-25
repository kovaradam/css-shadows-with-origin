import { render } from 'preact';
import { App } from './app';
import './index.css';

const targetElement = document.getElementById('app');

if (targetElement) {
  render(<App />, targetElement);
}
