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

    const HandleNavigate = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log("Redirecionando com ID:", user._id);
        navigate(`/edit-profile/${user._id}`);
    } else {
        alert("Erro: Usuário não encontrado!");
        navigate("/login"); // redirecione para o login em vez de tentar usar user._id
    }
};



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
                        <button onClick={HandleNavigate}>Editar</button>

                    </Logos>
                </Cabecalho>
            ) : (
                <p>Usuário não autenticado</p>
            )}
        </div>
    );
}