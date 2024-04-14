import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

import { TfiPlus, TfiMinus, TfiReceipt } from 'react-icons/tfi';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { BackButton } from '../../components/BackButton';
import { FoodIngredients } from '../../components/FoodIngredients';
import { Button } from '../../components/Button';
import defaultFood from '../../assets/food.svg';

import { Container, Content, FoodDetails, FoodInformations, Ingredients, FoodButon, FoodControls } from './styles';

export function Food() {
    const { isAdmin } = useAuth();

    const params = useParams();

    const [food, setFood] = useState(null);
    const [foodAmount, setFoodAmount] = useState(1);

    const [foodToAdd, setFoodToAdd] = useState();
    const [requestItems, setRequestItems] = useState(0);

    function decrease() {
        if (foodAmount > 1) {
            setFoodAmount(prevState => prevState - 1);
        };
    };

    function increase() {
        setFoodAmount(prevState => prevState + 1);
    };

    function handleAddFood(food_id, amount) {
        setFoodToAdd({ food_id, amount });
    };

    useEffect(() => {
        if (foodToAdd) {
            const oldItems = JSON.parse(localStorage.getItem("@foodexplorer:request"));
            const existingFoodIndex = oldItems.foods.findIndex(food => food.food_id === foodToAdd.food_id);

            const updatedRequest = { ...oldItems };

            if (existingFoodIndex !== -1) {
                updatedRequest.foods[existingFoodIndex].amount += foodToAdd.amount;
            } else {
                updatedRequest.foods.push(foodToAdd);
            };

            localStorage.setItem("@foodexplorer:request", JSON.stringify(updatedRequest));

            setRequestItems(requestItems + foodToAdd.amount);
        };
    }, [foodToAdd]);

    useEffect(() => {
        async function fetchFoods() {
            try {
                const response = await api.get(`/foods/${params.id}`);
                setFood(response.data);
            } catch (error) {
                console.error("Aconteceu um erro ao buscar o prato:", error);
                toast("Erro ao buscar o prato. Por favor, tente novamente.");
            };
        };

        fetchFoods();
    }, []);

    return (
        <Container>
            <Header requestItems={requestItems} />
            <Content>
                <BackButton />
                {
                    food &&
                    <FoodDetails className="food">
                        <img
                            src={food.image ? `${api.defaults.baseURL}/files/${food.image}` : `${defaultFood}`}
                            alt={`Imagem de ${food.description}`} />
                        <section>
                            <FoodInformations className='foodInformation'>
                                <h1>{food.name}</h1>
                                <p>{food.description}</p>
                                <Ingredients>
                                    {
                                        food.ingredients.length > 0 &&
                                        food.ingredients.map(ingredient => 
                                        <FoodIngredients title={ingredient.name} key={ingredient.id} />)
                                    }
                                </Ingredients>
                                <span>R$ {food.price.toFixed(2).replace(".", ",")}</span>
                            </FoodInformations>
                            {isAdmin ? (
                                <FoodButon className="foodButon">
                                    <Link to={`/edit/${food.id}`}>
                                        <Button>
                                            Editar prato
                                        </Button>
                                    </Link>
                                </FoodButon>
                            ) : (
                                <FoodButon className="foodButon">
                                    <FoodControls>
                                        <TfiMinus onClick={decrease} />
                                        <span>{foodAmount}</span>
                                        <TfiPlus onClick={increase} />
                                    </FoodControls>
                                    <Button onClick={() => handleAddFood(food.id, foodAmount)}>
                                        <TfiReceipt />incluir ∙ R$ {food.price.toFixed(2).replace(".", ",")}
                                    </Button>
                                </FoodButon>
                            )}
                        </section>
                    </FoodDetails>
                }
            </Content>
            <Footer />
        </Container>
    );
}