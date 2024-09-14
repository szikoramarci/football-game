class PlayerMovementManager {
    playerPositions = new Map();

    constructor() {
        if (!PlayerMovementManager.instance) {
            PlayerMovementManager.instance = this;
        }

        return PlayerMovementManager.instance;
    }

    move(player, hex) {
        console.log(player);
     //   this.playerPositions.set(player.id, hex);
    }

}

export default new PlayerMovementManager();