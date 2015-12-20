var Dino = (function () {
    function Dino() {
    }
    Dino.setClient = function (client) {
        this.client = client;
    };
    Dino.getClient = function () {
        return this.client;
    };
    return Dino;
})();
exports.Dino = Dino;
