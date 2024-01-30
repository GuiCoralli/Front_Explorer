import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

import defaultPlate from '../../../src/assets/plate.svg';
import { GoBack } from '../../components/GoBack';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

import { ConfirmationRequest } from '../../components/ConfirmationRequest';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Container, Content, WrappedPreferences, PreferencePlate, PlateInfo } from './styles';

export function Preferences() {

    const { user } = useAuth();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [preferences, setPreferences] = useState([]);
    const [loadingPreferences, setLoadingPreferences] = useState(false);

    function handlePlate(id) {
        navigate(`/plate/${id}`)
    };

    async function handleRemove(id) {
        const confirmed = await new Promise((resolve) => {

            const customId = "handleRemove";

            toast(
                <ConfirmationRequest
                    message={"Quer realmente remover dos preferidos?"}
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
            try {
                setLoadingPreferences(true);
                await api.delete(`/preferences/${id}`);
                toast("Removido das Preferências.", { containerId: "autoClose" });
                fetchPreferences();
            } catch (error) {
                console.error("Erro ao remover das preferências: ", error);
                toast("Erro ao remover o prato das preferências, tente novamente.");
            } finally {
                setLoadingPreferences(false);
            };
        };
    };

    async function fetchPreferences() {
        try {
            const response = await api.get(`/preferences/${user.id}`);
            setPreferences(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Não foi possível buscar pelas suas preferências: ", error);
            toast("Não foi possível buscar as suas preferências, tente novamente.");
        };
    };

    useEffect(() => {
        fetchPreferences();
    }, []);

    return (
        <Container>
            <Header />
            <Content>
                <GoBack  />
                <h1>Minhas Preferências</h1>
                {preferences.length > 0 ? (
                    <WrappedPreferences>
                        {
                            preferences.map(preference => (
                                <PreferencePlate key={preference.id}>
                                    {
                                        preference.image ?
                                            <img
                                                src={`${api.defaults.baseURL}/files/${preference.image}`}
                                                alt={preference.name}
                                                onClick={() => handlePlate(preference.plate_id)}
                                            /> :
                                            <img src={defaultPlate}
                                                alt="Imagem padrão do prato"
                                                onClick={() => handlePlate(preference.plate_id)}
                                            />
                                    }
                                    <PlateInfo>
                                        <h2 onClick={() => handlePlate(preference.plate_id)} >{preference.name}</h2>
                                        <span
                                            onClick={() => handleRemove(preference.id)}
                                            className={loadingPreferences ? "disabled" : ""}
                                        > Remover dos favoritos</span>
                                    </PlateInfo>
                                </PreferencePlate>
                            ))
                        }
                    </WrappedPreferences>
                ) : null}
                {!isLoading && (
                    preferences.length === 0 ? <p> Nenhum prato preferido foi adicionado.</p> : null
                )}
            </Content>
            <Footer />
            <ToastContainer enableMultiContainer containerId={"await"} autoClose={false} draggable={false} />
            <ToastContainer enableMultiContainer containerId={"autoClose"} autoClose={1500} draggable={false} />
        </Container>
    );
}