import crypto from 'crypto';
import bcrypt from 'bcrypt';
import DBlocal from 'db-local';

const { Schema } = new DBlocal({ path:'./bd' });

const User = Schema('Schema', {
    _id: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
})

export class UserRepository {
    static async findByEmail(email) {
        const user = await User.findOne({ email });
        return user;
    };

    static async create({ email, password }) {
        Validation.email(email);
        Validation.password(password);

        const user = await User.findOne({ email });
        if (user) throw new Error('Email ya existente.');

        const id = crypto.randomUUID();

        // Hacer la contra hasheada.

        await User.create({
            _id: id, 
            email,
            password
        }).save();

        return id;
    };

    static async login({ email, password }) {
        Validation.email(email);
        Validation.password(password);

        const user = await User.findOne({ email });
        if (!user) throw new Error('Usuario inexistente. Por favor registrese.');

        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) throw new Error('Contraseña invalida.');

        const { password:_, ...publicUser} = user;

        return publicUser;
    }
};

class Validation {
    static email(email) {
        if (typeof email !== 'string') throw new Error('El email debe ser un string.');
        if (email.length === 0) throw new Error('El email no puede estar vacío.')
        if (!email.includes('@')) throw new Error('El email debe contener un "@".');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('El emanil no es válido.');
        }
    }

    static password(password) {
        if (typeof password !== 'string') throw new Error('La contraseña debe ser un string.');
        if (password.length < 4) throw new Error('La contraseña debe tener más de 3 caracteres.');
    }
};