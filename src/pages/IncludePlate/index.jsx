import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '../../services/api';

import { FiUpload } from 'react-icons/fi';
import { TfiClose } from 'react-icons/tfi';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { GoBack } from '../../components/GoBack';
import { Section } from '../../components/Section';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { PlateDetails } from '../../components/PlateDetails';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Container, Content, PlateInformations, ChooseImage, RemoveImage } from './styles';

export function IncludePlate() {

	const navigate = useNavigate();

	const [plates, setPlates] = useState([]);
	const [plateImage, setPlateImage] = useState("");
	const [plateImageFile, setPlateImageFile] = useState("");
	const [name, setName] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [ingredients, setIngredients] = useState([]);
	const [newIngredient, setNewIngredient] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [isNotEmptyFields, setIsNotEmptyFields] = useState(false);
	const [loadingCreate, setLoadingCreate] = useState(false);

	function handleAddIngredient() {
		if (newIngredient.trim() === "") {
			setNewIngredient("");
			return toast("Escreva o nome de um ingrediente antes de adicionar.");
		};
		setIngredients(prevState => [...prevState, newIngredient]);
		setNewIngredient("");
	};

	function handleRemoveIngredient(deleted) {
		setIngredients(prevState => prevState.filter(ingredient => ingredient !== deleted));
	};

	const handleCategory = (event) => {
		setSelectedCategory(event.target.value);
	};

	function handleFoodChoosePlate(event) {
		const file = event.target.files[0];

		if (file && file.type.startsWith("image/")) {
			setPlateImageFile(file);

			const imagePreview = URL.createObjectURL(file);
			setPlateImage(imagePreview);
		};
	};

	function checkEmptyFields() {
		if (name && selectedCategory && ingredients.length > 0 && price && description) {
			setIsNotEmptyFields(true);
		} else {
			setIsNotEmptyFields(false);
		};
	};

	async function handleNewPlate() {
		try {
			const priceRegex = /^\d{1,3},\d{2}$/;

			if (!priceRegex.test(price)) {
				return toast("Digite um valor no formato válido. Ex: 27,85");
			};

			const formattedPrice = parseFloat(price.replace(",", "."));

			const fileUploadForm = new FormData();

			if (plateImageFile) {
				fileUploadForm.append("image", plateImageFile);
			};

			fileUploadForm.append("name", name);
			fileUploadForm.append("category", selectedCategory);
			fileUploadForm.append("ingredients", JSON.stringify(ingredients));
			fileUploadForm.append("price", formattedPrice);
			fileUploadForm.append("description", description);

			setLoadingCreate(true);
			await api.post("/plates", fileUploadForm);

			toast("Prato criado com sucesso!");

			setTimeout(() => {
				navigate("/");
			}, 2000);
		} catch (error) {
			console.error("Erro ao criar o prato:", error);
			toast("Não foi possível criar o prato, tente novamente.");
		} finally {
			setLoadingCreate(false);
		};
	};

	useEffect(() => {
		checkEmptyFields();
	}, [plateImage, name, selectedCategory, ingredients, price, description]);

	useEffect(() => {
		async function fetchPlates() {
			try {
				const response = await api.get(`/plates`);
				setPlates(response.data);
			} catch (error) {
				console.error("Erro ao buscar pelo prato desejado:", error);
				toast("Não foi possível fazer a busca do prato desejado. A busca não funcionou corretamente.");
			};
		};

		fetchPlates();
	}, []);

	return (
		<Container>
			<Header
				plates={plates}
			/>
			<Content>
				<GoBack />
				<h1>Adicionar um prato</h1>
				<PlateInformations className='plateInformations'>
					<Section title="Imagem do prato">
						<ChooseImage>
							{
								plateImage &&
								<div>
									<img src={plateImage} alt="Visualização da imagem" />
									<RemoveImage onClick={() => setPlateImage("")}>
										<TfiClose />
									</RemoveImage>
								</div>
							}
							<label htmlFor="plateImage">
								<FiUpload /> Escolher uma imagem
								<input id="plateImage" type="file" onChange={handleFoodChoosePlate} />
							</label>
						</ChooseImage>
					</Section>

					<Section title="Nome">
						<Input
							placeholder="Ex.: Feijoada"
							onChange={(e) => setName(e.target.value)}
						/>
					</Section>

					<Section title="Categoria">
						<select value={selectedCategory} onChange={handleCategory}>
							<option value="">Escolha uma opção</option>
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
							placeholder="00,00"
							onChange={e => setPrice(e.target.value)}
						/>
					</Section>

					<Section title="Descrição">
						<textarea
							name="plateDescription"
							id="plateDescription"
							placeholder=" Descreva sobre o seu prato. Nome, ingredientes, detalhes..."
							onChange={e => setDescription(e.target.value)}
						></textarea>
					</Section>

					<div>
						<Button
							type="text"
							disabled={!isNotEmptyFields}
							onClick={handleNewPlate}
							loading={loadingCreate}
							title="Adicionar"
						/>
					</div>
				</PlateInformations>
			</Content>
			<Footer />
			<ToastContainer autoClose={1500} draggable={false} />
		</Container>
	);
}