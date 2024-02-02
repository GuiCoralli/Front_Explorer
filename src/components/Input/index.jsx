import React from 'react';
import { Placeholder } from '../Placeholder';
import { Container } from './styles';

export function Input({ icon: Icon, searchPlaceholder, children, ...rest }) {
    
    const IconComponent = Icon && <Icon size={24} />;
    
    const PlaceholderComponent = searchPlaceholder && <Placeholder />;

    return (
        <Container>
            {IconComponent}
            {PlaceholderComponent}
            <input autoComplete="off" {...rest} />
            {children}
        </Container>
    );
}

