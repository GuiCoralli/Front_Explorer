import { Container } from './styles';

export function CardPayment({ title, children }) {
    return (
        <Container>
            <span>{title}</span>
            {children}
        </Container>
    );
}