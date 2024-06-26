import styled from 'styled-components';
/* Estilos do container */
export const Container = styled.div`
    max-width: 100%;
    overflow-x: auto;
    position: relative;
    animation: leftToRight 0.3s ease-in;

    > h2 {
        position: relative;
        color: ${({ theme }) => theme.COLORS.LIGHT_300};
        font: ${({ theme }) => theme.FONTS.POPPINS_400};
        margin-bottom: 2.4rem;
        z-index: 1;
    }
`;
 /* Estilos do botão de controle (left/right) */
export const ControlButton = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 5rem;
    width: 5rem;
    font-size: 2.7rem;
    z-index: 1;
    border-radius: 50%;
    transition: all 0.3s;
    background: transparent;

    svg {
        transition: transform ease 0.3s;
    }

    &:hover {
        cursor: pointer;
        background: ${({ theme }) => theme.COLORS.DARK_1000};
    }

    &:hover svg {
        transform: scale(1.3);
    }

    @media (max-width: 1049px) {
        ${({ position }) => position === 'left' ? 'left: 0;' : 'right: 0;'}
    }
`;
/* Estilos dos gradientes*/
export const Gradient = styled.div`
    position: absolute;
    top: 0;
    ${({ side }) => side === 'left' ? 'right: 0;' : 'left: -0.1rem; transform: matrix(-1, 0, 0, 1, 0, 0);'}
    height: 100%;
    width: 27.7rem;
    background: ${({ theme }) => theme.COLORS.GRADIENTS_100};
    pointer-events: none;

    @media (max-width: 1049px) {
        width: 7rem;
    }
`;
 /* Estilos do conteúdo do carrossel */
export const RoundaboutContent = styled.div`
    position: relative;
    display: flex;
    gap: 2.7rem;
    padding: 0 15rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }

    > div {
        scroll-snap-align: center;
    }

    @media (max-width: 1049px) {
        padding: 0 4rem;
    }
`;
