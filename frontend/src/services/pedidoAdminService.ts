import api from './api';
import { mapearPedidoBackend } from './pedidosService';
import type { EstadoPedido, Pedido } from '../types/pedido';
export async function listarPedidos(): Promise<Pedido[]> {
 const resumen = (await api.get<{id:number}[]>('/admin/pedidos')).data;
 return Promise.all(resumen.map(async p => mapearPedidoBackend((await api.get('/admin/pedidos/'+p.id)).data)));
}
export async function cambiarEstadoPedido(id:string,estado:EstadoPedido):Promise<void>{await api.put('/admin/pedidos/'+id+'/estado',{estado:estado.toUpperCase()});}
