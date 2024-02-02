import React from 'react';
import { Container } from './styles';

export function ItemMenu({ icon: Icon, title, ...rest }) {
    
    const IconComponent = Icon && <Icon />;

    return (
        <Container {...rest}>
            {IconComponent}
            {title}
        </Container>
    );
}
