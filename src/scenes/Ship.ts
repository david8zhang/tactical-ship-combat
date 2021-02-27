import Game from "./Game";

export class Ship {
    public static readonly SPRITE_FRAME_WIDTH = 67;
    public static readonly SPRITE_FRAME_HEIGHT = 114;
    public static readonly SCALE_FACTOR = 0.5;

    constructor(
        private sprite: Phaser.GameObjects.Sprite,
        startTilePosX: number,
        startTilePosY: number
    ) {
        this.sprite.scale = Ship.SCALE_FACTOR;
        this.sprite.setPosition(
            startTilePosX * Game.TILE_SIZE + this.shipOffsetX(),
            startTilePosY * Game.TILE_SIZE + this.shipOffsetY()
        )
        this.sprite.setFrame(3);
    }

    public shipOffsetX() {
        return Game.TILE_SIZE / 2;
    }

    public shipOffsetY() {
        return -((Ship.SPRITE_FRAME_HEIGHT * Ship.SCALE_FACTOR) % Game.TILE_SIZE) / 2;
    }
}