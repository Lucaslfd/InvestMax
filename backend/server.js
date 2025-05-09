require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
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

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    picture: String,
    googleId: String
});
const User = mongoose.model("User", UserSchema);

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
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                googleId: payload.sub
            });
            await user.save();
        }

        res.json({ status: "success", user });
    } catch (error) {
        res.status(400).json({ status: "error", message: "Token inválido" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
