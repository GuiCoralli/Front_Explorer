import { Container } from './styles';

export function CardPayment({ title, children }) {

    return (
        <Container>
            <div>
                <span>{title}</span>
            </div>

            <div>
                <div>{children}</div>
            </div>      
        </Container>
    );
}



