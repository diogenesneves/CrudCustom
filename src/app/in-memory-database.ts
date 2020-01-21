import { InMemoryDbService } from "angular-in-memory-web-api";

import { Pendency } from "./pages/categories/shared/pendency.model";

export class InMemoryDatabase implements InMemoryDbService{
    createDb(){
        const pendencies: Pendency[] = [
            {id: 1, nome: "Camila Cristina Quaglia", descricao: "Escrever o nome Diogenes na Mandala", corDoBanho: "dourado", dataPedido: "19/01/2020", status: true  },
            {id: 2, nome: "Diogenes", descricao: "Escrever o nome Camila na Mandala", corDoBanho: "dourado", dataPedido: "20/01/2020", status: true },
        ];

        return { pendencies }
    }
}