"use client";

import styles from "./styles/page.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const router = useRouter();
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {

        const token = localStorage.getItem('token');
        if (token) {
            setHasToken(true);
        }
    }, []);

    const handleLoginClick = () => {
        if (hasToken) {
            router.push('/dashboard');
        } else {
            router.push('/login');
        }
    };

    const handleCadastroClick = () => {
        router.push('/cadastro');
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('token');
        setHasToken(false);
        router.push('/login');
    };

    return (
        <main className={styles.main_home}>
            <div className={styles.button_container_home}>

                <button className={styles.button_home} onClick={handleLoginClick}>
                    {hasToken ? "Go to Dashboard" : "Login"}
                </button>

                <button className={styles.button_home} onClick={handleCadastroClick}>
                    Cadastro
                </button>

                {hasToken && (
                    <button className={styles.button_logout_home} onClick={handleLogoutClick}>
                        Logout
                    </button>
                )}
            </div>
        </main>
    );
}
