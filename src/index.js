import './styles/style.js';
import './images/icons/icons.js';

import { WorldDataHandler } from './handlers/WorldDataHandler.js';
import { SoundHandler } from './handlers/SoundHandler.js';
import { AnimationHelper } from './AnimationHelper.js';
import { SpritePixelArrays } from './utils/SpritePixelArrays.js';
import { Player } from './Player.js';
import { Game } from './Game.js';
import { TransitionAnimationHandler } from './TransitionAnimationHandler.js';
import { Camera } from './Camera.js';
import { EffectsHandler } from './handlers/EffectsHandler.js';
import { TileMapHandler } from './handlers/TileMapHandler.js';
import { DialogueHandler } from './handlers/DialogueHandler.js';
import { Display } from './Display.js';
import { Controller } from './Controller.js';
import { DrawSectionHandler } from './handlers/DrawSectionHandler.js';
import { Collision } from './Collision.js';
import { SpriteSheetCreator } from './SpriteSheetCreator.js';
import { CharacterCollision } from './CharacterCollision.js';
import { PlayMode } from './PlayLoop/PlayMode.js';
import { SFXHandler } from './handlers/SFXHandler.js';
import { GameStatistics } from './GameStatistics.js';
import { PauseHandler } from './handlers/PauseHandler.js';
import { EffectsRenderer } from './EffectsRenderer.js';
import { BuildMode } from './BuildMode.js';
import { PathBuildHandler } from './handlers/PathBuildHandler.js';
import { LevelNavigationHandler } from './handlers/LevelNavigationHandler.js';
import { WorldColorHandler } from './handlers/WorldColorHandler.js';
import { TabPagination } from './TabPagination.js';
import { TabNavigation } from './TabNavigation.js';
import { ProTipHandler } from './handlers/ProTipHandler.js';
import { TooltipHandler } from './handlers/TooltipHandler.js';
import { LevelSizeHandler } from './handlers/LevelSizeHandler.js';
import { PlayerAttributesHandler} from './handlers/PlayerAttributesHandler.js';
import {CustomSpriteHandler} from './handlers/CustomSpriteHandler.js';
window.html = {};
window.html.LevelSizeHandler = LevelSizeHandler;
window.html.Game = Game;
//startRemoval 
WorldDataHandler.insideTool = true;
//endRemoval
const canvas = document.getElementById("myCanvas");
const tileCanvas = document.getElementById("tileCanvas");
WorldDataHandler.staticConstructor();
const spriteCanvas = document.getElementById("sprites");
window.spriteCanvas = spriteCanvas;
SoundHandler.staticConstructor();
AnimationHelper.staticConstructor();
SpritePixelArrays.staticConstructor();
const player = new Player(WorldDataHandler.initialPlayerPosition.x,
    WorldDataHandler.initialPlayerPosition.y, WorldDataHandler.tileSize, spriteCanvas);
window.player = player;
Game.staticConstructor();
TransitionAnimationHandler.staticConstructor();
let startLevel = 0;

//putAllDataHere
if (WorldDataHandler.insideTool) {
    startLevel = 1;
}
else {
    ExportedGameInitializer.initializeExportedGame(allData);
}
const canvasSize = WorldDataHandler.calucalteCanvasSize();
canvas.width = canvasSize.width;
canvas.height = canvasSize.height;
tileCanvas.width = canvasSize.width;
tileCanvas.height = canvasSize.height;
const canvasWidth = canvasSize.width;
const canvasHeight = canvasSize.height;
canvas.style.backgroundColor = WorldDataHandler.backgroundColor;
window.canvasOffsetLeft = canvas.offsetLeft;
window.canvasOffsetTop = canvas.offsetTop;
const ctx = canvas.getContext("2d");
const tileCtx = tileCanvas.getContext("2d");
Camera.staticConstructor(ctx, canvasWidth, canvasHeight, WorldDataHandler.levels[startLevel].tileData[0].length * WorldDataHandler.tileSize,
    WorldDataHandler.levels[startLevel].tileData.length * WorldDataHandler.tileSize);
EffectsHandler.staticConstructor();
let tileMapHandler = new TileMapHandler(WorldDataHandler.tileSize, startLevel, spriteCanvas, player);
window.tileMapHandler = tileMapHandler;
DialogueHandler.staticConstructor(Camera);
Display.staticConstructor(ctx, canvasWidth, canvasHeight, tileCtx);
Controller.staticConstructor();
Collision.staticConstructor(tileMapHandler);
const spriteSheetCreator = new SpriteSheetCreator(tileMapHandler, spriteCanvas);
CharacterCollision.staticConstructor(tileMapHandler);
PlayMode.staticConstructor(player, tileMapHandler);
SFXHandler.staticConstructor(tileMapHandler.tileSize, spriteCanvas);
GameStatistics.staticConstructor();
PauseHandler.staticConstructor();
EffectsRenderer.staticConstructor(tileMapHandler);
tileMapHandler.resetLevel(startLevel)

