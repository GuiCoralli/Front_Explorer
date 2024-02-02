import React from 'react';

import { Container } from './styles';

export function CheckIngredients({ title }) {

    const Content = () => (

        <Container>
            {title}
        </Container>
    );

    return Content();

}