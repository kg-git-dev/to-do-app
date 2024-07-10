import { createUser, findUserByUsername } from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        await createUser(username, password);
        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '6h',
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { register, login };
