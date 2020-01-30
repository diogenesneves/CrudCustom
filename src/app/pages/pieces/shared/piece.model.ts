export class Piece{
    constructor(
        public id?:number,
        public nome?: string,
        public codigo?: string,
        public valor?: string,
        public tipo?: string,
        public status?: boolean,
        public photo?: string,
        public obs?: string
    ){}
}