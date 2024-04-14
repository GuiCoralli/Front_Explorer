import React, { useEffect, useState } from 'react';

import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { BackButton } from '../../components/BackButton';
import { CardRequest } from '../../components/CardRequest';

import { toast } from 'react-hot-toast';;  // Importa a biblioteca do Toaster do react-hot-toast

import { Container, Content, RequestAdmin, Request, Status, RequestId, Items, Date, WrappedRequest } from './styles';

export function Requests() {

    const { user, isAdmin } = useAuth();

    const [requests, setRequests] = useState([]);
    const [isLoadingFoods, setIsLoadingFoods] = useState(true);

    const queryWidth = 1050;
    const [windowWidth, setWindowWidth] = useState(window.innerWidth >= queryWidth);

    function handleResize() {
        setWindowWidth(window.innerWidth >= queryWidth);
    };

    useEffect(() => {
        setIsLoadingFoods(true);

        async function fetchRequests() {
            try {
                if (isAdmin) {
                    const response = await api.get("/requests");
                    setRequests(response.data);
                    setIsLoadingFoods(false);
                } else {
                    const response = await api.get(`/orders/${user.id}`);
                    setOrders(response.data);
                    setIsLoadingFoods(false);
                };
            } catch (error) {
                console.error("Aconteceu um erro ao buscar os pedidos:", error);
                toast("Erro ao buscar os pedidos. Por favor, tente novamente.");
            };
        };

        fetchRequests();

        window.addEventListener("resize", handleResize);
    }, []);

    return (
        <Container>
            <Header />
            <Content>
                <BackButton />
                <div>
                    <h1>Histórico de pedidos</h1>
                    {
                        !isLoadingFoods && requests.length === 0 &&
                        (
                            isAdmin ? 
                            <p>Nenhum pedido registrado.</p> :
                             <p>Você ainda não tem nenhum pedido fechado.</p>
                        )
                    }
                    {
                        !isLoadingFoods && requests.length > 0 &&
                        <WrappedRequest>
                            {
                                windowWidth &&
                                (
                                    isAdmin ? (
                                        <RequestAdmin>
                                            <Status><strong>Status</strong></Status>
                                            <RequestId><strong>Código</strong></RequestId>
                                            <Items><strong>Detalhamento</strong></Items>
                                            <Date><strong>Data e hora</strong></Date>
                                        </RequestAdmin>
                                    ) : (
                                        <Request>
                                            <Status><strong>Status</strong></Status>
                                            <RequestId><strong>Código</strong></RequestId>
                                            <Items><strong>Detalhamento</strong></Items>
                                            <Date><strong>Data e hora</strong></Date>
                                        </Request>
                                    )
                                )
                            }
                            {
                                requests.map(request =>
                                    <CardRequest data={request} key={request.id} />
                                )
                            }
                        </WrappedRequest>
                    }
                </div>
            </Content>
            <Footer />
        </Container>
    );
}