
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'

// Add error handling for the initial render
const renderApp = () => {
  try {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </React.StrictMode>,
    )
    console.log('Application successfully mounted to DOM');
  } catch (error) {
    console.error('Failed to render the application:', error);
    // Render a fallback UI in case of critical errors
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: sans-serif;">
          <h2>Something went wrong</h2>
          <p>We're sorry, but the application couldn't be loaded. Please try refreshing the page.</p>
          <pre style="background: #f5f5f5; padding: 10px; text-align: left; overflow: auto;">${error instanceof Error ? error.message : 'Unknown error'}</pre>
        </div>
      `;
    }
  }
}

renderApp();
