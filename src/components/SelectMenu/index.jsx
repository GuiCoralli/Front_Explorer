import { Container } from './styles';

export function SelectMenu({ icon: Icon, title, ...rest }) {
    return (
        <Container {...rest}>
            {Icon && <Icon />}
            {title}
        </Container>
    );
}