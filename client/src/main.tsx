import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add global error handlers for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Check if it's a fetch error
  if (event.reason instanceof TypeError && event.reason.message.includes('fetch')) {
    console.warn('Network connection issue detected. The application will retry automatically.');
  }
  
  // Prevent default behavior (which would show error in console)
  event.preventDefault();
});

// Handle uncaught errors
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  
  // Check if it's a network-related error
  if (event.error instanceof TypeError && event.error.message.includes('fetch')) {
    console.warn('Network error detected. Please check your connection.');
  }
});

createRoot(document.getElementById("root")!).render(<App />);
