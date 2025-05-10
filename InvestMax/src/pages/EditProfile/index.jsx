import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState({ nickname: "", email: "" });
    const [password, setPassword] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
    if (!token) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            navigate(`/edit-profile/${user._id}`);
        } else {
            navigate("/login");
        }
        return;
    }

    axios.get(`http://localhost:5000/user/${id}`)
        .then(res => {
            console.log("Usuário recebido do backend:", res.data); 
            setUser(res.data);
        })
        .catch(err => {
            console.error("Erro ao buscar usuário:", err);
            navigate("/login");
        });
}, [id, token, navigate]);


    const handleUpdate = async (e) => {
    e.preventDefault();

    if (!id) {
        alert("Erro: ID do usuário não encontrado!");
        return;
    }

    try {
        const formData = new FormData();
        formData.append("nickname", user.nickname);
        formData.append("email", user.email);
        formData.append("password", password);

        if (user.picture && user.picture instanceof File) { // Garante que é um arquivo
            formData.append("picture", user.picture);
        }

        await axios.put(`http://localhost:5000/edit-profile/${id}`, formData, { 
            headers: { 
                Authorization: `Bearer ${token}`, 
                "Content-Type": "multipart/form-data" 
            } 
        });

        alert("Perfil atualizado com sucesso!");
        navigate("/profile");
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error.response?.data || error.message);
        alert("Erro ao atualizar perfil");
    }
};





    

    return (
        <div>
            <h2>Editar Perfil</h2>
            <form onSubmit={handleUpdate}>
    <label>
        Nickname:
        <input 
            type="text" 
            value={user.nickname} 
            onChange={(e) => setUser({ ...user, nickname: e.target.value })} 
        />
    </label>
    <label>
        Email:
        <input 
            type="email" 
            value={user.email} 
            onChange={(e) => setUser({ ...user, email: e.target.value })} 
        />
    </label>
    <label>
        Nova Senha:
        <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
        />
    </label>
    <label>
    Foto de Perfil:
    <input 
        type="file" 
        onChange={(e) => setUser({ ...user, picture: e.target.files[0] })} 
    />
</label>

    <button type="submit">Salvar Alterações</button>
    <Link to={"/profile"}>Cancelar</Link>
</form>
        </div>
    );
};

export default EditProfile;
