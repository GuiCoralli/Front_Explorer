import React from 'react';
import { BsHexagonFill } from 'react-icons/bs';

import { Container, AdminAccess } from './styles';

export function Trademark({ isAdminAccess}) {
    return (
        <Container>
            <div className="trademark">
                <BsHexagonFill />
                food explorer
            </div>
            
            {isAdminAccess && (

                <AdminAccess>
                  adminaccess
                </AdminAccess>
            )}
        </Container>
    );
}
