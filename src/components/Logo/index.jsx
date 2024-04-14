import { BsHexagonFill } from 'react-icons/bs';

import { Container, Brand, Admin } from './styles';

export function Logo({ isAdmin }) {
    return (
        <Container>
            <Brand>
                <BsHexagonFill />
                food explorer
            </Brand>
            {isAdmin ? (
                <Admin>
                    admin
                </Admin>
            ) : null}
        </Container>
    );
}