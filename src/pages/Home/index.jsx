import React, { useState, useEffect } from 'react';

import { api } from '../../services/api';

import { CardItem } from '../../components/CardItem';
import { Header } from '../../components/Header';
import { Switch  } from '../../components/Switch';
import { Footer } from '../../components/Footer';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Container, Content, Banner, WrappedBanner, Slogan, BgBanner, NoResults } from './styles';

const mapPlatesToCards = (plates, setPlateToAdd) => {
    return plates.map(plate => (
      <CardItem key={plate.id} plate={plate} setPlateToAdd={setPlateToAdd} />
    ));
  };


export function Home() {

    const [foods, setFoods] = useState([]);
    const [desserts, setDesserts] = useState([]);
    const [drinks, setDrinks] = useState([]);

    const [plates, setPlates] = useState([]);

    const [itemSearch, setItemSearch] = useState("");
    const [filteredSearch, setFilteredSearch] = useState([]);
    const [search, setSearch] = useState("");
    const page = "home";

    const [plateToAdd, setPlateToAdd] = useState();
    const [orderItems, setOrderItems] = useState(0);
    const [loadingPlates, setLoadingPlates] = useState(true);

    
    useEffect(() => {
        async function fetchPlates() {
            try {
                setLoadingPlates(true);
                const response = await api.get(`/plates?itemSearch=${search}`);

                setPlates(response.data);

                const foodsArray = response.data.filter(plate => plate.category === "Comidas");
                const dessertsArray = response.data.filter(plate => plate.category === "Sobremesas");
                const drinksArray = response.data.filter(plate => plate.category === "Bebidas");

                setFoods(mapPlatesToCards(foodsArray, setPlateToAdd));
                setDesserts(mapPlatesToCards(dessertsArray, setPlateToAdd));
                setDrinks(mapPlatesToCards(drinksArray, setPlateToAdd));

            } catch (error) {
                console.error("Aconteceu um erro ao buscar por pratos:", error);
                toast("Não foi possível buscar por comidas, tente novamente.");
            } finally {
                setLoadingPlates(false);
            };
        };

        fetchPlates();

    }, []);

    useEffect(() => {
        function filterPlatesByNameOrIngredient(searchQuery) {
            searchQuery = searchQuery.toLowerCase();

            var filteredPlates = plates.filter(function (plate) {
                if (plate.name.toLowerCase().includes(searchQuery)) {
                    return true;
                };

                var foundIngredient = plate.ingredients.find(function (ingredient) {
                    return ingredient.name.toLowerCase().includes(searchQuery);
                });

                return !!foundIngredient;
            });

            return filteredPlates;
        };

        var searchResult = filterPlatesByNameOrIngredient(itemSearch);
        setFilteredSearch(searchResult);

        const foodsArray = searchResult.filter(plate => plate.category === "Comidas");
        const dessertsArray = searchResult.filter(plate => plate.category === "Sobremesas");
        const drinksArray = searchResult.filter(plate => plate.category === "Bebidas");

        setFoods(mapPlatesToCards(foodsArray, setPlateToAdd));
        setDesserts(mapPlatesToCards(dessertsArray, setPlateToAdd));
        setDrinks(mapPlatesToCards(drinksArray, setPlateToAdd));
    }, [itemSearch]);

    useEffect(() => {
        if (plateToAdd) {
            const oldItems = JSON.parse(localStorage.getItem("@foodexplorer:order"));
            const existingPlateIndex = oldItems.plates.findIndex(plate => plate.plate_id === plateToAdd.plate_id);

            const updatedOrder = { ...oldItems };

            if (existingPlateIndex !== -1) {
                updatedOrder.plates[existingPlateIndex].quantity += plateToAdd.quantity;
            } else {
                updatedOrder.plates.push(plateToAdd);
            };

            localStorage.setItem("@foodexplorer:order", JSON.stringify(updatedOrder));

            setOrderItems(orderItems + plateToAdd.quantity);

            toast("Adicionado um item ao pedido.")
        };

    }, [plateToAdd]);

    return (
        <Container>
            <Header
                setItemSearch={setItemSearch}
                setSearch={setSearch}
                page={page}
                plates={plates}
                orderItems={orderItems}
            />
            <Content>
                <Banner className="banner">
                    <WrappedBanner className="wrappedBanner" />
                    <Slogan className="slogan">
                        <h1>Sabores inigualáveis</h1>
                        <span>Sinta o cuidado do preparo com ingredientes selecionados</span>
                    </Slogan>
                    <BgBanner className="bgBanner" />
                </Banner>
                {foods.length > 0 && <Switch title="Comidas" content={foods} />
                }
                {desserts.length > 0 && <Switch title="Sobremesas" content={desserts} />
                }
                {drinks.length > 0 && <Switch title="Bebidas" content={drinks} />
                }
                {itemSearch && filteredSearch.length <= 0 (
                    <NoResults>Nenhum resultado encontrado!</NoResults>
                )}
                {
                    !loadingPlates && plates.length <= 0 &&
                    <NoResults>Nenhum prato cadastrado!</NoResults>
                }
            </Content>
            <Footer />
            <ToastContainer autoClose={1500} draggable={false} />
        </Container >
    );
}