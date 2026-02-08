// This line imports the createRoot function from the react-dom/client library
import { createRoot } from "react-dom/client";
// This line imports the App component from the App.tsx file.
import App from "./App.tsx";
// This line imports the index.css file
import "./index.css";
// This line imports the i18n.ts file
import "./i18n";

// This line creates a root for the React application and renders the App component.
// root element is the div with the id "root" in the index.html file.
// The ! is a non-null assertion operator, which tells TypeScript that the element will not be null.
createRoot(document.getElementById("root")!).render(<App />);
