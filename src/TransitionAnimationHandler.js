export class TransitionAnimationHandler {
    static staticConstructor() {
        this.animationFrames = 48;
        this.animationType = "tiles";
        this.animationTypes = {
            none: "none",
            tiles: "tiles",
            wholeScreen: "wholeScreen"
        }
    }

    static changeAnimationType(event) {
        this.animationType = event.target.value;
    }

    static changeAnimationDuration(event) {
        const value = parseInt(event.target.value);
        this.animationFrames = value;
        document.getElementById("transitionDurationValue").innerHTML = value;
    }

    static displayTransition() {
        const halfAnimationFrames = this.animationFrames / 2;
        const totalBlackFrames = this.animationFrames > 24 ? 4 : 0;

        if (tileMapHandler.checkIfStartOrEndingLevel()) {
            PlayMode.currentPauseFrames = 0;
        }
        const fadeInFrames = halfAnimationFrames + totalBlackFrames;
        const fadeOutFrames = halfAnimationFrames - totalBlackFrames;

        //fade in
        if (PlayMode.currentPauseFrames > fadeInFrames) {
            const currentFrame = fadeInFrames - (PlayMode.currentPauseFrames - fadeInFrames);
            switch (this.animationType) {
                case this.animationTypes.tiles:
                    this.animateFade(currentFrame, fadeInFrames);
                    break;
                case this.animationTypes.wholeScreen:
                    this.animateFadeWholeScreen(currentFrame, fadeInFrames);
                    break;
            }
            //Camera.zoomToObject(0.01, player);
        }
        //fade out
        else if (PlayMode.currentPauseFrames < fadeOutFrames) {
            switch (this.animationType) {
                case this.animationTypes.tiles:
                    this.animateFade(PlayMode.currentPauseFrames, fadeOutFrames);
                    break;
                case this.animationTypes.wholeScreen:
                    this.animateFadeWholeScreen(PlayMode.currentPauseFrames, fadeInFrames);
                    break;
            }
        }
        //stay black for some frames
        else {
            if (this.animationType !== this.animationTypes.none) {
                Display.drawRectangle(Camera.viewport.left,
                    Camera.viewport.top,
                    Camera.viewport.width,
                    Camera.viewport.height, "000000");
            }
        }
        if (PlayMode.currentPauseFrames === halfAnimationFrames) {
            tileMapHandler.switchToNextLevel();
        }
    }

    static animateFadeWholeScreen(currentFrame, totalFrames) {
        const percent = currentFrame / totalFrames;
        Display.drawRectangleWithAlpha(Camera.viewport.left,
            Camera.viewport.top,
            Camera.viewport.width,
            Camera.viewport.height, "000000", Display.ctx, percent);
    }

    static setTypeElementValue(type) {
        this.animationType = type;
        document.getElementById("transitionType").value = type;
    }

    static setDurationElementValue(value) {
        this.animationFrames = value;
        document.getElementById("transitionDuration").value = value;
        document.getElementById("transitionDurationValue").innerHTML = value;
    }

    static animateFade(currentFrame, totalFrames) {
        const percent = currentFrame / totalFrames * 100;
        const parcelAmount = 10;
        const parcelHeight = Display.canvasHeight / parcelAmount;
        const widthParcelAmount = Math.ceil(Display.canvasWidth / parcelHeight);

        for (var i = 0; i <= widthParcelAmount; i++) {
            for (var j = 0; j <= parcelAmount; j++) {
                const relativeWidth = parcelHeight / 100 * percent + 1;
                Display.drawRectangle(i * parcelHeight + ((parcelHeight - relativeWidth) / 2) + Camera.viewport.left,
                    j * parcelHeight + ((parcelHeight - relativeWidth) / 2) + Camera.viewport.top,
                    relativeWidth,
                    relativeWidth);
            }
        }
    }
}