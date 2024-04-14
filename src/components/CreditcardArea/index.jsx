import { Container } from './styles';

export function CreditcardArea({ title, children }) {
    return (
        <Container>
            <span>{title}</span>
            {children}
        </Container>
    );
}