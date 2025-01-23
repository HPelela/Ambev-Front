
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Certifique-se de importar o AuthProvider
import App from "./App";

// Envolvendo a aplicação com AuthProvider e Router
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
);