import { SwitchableBlock } from './SwitchableBlock';
export class PinkBlock extends SwitchableBlock{

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tilemapHandler, AnimationHelper.switchableBlockColors.blue, extraAttributes);
        this.setBlockState(this.activeTileIndex, true);
    }

    resetObject() {
        if(this.tilemapHandler && !PlayMode.checkActiveCheckPoints()) {
            this.setBlockState(this.activeTileIndex, true);
            this.tilemapHandler.currentJumpSwitchBlockType = this.tilemapHandler.jumpSwitchBlockTypes.violet;
        }
    }

    collisionEvent() {
    }

    draw(spriteCanvas) {
        if(this.tilemapHandler.currentJumpSwitchBlockType === this.tilemapHandler.jumpSwitchBlockTypes.pink
            && !this.active
        ) {
            this.setBlockState(this.activeTileIndex, true);
        }
        else if(this.tilemapHandler.currentJumpSwitchBlockType === this.tilemapHandler.jumpSwitchBlockTypes.violet
            && this.active
        ) {
            this.setBlockState(0, false);
        }
        super.draw(spriteCanvas);
    }
}