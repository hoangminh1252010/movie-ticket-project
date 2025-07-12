import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>{/* Your existing app content */}</BrowserRouter>
    </AuthProvider>
  );
}

export default App;
