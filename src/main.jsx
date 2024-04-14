import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // Corrigindo a importação do ReactDOM

// Importando as Rotas dos usuários
import { AppRoutes } from './routes/index';

// Prover um tema às páginas
import { ThemeProvider } from 'styled-components';

// Estilo Global para fontes e cores da página
import GlobalStyles from './styles/global';

// Modo escuro e claro
import { modeDark, modeLight } from './styles/theme';

// Importa do AuthProvider
import { AuthProvider } from './hooks/auth';

// Importa o hook personalizado useThemeChangeConfig
import { useThemeChangeConfig } from './styles/useThemeChangeConfig';

// Componente para o botão de mudança de temas
import { ThemeChanger } from './components/ThemeChanger';

// Defina a função App como um componente React
const App = () => {
  const [loadingPage, setLoadingPage] = useState(true); // Estado para indicar se o carregamento está em andamento

  // Modifiquei para utilizar useThemeChangeConfig
  const { themeMode, toggleTheme } = useThemeChangeConfig();

  useEffect(() => {
    async function fetchTheme() {
      try {
        // Não é necessário utilizar o hook aqui novamente
        // A variável themeMode já está disponível como retorno do hook
        setTheme(themeMode === "modeLight" ? modeLight : modeDark);
      } catch (error) {
        console.error("Erro ao carregar o tema:", error);
      } finally {
        setLoadingPage(false); // Atualiza o estado de carregamento, independentemente do resultado
      }
    }

    fetchTheme(); // Chama a função de busca do tema ao montar o componente
  }, []); // Executa apenas uma vez, após a montagem inicial do componente

  if (loadingPage) {
    return <div>Carregando...</div>; // Renderiza uma mensagem de carregamento enquanto a promessa está pendente
  }

  // Retorne a estrutura do aplicativo
  return (
    <React.StrictMode>
      <ThemeProvider theme={themeMode}>
        <GlobalStyles />
        <AuthProvider>
          <AppRoutes />
          {/* Modifiquei para passar themeMode e toggleTheme do hook */}
          <ThemeChanger theme={themeMode} toggleTheme={toggleTheme} />
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};

// Renderize o aplicativo
ReactDOM.render(<App />, document.getElementById('root')); // Corrigindo a renderização com ReactDOM.render
