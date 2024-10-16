import { InteractiveLevelObject } from './InteractiveLevelObject';
export class PowerUp extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, -2, extraAttributes);
        this.tilemapHandler = tilemapHandler;
        this.touched = false;
        this.showGainedPowerUpMessageFrames = 140;
        this.currentMessageFrame = 0;
        this.playerPowerUpMapper = {
            powerUpDoubleJumpChecked: "double-jump",
            powerUpWallJumpChecked: "wall-jump",
            powerUpJumpChecked: "jump",
            powerUpDashChecked: "dash"
        }
        if (extraAttributes?.collectedInGame) {
            this.touched = true;
        }
        if(!extraAttributes.PowerUp) {
            this.PowerUp = 'double-jump';
        }
    }

    resetObject() {
        if (WorldDataHandler.insideTool) {
            this.touched = false;
            Object.keys(this.playerPowerUpMapper).forEach(powerUp => {
                this.tilemapHandler.player[powerUp] = false;
            })
        }
    }

    collisionEvent() {
        if (!this.touched) {
            this.touched = true;
            this.currentMessageFrame = this.showGainedPowerUpMessageFrames;
            const playerAttribute = Object.keys(this.playerPowerUpMapper).find(key =>
                this.playerPowerUpMapper[key] === this.PowerUp);
            this.tilemapHandler.player[playerAttribute] = true;
            PlayMode.currentPauseFrames = this.showGainedPowerUpMessageFrames;
            SoundHandler.powerUp.play();
            if (!WorldDataHandler.insideTool) {
                const thisObjectInWorldData = WorldDataHandler.levels[this.tilemapHandler.currentLevel].levelObjects.find(levelObject =>
                    levelObject.type === ObjectTypes.POWER_UP
                    && levelObject.x === this.initialX
                    && levelObject.y === this.initialY);
                thisObjectInWorldData.extraAttributes = { ...thisObjectInWorldData.extraAttributes, collectedInGame: true }
            }
        }
    }

    draw(spriteCanvas) {
        if (this.currentMessageFrame > 0) {
            if(this.currentMessageFrame % 10 === 0) {
                SFXHandler.createSFX(this.x, this.y, 12, 
                    this.facingDirection, 
                    MathHelpers.getSometimesNegativeRandomNumber(1, 3, false), 
                    MathHelpers.getSometimesNegativeRandomNumber(1, 3, false), 
                    true, 40, 1, "backgroundSFX")
            }
            Display.displayText(this.PowerUp,
                this.x + this.tileSize / 2, this.y - this.tileSize * 1.1, 14,
                this.currentMessageFrame % 20 > 10 ? "#FFFFFF" : "#000000");
            this.currentMessageFrame--;
        }
        if (this.touched) {
            super.drawWithAlpha(spriteCanvas, 0.1);
        }
        else {
            super.draw(spriteCanvas);
        }
    }
}