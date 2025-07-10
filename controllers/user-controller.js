import express from 'express';
import { UserRepository } from '../models/repository/user-repository';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    const { user } = req.session;
    res.json(user);
});

app.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserRepository.login ({ email, password });
        res.send({ user }); //Hacer lo de JWT y cookies aca.
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
    //limpiar la cookie aca arriba.
    res.json({ message: 'Se cerró la sesión con éxito.' })
});

app.get('/protected', (req, res) => {
    const { user } = req.session;
    if (!user) return res.status(403).send('Acceso no autorizado.');
    res.render('protected', user);
});