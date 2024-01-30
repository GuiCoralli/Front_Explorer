import { Routes, Route } from 'react-router-dom';

import { Home } from '../pages/Home';
import { Plate } from '../pages/Plate';
import { IncludePlate  } from '../pages/IncludePlate';
import { EditPlate  } from '../pages/EditPlate';
import { Profile } from '../pages/Profile';
import { RequestOrders } from '../pages/RequestOrders';
import { NotFound } from '../pages/NotFound';

export function AdminAccessRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/plate/:id" element={<Plate />} />
            <Route path="/includeplate" element={<IncludePlate />} />
            <Route path="/editplate/:id" element={<EditPlate />} />
            <Route path="/requestorders" element={<RequestOrders />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}