import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';
import { TfiSearch, TfiUser } from 'react-icons/tfi';
import { Input } from '../Input';
import { SelectMenu  } from '../SelectMenu';
import { Footer } from '../Footer';
import defaultFood from '../../assets/food.svg';
import { toast } from 'react-hot-toast';// Importa a biblioteca do Toaster do react-hot-toast
import {  Container,  IconMenu,  TitleMenu,  ExpandedMenu,  ExpandedMenuOptions,  Profile,  SearchList } from './styles';

export function Menu() {
  const { signOut, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = user && user.avatar ? `${api.defaults.baseURL}/files/${user.avatar}` : '';
  const avatarStyle = { backgroundImage: user && user.avatar ? `url(${avatarUrl})` : 'none' };
  

  const [isChecked, setIsChecked] = useState(false);
  const [search, setSearch] = useState('');
  const [foods, setFoods] = useState([]);
  const [filteredSearch, setFilteredSearch] = useState([]);

  function handleSignOut() {
    document.documentElement.style.overflowY = "auto";
    navigate("/");
    signOut();
  };

  const expandedMenuRef = useRef(null);

  const handleIconMenuClick = () => {
    setIsChecked(!isChecked);
  };

  const handleMenuItemClick = (id) => {
    handleIconMenuClick();

    const pageNameAndId = window.location.pathname.split('/');

    navigate(`/food/${id}`);

    if (pageNameAndId[1] === 'food' && pageNameAndId[2] !== id.toString()) {
      window.location.reload();
    } else {      setSearch('');
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1049) {
        setIsChecked(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    async function fetchFoods() {
      try {
        const response = await api.get(`/foods/search=${search}`);
        setFoods(response.data);
      } catch (error) {
        console.error('Não foi possível buscar os pratos: ', error);
        toast('Não foi possível buscar os pratos. Por favor, tente novamente.');
      }
    }

    fetchFoods();
  }, [search]);

  useEffect(() => {
    function filterFoodsByNameOrIngredient(searchQuery) {
      searchQuery = searchQuery.toLowerCase();

      var filteredFoods = foods.filter(function (food) {
        return (
          food.name.toLowerCase().includes(searchQuery) ||
          food.ingredients.some((ingredient) =>
            ingredient.name.toLowerCase().includes(searchQuery)
          )
        );
      });

      return filteredFoods;
    }

    var searchResult = filterFoodsByNameOrIngredient(search);
    setFilteredSearch(searchResult);
  }, [search, foods]);

  return !user ? null : (
    <Container>
      <input
        className="checkMenu"
        type="checkbox"
        checked={isChecked}
        onChange={handleIconMenuClick}
      />
      <IconMenu className="iconMenu" onClick={handleIconMenuClick}>
        <span></span>
        <span></span>
        <span></span>
      </IconMenu>
      <TitleMenu className={isChecked ? 'titleMenu' : 'titleMenu hide'}>
        <span>Menu</span>
        <Link to="/profile">
          <Profile style={avatarStyle}>{!user.avatar && <TfiUser />}</Profile>
        </Link>
      </TitleMenu>
      <ExpandedMenu ref={expandedMenuRef} className="expandedMenu">
        <ExpandedMenuOptions>
          <Input
            type="text"
            placeholder="Busque por pratos ou ingredientes"
            icon={TfiSearch}
            onChange={(e) => setSearch(e.target.value)}
          >
            {search && filteredSearch.length > 0 && (
              <SearchList>
                {filteredSearch.map((food) => (
                  <div key={food.id} onClick={() => handleMenuItemClick(food.id)}>
                    <img
                      src={food.image
                          ? `${api.defaults.baseURL}/files/${food.image}`
                          : defaultFood
                        }
                    />
                    <span>{food.name}</span>
                  </div>
                ))}
              </SearchList>
            )}
            {search && filteredSearch.length === 0 && (
              <SearchList>
                <span>Nenhum resultado encontrado!</span>
              </SearchList>
            )}
          </Input>
          <Link to="/requests" onClick={handleIconMenuClick}>
            {isAdmin ? <SelectMenu title="Pedidos" /> : <SelectMenu title="Meus pedidos" />}
          </Link>
          {isAdmin ? (
            <Link to="/add" onClick={handleIconMenuClick}>
              <SelectMenu title="Novo prato" />
            </Link>
          ) : (
            <Link to="/favorites" onClick={handleIconMenuClick}>
              <SelectMenu title="Favoritos" />
            </Link>
          )}
          <SelectMenu title="Sair" onClick={handleSignOut} />
        </ExpandedMenuOptions>
        <Footer />
      </ExpandedMenu>
    </Container>
  );
}
