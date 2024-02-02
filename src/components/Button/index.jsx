import { Container } from './styles';

export function Button({ title, loading, children, ...rest }) {
    
    const buttonContent = loading ? "Carregando...": title;

    return (
        <Container
            type="button"
            disabled={loading}
            {...rest}
        >
            {buttonContent}
            {children}
        </Container>
    );
}
