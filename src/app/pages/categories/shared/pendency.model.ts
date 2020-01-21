export class Pendency{
    constructor(
        public id?:number,
        public nome?: string,
        public descricao?: string,
        public corDoBanho?: string,
        public dataPedido?: string,
        public foto?: string,
        public status?: boolean
    ){}
}