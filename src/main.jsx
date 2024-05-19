import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AppRoutes } from './routes';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/global';
import { AuthProvider } from './hooks/auth';
import { useThemeChangeConfig } from './styles/useThemeChangeConfig';
import { ThemeChanger } from './components/ThemeChanger';

const App = () => {
  const [loading, setLoading] = useState(true);
  const { themeMode, toggleTheme, theme } = useThemeChangeConfig();

  useEffect(() => {
    setLoading(false);
  }, [theme]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthProvider>
          <AppRoutes />
          <ThemeChanger theme={themeMode} toggleTheme={toggleTheme} />
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
