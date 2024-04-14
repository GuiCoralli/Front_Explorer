import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';

import { Logo } from '../../components/Logo';
import { Section } from '../../components/Section';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

import { Toaster, toast } from 'react-hot-toast';

import { Container, Main, Form } from './styles';

export function LogIn() {
    const { logIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loadingLogIn, setLoadingLogIn] = useState(false);

    const mainRef = useRef(null);
    const containerRef = useRef(null);
    const history = useNavigate();

    // Função para lidar com o retorno à página anterior
    const handleBack = () => {
        history.goBack();
        return handleBack();
    };

    // Função para lidar com o login
    const handleLogIn = async () => {
        setLoadingLogIn(true);
        try {
            await logIn({ email, password });
        } catch (error) {
            console.error("Aconteceu um erro ao fazer login:", error);
            toast.error("Erro ao fazer login. Por favor, tente novamente.");
        } finally {
            setLoadingLogIn(false);
        }
    };

    // Função para lidar com a ação de pressionar da tecla Enter
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleLogIn();
        }
    };

    // Efeito para ajustar a altura do container
    useEffect(() => {
        const handleResize = () => {
            const containerHeight = mainRef.current.offsetHeight;
            const windowHeight = window.innerHeight;

            containerRef.current.style.height = containerHeight > windowHeight ? "auto" : "100%";
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <Container ref={containerRef}>
            <Main ref={mainRef}>
                <Logo />
                <Form>
                    <h1>Faça o login</h1>
                    <Section title="Email">
                        <Input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </Section>
                    <Section title="Senha">
                        <Input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </Section>
                    <Button
                        onClick={handleLogIn}
                        loading={loadingLogIn}
                        title="Entrar"
                    />
                    <Link to="/register">Crie sua conta</Link>
                </Form>
            </Main>
            <Toaster />
        </Container>
    );
}
