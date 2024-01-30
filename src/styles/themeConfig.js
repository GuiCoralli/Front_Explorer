import { useState, useEffect } from 'react';

export const themeConfig = () => {
    const [theme, setThemeChange] = useState("themeDark");

    const setModeTheme = mode => {
        window.localStorage.setItem("@foodexplorer:theme", mode);
        setThemeChange(mode);
    };

    const toggleThemeMode = () => {
        theme === "themeDark" ? setModeTheme("themeLight") : setModeTheme("themeDark");
    };

    useEffect(() => {
        const localThemeChange = window.localStorage.getItem("@foodexplorer:theme");
        localThemeChange ? setModeTheme(localThemeChange) : setModeTheme("themeDark");
    }, []);

    return { theme, toggleThemeMode };
};