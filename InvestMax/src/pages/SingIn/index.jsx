import { Campus, Logo, Main, Section } from "./style";
import InvestMax from "../../assets/InvestMax.png";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SingIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Login com Google
    const handleSuccess = (credentialResponse) => {
        const token = credentialResponse.credential;
        const user = jwtDecode(token);
        console.log("Usuário autenticado (Google):", user);

        localStorage.setItem("user", JSON.stringify(user));

        fetch("http://localhost:5000/validate-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
        })
        .then(res => res.json())
        .then(data => {
            console.log("Validação do Token:", data);
            navigate("/profile");
        });
    };

    // Login com email e senha
    const handleLoginEmailSenha = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log("Resposta do servidor:", data);

    if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Usuário salvo no localStorage:", data.user);
        navigate("/profile");
    } else {
        console.error("Erro no login:", data.message);
    }
};

    return (
        <Main>
            <Section>
                <Logo src={InvestMax} alt="" />
                <Campus>
                    <form onSubmit={handleLoginEmailSenha}>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                placeholder="Digite seu email:"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Senha:</label>
                            <input
                                type="password"
                                placeholder="Digite sua senha:"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Entrar</button>
                    </form>
                    <div>
                        <GoogleLogin onSuccess={handleSuccess} onError={() => console.log("Login failed")} auto_select={true} />
                        <p>Ainda não tem uma conta?</p>
                        <a href="/register">Cadastre-se</a>
                    </div>
                </Campus>
            </Section>
        </Main>
    );
}
