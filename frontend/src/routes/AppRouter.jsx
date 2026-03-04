import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import {useAuth} from "../context/useAuth";
import MainLayout from "../components/layout/MainLayout";
import GroupsPage from "../pages/groups/GroupsPage.jsx";
import AdminRoute from "../components/AdminRoute.jsx";
import UsersPage from "../pages/UsersPage.jsx";
import EditUserPage from "../pages/EditUserPage.jsx";
import EditGroupPage from "../pages/groups/EditGroupPage.jsx";
import CreateGroupPage from "../pages/groups/CreateGroupPage.jsx";
import DepartmentsPage from "../pages/departments/DepartmentsPage.jsx";
import EditDepartmentPage from "../pages/departments/EditDepartmentPage.jsx";
import CreateDepartmentPage from "../pages/departments/CreateDepartmentPage.jsx";
import EmployeeList from '../pages/employees/EmployeeList.jsx';
import EmployeeCreatePage from "../pages/employees/EmployeeCreatePage.jsx";
import EmployeeEditPage from "../pages/employees/EmployeeEditPage.jsx";

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
                    <Route path="/groups" element={<AdminRoute><GroupsPage/></AdminRoute>}/>
                    <Route path="/groups/create" element={<AdminRoute><CreateGroupPage/></AdminRoute>}/>
                    <Route path="/groups/edit/:id" element={<AdminRoute><EditGroupPage/></AdminRoute>}/>
                    <Route path="/users" element={<AdminRoute><UsersPage/></AdminRoute>}/>
                    <Route path="/users/edit/:id" element={<AdminRoute><EditUserPage/></AdminRoute>}/>
                    <Route path="/departments" element={<AdminRoute><DepartmentsPage/></AdminRoute>}/>
                    <Route path="/departments/create" element={<AdminRoute><CreateDepartmentPage/></AdminRoute>}/>
                    <Route path="/departments/edit/:id" element={<AdminRoute><EditDepartmentPage/></AdminRoute>}/>
                    <Route path="/employees" element={<AdminRoute><EmployeeList/></AdminRoute>}/>
                    <Route path="/employee/create" element={<EmployeeCreatePage/>}/>
                    <Route path="/employee/edit/:id" element={<EmployeeEditPage/>}/>

                </Route>
                <Route path="/" element={<Navigate to="/login"/>}/>
            </Routes>
        </Router>
    );
}
