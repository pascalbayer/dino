export class Dino {
    private static client : any;

    static setClient (client : any) : void {
        this.client = client;
    }

    static getClient () : any {
        return this.client;
    }
}