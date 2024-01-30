import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { api } from '../../services/api';

import { FiUpload } from 'react-icons/fi';
import { TfiClose } from 'react-icons/tfi';

import { ConfirmationRequest } from '../../components/ConfirmationRequest';
import { PlateDetails } from'../../components/PlateDetails';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { GoBack } from '../../components/GoBack';
import { Section } from '../../components/Section';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

import defaultPlate from '../../../src/assets/plate.svg';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Container, Content, PlateInformations, ChoiceImage, RemoveImage } from './styles';

export function EditPlate() {
    const navigate = useNavigate();

    const params = useParams();

    const [plate, setPlate] = useState(null);
    const [plateImage, setPlateImage] = useState("");
    const [plateImageFile, setPlateImageFile] = useState("");
    const [name, setName] = useState("")
    const [selectedCategory, setSelectedCategory] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [ifHasChanges, setIfHasChanges] = useState(false);
    const [plateImageHasChanges, setPlateImageHasChanges] = useState(false);
    const [ingredientsHasChanges, setIngredientsHasChanges] = useState(false);
    const [plateImageFilename, setPlateImageFilename] = useState("");
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);''

    const handleCategory = (event) => {
        setSelectedCategory(event.target.value);
    };

    function handleAddIngredient() {
        if (newIngredient.trim() === "") {
            setNewIngredient("");
            toast("Antes de adicionar digite o nome do ingrediente desejado.", { containerId: "autoClose" });
            return
        };
        setIngredients(prevState => [...prevState, newIngredient]);
        setIngredientsHasChanges(true);
        setNewIngredient("");
    };

    function handleRemoveIngredient(deleted) {
        setIngredients(prevState => prevState.filter(ingredient => ingredient !== deleted));
        setIngredientsHasChanges(true);
    };

    function handleChoiceOfPlate(event) {

        const file = event.target.files[0];

        if (file && file.type.startsWith("image/")) {
            setPlateImageFile(file);

            const imagePreview = URL.createObjectURL(file);
            setPlateImage(imagePreview);

            setPlateImageHasChanges(true);
        };
    };

    function removeImage() {
        document.querySelector("#plateImage").value = "";
        if (plate.image) {
            setPlateImageHasChanges(true);
        } else {
            setPlateImageHasChanges(false);
        };
        setPlateImage("");
        setPlateImageFile("");
    };

    async function handleRemove() {
        const confirmed = await new Promise((resolve) => {

            const customId = "handleRemove";

            toast(
                <ConfirmationRequest 
                    message={"Você deseja remover este prato?"}
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
                await api.delete(`/plates/${params.id}`);

                await api.delete(`plates/files/${plateImageFilename}`);

                toast("Prato removido.", { containerId: "autoClose" });

                setTimeout(() => {
                    navigate("/");
                }, 2000);

            } catch (error) {
                console.error("Aconteceu um erro ao remover o prato.", error);
                toast("Não foi possível remover o prato, tente outra vez.", { containerId: "autoClose" });
            } finally {
                setLoadingDelete(false);
                setLoadingUpdate(false);
            };

        };
    };

    async function handleUpdatePlate() {
        try {
            let formattedPrice = price.toString().replace(".", ",");

            const priceRegex = /^\d{1,3},\d{2}$/;
            if (!priceRegex.test(formattedPrice)) {
                return toast("Digite um preço no formato suportado. Ex: 9,59", { containerId: "autoClose" });
            };

            formattedPrice = parseFloat(formattedPrice.replace(",", "."));

            const fileUploadForm = new FormData();

            if (plateImageFile) {
                fileUploadForm.append("image", plateImageFile);
            };

            fileUploadForm.append("name", name);
            fileUploadForm.append("category", selectedCategory);
            fileUploadForm.append("ingredients", JSON.stringify(ingredients));
            fileUploadForm.append("price", formattedPrice);
            fileUploadForm.append("description", description);
            fileUploadForm.append("removePlateImage", plateImage);

            setLoadingDelete(true);
            setLoadingUpdate(true);
            await api.put(`/plates/${params.id}`, fileUploadForm);

            toast("Prato atualizado com sucesso!", { containerId: "autoClose" });

            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            console.error("Aconteceu um erro ao remover o prato.", error);
            toast("Não foi possível atualizar o prato, tente novamente.", { containerId: "autoClose" });
        } finally {
            setLoadingDelete(false);
            setLoadingUpdate(false);
        };
    };

    useEffect(() => {
        if (plate) {
            const replacedPrice = parseFloat(price.toString().replace(',', '.'));

            if (
                plateImageHasChanges ||
                name != plate.name ||
                selectedCategory != plate.category ||
                ingredientsHasChanges ||
                replacedPrice != plate.price ||
                description != plate.description
            ) {
                setIfHasChanges(true);
            } else {
                setIfHasChanges(false);
            };
        };

    }, [plateImageHasChanges, name, selectedCategory, ingredients, price, description]);

    useEffect(() => {
        async function fetchPlate() {
            try {
                const response = await api.get(`/plates/${params.id}`);
                setPlate(response.data);

                const foundPlate = response.data;
                if (foundPlate) {
                    setPlate(foundPlate);
                    setPlateImage(foundPlate.image ? `${api.defaults.baseURL}/files/${foundPlate.image}` : `${defaultPlate}`);
                    setName(foundPlate.name);
                    setSelectedCategory(foundPlate.category);
                    setIngredients(foundPlate.ingredients.map(ingredient => ingredient.name));
                    setPrice(foundPlate.price);
                    setDescription(foundPlate.description);
                };

                if (foundPlate.image) {
                    setPlateImageFilename(foundPlate.image);
                };

            } catch (error) {
                console.error("Erro ao procurar por prato:", error);
                toast("Não foi possível buscar o prato desejado, tente novamente.", { containerId: "autoClose" });
            };
        };

        fetchPlate();
    }, []);

    return (
        <Container>
            <Header />
            <Content>
                <GoBack  />
                <h1>Editar prato</h1>
                {
                    plate &&
                    <PlateInformations className='plateInformations'>

                        <Section title="Imagem do prato">
                            <ChoiceImage>
                                {
                                    plateImage &&
                                    <div>
                                        <img src={plateImage} alt="Visualização da imagem" />
                                        <RemoveImage onClick={removeImage}>
                                            <TfiClose />
                                        </RemoveImage>
                                    </div>
                                }
                                <label htmlFor="plateImage">
                                    <FiUpload /> Escolher imagem
                                    <input id="plateImage" type="file" onChange={handleChoiceOfPlate} />
                                </label>
                            </ChoiceImage>
                        </Section>

                        <Section title="Nome">
                            <Input
                                placeholder="Ex: Feijoada"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Section>

                        <Section title="Categoria">
                            <select value={selectedCategory} onChange={handleCategory}>
                                <option value="Comidas">Comidas</option>
                                <option value="Sobremesas">Sobremesas</option>
                                <option value="Bebidas">Bebidas</option>
                            </select>
                        </Section>

                        <Section title="Ingredientes">
                            <div>
                                {
                                    ingredients.map((ingredient, index) => (
                                        <PlateDetails
                                            key={index}
                                            value={ingredient}
                                            onClick={() => handleRemoveIngredient(ingredient)}
                                        />
                                    ))
                                }

                                <PlateDetails
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
                                name="plateDescription"
                                id="plateDescription"
                                placeholder="A Feijoada adaptada de uma forma saudável, é uma deliciosa e nutritiva opção."
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
                                onClick={handleUpdatePlate}
                                loading={loadingUpdate}
                                title="Salvar alterações"
                            />
                        </div>
                    </PlateInformations>
                }
            </Content>
            <Footer />
            <ToastContainer enableMultiContainer containerId={"await"} autoClose={false} draggable={false} />
            <ToastContainer enableMultiContainer containerId={"autoClose"} autoClose={1500} draggable={false} />
        </Container>
    );
}