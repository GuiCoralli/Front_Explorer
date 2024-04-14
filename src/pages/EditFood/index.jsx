import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { api } from '../../services/api';

import { FiUpload } from 'react-icons/fi';
import { TfiClose } from 'react-icons/tfi';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { BackButton } from '../../components/BackButton';
import { Section } from '../../components/Section';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { FoodItem } from '../../components/FoodItem';

import defaultFood from '../../assets/food.svg';

import { toast } from "react-hot-toast"
import { Toaster } from '../../components/Toaster';

import { Container, Content, FoodInformations, ChoiceImg, RemoveImg } from './styles';

export function EditFood() {
    const navigate = useNavigate();

    const params = useParams();

    const [food, setFood] = useState(null);
    const [foodImg, setFoodImg] = useState("");
    const [foodImgFile, setFoodImgFile] = useState("");
    const [name, setName] = useState("")
    const [selectedCategory, setSelectedCategory] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [ifHasChanges, setIfHasChanges] = useState(false);
    const [foodImgHasChange, setFoodImgHasChange] = useState(false);
    const [ingredientsHasChange, setIngredientsHasChange] = useState(false);
    const [foodImgFilename, setFoodImgFileName] = useState("");
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const handleCategory = (event) => {
        setSelectedCategory(event.target.value);
    };

    function handleAddIngredient() {
        if (newIngredient.trim() === "") {
            setNewIngredient("");
            toast("Antes de adicionar digite um ingrediente.", { containerId: "autoClose" });
            return
        };
        setIngredients(prevState => [...prevState, newIngredient]);
        setIngredientsHasChange(true);
        setNewIngredient("");
    };

    function handleRemoveIngredient(deleted) {
        setIngredients(prevState => prevState.filter(ingredient => ingredient !== deleted));
        setIngredientsHasChange(true);
    };

    function handleChoiceOfFood(event) {

        const file = event.target.files[0];

        if (file && file.type.startsWith("image/")) {
            setFoodImgFile(file);

            const imagePreview = URL.createObjectURL(file);
            setFoodImg(imagePreview);

            setFoodImgHasChange(true);
        };
    };

    function removeImg() {
        document.querySelector("#foodImage").value = "";
        if (food.image) {
            setFoodImgHasChange(true);
        } else {
            setFoodImgHasChange(false);
        };
        setFoodImg("");
        setFoodImgFile("");
    };

    async function handleRemove() {
        const confirmed = await new Promise((resolve) => {

            const customId = "handleRemove";

            toast(
                <ConfirmationToast
                    message={"Deseja realmente remover o prato?"}
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
                setLoadingDelete(true);
                setLoadingUpdate(true);
                await api.delete(`/foods/${params.id}`);

                await api.delete(`foods/files/${foodImgFilename}`);

                toast("Prato removido.", { containerId: "autoClose" });

                setTimeout(() => {
                    navigate("/");
                }, 2000);

            } catch (error) {
                console.error("Aconteceu um erro ao remover o prato:", error);
                toast("Erro ao remover o prato. Por favor, tente novamente.", { containerId: "autoClose" });
            } finally {
                setLoadingDelete(false);
                setLoadingUpdate(false);
            };

        };
    };

    async function handleUpdateFood() {
        try {
            let formattedPrice = price.toString().replace(".", ",");

            const priceRegex = /^\d{1,3},\d{2}$/;
            if (!priceRegex.test(formattedPrice)) {
                return toast("Coloque um formato valido para o preço. Ex: 9,99", { containerId: "autoClose" });
            };

            formattedPrice = parseFloat(formattedPrice.replace(",", "."));

            const fileUploadForm = new FormData();

            if (foodImgFile) {
                fileUploadForm.append("image", foodImgFile);
            };

            fileUploadForm.append("name", name);
            fileUploadForm.append("category", selectedCategory);
            fileUploadForm.append("ingredients", JSON.stringify(ingredients));
            fileUploadForm.append("price", formattedPrice);
            fileUploadForm.append("description", description);
            fileUploadForm.append("removeFoodImg", foodImg);

            setLoadingDelete(true);
            setLoadingUpdate(true);
            await api.put(`/foods/${params.id}`, fileUploadForm);

            toast("Prato atualizado com sucesso!", { containerId: "autoClose" });

            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            console.error("Aconteceu um erro ao atualizar o prato:", error);
            toast("Erro ao atualizar o prato. Por favor, tente novamente.", { containerId: "autoClose" });
        } finally {
            setLoadingDelete(false);
            setLoadingUpdate(false);
        };
    };

    useEffect(() => {
        if (food) {
            const replacedPrice = Number(price.toString().replace(',', '.'));

            if (
                foodImgHasChange ||
                name != food.name ||
                selectedCategory != food.category ||
                ingredientsHasChange ||
                replacedPrice != food.price ||
                description != food.description
            ) {
                setIfHasChanges(true);
            } else {
                setIfHasChanges(false);
            };
        };

    }, [foodImgHasChange, name, selectedCategory, ingredients, price, description]);

    useEffect(() => {
        async function fetchFood() {
            try {
                const response = await api.get(`/food/${params.id}`);
                setFood(response.data);

                const foundFood = response.data;
                if (foundFood) {
                    setFood(foundFood);
                    setFoodImg(foundFood.image ? `${api.defaults.baseURL}/files/${foundFood.image}` : `${defaultFood}`);
                    setName(foundFood.name);
                    setSelectedCategory(foundFood.category);
                    setIngredients(foundFood.ingredients.map(ingredient => ingredient.name));
                    setPrice(foundFood.price);
                    setDescription(foundFood.description);
                };

                if (foundFood.image) {
                    setFoodImgFileName(foundFood.image);
                };

            } catch (error) {
                console.error("Aconteceu um erro ao buscar o prato:", error);
                toast("Erro ao buscar o prato. Por favor, tente novamente.", { containerId: "autoClose" });
            };
        };

        fetchFood();
    }, []);

    return (
        <Container>
            <Header />
            <Content>
                <BackButton />
                <h1>Editar prato</h1>
                {
                    food &&
                    <FoodInformations className='foodInformations'>

                        <Section title="Imagem do prato">
                            <ChoiceImg>
                                {
                                    foodImg &&
                                    <div>
                                        <img src={foodImg} alt="Visualização da imagem" />
                                        <RemoveImg onClick={removeImg}>
                                            <TfiClose />
                                        </RemoveImg>
                                    </div>
                                }
                                <label htmlFor="foodImg">
                                    <FiUpload /> Escolher imagem
                                    <input id="foodImg" type="file" onChange={handleChoiceOfFood} />
                                </label>
                            </ChoiceImg>
                        </Section>

                        <Section title="Nome">
                            <Input
                                placeholder="Ex: Caesar Salad"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Section>

                        <Section title="Categoria">
                            <select value={selectedCategory} onChange={handleCategory}>
                                <option value="Refeições">Refeições</option>
                                <option value="Sobremesas">Sobremesas</option>
                                <option value="Bebidas">Bebidas</option>
                            </select>
                        </Section>

                        <Section title="Ingredientes">
                            <div>
                                {
                                    ingredients.map((ingredient, index) => (
                                        <FoodItem
                                            key={index}
                                            value={ingredient}
                                            onClick={() => handleRemoveIngredient(ingredient)}
                                        />
                                    ))
                                }

                                <FoodItem
                                    $isNew
                                    placeholder="Adicionar"
                                    onChange={e => setNewIngredient(e.target.value)}
                                    value={newIngredient}
                                    onClick={handleAddIngredient}
                                />
                            </div>
                        </Section>

                        <Section title="Preço">
                            <Input
                                placeholder="R$ 00,00"
                                value={price.toString().replace('.', ',')}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Section>

                        <Section title="Descrição">
                            <textarea
                                name="foodDescription"
                                id="foodDescription"
                                placeholder="Ceasar Salad uma opção nutritiva, saudável e saborosa."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </Section>

                        <div>
                            <Button
                                onClick={handleRemove}
                                loading={loadingDelete}
                                title="Excluir prato"
                            />
                            <Button
                                type="text"
                                disabled={!ifHasChanges}
                                onClick={handleUpdateFood}
                                loading={loadingUpdate}
                                title="Salvar alterações"
                            />
                        </div>
                    </FoodInformations>
                }
            </Content>
            <Footer />
            <Toaster />
        </Container>
    );
}