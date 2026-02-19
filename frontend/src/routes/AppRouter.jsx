import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import CreateGroupPage from '../pages/Groups/CreateGroupPage.jsx';
import {useAuth} from "../context/useAuth";
import MainLayout from "../components/layout/MainLayout";
import GroupsList from "../components/GroupsAndPermissions/GroupsList.jsx";
import EditGroupPage from "../pages/Groups/EditGroupPage.jsx";
import AdminRoute from "../components/AdminRoute.jsx";

// PrivateRoute - за защитени страници
const PrivateRoute = ({children}) => {
    const {user, loading} = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login"/>;
};

// PublicRoute - за login/register страници
const PublicRoute = ({children}) => {
    const {user, loading} = useAuth();
    if (loading) return <div>Loading...</div>;
    return !user ? children : <Navigate to="/profile"/>;
};


export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<PublicRoute><LoginPage/></PublicRoute>}/>
                <Route path="/register" element={<PublicRoute><RegisterPage/></PublicRoute>}/>
                <Route element={<MainLayout/>}>
                    <Route path="/profile" element={<PrivateRoute><ProfilePage/></PrivateRoute>}/>
                    <Route path="/groups" element={<AdminRoute><GroupsList/></AdminRoute>}/>
                    <Route path="/groups/create" element={<AdminRoute><CreateGroupPage/></AdminRoute>}/>
                    <Route path="/groups/edit/:id" element={<AdminRoute><EditGroupPage/></AdminRoute>}/>
                </Route>
                <Route path="/" element={<Navigate to="/login"/>}/>
            </Routes>
        </Router>
    );
}
