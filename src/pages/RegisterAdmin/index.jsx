import React, { useEffect, useRef, useState } from 'react';

import { api } from '../../services/api';

import { BsHexagonFill } from 'react-icons/bs'

import { Section } from '../../components/Section';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

import { Toaster, toast } from 'react-hot-toast';;  // Importa a biblioteca do Toaster do react-hot-toast

import { Container, Main, Logo, Form } from './styles';

export function RegisterAdmin() {
    const mainRef = useRef(null);
    const containerRef = useRef(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loadingRegister, setLoadingRegister] = useState(false);


    function handleRegister() {
        if (!name || !email || !password) {
            return toast("Preencha todos os campos da página.");
        };

        if (name.length < 3) {
            return toast("O nome deve ter no mínimo 3 caracteres.");
        };

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return toast("Por favor, insira um email válido.");
        };

        if (password.length < 6) {
            return toast("A senha deve ter no mínimo 6 caracteres.");
        };

        setLoadingRegister(true);
        api.post("/admin", { name, email, password })
            .then(() => {
                setLoadingRegister(false);
                toast("Administrador cadastrado com sucesso!");

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch(error => {
                setLoadingRegister(false);
                if (error.response) {
                    toast(error.response.data.message);
                } else {
                    toast("Não foi possível cadastrar.");
                }
            });
    };

    function handleKeyPress(event) {
        if (event.key === "Enter") {
            handleRegister();
        };
    };

    useEffect(() => {
        function handleResize() {
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
                            placeholder="Exemplo: José de Oliveira Junior"
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
                            onClick={handleRegister}
                            loading={loadingRegister}
                            title="Criar conta de administrador"
                        />
                </Form>
            </Main>
            <Toaster />
        </Container>
    );
}
























/*
<ToastContainer autoClose={1500} draggable={false} />
*/

