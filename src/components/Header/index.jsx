import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

import { TfiReceipt, TfiUser, TfiHeart } from 'react-icons/tfi';
import { FiLogOut } from 'react-icons/fi';

import defaultPlate from '../../../src/assets/plate.svg';
import { Trademark }  from '../Trademark';
import { Input } from '../Input';
import { Button } from '../Button';
import { Menu } from '../Menu';
import { ItemMenu } from '../ItemMenu';

import { Container, ReceiptRequestOrders, RequestOrder, Profile, ProfileMenu, ProfileMenuOptions, SearchList } from './styles';

export function Header(props) {
    const { signOut, user, isAdminAccess } = useAuth();

    const navigate = useNavigate();

    const { setItemSearch, page, requestOrderItems, totalRequestOrder } = props;

    const [plates, setPlates] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);

    const avatarUrl = `${api.defaults.baseURL}/files/${user.avatar}`;
    const avatarStyle = { backgroundImage: user.avatar ? `url(${avatarUrl})` : 'none' };

    const querySizeWidth = 1050;
    const [windowSizeWidth, setWindowSizeWidth] = useState(window.innerWidth);
    const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);

    const [search, setSearch] = useState("");
    const [hasSearchButton, setHasSearchButton] = useState(false);
    const [filteredSearch, setFilteredSearch] = useState([]);

    const profileMenuRef = useRef(null);
    const profileRef = useRef(null);

    function handleSignOut() {
        document.documentElement.style.overflowY = "auto";
        navigate("/");
        signOut();
    };

    function handlePlate(id) {
        const pageNameAndId = window.location.pathname.split("/");

        navigate(`/plate/${id}`);

        if (pageNameAndId[1] === "plate" && pageNameAndId[2] !== id.toString()) {
            window.location.reload();
        } else {
            document.querySelector("#searchPlates").value = "";
            setSearch("");
        };
    };

    function toggleProfileMenu() {
        if (isProfileMenuVisible) {
            setIsProfileMenuVisible(false);
        } else {
            setIsProfileMenuVisible(true);
        };
    };

    useEffect(() => {
        function handleClickOutside(event) {
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
        setHasSearchButton(!search);
    }, [search]);

    useEffect(() => {
        if (page === "home") {
            setItemSearch(search);
        };

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

        var searchResult = filterPlatesByNameOrIngredient(search);
        setFilteredSearch(searchResult);
    }, [search]);

    useEffect(() => {
        async function fetchPlates() {
            try {
                const response = await api.get("/plates");
                setPlates(response.data);
            } catch (error) {
                console.error("Erro ao buscar pratos: ", error);
                toast("Erro ao buscar os pratos, tente novamente.");
            };
        };

        fetchPlates();

        function handleResize() {
            setWindowSizeWidth(window.innerWidth);

            if (window.innerWidth < querySizeWidth) {
                setIsProfileMenuVisible(false);
                setSearch("");
            };
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const oldItems = JSON.parse(localStorage.getItem("@foodexplorer:requestorder"));

        if (oldItems && oldItems.plates) {
            let total = 0;

            for (const plate of oldItems.plates) {
                if (plate.quantity) {
                    total += plate.quantity;
                };
            };
            setTotalQuantity(total);
        } else {
            setTotalQuantity(requestOrderItems);
        };

    }, [requestOrderItems, totalRequestOrder]);

    return (
        <Container>
            <Menu />
            <Link to="/"><Trademark  isAdminAccess={isAdminAccess} /> </Link>
            {windowSizeWidth >= querySizeWidth && (
                <Input
                    id="searchPlates"
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Buscar por pratos ou Ingredientes"
                    searchPlaceholder={hasSearchPlaceholder}
                    value={search}
                >
                    {
                        search && filteredSearch.length > 0 && page !== "home" &&
                        <SearchList>
                            {
                                filteredSearch.map(plate =>
                                    <div key={plates.id} onClick={() => handlePlate(plate.id)}>
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
                        search && filteredSearch.length === 0 && page !== "home" &&
                        <SearchList><span>Não foi encontrado nenhum resultado!</span></SearchList>
                    }
                </Input>
            )}
            {windowSizeWidth >= querySizeWidth ? (
                isAdminAccess ? (
                    <Link to="/add">
                        <Button>
                            Novo prato
                        </Button>
                    </Link>
                ) : (
                    <Link to="/requestPayment">
                        <Button>
                            <TfiReceipt />{`Pedido (${totalQuantity})`}
                        </Button>
                    </Link>
                )
            ) : (
                isAdminAccess ? null : (
                    <Link to="/requestPayment">
                        <ReceiptRequestOrders>
                            <TfiReceipt />
                            <RequestOrder>
                                {totalQuantity}
                            </RequestOrder>
                        </ReceiptRequestOrders>
                    </Link>
                )
            )}
            {windowSizeWidth >= querySizeWidth && (
                <Profile
                    ref={profileRef}
                    style={avatarStyle}
                    onClick={toggleProfileMenu}
                >
                    {
                        !user.avatar && <TfiUser />
                    }
                </Profile>
            )}
            <ProfileMenu
                ref={profileMenuRef}
                className={`profile-menu ${isProfileMenuVisible ? 'profile-menu-visible' : 'profile-menu-transition'}`}
            >
                <ProfileMenuOptions>
                    <Link to="/requestorders">
                        {
                            isAdminAccess ? <ItemMenu icon={TfiReceipt} title="Pedidos" /> : <ItemMenu icon={TfiReceipt} title="Meus pedidos" />
                        }
                    </Link>
                    {
                        !isAdminAccess &&
                        <Link to="/preferences"><ItemMenu icon={TfiHeart} title="Preferidos" /></Link>
                    }
                    <Link to="/profile"><ItemMenu icon={TfiUser} title="Atualizar dados" /></Link>
                    <ItemMenu
                        icon={FiLogOut}
                        title="Sair"
                        onClick={handleSignOut}
                    />
                </ProfileMenuOptions>
            </ProfileMenu>
        </Container>
    );
}