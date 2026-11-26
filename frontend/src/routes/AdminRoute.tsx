import { Navigate, Outlet } from 'react-router-dom';
import { esAdministrador } from '../services/session';
export default function AdminRoute(){return esAdministrador() ? <Outlet/> : <Navigate to="/login" replace/>;}
