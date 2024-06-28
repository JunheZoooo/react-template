import React from 'react';
import {useRoutes} from 'react-router-dom';
import Tab from '@/view/Tab';
import routes from '@/router';
import '@/styles/index.less';

function App() {
    const element = useRoutes(routes);
    return (
        <div className='app'>
            <Tab />
            {element}
        </div>
    );
}

export default App;
