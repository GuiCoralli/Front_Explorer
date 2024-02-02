import React, { useEffect, useRef, useState } from 'react';

import { api } from '../../services/api';

import { BsHexagonFill } from 'react-icons/bs'

import { Section } from '../../components/Section';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Container, Main, Logo, Form } from './styles';

export function AdminAccess() {
    const mainRef = useRef(null);
    const containerRef = useRef(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loadingSignUp, setLoadingSignUp] = useState(false);

    const handleSignUp = async () => {
        try {

        if (!name || !email || !password) {
            throw new Error("Complete todos os campos.");
        };

        if (name.length < 4) {
            throw new Error("O nome deve ter no mínimo 4 caracteres.");
        };

        const emailDefault = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailDefault.test(email)) {
            throw new Error("Por favor, coloque um email válido.");
        };

        if (password.length < 6) {
            throw new Error("A senha deve ter no mínimo 6 caracteres.");
        };

        setLoadingSignUp(true);
        api.post("/adminaccess", { name, email, password })
            .toast("Administrador cadastrado com sucesso!");
            setLoadingSignUp(false);
              
        } catch(error) {
            setLoadingSignUp(false);
        if (error.response) {
            toast(error.response.data.message);
        } else {
            toast("Não foi possível cadastrar.");
        }
    };
};

    const handleKeyPress = event => {
        if (event.key === "Enter") {
            handleSignUp();
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const containerHeight = mainRef.current.offsetHeight;
            const windowHeight = window.innerHeight;

            if (containerHeight > windowHeight) {
                containerRef.current.style.height = "auto";
            } else {
                containerRef.current.style.height = "100%";
            };
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
                <Logo>
                    <BsHexagonFill />
                    food explorer
                </Logo>
                    <Form>
                        <h1>Crie sua conta</h1>

                        <Section title="Seu nome">
                            <Input
                                placeholder="Exemplo: José de Oliveira"
                                onChange={e => setName(e.target.value)}
                            />
                        </Section>

                        <Section title="Email">
                            <Input
                                placeholder="Exemplo: exemplo@email.com.br"
                                onChange={e => setEmail(e.target.value)}
                            />
                        </Section>

                        <Section title="Senha">
                            <Input
                                type="password"
                                placeholder="No mínimo 6 caracteres"
                                onChange={e => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </Section>

                        <Button
                            onClick={handleSignUp}
                            loading={loadingSignUp}
                            title="Criar conta de administrador"
                        />
                    </Form>
            </Main>
            <ToastContainer autoClose={1500} draggable={false} />
        </Container>
    );
}


