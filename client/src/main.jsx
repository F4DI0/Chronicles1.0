import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { DarkModeProvider } from "./context/DarkModeContext.jsx";
import { UserProvider } from "./context/userContext.jsx"; // Import UserProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <DarkModeProvider>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </DarkModeProvider>
);