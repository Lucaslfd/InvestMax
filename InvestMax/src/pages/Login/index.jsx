import { useEffect, useState } from "react";

export default function Login() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div>
            {user ? (
                <div>
                    <h2>Bem-vindo, {user.name}!</h2>
                    <img src={user.picture} alt="Foto do perfil" />
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <p>Usuário não autenticado</p>
            )}
        </div>
    );
}
