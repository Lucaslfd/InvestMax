import { Routes, Route } from "react-router-dom";
import SingUp from '../pages/SingUp'
import SingIn from '../pages/SingIn'

const RoutesApp = () => {
    return (
        <Routes>
            <Route path="/" element={ <SingIn/> }/>
            <Route path="/registre-se" element={<SingUp/>} />
        </Routes>
    )
}

export default RoutesApp;