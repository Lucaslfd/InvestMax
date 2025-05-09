import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (event) => {
        event.preventDefault();

        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nickname, email, password })
});


        const data = await response.json();
        if (data.status === "success") {
            console.log("Usuário cadastrado:", data);
            localStorage.setItem("user", JSON.stringify({ nickname, email }));
            navigate("/profile");
        } else {
            console.error("Erro no cadastro:", data.message);
        }
    };

    return (
        <div>
            <h2>Cadastre-se</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="nickname">Nickname:</label>
                    <input
                        type="text"
                        placeholder="Digite seu nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        placeholder="Digite seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Senha:</label>
                    <input
                        type="password"
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Registrar</button>
            </form>
            <p>Já tem uma conta?</p>
            <a href="/">Entrar</a>
        </div>
    );
}
