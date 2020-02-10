import { InMemoryDbService } from "angular-in-memory-web-api";

import { Pendency } from "./pages/categories/shared/pendency.model";
import { Piece } from './pages/pieces/shared/piece.model';

export class InMemoryDatabase implements InMemoryDbService{
    createDb(){
        const pendencies: Pendency[] = [
            {id: 1, nome: "Camila Cristina Quaglia", descricao: "Escrever o nome Diogenes na Mandala", corDoBanho: "dourado", status: true  },
            {id: 2, nome: "Diogenes", descricao: "Escrever o nome Camila na Mandala", corDoBanho: "dourado", status: true },
        ];

        const pieces: Piece[] = [
            {id: 1, nome: "Mandala redonda", codigo: "4324334", valor: "450,00", status: true  },
            {id: 2, nome: "Anel com brilhantes", codigo: "4324343434", valor: "200,00", status: true },
        ];

        return { pendencies, pieces }
    }
}