import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { BackButton } from '../../components/BackButton';

import defaultFood from '../../assets/food.svg';
import CoverPage from "../../assets/coverPage.png";

import { Toaster } from '../../components/Toaster';
import { toast } from 'react-hot-toast';;  // Importa a biblioteca do Toaster do react-hot-toast

import { Container, Content, WrappedPreferences, PreferenceFood, FoodInfo } from './styles';

export function Preferences() {

    const { user } = useAuth();

    const history = useNavigate();

    const [isLoadingFoods, setIsLoadingFoods] = useState(true);
    const [preferences, setPreferences] = useState([]);
    const [loadingPreferences, setLoadingPreferences] = useState(false);

    function handleFood(id) {
        history(`/food/${id}`)
    };

    async function handleRemove(id) {
        const confirmed = await new Promise((resolve) => {

            const customId = "handleRemove";

            toast(
                <Toaster
                    message={"Deseja realmente remover dos preferidos?"}
                    confirm={"Remover"}
                    cancel={"Cancelar"}
                    onConfirm={() => resolve(true)}
                    onCancel={() => resolve(false)}
                />, {
                toastId: customId,
                containerId: "await"
                }
            );
        });
        // Trabalha removendo um item, de comida, da Lista de preferidos do Usuário
        if (confirmed) {
            try {
                setLoadingPreferences(true);
                await api.delete(`/preferences/${id}`);
                toast("Preferido foi removido.", { containerId: "autoClose" });
                fetchPreferences();
            } catch (error) {
                console.error("Aconteceu um erro ao remover um item dos preferidos: ", error);
                toast("Erro ao remover dos preferidos. Por favor, tente novamente.");
            } finally {
                setLoadingPreferences(false);
            };
        };
    };

    async function fetchPreferences() {
        try {
            const response = await api.get(`/preferences/${user.id}`);
            setPreferences(response.data);
            setLoadingPreferences(false);
        } catch (error) {
            console.error("Aconteceu um erro ao e não foi possível buscar pelos preferidos: ", error);
            toast("Não foi possível buscar pelos preferidos. Por favor, tente novamente.");
        };
    };

    useEffect(() => {
        fetchPreferences();
    }, []);

    return (
        <Container>
            <Header />
            <Content>
                <BackButton />
                <h1>Meus preferidos</h1>
                {preferences.length > 0 ? (
                    <WrappedPreferences>
                        {
                            preferences.map(preference => (
                                <PreferenceFood key={preference.id}>
                                    {
                                        preference.image ?
                                            <img
                                                src={`${api.defaults.baseURL}/files/${preference.image}`}
                                                alt={preference.name}
                                                onClick={() => handleFood(preference.food_id)}
                                            /> :
                                            <img src={defaultFood}
                                                alt="Imagem padrão do prato"
                                                onClick={() => handleFood(preference.food_id)}
                                            />
                                    }
                                    <FoodInfo>
                                        <h2 onClick={() => handleFood(preference.food_id)} >{preference.name}</h2>
                                        <span
                                            onClick={() => handleRemove(preference.id)}
                                            className={loadingPreferences ? "disabled" : ""}
                                        >Remover dos preferidos</span>
                                    </FoodInfo>
                                </PreferenceFood>
                            ))
                        }
                    </WrappedPreferences>
                ) : null}
                {!isLoadingFoods && (
                    preferences.length === 0 ? 
                    <p> Nenhuma comida preferida foi adicionada a sua lista.</p> 
                    : null
                )}
            </Content>
            <Footer />
            <Toaster />
            </Container>
    );
}