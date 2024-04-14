// Bibliotecas do React importadas
import React from 'react';
import ReactDOM from 'react-dom'; // Importe o ReactDOM corretamente

// Importando as Rotas dos usuários
import { AppRoutes } from './routes/index';

// Prover um tema às páginas
import { ThemeProvider } from 'styled-components';

// Estilo Global para fontes e cores da página
import GlobalStyles from './styles/global';

// Importa do AuthProvider
import { AuthProvider } from './hooks/auth';

// Importa o hook personalizado useThemeChangeConfig
import { useThemeChangeConfig } from './styles/useThemeChangeConfig';

// Componente para o botão de mudança de temas
import { ThemeChanger } from './components/ThemeChanger';

// Defina a função App como um componente React
const App = () => {
  // Modifiquei para utilizar useThemeChangeConfig
  const { themeMode, toggleTheme } = useThemeChangeConfig();

  // Retorne a estrutura do aplicativo
  return (
    <React.StrictMode>
      <ThemeProvider theme={themeMode}>
        <GlobalStyles />
        <AuthProvider>
          <AppRoutes />
          <ThemeChanger theme={themeMode} toggleTheme={toggleTheme} />
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
};

// Renderize o aplicativo
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
