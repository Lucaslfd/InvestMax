import { Routes, Route } from "react-router-dom";
import SingUp from '../pages/SingUp';
import SingIn from '../pages/SingIn';
import Login from '../pages/Login'; // Confirme que este é o componente correto
import EditProfile from "../pages/EditProfile";

const RoutesApp = () => {
    return (
        <Routes>
            <Route path="/" element={<SingIn />} />
            <Route path="/register" element={<SingUp />} />
            <Route path="/profile" element={<Login />} />
            <Route path="/edit-profile/:id" element={<EditProfile />} />
            <Route path="/login" element={<Login />} />

        </Routes>
    );
};

export default RoutesApp;
