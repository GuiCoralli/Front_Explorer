import React, { useState, useEffect } from 'react';

import { api } from '../../services/api';

import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Roundabout } from '../../components/Roundabout';
import { Footer } from '../../components/Footer';

import { Toaster, toast } from 'react-hot-toast';  // Importa a biblioteca do Toaster do react-hot-toast

import { Container, Content, CoverPage, BundleBanner, Quote, BgBanner, NoResults } from './styles';

export function Home() {
  const [meals, setMeals] = useState([]);
  const [desserts, setDesserts] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [searchedItem, setSearchedItem] = useState("");
  const [requestItemsCount, setRequestItemsCount] = useState(0);
  const [isLoadingFoods, setIsLoadingFoods] = useState(true);
  const [foodToAddToRequest, setFoodToAddToRequest] = useState(null); 
  
  useEffect(() => {
    async function fetchFoods() {
      try {
        setIsLoadingFoods(true);
        const response = await api.get(`/foods?itemSearch=${searchedItem}`);
        setAllFoods(response.data);

        const mealsArray = response.data.filter(food => food.category === "Refeições");
        const dessertsArray = response.data.filter(food => food.category === "Sobremesas");
        const drinksArray = response.data.filter(food => food.category === "Bebidas");

        setMeals(mealsArray.map(meal => 
            <Card key={meal.id} 
                food={meal} 
                setFoodToAdd={setFoodToAddToRequest} 
            />
        ));
        setDesserts(dessertsArray.map(dessert => 
            <Card key={dessert.id} 
                food={dessert} 
                setFoodToAdd={setFoodToAddToRequest} 
            />
        ));
        setDrinks(drinksArray.map(drink => 
            <Card key={drink.id} 
                food={drink} 
                setFoodToAdd={setFoodToAddToRequest} 
            />
        ));
      } catch (error) {
        console.error("Aconteceu um erro ao buscar os pratos:", error);
        toast("Erro ao buscar os pratos. Por favor, tente novamente.");
      } finally {
        setIsLoadingFoods(false);
      }
    }

    fetchFoods();
  }, [searchedItem]);

  useEffect(() => {
    function filterFoodsByNameOrIngredient(query) {
      if (typeof query !== 'string') {
        query = '';
      }

      query = query.toLowerCase();

      const filteredFoods = allFoods.filter(food =>
        food.name.toLowerCase().includes(query) ||
        food.ingredients.some(ingredient => ingredient.name.toLowerCase().includes(query))
      );
      return filteredFoods;
    }

    const filteredSearchResults = filterFoodsByNameOrIngredient(searchedItem);

    const updateRoundaboutItems = (category) => (
      filteredSearchResults
        .filter(food => food.category === category)
        .map(food => <Card key={food.id} food={food} setFoodToAdd={setFoodToAddToRequest} />)
    );

    setMeals(updateRoundaboutItems("Refeições"));
    setDesserts(updateRoundaboutItems("Sobremesas"));
    setDrinks(updateRoundaboutItems("Bebidas"));
  }, [searchedItem, allFoods]);

  useEffect(() => {
    if (foodToAddToRequest) {
      const oldItems = JSON.parse(localStorage.getItem("@foodexplorer:request")) || { foods: [] };
      const existingFoodIndex = oldItems.foods.findIndex(item => item.food_id === foodToAddToRequest.food_id);
      const updatedRequest = { ...oldItems };

      if (existingFoodIndex !== -1) {
        updatedRequest.foods[existingFoodIndex].amount += foodToAddToRequest.amount;
      } else {
        updatedRequest.foods.push(foodToAddToRequest);
      }

      localStorage.setItem("@foodexplorer:request", JSON.stringify(updatedRequest));
      setRequestItemsCount(requestItemsCount + foodToAddToRequest.amount);
      toast("Item adicionado ao pedido.");
    }
  }, [foodToAddToRequest]);

  return (
    <Container>
      <Header setItemSearch={setSearchedItem} page="home" 
        foods={allFoods} 
        requestItems={requestItemsCount} 
      />
      <Content>
        <CoverPage className="coverPage">
          <BundleBanner className="bundleBanner" />
          <Quote className="quote">
            <h1>Sabores inigualáveis</h1>
            <span>Sinta o cuidado do preparo com ingredientes selecionados</span>
          </Quote>
          <BgBanner className="bgBanner" />
        </CoverPage>
        {
          meals.length > 0 && 
          <Roundabout title="Refeições" 
            content={meals} 
          />
        }
        {desserts.length > 0 && 
          <Roundabout title="Sobremesas" 
            content={desserts} 
          />
        }
        {drinks.length > 0 && 
          <Roundabout title="Bebidas" 
            content={drinks} 
          />
        }
        {searchedItem && 
          meals.length <= 0 && 
          desserts.length <= 0 && drinks.length <= 0 && (
            <NoResults>Nenhum resultado encontrado! </NoResults>
        )}
        {!isLoadingFoods && allFoods.length <= 0 && 
          <NoResults>Nenhum prato cadastrado!</NoResults>
        }
      </Content>
      <Footer />
      <Toaster /> 
    </Container>
  );
}
