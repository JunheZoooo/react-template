import React from 'react';

import Tab from '@/view/Tab';
import routes from '@/router';
import '@/styles/index.less';
import{ThemeProvider, createTheme} from '@mui/material/styles';
import {useRoutes} from 'react-router-dom';
const theme = createTheme();
function App() {
    const element = useRoutes(routes);
    return (
        <ThemeProvider theme={theme}>
            <div className='app'>
                <Tab />
                {element}
            </div>
        </ThemeProvider>
    );
}

export default App;
