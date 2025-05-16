import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('main.tsx: Starting to render app');
const rootElement = document.getElementById('root');
console.log('main.tsx: Root element:', rootElement);

if (!rootElement) {
  console.error('main.tsx: Failed to find root element!');
} else {
  const root = createRoot(rootElement);
  console.log('main.tsx: Created root, about to render');
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('main.tsx: Render called');
}
