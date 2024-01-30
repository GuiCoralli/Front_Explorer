import { Container, Content, ButtonLight, ButtonDark } from './styles';
import React, { useRef, useEffect } from 'react';
import btnLight from '../../assets/btn-light.svg';
import btnDark from '../../assets/btn-dark.svg';

export function ChangeMode({ toggleThemeMode }) {

    const contentRef = useRef(null);
    const buttonLightRef = useRef(null);
    const buttonDarkRef = useRef(null);

    function checkChangeTheme() {
        const localThemeChange = window.localStorage.getItem("@foodexplorer:theme");

        if (localThemeChange === "themeLight") {
            buttonLightRef.current.classList.add("fadeIn");
            buttonDarkRef.current.classList.remove("fadeIn");
            buttonLightRef.current.classList.remove("moveRight");
            buttonDarkRef.current.classList.remove("moveRight");
        } else {
            buttonLightRef.current.classList.remove("fadeIn");
            buttonDarkRef.current.classList.add("fadeIn");
            buttonLightRef.current.classList.add("moveRight");
            buttonDarkRef.current.classList.add("moveRight");
        };
    };

    function changeThemeMode() {
        toggleThemeMode();
        checkChangeTheme();
    };

    useEffect(() => {
        checkChangeTheme();
    }, []);

    return (
        <Container>
            <Content onClick={changeThemeMode} ref={contentRef} className="Content">
                <ButtonLight ref={buttonLightRef} className="ButtonLight">
                    <img src={btnLight} alt="Muda para o modo escuro." />
                </ButtonLight>
                <ButtonDark ref={buttonDarkRef} className="ButtonDark">
                    <img src={btnDark} alt="Muda para o modo claro." />
                </ButtonDark>
            </Content>
        </Container>
    );
};