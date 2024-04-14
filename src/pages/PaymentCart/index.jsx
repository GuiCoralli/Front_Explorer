import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

import { MdPix } from 'react-icons/md';
import { PiCheckCircleLight } from 'react-icons/pi';
import { FaRegCreditCard } from 'react-icons/fa';
import { TfiReceipt } from 'react-icons/tfi';
import moment from 'moment-timezone';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { BackButton } from '../../components/BackButton';
import { CreditcardArea } from '../../components/CreditcardArea';
import { Button } from '../../components/Button';
import defaultFood from '../../assets/food.svg';
import qrcode from '../../../src/assets/qrcode.png';

import { Toaster, toast } from 'react-hot-toast';;  // Importa a biblioteca do Toaster do react-hot-toast

import { Container, 
        Content, 
        WrappedPayment, 
        Request, 
        Total, 
        ItemRequest, 
        ItemInformation, 
        PaymentMethods, 
        WrappedPaymentMethods, 
        PaymentTitle, 
        PaymentType, 
        ProcessingPaymentMethods, 
        Clock, 
        PaymentComplete 
    } from './styles';

export function PaymentCart() {
    const { user, request } = useAuth();

    const navigate = useNavigate();

    const [selectedPayment, setSelectedPayment] = useState("pix");
    const [items, setItems] = useState([]);
    const [totalRequest, setTotalRequest] = useState(0);
    const [foods, setFoods] = useState([]);
    const [isLoadingFoods, setIsLoadingFoods] = useState(true);
    const [cardNumber, setCardNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [verifyingDigit, setVerifyingDigit] = useState("");
    const [paymentData, setPaymentData] = useState(false);
    const [processingPaymentMethods, setProcessingPaymentMethods] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const queryWidth = 1050;
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [viewRequest, setViewRequest] = useState(true);
    const [viewPaymentMethods, setViewPaymentMethods] = useState(false);

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

    function viewTotalRequest(requestFoods) {
        let total = 0;
        setTotalRequest(0);
        const foodAmount = {};
        const oldItems = JSON.parse(localStorage.getItem("@foodexplorer:request"));

        oldItems.foods.forEach(food => {
            foodAmount[food.food_id] = food.amount;
        });

        const updatedRequest = requestFoods.map(requestFood => {
            if (foodAmount[requestFood.id] > 0) {
                const foodTotal = foodAmount[requestFood.id] * requestFood.price;
                setTotalRequest(total += foodTotal);

                return {
                    id: requestFood.id,
                    image: requestFood.image,
                    amount: foodAmount[requestFood.id],
                    name: requestFood.name,
                    price: requestTotal
                };
            };
        }).filter(item => item !== undefined);

        setItems(updatedRequest);
    };

    async function deleteItem(food_id) {
        const confirmed = await new Promise((resolve) => {

            const customId = "deleteItem";

            toast(
                <Toaster
                    message={"Deseja realmente remover este item do pedido?"}
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
            const oldItems = JSON.parse(localStorage.getItem("@foodexplorer:request"));
            const newItems = oldItems.foods.filter(item => item.food_id !== food_id);
            const request = {
                user_id: user.id,
                status: "aberto",
                foods: newItems
            };
            localStorage.setItem("@foodexplorer:request", JSON.stringify(request));
            toast("Item removido.", { containerId: "autoClose" });
            viewTotalRequest(foods);
        };
    };

    function handleOpenPayment() {
        setViewRequest(false);
        setViewPaymentMethods(true);
    };

    function handleOpenRequest() {
        setViewRequest(true);
        setViewPaymentMethods(false);
    };

    function handleResize() {
        setWindowWidth(window.innerWidth);
    };

    async function handleCreateRequest() {
        const confirmed = await new Promise((resolve) => {

            const customId = "createRequest";

            toast(
                <ConfirmationToast
                    message={"Deseja realmente fechar a solicitação do pedido e realizar o pagamento?"}
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
            const request = JSON.parse(localStorage.getItem("@foodexplorer:request"));
            request.status = "Pendente";

            const dateRequest = moment();
            const dateRequestUTC = dateRequest.utc().format();
            request.requests_at = dateRequestUTC;

            setProcessingPaymentMethods(true);

            api.post("/requests", { request })
                .then(() => {
                    setProcessingPaymentMethods(false);
                    setPaymentComplete(true);

                    const request = {
                        user_id: user.id,
                        status: "aberto",
                        foods: []
                    };

                    localStorage.setItem("@foodexplorer:request", JSON.stringify(request));

                    setTotalRequest(0);
                    setViewRequest(false);

                    setTimeout(() => {
                        navigate("/requests");
                    }, 3000);
                })
                .catch((error) => {
                    setProcessingPaymentMethods(false);
                    console.error("Aconteceu um erro ao criar o pedido:", error);
                    toast("Erro ao criar a solicitação do pedido. Por favor, tente novamente.");
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
        if (windowWidth >= queryWidth) {
            if (paymentComplete) {
                setViewRequest(false);
                setViewPaymentMethods(true);
            } else {
                setViewRequest(true);
                setViewPaymentMethods(true);
            };
        } else {
            if (viewRequest && viewPaymentMethods) {
                setViewRequest(true);
                setViewPaymentMethods(false);
            } else if (!viewRequest && viewPaymentMethods) {
                setViewRequest(false);
                setViewPaymentMethods(true);
            } else {
                setViewRequest(true);
                setViewPaymentMethods(false);
            };
        };

    }, [windowWidth]);

    useEffect(() => {
        setIsLoadingFoods(true);

        if (request) {
            const oldItems = JSON.parse(localStorage.getItem("@foodexplorer:request"));
            const foodIds = oldItems.foods.map(food => food.food_id);

            async function fetchFoods() {
                try {
                    const response = await api.get(`/payment?foodIds=${foodIds}`);
                    setFoods(response.data);
                    viewTotalRequest(response.data);
                    setIsLoadingFoods(false);
                } catch (error) {
                    console.error("Aconteceu um erro ao buscar o pedido:", error);
                    toast("Erro ao buscar o pedido. Por favor, tente novamente.");
                };
            };

            if (foodIds.length === 0) {
                return setIsLoadingFoods(false);
            };

            fetchFoods();

            window.addEventListener("resize", handleResize);
        };
    }, []);

    return (
        <Container>
            <Header totalRequest={totalRequest} />
            <Content>
                <BackButton />
                <WrappedPayment
                    style={items.length === 0 ? { justifyContent: "left" } : { justifyContent: "center" }}
                >
                    {viewRequest && (
                        <Request>
                            <h2>Meu pedido</h2>
                            {items.length > 0 ? (
                                items.map(item => (
                                    <ItemRequest key={item.id}>
                                        <img
                                            src={item.image ? `${api.defaults.baseURL}/files/${item.image}` : defaultFood}
                                            alt={item.name}
                                        />
                                        <ItemInformation>
                                            <div>
                                                <strong>{`${item.amount} x ${item.name}`}</strong>
                                                <span>R$ {item.price.toFixed(2).replace(".", ",")}</span>
                                            </div>
                                            <div onClick={() => deleteItem(item.id)}>Excluir</div>
                                        </ItemInformation>
                                    </ItemRequest>
                                ))
                            ) : null}
                            {!isLoadingFoods && (
                                items.length > 0 ? (
                                    <Total>
                                        <div>Total: R$ {totalRequest.toFixed(2).replace(".", ",")}</div>
                                        <Button onClick={handleOpenPayment}>Avançar</Button>
                                    </Total>
                                ) : null
                            )}
                            {!isLoadingFoods && (
                                items.length === 0 ? <p>Nenhum item adicionado.</p> : null
                            )}
                        </Request>
                    )}
                    {!isLoadingFoods && viewPaymentMethods && items.length > 0 && (
                        <PaymentMethods>
                            <h2>Pagamento</h2>
                            <WrappedPaymentMethods>
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
                                {selectedPayment === "creditcard" && !processingPaymentMethods && !paymentComplete && (
                                    <PaymentType className="creditcard">
                                        <div>
                                            <CreditcardArea title="Número do Cartão">
                                                <input
                                                    onChange={handleCardNumberChange}
                                                    placeholder="0000 0000 0000 0000"
                                                    type="text"
                                                    id="cardNumber"
                                                    value={cardNumber}
                                                    maxLength={19}
                                                />
                                            </CreditcardArea>
                                        </div>
                                        <div>
                                            <CreditcardArea title="Validade">
                                                <input
                                                    placeholder="04/25"
                                                    type="text"
                                                    id="expirationDate"
                                                    value={expirationDate}
                                                    onChange={handleExpirationDateChange}
                                                    maxLength={5}
                                                />
                                            </CreditcardArea>
                                        </div>
                                        <div>
                                            <CreditcardArea title="CVC">
                                                <input
                                                    placeholder="000"
                                                    type="text"
                                                    id="verifyingDigit"
                                                    value={verifyingDigit}
                                                    onChange={handleVerifyingDigitChange}
                                                    maxLength={3}
                                                />
                                            </CreditcardArea>
                                        </div>
                                        <div>
                                            <Button
                                                disabled={!paymentData}
                                                onClick={handleCreateRequest}
                                            ><TfiReceipt />Finalizar pagamento</Button>
                                        </div>
                                    </PaymentType>
                                )}
                                {
                                    selectedPayment === "creditcard" && processingPaymentMethods &&
                                    <ProcessingPaymentMethods>
                                        <Clock>
                                            <div className="hour-hand"></div>
                                            <div className="minute-hand"></div>
                                        </Clock>
                                        <span>Estamos processando o pagamento...</span>
                                    </ProcessingPaymentMethods>
                                }
                                {
                                    selectedPayment === "creditcard" && paymentComplete &&
                                    <PaymentComplete>
                                        <PiCheckCircleLight size={96} />
                                        <span>Pagamento Completo!</span>
                                        <p>Você pode acompanhar a solicitação dos seus pedidos clicando <Link to="/requests">aqui</Link>, ou aguarde para ser redirecionado.</p>
                                    </PaymentComplete>
                                }
                                {
                                    !processingPaymentMethods && !paymentComplete &&
                                    <div className="openRequestButton">
                                        <Button onClick={handleOpenRequest}>Voltar</Button>
                                    </div>
                                }
                            </WrappedPaymentMethods>
                        </PaymentMethods>
                    )}
                </WrappedPayment>
            </Content>
            <Footer />
            <Toaster />
        </Container>
    );
}



/* <ToastContainer enableMultiContainer containerId={"await"} autoClose={false} draggable={false} 
<ToastContainer enableMultiContainer containerId={"autoClose"} autoClose={1500} draggable={false} />
*/