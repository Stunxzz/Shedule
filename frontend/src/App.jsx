import AppRouter from "./routes/AppRouter";
import {AuthProvider} from "./context/AuthProvider";
import SnackbarProvider from "./providers/SnackbarProvider";


function App() {
    return (
        <SnackbarProvider>
            <AuthProvider>
                <AppRouter/>
            </AuthProvider>
        </SnackbarProvider>
    );
}

export default App;
