import { Cliente } from '../../clientes/cliente';
import { ItemFactura } from './item-factura';

export class Factura {
  id: number;
  descripcion: string;
  observacion: string;
  items: ItemFactura[] = [];
  cliente: Cliente;
  importeTotal: number;
  createAt: string;
}
