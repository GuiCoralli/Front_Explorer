import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

import { PiCheckCircleLight } from 'react-icons/pi';
import { FaRegCreditCard } from 'react-icons/fa';
import { TfiReceipt } from 'react-icons/tfi';
import { MdPix } from 'react-icons/md';
import moment from 'moment-timezone';

import defaultPlate from '../../../src/assets/plate.svg';
import qrcode from '../../../src/assets/qrcode.png';

import { CardPayment } from '../../components/CardPayment';
import { Button  } from '../../components/Button';
import { GoBack } from '../../components/GoBack';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

import { ConfirmationRequest  } from '../../components/ConfirmationRequest';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Container, Content, WrappedRequestPayment, RequestOrder, RequestItemOrder, FormOfPayment, WrappedFormOfPayment, 
    ItemInformation,  PaymentTitle, PaymentType, ProcessingPayment, PaymentAccept, Total, Clock } from './styles';

export function RequestPayment() {
    const { user, order } = useAuth();

    const navigate = useNavigate();

    const [selectedPayment, setSelectedPayment] = useState("pix");
    const [items, setItems] = useState([]);
    const [totalRequestOrder, setTotalRequestOrder] = useState(0);
    const [plates, setPlates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cardNumber, setCardNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [verifyingDigit, setVerifyingDigit] = useState("");
    const [paymentData, setPaymentData] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [paymentAccept, setPaymentAccept] = useState(false);
    const querySizeWidth = 1050;
    const [windowSizeWidth, setWindowSizeWidth] = useState(window.innerWidth);
    const [viewRequestOrder, setViewRequestOrder] = useState(true);
    const [viewPayment, setViewPayment] = useState(false);

    const formatCardNumber = (cardNumber) => {
        const cleanNumber = cardNumber.replace(/\D/g, "");
        const formattedNumber = cleanNumber.replace(/(.{4})/g, "$1 ");

        return formattedNumber.trim().slice(0, 19);
    };

    const handleCardNumberChange = (event) => {
        const inputNumber = event.target.value;
        const formattedNumber = formatCardNumber(inputNumber);

        setCardNumber(formattedNumber);
    };

    const formatExpirationDate = (expirationDate) => {
        const cleanedNumber = expirationDate.replace(/\D/g, "");
        const groups = cleanedNumber.match(/.{1,2}/g);

        if (groups) {
            return groups.join("/");
        };

        return "";
    };

    const handleExpirationDateChange = (event) => {
        const newNumber = event.target.value;
        const formattedNumber = formatExpirationDate(newNumber);

        setExpirationDate(formattedNumber);
    };

    const formatVerifyingDigit = (verifyingDigit) => {
        const cleanNumber = verifyingDigit.replace(/\D/g, "");
        const formattedNumber = cleanNumber.replace(/(.{4})/g, "$1 ");

        return formattedNumber.trim().slice(0, 19);
    };

    const handleVerifyingDigitChange = (event) => {
        const inputNumber = event.target.value;
        const formattedNumber = formatVerifyingDigit(inputNumber);

        setVerifyingDigit(formattedNumber);
    };

    const handlePaymentSelection = (payment) => {
        setSelectedPayment(payment);
    };

    function viewTotalRequestOrder(orderPlates) {
        let total = 0;
        setTotalRequestOrder(0);
        const plateQuantity = {};
        const oldItems = JSON.parse(localStorage.getItem("@foodexplorer:order"));

        oldItems.plates.forEach(plate => {
            plateQuantity[plate.plate_id] = plate.quantity;
        });

        const updatedRequestOrder = RequestOrder.map(requestorderPlate => {
            if (plateQuantity[requestorderPlate.id] > 0) {
                const plateTotal = plateQuantity[requestorderPlate.id] * requestorderPlate.price;
                setTotalRequestOrder(total += plateTotal);

                return {
                    id: requestorderPlate.id,
                    image: requestorderPlate.image,
                    Quantity: plateQuantity[requestorderPlate.id],
                    name: requestorderPlate.name,
                    price: plateTotal
                };
            };
        }).filter(item => item !== undefined);

        setItems(updatedRequestOrder);
    };

    async function deleteItem(plate_id) {
        const confirmed = await new Promise((resolve) => {

            const customId = "deleteItem";

            toast(
                <ConfirmationRequest 
                    message={"Quer realmente remover este item do pedido?"}
                    confirm={"Remover"}
                    cancel={"Cancelar"}
                    onConfirm={() => resolve(true)}
                    onCancel={() => resolve(false)}
                />, {
                toastId: customId,
                containerId: "await"
            });
        });

        if (confirmed) {
            const oldItems = JSON.parse(localStorage.getItem("@foodexplorer:order"));
            const newItems = oldItems.plates.filter(item => item.plate_id !== plate_id);
            const order = {
                user_id: user.id,
                status: "aberto",
                plates: newItems
            };
            localStorage.setItem("@foodexplorer:order", JSON.stringify(order));
            toast("Item foi removido.", { containerId: "autoClose" });
            viewTotalRequestOrder(plates);
        };
    };

    function handleOpenPayment() {
        setViewRequestOrder(false);
        setViewPayment(true);
    };

    function handleOpenOrder() {
        setViewRequestOrder(true);
        setViewPayment(false);
    };

    function handleResize() {
        setWindowSizeWidth(window.innerWidth);
    };

    async function handleCreateOrder() {
        const confirmed = await new Promise((resolve) => {

            const customId = "createOrder";

            toast(
                <ConfirmationRequest 
                    message={"Você deseja fechar o pedido e realizar o pagamento?"}
                    confirm={"Sim"}
                    cancel={"Cancelar"}
                    onConfirm={() => resolve(true)}
                    onCancel={() => resolve(false)}
                />, {
                toastId: customId,
                containerId: "await"
            });
        });

        if (confirmed) {
            const order = JSON.parse(localStorage.getItem("@foodexplorer:order"));
            order.status = "Pendente";

            const dateOrder = moment();
            const dateOrderUTC = dateOrder.utc().format();
            order.orders_at = dateOrderUTC;

            setProcessingPayment(true);

            api.post("/requestorders", { order })
                .then(() => {
                    setProcessingPayment(false);
                    setPaymentAccept(true);

                    const order = {
                        user_id: user.id,
                        status: "aberto",
                        plates: []
                    };

                    localStorage.setItem("@foodexplorer:order", JSON.stringify(order));

                    setTotalRequestOrder(0);
                    setViewRequestOrder(false);

                    setTimeout(() => {
                        navigate("/requestorders");
                    }, 3000);
                })
                .catch((error) => {
                    setProcessingPayment(false);
                    console.error("Ocorreu um erro ao criar o pedido:", error);
                    toast("Ocorreu um erro ao criar o pedido. Por favor, tente novamente.");
                });
        };
    };

    useEffect(() => {
        const formattedCardNumber = cardNumber.replace(/\D/g, "").length;
        const formattedExpirationDate = expirationDate.replace(/\D/g, "").length;
        const formattedVerifyingDigit = verifyingDigit.length;

        if (formattedCardNumber === 16 && formattedExpirationDate === 4 && formattedVerifyingDigit === 3) {
            setPaymentData(true);
        } else {
            setPaymentData(false);
        };

    }, [cardNumber, expirationDate, verifyingDigit]);

    useEffect(() => {
        if (windowSizeWidth >= querySizeWidth) {
            if (paymentAccept) {
                setViewRequestOrder(false);
                setViewPayment(true);
            } else {
                setViewRequestOrder(true);
                setViewPayment(true);
            };
        } else {
            if (viewRequestOrder && viewPayment) {
                setViewRequestOrder(true);
                setViewPayment(false);
            } else if (!viewRequestOrder && viewPayment) {
                setViewRequestOrder(false);
                setViewPayment(true);
            } else {
                setViewRequestOrder(true);
                setViewPayment(false);
            };
        };

    }, [windowSizeWidth]);

    useEffect(() => {
        setIsLoading(true);

        if (order) {
            const oldItems = JSON.parse(localStorage.getItem("@foodexplorer:order"));
            const plateIds = oldItems.plates.map(plate => plate.plate_id);

            async function fetchPlates() {
                try {
                    const response = await api.get(`/payment?plateIds=${plateIds}`);
                    setPlates(response.data);
                    viewTotalRequestOrder(response.data);
                    setIsLoading(false);
                } catch (error) {
                    console.error("Erro ao buscar por pedido:", error);
                    toast("Ocorreu um erro ao buscar por seu pedido, tente novamente.");
                };
            };

            if (plateIds.length === 0) {
                return setIsLoading(false);
            };

            fetchPlates();

            window.addEventListener("resize", handleResize);
        };
    }, []);

    return (
        <Container>
            <Header totalRequestOrder={totalRequestOrder} />
            <Content>
                <GoBack />
                <WrappedRequestPayment
                    style={items.length === 0 ? { justifyContent: "left" } : { justifyContent: "center" }}
                 >
                    {viewRequestOrder && (
                        <RequestOrder>
                            <h2>Meu pedido</h2>
                            {items.length > 0 ? (
                                items.map(item => (
                                    <RequestItemOrder key={item.id}>
                                        <img
                                            src={item.image ? `${api.defaults.baseURL}/files/${item.image}` : defaultPlate}
                                            alt={item.name}
                                        />
                                        <ItemInformation>
                                            <div>
                                                <strong>{`${item.quantity} x ${item.name}`}</strong>
                                                <span>R$ {item.price.toFixed(2).replace(".", ",")}</span>
                                            </div>
                                            <div onClick={() => deleteItem(item.id)}>Excluir</div>
                                        </ItemInformation>
                                    </RequestItemOrder>
                                ))
                            ) : null}
                            {!isLoading && (
                                items.length > 0 ? (
                                    <Total>
                                        <div>Total: R$ {totalRequestOrder.toFixed(2).replace(".", ",")}</div>
                                        <Button onClick={handleOpenPayment}>Avançar</Button>
                                    </Total>
                                ) : null
                            )}
                            {!isLoading && (
                                items.length === 0 ? <p>Nenhum item foi adicionado.</p> : null
                            )}
                        </RequestOrder>
                    )}
                    {!isLoading && viewPayment && items.length > 0 && (
                        <FormOfPayment>
                            <h2>Pagamento</h2>
                            <WrappedFormOfPayment>
                                <PaymentTitle>
                                    <div
                                        className={selectedPayment === "pix" ? "active" : ""}
                                        onClick={() => handlePaymentSelection("pix")}
                                    >
                                        <MdPix />PIX
                                    </div>
                                    <div
                                        className={selectedPayment === "creditcard" ? "active" : ""}
                                        onClick={() => handlePaymentSelection("creditcard")}
                                    >
                                        <FaRegCreditCard />Crédito
                                    </div>
                                </PaymentTitle>
                                {selectedPayment === "pix" && (
                                    <PaymentType className="pix">
                                        <img src={qrcode} alt="QrCode" />
                                    </PaymentType>
                                )}
                                {selectedPayment === "creditcard" && !processingPayment && !paymentAccept && (
                                    <PaymentType className="creditcard">
                                        <div>
                                            <CardPayment title="Número do Cartão">
                                                <input
                                                    onChange={handleCardNumberChange}
                                                    placeholder="0000 0000 0000 0000"
                                                    type="text"
                                                    id="cardNumber"
                                                    value={cardNumber}
                                                    maxLength={19}
                                                />
                                            </CardPayment>
                                        </div>
                                        <div>
                                            <CardPayment title="Validade">
                                                <input
                                                    placeholder="08/28"
                                                    type="text"
                                                    id="expirationDate"
                                                    value={expirationDate}
                                                    onChange={handleExpirationDateChange}
                                                    maxLength={5}
                                                />
                                            </CardPayment>
                                        </div>
                                        <div>
                                            <CardPayment title="CVC">
                                                <input
                                                    placeholder="000"
                                                    type="text"
                                                    id="verifyingDigit"
                                                    value={verifyingDigit}
                                                    onChange={handleVerifyingDigitChange}
                                                    maxLength={3}
                                                />
                                            </CardPayment>
                                        </div>
                                        <div>
                                            <Button
                                                disabled={!paymentData}
                                                onClick={handleCreateOrder}
                                            ><TfiReceipt /> Finalizar pagamento</Button>
                                        </div>
                                    </PaymentType>
                                )}
                                {
                                    selectedPayment === "creditcard" && processingPayment &&
                                    <ProcessingPayment>
                                        <Clock>
                                            <div className="hour-hand"></div>
                                            <div className="minute-hand"></div>
                                        </Clock>
                                        <span> Processando o pagamento...</span>
                                    </ProcessingPayment>
                                }
                                {
                                    selectedPayment === "creditcard" && paymentAccept &&
                                    <PaymentAccept>
                                        <PiCheckCircleLight size={96} />
                                        <span>Pagamento aprovado!</span>
                                        <p>Acompanhe seu pedido clicando <Link to="/requestorders"> aqui</Link>, ou aguarde para ser redirecionado.</p>
                                    </PaymentAccept>
                                }
                                {
                                    !processingPayment && !paymentAccept &&
                                    <div className="openOrderButton">
                                        <Button onClick={handleOpenOrder}>Voltar</Button>
                                    </div>
                                }
                            </WrappedFormOfPayment>
                        </FormOfPayment>
                    )}
                </WrappedRequestPayment>
            </Content>
            <Footer />
            <ToastContainer enableMultiContainer containerId={"await"} autoClose={false} draggable={false} />
            <ToastContainer enableMultiContainer containerId={"autoClose"} autoClose={1500} draggable={false} />
        </Container>
    );
}