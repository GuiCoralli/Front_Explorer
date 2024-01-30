import { Routes, Route } from 'react-router-dom';

import { AdminAccess  } from '../pages/AdminAccess';
import { NotFound } from '../pages/NotFound';

export function RegisterRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AdminAccess />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}