import express from 'express';
import { UserRepository } from '../models/repository/user-repository';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);


const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    const { user } = req.session;
    res.json(user);
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserRepository.login ({ email, password });
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn:'1h'
        });
        res
            .cookie('access_token', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60
            })
            .send({ user }); 
    } catch(error) {
        res.status(400).send(error.message);
    };
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const id = await UserRepository.create({ email, password });
        res.send({ id });
    } catch(error) {
        res.status(400).send(error.message);
    }
});

app.post('/logout', async (req, res) => {
    res
        .clearCookie('access_token')
        .json({ message: 'Se cerró la sesión con éxito.' });
});

app.get('/protected', (req, res) => {
    const { user } = req.session;
    if (!user) return res.status(403).send('Acceso no autorizado.');
    res.render('protected', user);
});