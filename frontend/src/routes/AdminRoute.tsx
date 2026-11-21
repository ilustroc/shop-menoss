import { Navigate, Outlet } from 'react-router-dom';
import { session } from '../services/session';
export default function AdminRoute(){return session()?.rol === 'ADMINISTRADOR' ? <Outlet/> : <Navigate to="/login" replace/>;}
