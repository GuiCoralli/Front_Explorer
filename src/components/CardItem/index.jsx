import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

import { ThemeContext } from 'styled-components';
import { TfiPlus, TfiMinus, TfiPencil } from 'react-icons/tfi';
import { VscHeartFilled, VscHeart } from 'react-icons/vsc';

import defaultPlate from '../../../src/assets/plate.svg';
import { Button } from '../Button';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Container, QuantityOfPlates, PlatesControls, TopRightButton } from './styles';

export function CardItem({ plate, setPlateToInclude }) {
    const { user, isAdminAccess } = useAuth();

    const navigate = useNavigate();

    const theme = useContext(ThemeContext);

    const plateImage = plate.image ? `${api.defaults.baseURL}/files/${plate.image}` : `${defaultPlate}`;

    const [plateQuantity, setPlateQuantity] = useState(1);
    const [preferences, setPreferences] = useState([]);
    const [loadingPreferences, setLoadingPreferences] = useState(false);

    function handlePlate(id) {
        navigate(`/plate/${id}`)
    };

    function handleEditPlate(id) {
        navigate(`/edit/${id}`)
    };

    function decrease() {
        if (plateQuantity > 1) {
            setPlateQuantity(prevState => prevState - 1);
        };
    };

    function increase() {
        setPlateQuantity(prevState => prevState + 1);
    };

    async function changeMyPreferences() {
        if (loadingPreferences) {
            return;
        };

        const isPreferences = checkIfIsPreferences(preferences, plate.id);

        if (isPreferences) {
            try {
                setLoadingPreferences(true);
                await api.delete(`/preferences/${isPreferences}`);
                toast("Prato retirado dos preferidos.");
            } catch (error) {
                console.error("Erro ao remover prato dos preferidos: ", error);
                toast("Erro ao remover prato dos preferidos, tente novamente.");
            } finally {
                setLoadingPreferences(false);
            };
        } else {
            const userAndPlate = {
                userId: user.id,
                plateId: plate.id
            };

            try {
                setLoadingPreferences(true);
                await api.post("/preferences", userAndPlate);
                toast("Prato adicionado aos preferidos.");
            } catch (error) {
                console.error("Erro ao adicionar prato dos preferidos: ", error);
                toast("Erro ao adicionar prato dos preferidos, tente novamente.");
            } finally {
                setLoadingPreferences(false);
            };
        };

        fetchPreferences();
    };

    function handleIncludePlate(plate_id, quantity) {
        setPlateToInclude({ plate_id, quantity });
    };

    async function fetchPreferences() {
        try {
            const response = await api.get(`/preferences/${user.id}`);
            setPreferences(response.data);
        } catch (error) {
            console.error("Não localizamos seu prato preferido: ", error);
            toast("Não foi possível localizar seu prato preferido, tente novamente.");
        };
    };

    function checkIfIsPreferences(preferences, plateId) {
        for (let i = 0; i < preferences.length; i++) {
            if (preferences[i].plate_id === plateId) {
                return preferences[i].id;
            };
        };
        return false;
    };

    useEffect(() => {
        fetchPreferences();
    }, []);

    return (
        <Container>
            <img
                src={plateImage}
                alt={`Imagem de ${plate.description.toLowerCase()}`}
                onClick={() => handlePlate(plate.id)}
            />
            <h3
                onClick={() => handlePlate(plate.id)}
            >{plate.name} &gt;</h3>
            <p>{plate.description}</p>
            <span>R$ {plate.price.toFixed(2).replace(".", ",")}</span>
            {isAdminAccess ? (
                <TopRightButton>
                    <TfiPencil onClick={() => handleEditPlate(plate.id)} />
                </TopRightButton>
            ) : (
                <div>
                    <QuantityOfPlates>
                        <PlatesControls>
                            <TfiMinus onClick={decrease} />
                            <span>{plateQuantity}</span>
                            <TfiPlus onClick={increase} />
                        </PlatesControls>
                        <Button onClick={() => handleIncludePlate(plate.id, plateQuantity)}>
                            incluir
                        </Button>
                    </QuantityOfPlates>
                    <TopRightButton
                        onClick={() => changeMyPreferences()}
                        className={loadingPreferences ? "disabled" : ""}
                    >
                        {
                            checkIfIsPreferences(preferences, plate.id) ?
                                <VscHeartFilled style={{ color: theme.COLORS.TOMATO_100 }} /> :
                                <VscHeart />
                        }
                    </TopRightButton>
                </div>
            )}
        </Container>
    );
}
