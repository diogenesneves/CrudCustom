import { InMemoryDbService } from "angular-in-memory-web-api";

import { Pendency } from "./pages/categories/shared/pendency.model";

export class InMemoryDatabase implements InMemoryDbService{
    createDb(){
        const pendencies: Pendency[] = [
            {id: 1, nome: "Diogenes", descricao: "Escrever o nome Camila na Mandala", corDoBanho: "dourado" },
            {id: 2, nome: "Diogenes", descricao: "Escrever o nome Camila na Mandala", corDoBanho: "dourado" },
        ];

        return { pendencies }
    }
}