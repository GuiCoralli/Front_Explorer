import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

import { ThemeContext } from 'styled-components';
import { TfiPlus, TfiMinus, TfiPencil } from 'react-icons/tfi';
import { VscHeartFilled, VscHeart } from 'react-icons/vsc';

import { Button } from '../Button';
import defaultFood from '../../assets/food.svg';

import { Toaster, toast } from 'react-hot-toast';;  // Importa a biblioteca do Toaster do react-hot-toast

import { Container, AmountOfFoods, FoodControls, TopRightButton } from './styles';

export function Card({ food, setFoodToAdd }) {
    const { user, isAdmin } = useAuth();

    const navigate = useNavigate();

    const theme = useContext(ThemeContext);

    const foodImage = food.image ? `${api.defaults.baseURL}/files/${food.image}` : `${defaultFood}`;

    const [foodAmount, setFoodAmount] = useState(1);
    const [preferences, setPreferences] = useState([]);
    const [loadingPreferences, setLoadingPreferences] = useState(false);

    function handleFood(id) {
        navigate(`/food/${id}`)
    };

    function handleEditFood(id) {
        navigate(`/edit/${id}`)
    };

    function decrease() {
        if (foodAmount > 1) {
            setFoodAmount(prevState => prevState - 1);
        };
    };

    function increase() {
        setFoodAmount(prevState => prevState + 1);
    };

    async function changePreferences() {
        if (loadingPreferences) {
            return;
        };

        const isPreference = checkIfIsPreference(preferences, food.id);

        if (isPreference) {
            try {
                setLoadingPreferences(true);
                await api.delete(`/prefereces/${isPreference}`);
                toast("Removido dos preferidos.");
            } catch (error) {
                console.error("Erro ao remover do preferido : ", error);
                toast("Erro ao remover do preferido. Por favor, tente novamente.");
            } finally {
                setLoadingPreferences(false);
            };
        } else {
            const userAndFood = {
                userId: user.id,
                foodId: food.id
            };

            try {
                setLoadingPreferences(true);
                await api.post("/preferences", userAndFood);
                toast("Adicionado aos preferidos.");
            } catch (error) {
                console.error("Erro ao adicionar aos preferidos: ", error);
                toast("Erro ao adicionar aos preferidos. Por favor, tente novamente.");
            } finally {
                setLoadingPreferences(false);
            };
        };

        fetchPreferences();
    };

    function handleAddFood(food_id, amount) {
        setFoodToAdd({ food_id, amount });
    };

    async function fetchPreferences() {
        try {
            const response = await api.get(`/preferences/${user.id}`);
            setPreferences(response.data);
        } catch (error) {
            console.error("Não foi possível buscar por preferidos: ", error);
            toast("Não foi possível buscar por preferidos. Por favor, tente novamente.");
        };
    };

    function checkIfIsPreference(preferences, foodId) {
        for (let i = 0; i < preferences.length; i++) {
            if (preferences[i].food_id === foodId) {
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
                src={foodImage}
                alt={`Imagem de ${food.description.toLowerCase()}`}
                onClick={() => handleFood(food.id)}
            />
            <h3
                onClick={() => handleFood(food.id)} >{food.name} &gt;</h3>
            <p>{food.description}</p>
            <span>R$ {food.price.toFixed(2).replace(".", ",")}</span>
            {isAdmin ? (
                <TopRightButton>
                    <TfiPencil onClick={() => handleEditFood(food.id)} />
                </TopRightButton>
            ) : (
                <div>
                    <AmountOfFoods>
                        <FoodControls>
                            <TfiMinus onClick={decrease} />
                            <span>{foodAmount}</span>
                            <TfiPlus onClick={increase} />
                        </FoodControls>
                        <Button onClick={() => handleAddFood(food.id, foodAmount)}>
                            incluir
                        </Button>
                    </AmountOfFoods>
                    <TopRightButton
                        onClick={() => changePreferences()}
                        className={loadingPreferences ? "disabled" : ""}
                    >
                        {
                            checkIfIsPreference(preferences, food.id) ?
                                <VscHeartFilled style={{ color: theme.COLORS.TOMATO_100 }} /> :
                                <VscHeart />
                        }
                    </TopRightButton>
                </div>
            )}
            <Toaster />
        </Container>
    );
}