import { useState, useEffect } from 'react';
import { modeDark, modeLight } from './theme';

export const useThemeChangeConfig = () => {
  // Correção: useState retorna um array com o estado e a função de atualização
  const [themeMode, setThemeMode] = useState('modeLight');

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'modeLight' ? 'modeDark' : 'modeLight'));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'modeLight';
    setThemeMode(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  return {
    themeMode,
    toggleTheme,
    theme: themeMode === 'modeLight' ? modeLight : modeDark,
  };
};
