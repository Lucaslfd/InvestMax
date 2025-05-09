import { Campus, Logo, Main, Section } from "./style"
import InvestMax from "../../assets/InvestMax.png"
import { GoogleLogin, googleLogout } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"

export default function SingIn() {

    const navigate = useNavigate()

    const handleSuccess = (credentialResponse) => {
        const token = credentialResponse.credential;
        const user = jwtDecode(token);
        console.log("Usuário autenticado:", user);

        localStorage.setItem("user", JSON.stringify(user));

        fetch("http://localhost:5000/validate-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
        }).then(res => res.json()).then(data => {
            console.log("Validação do Token:", data);
            navigate("/profile");
        });
    };



    return(
        <Main>
            <Section>
                <Logo src={InvestMax} alt="" />
                <Campus>
                    <form action="">
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input type="email" placeholder="Digite seu email:"/>
                        </div>
                        <div>
                            <label htmlFor="password">Senha:</label>
                            <input type="password" placeholder="Digite sua senha:"/>
                        </div>
                        <button>Entrar</button>
                    </form>
                    <div>
                        <GoogleLogin onSuccess={handleSuccess} onError={() => console.log("Login failed")} auto_select={true}/>
                        <p>Ainda não tem ma conta?</p>
                        <a href="/registre-se">Cadastre-se</a>
                    </div>
                </Campus>
            </Section>
            
        </Main>
    )
}