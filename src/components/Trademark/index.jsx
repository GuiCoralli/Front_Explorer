import React from 'react';
import { BsHexagonFill } from 'react-icons/bs';

import { Container, Trademark, AdminAccess } from './styles';

export function Trademark({ isAdminAccess}) {
    return (
        <Container>
            <Trademark>
                <BsHexagonFill />
                food explorer
            </Trademark>
            {isAdminAccess && (
                <AdminAccess>
                    adminaccess
                </AdminAccess>
            )}
        </Container>
    );
}