//startRemoval 
BuildMode.staticConstructor(tileMapHandler, player);
PathBuildHandler.staticConstructor(tileMapHandler);
LevelNavigationHandler.staticConstructor();
WorldColorHandler.staticConstructor();
DrawSectionHandler.staticConstructor(tileMapHandler);
TabPagination.staticConstructor();
TabNavigation.staticConstructor(spriteCanvas);
ProTipHandler.staticConstructor();
TooltipHandler.staticConstructor();
LevelSizeHandler.staticConstructor(tileMapHandler);
PlayerAttributesHandler.staticConstructor(player);
CustomSpriteHandler.staticConstructor();

canvas.addEventListener("mouseenter", (e) => { Controller.mouseEnter(e) });
canvas.addEventListener("mouseleave", (e) => { Controller.mouseLeave(e) });

function build() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    Camera.begin();
    tileMapHandler.drawGrid();
    tileMapHandler.displayLevel();
    if (tileMapHandler.currentLevel === 0) {
        PlayMode.runStartScreenLogic();
        Display.displayStartScreen(tileMapHandler.currentGeneralFrameCounter, tileMapHandler.generalFrameCounterMax);
    }
    else if (tileMapHandler.currentLevel === WorldDataHandler.levels.length - 1) {
        player.x = 0;
        player.y = 0;
        Display.displayEndingScreen(spriteCanvas, tileMapHandler.currentGeneralFrameCounter, tileMapHandler.generalFrameCounterMax);
    }
    else {
        player.draw();
    }
    //foreground objects
    tileMapHandler.displayObjects(tileMapHandler.layers[4]);
    DrawSectionHandler.draw();
    BuildMode.runBuildLogic();
    SFXHandler.updateSfxAnimations();
    Camera.end();

    if (Game.playMode === Game.BUILD_MODE) {
        window.requestAnimationFrame(window.build);
    }
}
window.build = build;
//endRemoval

function play(timestamp) {
    Game.updateFPSInterval(timestamp);
    // if enough time has elapsed, draw the next frame
    if (!Game.refreshRateHigher60 || Game.elapsed > Game.fpsInterval) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        Camera.begin();
        tileMapHandler.displayLevel();
        Controller.handleGamepadInput();
        if (tileMapHandler.currentLevel === 0) {
            PlayMode.runStartScreenLogic();
            Display.displayStartScreen(tileMapHandler.currentGeneralFrameCounter, tileMapHandler.generalFrameCounterMax);
            EffectsRenderer.displayEffects(1);
        }
        else if (tileMapHandler.currentLevel === WorldDataHandler.levels.length - 1) {
            Display.displayEndingScreen(spriteCanvas, tileMapHandler.currentGeneralFrameCounter, tileMapHandler.generalFrameCounterMax);
            EffectsRenderer.displayEffects(1);
        }
        else {
            PlayMode.runPlayLogic();
            SFXHandler.updateSfxAnimations();
            player.draw();
            //foreground objects
            tileMapHandler.displayObjects(tileMapHandler.layers[4]);
            EffectsRenderer.displayEffects(1);
            DialogueHandler.handleDialogue();
            PlayMode.pauseFramesHandler();
            EffectsRenderer.displayEffects(2);
            Camera.followObject(player.x, player.y);
        }
        //startRemoval 
        DrawSectionHandler.draw();
        //endRemoval
        Camera.end();
        Game.resetFpsInterval();
    }

    if (Game.playMode === Game.PLAY_MODE) {
        window.requestAnimationFrame(play);
    }
}
window.play = play;

function loading() {
    let loadedAssets = 0;
    SoundHandler.sounds.forEach(soundRawData => {
        const sound = SoundHandler[soundRawData.key];
        if (sound.loaded || sound.errorWhileLoading) {
            loadedAssets++;
        }
    })
    if (loadedAssets === SoundHandler.sounds.length) {
        Game.startAnimating(60);
        WorldDataHandler.insideTool ? Game.changeGameMode(true) : Game.executeGameMode();
    }
    else {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        Display.displayLoadingScreen(loadedAssets, SoundHandler.sounds.length);
        window.requestAnimationFrame(loading);
    }
}

window.requestAnimationFrame(loading);