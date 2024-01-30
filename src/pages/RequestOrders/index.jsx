import React, { useEffect, useState } from 'react';

import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

import { CardRequest } from '../../components/CardRequest';
import { GoBack } from '../../components/GoBack';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Container, Content, RequestOrderAdminAccess, RequestOrder, Status, RequestOrderId, PlateDetails, Date, WrappedRequestOrder } from './styles';

export function RequestOrders() {

    const { user, isAdminAccess } = useAuth();

    const [requestorders, setRequestOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const querySizeWidth = 1050;
    const [windowSizeWidth, setWindowSizeWidth] = useState(window.innerWidth >= querySizeWidth);

    function handleResize() {
        setWindowSizeWidth(window.innerWidth >= querySizeWidth);
    };

    useEffect(() => {
        setIsLoading(true);

        async function fetchRequestOrders() {
            try {
                if (isAdminAccess) {
                    const response = await api.get("/requestorders");
                    setRequestOrders(response.data);
                    setIsLoading(false);
                } else {
                    const response = await api.get(`/requestorders/${user.id}`);
                    setRequestOrders(response.data);
                    setIsLoading(false);
                };
            } catch (error) {
                console.error("Erro ao buscar pela solicitação de pedidos:", error);
                toast("Não foi possível buscar pela solicitação de pedidos, tente novamente.");
            };
        };

        fetchRequestOrders();

        window.addEventListener("resize", handleResize);
    }, []);

    return (
        <Container>
            <Header />
            <Content>
                <GoBack />
                <div>
                    <h1>Histórico de Solicitação de pedidos</h1>
                    {
                        !isLoading && requestorders.length === 0 &&
                        (
                            isAdminAccess ? <p>Nenhum pedido registrado.</p> : <p>Você não possui nenhum pedido fechado.</p>
                        )
                    }
                    {
                        !isLoading && requestorders.length > 0 &&
                        <WrappedRequestOrder>
                            {
                                windowSizeWidth &&
                                (
                                    isAdminAccess ? (
                                        <RequestOrderAdminAccess>
                                            <Status><strong>Status</strong></Status>
                                            <RequestOrderId><strong>Código da Solicitação do Pedido</strong></RequestOrderId>
                                            <PlateDetails><strong>Detalhamento</strong></PlateDetails>
                                            <Date><strong>Data e hora</strong></Date>
                                        </RequestOrderAdminAccess>
                                    ) : (
                                        <RequestOrder>
                                            <Status><strong>Status</strong></Status>
                                            <RequestOrderId><strong>Código da Solicitação do Pedido</strong></RequestOrderId>
                                            <PlateDetails><strong>Detalhamento</strong></PlateDetails>
                                            <Date><strong>Data e hora</strong></Date>
                                        </RequestOrder>
                                    )
                                )
                            }
                            {
                                requestorders.map(requestorder =>
                                    <CardRequest data={requestorder} key={requestorder.id} />
                                )
                            }
                        </WrappedRequestOrder>
                    }
                </div>
            </Content>
            <Footer />
        </Container>
    );
}