import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthProvider";
import Navbar from "./components/Navbar.jsx";


function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
