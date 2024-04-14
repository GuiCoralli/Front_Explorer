import React from 'react';

import { toast } from 'react-hot-toast';

import { Container,  AnimationButtons} from './styles';

export const Toaster = ({ sucess, error, promise, message, onSucess, onError, onPromise }) => {
    const handleSucess = () => {
        toast.dismiss();
        onSucess();
    };

    const handleError = () => {
        toast.dismiss();
        onError();
    };

    const handlePromise = () => {
        toast.dismiss();
        onPromise();
    };
    
    return (
        <Container>
            {message}
            <AnimationButtons>
                <button onClick={handleSucess}>{sucess}</button>
                <button onClick={handleError}>{error}</button>
                <button onClick={handlePromise}>{promise}</button>
            </AnimationButtons>
        </Container>
    );
}