import express from 'express';

const app = express();

app.use(express.json());


app.get('/', (req, res) => {
    const { user } = req.session;
    res.json(user);
});