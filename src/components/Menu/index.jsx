import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

import { TfiSearch, TfiUser } from 'react-icons/tfi';

import { Input } from '../Input';
import { ItemMenu } from '../ItemMenu';
import { Footer } from '../Footer';
import defaultPlate from '../../../src/assets/plate.svg';

import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

import { Container, IconMenu, TitleMenu, ExpandedMenu, ExpandedMenuOptions, Profile, SearchList } from './styles';

export function Menu() {
    const { signOut, user, isAdminAccess } = useAuth();
    const navigate = useNavigate()

    const avatarUrl = `${api.defaults.baseURL}/files/${user.avatar}`;

    const avatarStyle = { backgroundImage: user.avatar ? `url(${avatarUrl})` : 'none' };

    const [isChecked, setIsChecked] = useState(false);
    const titleMenu = !isChecked ? "titleMenu hide" : "titleMenu";
    const expandedMenuRef = useRef(null);
    const [search, setSearch] = useState("");
    const [plates, setPlates] = useState([]);
    const [filteredSearch, setFilteredSearch] = useState([]);

    function handleSignOut() {
        document.documentElement.style.overflowY = "auto";
        navigate("/");
        signOut();
    };

    const handleIconMenuClick = () => {
        setIsChecked(!isChecked);

        if (expandedMenuRef) {
            if (!isChecked) {
                expandedMenuRef.current.classList.remove("animateCloseMenu");
                expandedMenuRef.current.classList.add("animateOpenMenu");
            } else {
                expandedMenuRef.current.classList.remove("animateOpenMenu");
                expandedMenuRef.current.classList.add("animateCloseMenu");
                setTimeout(() => {
                    if (expandedMenuRef.current) {
                        expandedMenuRef.current.classList.remove("animateCloseMenu");
                    }
                }, 300);
                document.querySelector(".expandedMenu input").value = "";
                setSearch("");
            };
        };
    };

    function handlePlate(id) {
        const pageNameAndId = window.location.pathname.split("/");

        navigate(`/plate/${id}`);

        if (pageNameAndId[1] === "plate" && pageNameAndId[2] !== id.toString()) {
            window.location.reload();
        } else {
            setIsChecked(false);
            expandedMenuRef.current.classList.remove("animateOpenMenu");
            document.querySelector(".expandedMenu input").value = "";
            setSearch("");
        };
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1049) {
                setIsChecked(false);
                expandedMenuRef.current.classList.remove("animateOpenMenu");
                document.querySelector(".expandedMenu input").value = "";
                setSearch("");
            };
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        async function fetchPlates() {
            try {
                const response = await api.get(`/plates?itemSearch=${search}`);

                setPlates(response.data);
            } catch (error) {
                console.error("Não foi possível buscar pelo prato desejado: ", error);
                toast("Não foi possível buscar pelo prato desejado, tente novamente.");
            };
        };

        fetchPlates();
    }, []);

    useEffect(() => {
        if (isChecked) {
            document.documentElement.style.overflowY = "hidden";
        } else {
            document.documentElement.style.overflowY = "auto";
        }
    }, [isChecked]);

    useEffect(() => {
        function filterfetchPlatesByNameOrIngredient(searchQuery) {
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
        }

        var searchResult = filterfetchPlatesByNameOrIngredient(search);
        setFilteredSearch(searchResult);

    }, [search]);

    return (
        <Container>
            <input
                className="checkMenu"
                type="checkbox"
                checked={isChecked}
                onClick={handleIconMenuClick}
                onChange={() => { }}
            />
            <IconMenu className="iconMenu" onClick={handleIconMenuClick}>
                <span></span>
                <span></span>
                <span></span>
            </IconMenu>
            <TitleMenu className={titleMenu}>
                <span>Menu</span>
                <Link to="/profile">
                    <Profile style={avatarStyle}>
                        {
                            !user.avatar && <TfiUser />
                        }
                    </Profile>
                </Link>
            </TitleMenu>
            <ExpandedMenu ref={expandedMenuRef} className="expandedMenu">
                <ExpandedMenuOptions>
                    <Input
                        type="text"
                        placeholder="Encontre seus pratos e ingredientes"
                        icon={TfiSearch}
                        onChange={(e) => setSearch(e.target.value)}
                    >
                        {
                            search && filteredSearch.length > 0 &&
                            <SearchList>
                                {
                                    filteredSearch.map(plate =>
                                        <div key={plate.id} onClick={() => handlePlate(plate.id)}>
                                            {
                                                plate.image ? (
                                                    <img src={`${api.defaults.baseURL}/files/${plate.image}`} />
                                                ) : (
                                                    <img src={defaultPlate} />
                                                )
                                            }
                                            <span>{plate.name}</span>
                                        </div>
                                    )
                                }
                            </SearchList>
                        }
                        {
                            search && filteredSearch.length === 0 &&
                            <SearchList><span>Nenhum resultado encontrado!</span></SearchList>
                        }
                    </Input>
                    <Link to="/requestorders" onClick={handleIconMenuClick}>
                        {
                            isAdminAccess ? <ItemMenu title="Pedidos" /> : <ItemMenu title="Meus pedidos" />
                        }
                    </Link>
                    {isAdminAccess ? (
                        <Link to="/add" onClick={handleIconMenuClick}>
                            <ItemMenu title="Novo prato" />
                        </Link>
                    ) : (
                        <Link to="/preferences" onClick={handleIconMenuClick}><ItemMenu title="Preferidos" /></Link>
                    )}
                    <ItemMenu
                        title="Sair"
                        onClick={handleSignOut}
                    />
                </ExpandedMenuOptions>
                <Footer />
            </ExpandedMenu>
        </Container>
    );
}