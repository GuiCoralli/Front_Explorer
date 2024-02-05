import { TfiPlus, TfiMinus, TfiReceipt } from 'react-icons/tfi';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

import defaultPlate from '../../../src/assets/plate.svg';

import { CheckIngredients } from '../../components/CheckIngredients';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { GoBack } from '../../components/GoBack';

import { Container, Content, PlateDetails, PlateInformations, Ingredients, PlateButton, PlateControls } from './styles';

export function Plate() {
    const { isAdminAccess } = useAuth();

    const params = useParams();

    const [plate, setPlates] = useState(null);
    const [plateQuantity, setPlateQuantity] = useState(1);

    const [plateToAdd, setPlateToAdd] = useState();
    const [orderItems, setOrderItems] = useState(0);

    function decrease() {
        if (plateQuantity > 1) {
            setPlateQuantity(prevState => prevState - 1);
        };
    };

    function increase() {
        setPlateQuantity(prevState => prevState + 1);
    };

    function handleAddPlate(plate_id, quantity) {
        setPlateToAdd({ plate_id, quantity });
    };

    useEffect(() => {
        if (plateToAdd) {
            const oldItems = JSON.parse(localStorage.getItem("@foodexplorer:order"));
            const existingPlateIndex = oldItems.plates.findIndex(plate => plate.plate_id === plateToAdd.plate_id);

            const updatedOrder = { ...oldItems };

            if (existingPlateIndex !== -1) {
                updatedOrder.plates[existingPlateIndex].amount += plateToAdd.amount;
            } else {
                updatedOrder.plates.push(plateToAdd);
            };

            localStorage.setItem("@foodexplorer:order", JSON.stringify(updatedOrder));

            setOrderItems(orderItems + plateToAdd.quantity);
        };
    }, [plateToAdd]);

    useEffect(() => {
        async function fetchPlates() {
            try {
                const response = await api.get(`/plates/${params.id}`);
                setPlates(response.data);
            } catch (error) {
                console.error("Erro ao procurar pelo prato desejado:", error);
                toast("Não foi possível encontrar pelo prato desejado, tente novamente.");
            };
        };

        fetchPlates();
    }, []);

    return (
        <Container>
            <Header orderItems={orderItems} />
            <Content>
                <GoBack />
                {
                    plate &&
                    <PlateDetails className="plate">
                        <img
                            src={plate.image ? `${api.defaults.baseURL}/files/${plate.image}` : `${defaultPlate}`}
                            alt={`Imagem de ${plate.description}`} />
                        <section>
                            <PlateInformations className='plateInformations'>
                                <h1>{plate.name}</h1>
                                <p>{plate.description}</p>
                                <Ingredients>
                                    {
                                        plate.ingredients.length > 0 &&
                                        plate.ingredients.map(ingredient => 
                                        <CheckIngredients title={ingredient.name} key={ingredient.id} />)
                                    }
                                </Ingredients>
                                <span>R$ {plate.price.toFixed(2).replace(".", ",")}</span>
                            </PlateInformations>
                            {isAdminAccess ? (
                                <PlateButton className="plateButton">
                                    <Link to={`/edit/${plate.id}`}>
                                        <Button>
                                            Editar prato
                                        </Button>
                                    </Link>
                                </PlateButton>
                            ) : (
                                <PlateButton className="plateButton">
                                    <PlateControls>
                                        <TfiMinus onClick={decrease} />
                                        <span>{plateQuantity}</span>
                                        <TfiPlus onClick={increase} />
                                    </PlateControls>
                                    <Button onClick={() => handleAddPlate(plate.id, plateQuantity)}>
                                        <TfiReceipt />incluir ∙ R$ {plate.price.toFixed(2).replace(".", ",")}
                                    </Button>
                                </PlateButton>
                            )}
                        </section>
                    </PlateDetails>
                }
            </Content>
            <Footer />
        </Container>
    );
}