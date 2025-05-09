import { useEffect, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Cabecalho, LogoInvestMax, Logos, Logos_img } from "./style"
import Logo from "../../assets/InvestMax.png"

export default function Header() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    function handleLogout() {
        googleLogout();
        localStorage.removeItem("user");
        navigate("/");
    }

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/")
        }
    }, []);

    return (
        <div>
            {user ? (
                <Cabecalho>
                    <LogoInvestMax>
                        <img src={Logo} alt="Logo da pagina" />
                    </LogoInvestMax>
                    <Logos>
                        <Logos_img>
                            {/* <img src={user.picture && <img src={user.picture}></img>} alt="Foto do perfil" /> */}
                            {user.picture && <img src={user.picture} alt="Foto do perfil" />}
<p>{user.nickname || user.name}</p>
                        </Logos_img>
                        <button onClick={handleLogout}>Sair</button>
                    </Logos>
                </Cabecalho>
            ) : (
                <p>Usuário não autenticado</p>
            )}
        </div>
    );
}