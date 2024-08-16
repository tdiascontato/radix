// radix/next-radix/src/app/cadastro/page.js
"use client";
import { useState } from 'react';
import { registerUser } from '../datas/api';
import styles from '../styles/cadastro.module.css';
import {useRouter} from "next/navigation";

export default function Cadastro() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await registerUser(email, password);
            setMessage('User registered successfully');
        } catch (error) {
            setMessage(`Registration failed: ${error.error || error.message}`);
        }
    };

    return (
        <main className={styles.main_cadastro}>
            <h1>Cadastro</h1>
            <button onClick={() => router.push('/')} className={styles.backButton_cadastro}>Voltar para Home</button>
            <form onSubmit={handleSubmit} className={styles.form_cadastro}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </main>
    );
}
