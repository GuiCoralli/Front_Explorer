import { BsHexagonFill } from 'react-icons/bs';

import { Container, AdminAccess } from './styles';

export function Trademark({ isAdminAccess}) {
    return (
        <Container>
            <Trademark>
                <BsHexagonFill />
                food explorer
            </Trademark>
            {isAdminAccess ? (
                <AdminAccess>
                    adminaccess
                </AdminAccess>
            ) : null}
        </Container>
    );
}