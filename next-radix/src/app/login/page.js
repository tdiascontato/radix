// radix/next-radix/src/app/login/page.js
"use client";
import { useState } from 'react';
import { loginUser } from '../datas/api';
import styles from '../styles/login.module.css';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(email, password);
            setMessage('Login successful');
            localStorage.setItem('token', data.token);
            router.push('/');
        } catch (error) {
            setMessage(`Login failed: ${error.error || error.message}`);
        }
    };

    return (
        <main className={styles.main_login}>
            <h1>Login</h1>
            <button onClick={() => router.push('/')} className={styles.backButton_login}>Voltar para Home</button>
            <form onSubmit={handleSubmit} className={styles.form_login}>
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
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </main>
    );
}
