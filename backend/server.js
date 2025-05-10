require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Erro ao conectar ao MongoDB:", err));

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
const SECRET_KEY = process.env.JWT_SECRET || "chave_super_secreta";


const UserSchema = new mongoose.Schema({
    nickname: String,
    email: String,
    password: String,
    picture: String,
    googleId: String
});

const User = mongoose.model("User", UserSchema);

app.post("/register", async (req, res) => {
    const { nickname, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: "error", message: "Email já cadastrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ 
            nickname, 
            email, 
            password: hashedPassword,
            picture: "https://www.gravatar.com/avatar/?d=mp"
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "7d" });

        res.json({ status: "success", token, user });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Erro ao registrar usuário" });
    }
});

app.get("/user/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ status: "error", message: "Usuário não encontrado" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ status: "error", message: "Erro ao buscar usuário" });
    }
});


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.put("/edit-profile/:id", upload.single("picture"), async (req, res) => {
    const { id } = req.params;
    const { nickname, email, password } = req.body;
    const picture = req.file ? `/uploads/${req.file.filename}` : null;

    console.log("🔎 Buscando usuário no banco com ID:", id);

    try {
        const user = await User.findById(id);
        console.log("👤 Usuário encontrado antes da edição:", user);

        if (!user) {
            console.log("❌ Usuário não encontrado no banco!");
            return res.status(404).json({ status: "error", message: "Usuário não encontrado" });
        }

        if (nickname) user.nickname = nickname;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (picture) user.picture = picture;

        console.log("✏️ Usuário após edição antes de salvar:", user);

        await user.save();

        console.log("✅ Usuário salvo no MongoDB:", user);

        res.json({ status: "success", message: "Perfil atualizado com sucesso!", user });
    } catch (error) {
        console.error("❌ Erro ao atualizar perfil:", error);
        res.status(500).json({ status: "error", message: "Erro ao atualizar perfil" });
    }
});





app.use("/uploads", express.static(path.join(__dirname, "uploads")));




app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: "error", message: "Usuário não encontrado" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ status: "error", message: "Senha incorreta" });
        }

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "7d" });

        res.json({ status: "success", token, user });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Erro ao fazer login" });
    }
});



// para criar um id para login com google
// app.post("/add-user", async (req, res) => {
//     const { nickname, email } = req.body;

//     try {
//         const newUser = new User({
//             nickname,
//             email
//         });

//         await newUser.save();

//         console.log("✅ Novo usuário criado:", newUser);

//         res.json({ status: "success", user: newUser });
//     } catch (error) {
//         console.error("❌ Erro ao criar usuário:", error);
//         res.status(500).json({ status: "error", message: "Erro ao criar usuário" });
//     }
// });

//acessar o id gerado
// axios.post("http://localhost:5000/add-user", { nickname, email })
//     .then(res => {
//         console.log("Usuário criado com ID:", res.data.user._id);
//     })
//     .catch(err => {
//         console.error("Erro ao criar usuário:", err);
//     });


app.post("/validate-token", async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });

        const payload = ticket.getPayload();

        let user = await User.findOne({ googleId: payload.sub });
        if (!user) {
            user = new User({
                nickname: payload.name,
                email: payload.email,
                picture: payload.picture,
                googleId: payload.sub
            });
            await user.save();
        }

        const jwtToken = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "7d" });

        res.json({ status: "success", token: jwtToken, user });
    } catch (error) {
        res.status(400).json({ status: "error", message: "Token inválido" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));