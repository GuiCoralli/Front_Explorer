import React from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { Container } from './styles';


export function PlateDetails({ $isNew, value, onClick, ...rest }) {
    
    const IconComponent = $isNew ? <FaPlus /> : <FaTimes/>;

    return (
        <Container $isNew={$isNew} size={value.length}>
            <input
                type="text"
                value={value}
                readOnly={!$isNew}
                {...rest}
            />

            <button
                type="button"
                onClick={onClick}
            >                
                {IconComponent}
            </button>
        </Container>
    );
}

