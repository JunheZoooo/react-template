import React from 'react';
import {observer} from 'mobx-react-lite';
import {Card} from '@/components';
import './index.less';
import HorizontalLinearStepper from 'Components/Step';


const HomeFormSubmit = () => {

    return (
        <div className='home-one-root'>
            <div className='one-card'>
                <Card>
                    <HorizontalLinearStepper >
                        this is some thing
                    </HorizontalLinearStepper>
                </Card>
            </div>
        </div>
    );
};

export default observer(HomeFormSubmit);
