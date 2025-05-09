import { Routes, Route } from "react-router-dom";
import SingUp from '../pages/SingUp'
import SingIn from '../pages/SingIn'
import Login from '../pages/Login'

const RoutesApp = () => {
    return (
        <Routes>
            <Route path="/" element={ <SingIn/> }/>
            <Route path="/registre-se" element={<SingUp/>} />
            <Route path="/profile" element={<Login/>} />
        </Routes>
    )
}

export default RoutesApp;