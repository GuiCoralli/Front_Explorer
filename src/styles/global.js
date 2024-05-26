import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    :root {
        font-size: 62.5%;
        --hot-toast-color-light: ${({ theme }) => theme.COLORS.DARK_900};
		--hot-toast-text-color-light: ${({ theme }) => theme.COLORS.LIGHT_100};
		--hot-toast-toast-min-height: 4.8rem;
		--hot-toast-color-progress-light: linear-gradient(to right, 
            ${({ theme }) => theme.COLORS.DARK_1000},
			${({ theme }) => theme.COLORS.LIGHT_700}
		);
    }

        #root {
            min-height: 100vh;
        }

    * {
        margin:0;
        padding: 0;
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
    }


    body, input, button, textarea {
        font-family: "Roboto", sans-serif;
        font-size: 1.6rem;
        outline: none;
        
        -webkit-font-smoothing: antialiased;

    }

    body {
        background-color: ${( { theme }) => theme.COLORS.LIGHT_300};
        font-family: ${({ theme }) => theme.FONTS?.POPPINS_100 || '"Roboto", sans-serif'};
        color: ${( {theme }) => theme.COLORS.LIGHT_100};

    }

    a {
        text-decoration: none;
    }

    button, a  {
        cursor: pointer;
        transition: filter 0.2s;
    }

    button:hover, a:hover  {
        filter: brightness(0.8);
    }

    #root {
        height: 100%;
    }

    ::-webkit-scrollbar {
        width: 1rem;
    }

    ::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.COLORS.DARK_1000};
        border-radius: 0.5rem;
    }

    * {
        scrollbar-color: ${({ theme }) => theme.COLORS.DARK_1000} transparent;
    }

    *::-moz-scrollbar-thumb {
        background-color: orange;
        border-radius: 0.5rem;
    }

    ::-ms-scrollbar {
        width: 0.5rem;
    }

    ::-ms-scrollbar-thumb {
        background-color: ${({ theme }) => theme.COLORS.DARK_1000};
        border-radius: 0.5rem;
    }


`;

