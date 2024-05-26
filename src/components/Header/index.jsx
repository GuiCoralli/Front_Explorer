import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

import { TfiReceipt, TfiUser, TfiHeart } from 'react-icons/tfi';
import { FiLogOut } from 'react-icons/fi';

import { Logo } from '../Logo';
import { Input } from '../Input';
import { Button } from '../Button';
import { Menu } from '../Menu';
import { SelectMenu } from '../SelectMenu';
import defaultFood from '../../assets/food.svg';

import toast from 'react-hot-toast';

import { Container, ReceiptRequests, Request, Profile, ProfileMenu, ProfileMenuOptions, SearchList } from './styles';

export function Header(props) {
    const { signOut, user, isAdmin } = useAuth();

    const navigate = useNavigate();

    const { setItemSearch, page, requestItems, totalRequest } = props;

    const [foods, setFoods] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    // Verificação para garantir que user e avatar sejam definidos antes de acessar suas propriedades
    const avatarUrl = user && user.avatar ? `${api.defaults.baseURL}/files/${user.avatar}` : '';
    const avatarStyle = { backgroundImage: user && user.avatar ? `url(${avatarUrl})` : 'none' };

    const queryWidth = 1050;
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);

    const [search, setSearch] = useState("");
    const [hasSearchPlaceholder, setHasSearchPlaceholder] = useState(false);
    const [filteredSearch, setFilteredSearch] = useState([]);

    const profileMenuRef = useRef(null);
    const profileRef = useRef(null);

    function handleSignOut() {
        document.documentElement.style.overflowY = "auto";
        navigate("/");
        signOut();
    };

    function handleFood(id) {
        const pageNameAndId = window.location.pathname.split("/");

        navigate(`/food/${id}`);

        if (pageNameAndId[1] === "food" && pageNameAndId[2] !== id.toString()) {
            window.location.reload();
        } else {
            document.querySelector("#searchFoods").value = "";
            setSearch("");
        };
    };

    function toggleProfileMenu() {
        setIsProfileMenuVisible(!isProfileMenuVisible);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            // Fecha o menu de perfil quando clicar fora dele
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target) &&
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                if (profileMenuRef.current.classList.contains("profile-menu-visible")) {
                    setIsProfileMenuVisible(false);
                };
            };
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setHasSearchPlaceholder(!search);
    }, [search]);
    
    useEffect(() => {
        setItemSearch(page === "home" ? search : "");

        function filterFoodsByNameOrIngredient(searchQuery) {
            searchQuery = searchQuery.toLowerCase();

            var filteredFoods = foods.filter(function (food) {
                if (food.name.toLowerCase().includes(searchQuery)) {
                    return true;
                };

                var foundIngredient = food.ingredients.find(function (ingredient) {
                    return ingredient.name.toLowerCase().includes(searchQuery);
                });

                return !!foundIngredient;
            });

            return filteredFoods;
        };

        var searchResult = filterFoodsByNameOrIngredient(search);
        setFilteredSearch(searchResult);
    }, [page, search]);

    useEffect(() => {
        async function fetchFoods() {
            try {
                const response = await api.get("/foods");
                setFoods(response.data);
            } catch (error) {
                console.error("Aconteceu um erro ao buscar por pratos: ", error);
                toast("Erro ao buscar por pratos. Por favor, tente novamente.");
            };
        };

        fetchFoods();

        const handleResize = () => {
            setWindowWidth(window.innerWidth);

            if (window.innerWidth < queryWidth) {
                setIsProfileMenuVisible(false);
                setSearch("");
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const oldItems = JSON.parse(localStorage.getItem("@foodexplorer:request"));

        if (oldItems && oldItems.foods) {
            let total = 0;

            for (const food of oldItems.foods) {
                if (food.amount) {
                    total += food.amount;
                };
            };
            setTotalAmount(total);
        } else {
            setTotalAmount(requestItems);
        };

    }, [requestItems, totalRequest]);

    return (
        <Container>
            <Menu />
            <Link to="/">
                <Logo isAdmin={isAdmin} />
            </Link>
            {windowWidth >= queryWidth && (
                <Input
                    id="searchFoods"
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Busque por pratos ou ingredientes"
                    searchPlaceholder={hasSearchPlaceholder}
                    value={search}
                >
                    {
                        search && filteredSearch.length > 0 && page !== "home" &&
                        <SearchList>
                            {
                                filteredSearch.map(food =>
                                    <div key={food.id} onClick={() => handleFood(food.id)}>
                                        {
                                            food.image ? (
                                                <img src={`${api.defaults.baseURL}/files/${food.image}`} />
                                            ) : (
                                                <img src={defaultFood} />
                                            )
                                        }
                                        <span>{food.name}</span>
                                    </div>
                                )
                            }
                        </SearchList>
                    }
                    {
                        search && filteredSearch.length === 0 && page !== "home" &&
                        <SearchList><span>Nenhum resultado foi encontrado!</span></SearchList>
                    }
                </Input>
            )}
            {windowWidth >= queryWidth ? (
                isAdmin ? (
                    <Link to="/add">
                        <Button>
                            Novo prato
                        </Button>
                    </Link>
                ) : (
                    <Link to="/payment">
                        <Button>
                            <TfiReceipt />{`Pedido (${totalAmount})`}
                        </Button>
                    </Link>
                )
            ) : (
                isAdmin ? null : (
                    <Link to="/payment">
                        <ReceiptRequests>
                            <TfiReceipt />
                            <Request>
                                {totalAmount}
                            </Request>
                        </ReceiptRequests>
                    </Link>
                )
            )}
            {windowWidth >= queryWidth && (
                <Profile
                    ref={profileRef}
                    style={avatarStyle}
                    onClick={toggleProfileMenu}
                >
                    {
                       !user || !user.avatar && <TfiUser />
                    }
                </Profile>
            )}
            <ProfileMenu
                ref={profileMenuRef}
                className={`profile-menu ${isProfileMenuVisible ? 'profile-menu-visible' : 'profile-menu-transition'}`}
            >
                <ProfileMenuOptions>
                    <Link to="/requests">
                        {
                            isAdmin ? 
                            <SelectMenu icon={TfiReceipt} title="Pedidos" /> 
                            : <SelectMenu icon={TfiReceipt} title="Meus pedidos" />
                        }
                    </Link>
                    {
                        !isAdmin &&
                        <Link to="/favorites">
                            <SelectMenu icon={TfiHeart} 
                            title="Favoritos" />
                        </Link>
                    }
                    
                    <Link to="/profile">
                        <SelectMenu icon={TfiUser} title="Atualizar dados" />
                    </Link>
                    
                    <SelectMenu
                        icon={FiLogOut}
                        title="Sair"
                        onClick={handleSignOut}
                    />
                </ProfileMenuOptions>
            </ProfileMenu>
        </Container>
    );
}