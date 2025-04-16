import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface ThemeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    darkMode: false,
    toggleDarkMode: () => {}
})

export const useThemeMode = () => useContext(ThemeContext);

export const CustomThemeProvider = ({children}: {children: ReactNode}) => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("darkMode");
        return saved ? JSON.parse(saved) : false;
    });

    const toggleDarkMode = () => {
        setDarkMode((prev:any) => {
            localStorage.setItem("darkMode", JSON.stringify(!prev));
            return !prev
        });
    };

    const theme = useMemo(
        () => createTheme({
            palette: {
                primary: {
                    main: '#000000'
                },
                mode: darkMode ? "dark" : "light",
            },
        }),
        [darkMode]
    )

    return (
        <ThemeContext.Provider value={{darkMode, toggleDarkMode}}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}