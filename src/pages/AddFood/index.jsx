import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

import { Toaster, toast } from 'react-hot-toast';;  // Importa a biblioteca do Toaster do react-hot-toast

import { Container, Content, FoodInformations, ChoiceImg, RemoveImg } from './styles';

export function AddFood() {

const navigate = useNavigate();

	const [foods, setFoods] = useState([]);
	const [foodImg, setFoodImg] = useState("");
	const [foodImgFile, setFoodImgFile] = useState("");
	const [name, setName] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [ingredients, setIngredients] = useState([]);
	const [newIngredient, setNewIngredient] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [noEmptySpaces, setNoEmptySpaces] = useState(false);
	const [loadingObject, setLoadingObject] = useState(false);

	const handleAddIngredient = () => {
		if (newIngredient.trim() === "") {
			setNewIngredient("");
			return toast("Antes de Adicionar digite um ingrediente.");
		};
		setIngredients((prevState) => [...prevState, newIngredient]);
		setNewIngredient("");
	};

	const handleRemoveIngredient = (deleted) => {
		setIngredients(prevState => prevState.filter(ingredient => ingredient !== deleted));
	};

	const handleCategory = (event) => {
		setSelectedCategory(event.target.value);
	};

	const handleChoiceOfFood = (event) => {
		const file = event.target.files[0];

		if (file && file.type.startsWith("img/")) {
			setFoodImgFile(file);
			const imgPreview = URL.createObjectURL(file);
			setFoodImg(imgPreview);
		};
	};

	const checkEmptySpaces= () => {
		if (name && selectedCategory && ingredients.length > 0 && price && description) {
			setNoEmptySpaces(true);
		} else {
			setNoEmptySpaces(false);
		};
	};

	const handleNewFood = async () => {
		try {
			const priceRegex = /^\d{1,3},\d{2}$/;

			if (!priceRegex.test(price)) {
				return toast("Digite o preço num formato válido. Ex: 1,99");
			};

			const formattedPrice = Number(price.replace(",", "."));

			const fileUploadForm = new FormData();

			if (foodImgFile) {
				fileUploadForm.append("img", foodImgFile);
			};

			fileUploadForm.append("name", name);
			fileUploadForm.append("category", selectedCategory);
			fileUploadForm.append("ingredients", JSON.stringify(ingredients));
			fileUploadForm.append("price", formattedPrice);
			fileUploadForm.append("description", description);

			setLoadingObject(true);
			await api.post("/foods", fileUploadForm);

			toast("Prato criado com sucesso!");

			setTimeout(() => {
				navigate("/");
			}, 2000);
		} catch (error) {
			console.error("Erro ao criar seu prato:", error);
			toast("Aconteceu um erro ao criar seu prato. Por favor, tente novamente.");
		} finally {
			setLoadingObject(false);
		};
	};

	useEffect(() => {
		checkEmptySpaces();
	}, [foodImg, name, selectedCategory, ingredients, price, description]);

	useEffect(() => {
		const fetchFoods = async () => {
			try {
				const response = await api.get(`/foods`);
				setFoods(response.data);
			} catch (error) {
				console.error("Erro ao buscar os pratos:", error);
				toast("Aconteceu um erro e não foi possível buscar seu pratos. O mecanismo de pesquisa não está funcionando corretamente.");
			};
		};

		fetchFoods();
	}, []);

	return (
		<Container>
			<Header
				foods={foods}
			/>
			<Content>
				<BackButton />
				<h1>Adicionar prato</h1>
				<FoodInformations className='foodInformations'>
					<Section title="Imagem do prato">
						<ChoiceImg>
							{
								foodImg &&
								<div>
									<img src={foodImg} alt="Visualização da imagem" />
									<RemoveImg onClick={() => setFoodImg("")}>
										<TfiClose />
									</RemoveImg>
								</div>
							}
							<label htmlFor="foodImg">
								<FiUpload /> Selecione a imagem
								<input id="foodImg" type="file" onChange={handleChoiceOfFood} />
							</label>
						</ChoiceImg>
					</Section>

					<Section title="Nome">
						<Input
							placeholder="Ex.: Salada Ceasar"
							onChange={(e) => setName(e.target.value)}
						/>
					</Section>

					<Section title="Categoria">
						<select value={selectedCategory} onChange={handleCategory}>
							<option value="">Selecione uma opção</option>
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
							placeholder="00,00"
							onChange={e => setPrice(e.target.value)}
						/>
					</Section>

					<Section title="Descrição">
						<textarea
							name="foodDescription"
							id="foodDescription"
							placeholder="Fale brevemente sobre o prato, seus ingredientes e composição."
							onChange={e => setDescription(e.target.value)}
						></textarea>
					</Section>

					<div>
						<Button
							type="text"
							disabled={!noEmptySpaces}
							onClick={handleNewFood}
							loading={loadingObject}
							title="Adicionar"
						/>
					</div>
				</FoodInformations>
			</Content>
			<Footer />
			<ToastContainer autoClose={1500} draggable={false} />
		</Container>
	);
}