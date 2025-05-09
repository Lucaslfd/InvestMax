require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const app = express();
app.use(express.json());
app.use(cors());

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