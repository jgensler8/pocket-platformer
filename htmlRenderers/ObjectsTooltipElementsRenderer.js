class ObjectsTooltipElementsRenderer {
    static createSliderForChangeableAttribute(attribute, currentObject) {
        const sliderWrapper = document.createElement("div");
        sliderWrapper.className = "changeableAttributesWrapper marginTop8";
        const sliderLabel = document.createElement("label");
        Helpers.addAttributesToHTMLElement(sliderLabel, { "for": attribute.name });
        sliderLabel.innerHTML = attribute.descriptiveName || attribute.name;
        const slider = document.createElement("input");
        const currentValue = currentObject.type === ObjectTypes.PATH_POINT ? currentObject.getPathValue(attribute.name) : currentObject[attribute.name];
        const sliderValueText = attribute.mapper ? this.mapValueToKey(currentValue, attribute.mapper) : currentValue;
        Helpers.addAttributesToHTMLElement(slider, {
            "type": "range", "min": attribute.minValue, "max": attribute.maxValue, "value": sliderValueText, "name": attribute.name, "step": attribute.step || 1,
            "id": "attributeSlider",
        });
        sliderWrapper.appendChild(sliderLabel);
        sliderWrapper.appendChild(slider);
        const sliderValue = document.createElement("span");
        sliderValue.className = "sliderValue";
        sliderValue.innerHTML = currentValue;
        sliderValue.id = attribute.name + "sliderValue";
        slider.onchange = (event) => {
            const value = attribute.mapper ? this.mapKeyToValue(event.target.value, attribute.mapper) : parseInt(event.target.value);
            currentObject.addChangeableAttribute(attribute.name, value);
            document.getElementById(attribute.name + "sliderValue").innerHTML = value;
            if (attribute.name === 'frequency') {
                currentObject.getShootFrames();
            }
        };
        sliderWrapper.appendChild(sliderValue);
        return sliderWrapper;
    }

    static startFlagToolTip(currentObject) {
        const startFlagWrapper = document.createElement("div");
        startFlagWrapper.className = "marginTop8";
        const idWrapper = document.createElement("div");
        idWrapper.innerHTML = "Flag-Id: <b>" + currentObject?.flagIndex + "</b>";
        const checkBoxWrapper = document.createElement("div");
        checkBoxWrapper.style.width = "fit-content";
        checkBoxWrapper.className = "marginTop8";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = currentObject?.levelStartFlag ? true : false;
        checkbox.id = "levelStartFlag"
        checkbox.onclick = (event) => {
            const checkboxValue = event.target.checked;
            currentObject.updateLevelStartValue(checkboxValue);
        };
        const labelForCheckBox = document.createElement("label");
        Helpers.addAttributesToHTMLElement(labelForCheckBox, {
            for: "levelStartFlag"
        });
        labelForCheckBox.style.marginRight = "8px";
        labelForCheckBox.className = "radioButtonLabel marginTop8";
        labelForCheckBox.innerHTML = "Starting flag";
        const info = document.createElement("span");
        Helpers.addAttributesToHTMLElement(info, {
            role: "tooltip", 'data-microtip-size': 'large', 'aria-label': 'If no custom exit is specified, the player will start at this flag. Useful for the first level, and testing inside the tool.',
            'data-microtip-position': 'top-left'
        });
        info.style.float = "right";
        const infoImage = document.createElement("img");
        Helpers.addAttributesToHTMLElement(infoImage, {
            src: "images/icons/info.svg", width: "16", height: "16"
        });
        info.appendChild(infoImage);
        labelForCheckBox.appendChild(info);
        checkBoxWrapper.append(checkbox, labelForCheckBox);
        startFlagWrapper.append(idWrapper, checkBoxWrapper);
        return startFlagWrapper;
    }

    static finishFlagToolTip(currentObject) {
        const finishFlagWrapper = document.createElement("div");
        finishFlagWrapper.className = "marginTop8";

        const firstButtonWrapper = document.createElement("div");
        const firstRadioButton = document.createElement("input");
        Helpers.addAttributesToHTMLElement(firstRadioButton, {
            type: "radio", id: "nextLevel", value: "nextLevel", name: "levelSelector"
        });
        firstRadioButton.onchange = () => {
            currentObject.changeExit(null);
            selectWithStartFlags.disabled = true;
        };
        const labelForFirstButton = document.createElement("label");
        Helpers.addAttributesToHTMLElement(labelForFirstButton, {
            for: "nextLevel"
        });
        labelForFirstButton.className = "radioButtonLabel";
        labelForFirstButton.innerHTML = "Next Level";
        firstButtonWrapper.append(firstRadioButton, labelForFirstButton);

        const secondButtonWrapper = document.createElement("div");
        secondButtonWrapper.className = "marginTop8";

        const secondRadioButton = document.createElement("input");
        Helpers.addAttributesToHTMLElement(secondRadioButton, {
            type: "radio", id: "customLevel", value: "customLevel", name: "levelSelector"
        });
        const labelForSecondButton = document.createElement("label");
        Helpers.addAttributesToHTMLElement(labelForSecondButton, {
            for: "customLevel"
        });
        labelForSecondButton.className = "radioButtonLabel";
        labelForSecondButton.innerHTML = "Custom";
        const selectWithStartFlags = document.createElement("select");
        if (!currentObject.customExit) {
            selectWithStartFlags.disabled = true;
        }
        labelForSecondButton.appendChild(selectWithStartFlags);
        secondButtonWrapper.append(secondRadioButton, labelForSecondButton);
        WorldDataHandler.levels.forEach((level, levelIndex) => {
            if (levelIndex !== 0 && levelIndex !== WorldDataHandler.levels.length - 1) {
                level.levelObjects.forEach(levelObject => {
                    if (levelObject.type === ObjectTypes.START_FLAG) {
                        const option = document.createElement("option");
                        option.value = levelIndex + "," + levelObject?.extraAttributes?.flagIndex;
                        option.innerHTML = `Level: ${levelIndex}. Flag-Id: ${levelObject?.extraAttributes?.flagIndex}`
                        selectWithStartFlags.appendChild(option);
                    }
                });
            }
        });
        const option = document.createElement("option");
        option.value = "finishLevel";
        option.innerHTML = `Ending screen`
        selectWithStartFlags.appendChild(option);

        if (currentObject.customExit) {
            secondRadioButton.checked = true;
            const customExitTextValue = `${currentObject.customExit.levelIndex},${currentObject.customExit.flagIndex}`
            var options = selectWithStartFlags.options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].value === customExitTextValue) {
                    options[i].selected = true;
                    break;
                }
            }
        }
        else {
            firstRadioButton.checked = true;
        }
        secondRadioButton.onchange = () => {
            selectWithStartFlags.disabled = false;
            const selectedIndex = selectWithStartFlags.selectedIndex;
            currentObject.changeExit(selectWithStartFlags.options[selectedIndex].value);
        };
        selectWithStartFlags.onchange = (event) => {
            currentObject.changeExit(event.target.value);
        }

        const collectiblesWrapper = document.createElement("div");
        collectiblesWrapper.className = "subSection";

        const changeableAttribute = currentObject.spriteObject[0].changeableAttributes[0];
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = changeableAttribute.name;
        checkbox.onclick = (event) => {
            const checkboxValue = event.target.checked;
            currentObject.addChangeableAttribute(changeableAttribute.name, checkboxValue);
        };
        const checkboxLabel = document.createElement("label");
        checkboxLabel.className = "checkBoxText";
        checkboxLabel.style.marginLeft = "8px";
        Helpers.addAttributesToHTMLElement(checkboxLabel, { "for": changeableAttribute.name });
        checkboxLabel.innerHTML = "Collectibles needed for opening";

        collectiblesWrapper.append(checkbox, checkboxLabel);
        finishFlagWrapper.append(firstButtonWrapper, secondButtonWrapper, collectiblesWrapper);

        return finishFlagWrapper;
    }

    static mapValueToKey(searchValue, mapper) {
        let resultValue = Object.entries(mapper).find(entry => {
            const [_, value] = entry;
            return value === searchValue;
        });
        return resultValue ? parseInt(resultValue?.[0]) : null;
    }

    static mapKeyToValue(searchKey, mapper) {
        let resultValue = Object.entries(mapper).find(entry => {
            const [key] = entry;
            return key === searchKey;
        });
        return resultValue ? parseInt(resultValue?.[1]) : null;
    }

    static createRotationHandlerForObjects(currentObject, directions) {
        const rotationWrapper = document.createElement("div");
        rotationWrapper.className = "changeableAttributesWrapper marginTop8";
        const rotationButton = document.createElement("button");
        rotationButton.className = "levelNavigationButton buttonWithIconAndText";
        rotationButton.onclick = (e) => {
            currentObject.turnObject();
            document.getElementById("directionValue").innerHTML = currentObject.currentFacingDirection;
        };
        const rotationImg = document.createElement("img");
        Helpers.addAttributesToHTMLElement(rotationImg, {
            "src": directions.length === 2 ? "images/icons/mirror.svg" : "images/icons/rotate.svg", width: 16, height: 16,
            class: "iconInButtonWithText"
        });
        rotationButton.appendChild(rotationImg);
        rotationWrapper.appendChild(rotationButton);
        const rotationValue = document.createElement("span");
        rotationValue.id = "directionValue";
        rotationValue.innerHTML = currentObject.currentFacingDirection;
        rotationWrapper.appendChild(rotationValue);
        const info = document.createElement("span");
        Helpers.addAttributesToHTMLElement(info, {
            role: "tooltip", 'data-microtip-size': 'large', 'aria-label': 'You can also press shift before placing an object to change it`s default direction.',
            'data-microtip-position': 'top-left'
        });
        info.style.margin = "12px 0 0 8px";
        const infoImage = document.createElement("img");
        Helpers.addAttributesToHTMLElement(infoImage, {
            src: "images/icons/info.svg", width: "16", height: "16"
        });
        info.appendChild(infoImage);
        rotationWrapper.appendChild(info);
        return rotationWrapper;
    }

    static createToggleSwitch(attribute, currentObject) {
        const wrapper = document.createElement("div");
        wrapper.className = "changeableAttributesWrapper marginTop8";
        const switchEl = document.createElement("label");
        switchEl.className = "switch";

        const currentValue = currentObject.type === ObjectTypes.PATH_POINT ? currentObject.getPathValue(attribute.name) : currentObject[attribute.name];

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        attribute.options.forEach(option => {
            if (option.true === currentValue) {
                checkbox.checked = true;
            }
        });
        checkbox.onclick = (event) => {
            const checkboxValue = event.target.checked;
            const currentOption = attribute.options.find(option =>
                option[checkboxValue]
            );
            const currentValue = currentOption[checkboxValue];
            currentObject.addChangeableAttribute(attribute.name, currentValue);
            document.getElementById("switchValue").innerHTML = currentValue;
        };

        const spanEl = document.createElement("span");
        spanEl.className = "switchSlider";

        switchEl.appendChild(checkbox);
        switchEl.appendChild(spanEl);
        wrapper.appendChild(switchEl);

        const switchValue = document.createElement("span");
        switchValue.id = "switchValue";

        switchValue.innerHTML = currentValue;
        wrapper.appendChild(switchValue);
        return wrapper;
    }

    static createDialogueWindow(attribute, currentObject) {
        const dialogueWrapper = document.createElement("div");
        dialogueWrapper.id = "dialogueWrapper";
        this.createDialogueContent(attribute, currentObject, dialogueWrapper);
        return dialogueWrapper;
    }

    static resetDialogueContent(event, attribute, currentObject, dialogueWrapper, allDialogues) {
        event.stopPropagation();
        currentObject.addChangeableAttribute(attribute.name, allDialogues);
        dialogueWrapper.innerHTML = ""
        this.createDialogueContent(attribute, currentObject, dialogueWrapper);
    }

    static changePlayButtonStyles(firstClass, secondClass) {
        const playPauseButton = document.getElementById("playPauseText");
        playPauseButton.classList.remove(firstClass);
        playPauseButton.classList.add(secondClass);
    }

    static renderPlayButton(firstTime) {
        document.getElementById("changeGameMode").innerHTML = `<div> 
            <img src="images/icons/right.svg" class="iconInButtonWithText" alt="play" width="14" height="14">
            <span id="playPauseText"style="display: inline-block;">Play</span>
        </div>`;
        !firstTime && this.changePlayButtonStyles("move", "back");
    }

    static renderPauseButton(firstTime) {
        document.getElementById("changeGameMode").innerHTML = `<div> 
            <img src="images/icons/pause.svg" class="iconInButtonWithText" alt="pause" width="14" height="14">
            <span id="playPauseText" style="display: inline-block;">Stop</span>
        </div>`;
        !firstTime && this.changePlayButtonStyles("back", "move");
    }

    static populateSvg(svgElement, alt, width, height, src) {
        Helpers.addAttributesToHTMLElement(svgElement, {
            "alt": alt,
            "width": width,
            "height": height,
            "src": src,
        });
    }

    static createLevelHelpersTooltip(disabledPasteButton) {
        const template = Object.assign(
            document.createElement(`div`),
            {
                innerHTML: `
                    <div class="drawHelpers">
                        <button id="copyLevelButton" title="copy level" class="levelNavigationButton buttonWithIconAndText"
                            onClick="LevelNavigationHandler.copyLevel(event)">
                            <img src="images/icons/copy.svg" class="iconInButtonWithText" alt="copyLevel"
                            width="16" height="16">
                        </button>
                        <button id="pasteLevelButton" title="paste level" class="levelNavigationButton buttonWithIconAndText"
                            onClick="LevelNavigationHandler.showPasteLevelModal()">
                            <img id="pasteIcon" src="images/icons/paste.svg" class="iconInButtonWithText ${disabledPasteButton ? "greyFilter" : ""}" alt="pasteLevel"
                            width="16" height="16">
                        </button>
                        <button id="deleteHelper" title="delete level" class="levelNavigationButton buttonWithIconAndText"
                            onClick="ModalHandler.showModal('deleteLevelModal');">
                            <img src="images/icons/delete.svg" class="iconInButtonWithText" alt="deleteHelper"
                            width="16" height="16">
                        </button>
                    </div>
                `
            });
        template.style.whiteSpace = "initial";
        return template
    }

    static createDrawHelpersToolsTop() {
        const template = Object.assign(
            document.createElement(`div`),
            {
                innerHTML: `
                    <div>
                        <div class="drawHelpers">
                            <button id="rotateLeftHelper" title="rotate left" class="levelNavigationButton buttonWithIconAndText"
                                onClick="DrawHelpers.rotateRight()">
                                <img src="images/icons/rotateLeft.svg" class="iconInButtonWithText" alt="rotateLeftHelper"
                                width="16" height="16">
                            </button>
                            <button id="longArrowUpHelper" title="move up" class="levelNavigationButton buttonWithIconAndText"
                                onClick="DrawHelpers.moveUp()">
                                <img src="images/icons/longArrowUp.svg" class="iconInButtonWithText" alt="longArrowUpHelper"
                                width="16" height="16">
                            </button>
                            <button id="rotateRightHelper" title="rotate right" class="levelNavigationButton buttonWithIconAndText"
                                onClick="DrawHelpers.rotateLeft()">
                                <img src="images/icons/rotateRight.svg" class="iconInButtonWithText" alt="rotateRightHelper"
                                width="16" height="16">
                            </button>
                        </div>
                        <div class="drawHelpers marginTop8">
                            <button id="longArrowLeftHelper" title="move left" class="levelNavigationButton buttonWithIconAndText"
                                onClick="DrawHelpers.moveLeft()">
                                <img src="images/icons/longArrowLeft.svg" class="iconInButtonWithText" alt="longArrowLeftHelper"
                                width="16" height="16">
                            </button>
                            <button id="longArrowDownHelper" title="move down" class="levelNavigationButton buttonWithIconAndText"
                                onClick="DrawHelpers.moveDown()">
                                <img src="images/icons/longArrowDown.svg" class="iconInButtonWithText" alt="longArrowDownHelper"
                                width="16" height="16">
                            </button>
                            <button id="longArrowRightHelper" title="move right" class="levelNavigationButton buttonWithIconAndText"
                                onClick="DrawHelpers.moveRight()">
                                <img src="images/icons/longArrowRight.svg" class="iconInButtonWithText" alt="longArrowRightHelper"
                                width="16" height="16">
                            </button>
                        </div>
                    </div>
                    <div class="drawHelpers subSection">
                        <button id="mirrorHelper" title="mirror horizontally" class="levelNavigationButton buttonWithIconAndText"
                            onClick="DrawHelpers.flipHorzontally()">
                            <img src="images/icons/mirror.svg" class="iconInButtonWithText" alt="mirrorHelper"
                            width="16" height="16">
                        </button>
                        <button id="mirrorVerticalHelper" title="mirror vertically" class="levelNavigationButton buttonWithIconAndText"
                            onClick="DrawHelpers.flipVertically()">
                            <img src="images/icons/mirrorVertical.svg" class="iconInButtonWithText" alt="mirrorVerticalHelper"
                            width="16" height="16">
                        </button>
                        <button id="deleteHelper" title="delete drawing" class="levelNavigationButton buttonWithIconAndText"
                            onClick="DrawHelpers.deleteSprite()">
                            <img src="images/icons/delete.svg" class="iconInButtonWithText" alt="deleteHelper"
                            width="16" height="16">
                        </button>
                    </div>
                `
            });
        template.style.whiteSpace = "initial";
        return template
    }

    static createDialogueContent(attribute, currentObject, dialogueWrapper) {
        const maxDialogues = 5;
        currentObject.dialogue.forEach((dialogueBit, index) => {
            const dialogueBitWrapper = document.createElement("div");
            dialogueBitWrapper.className = "marginTop8"
            const textValue = document.createElement("textarea");
            Helpers.addAttributesToHTMLElement(textValue, {
                "maxlength": 239,
                "rows": "4",
                "placeholder": "Add text here..."
            });
            textValue.value = dialogueBit;
            //TODO: might have bad performance
            textValue.onkeyup = (event) => {
                Helpers.debounce(() => {
                    const allDialogues = [...currentObject.dialogue];
                    allDialogues[index] = event.target.value;
                    currentObject.addChangeableAttribute(attribute.name, allDialogues);
                }, 300);
            }
            textValue.className = "dialogueText";
            dialogueBitWrapper.appendChild(textValue);
            if (currentObject.dialogue.length > 1) {
                const button = document.createElement("img");
                this.populateSvg(button, "delete", "16", "16", `images/icons/delete.svg`);
                button.className = "marginTop8 hovereableRedSvg";
                button.onclick = (event) => {
                    const allDialogues = [...currentObject.dialogue];
                    allDialogues.splice(index, 1);
                    this.resetDialogueContent(event, attribute, currentObject, dialogueWrapper, allDialogues);
                };
                dialogueBitWrapper.appendChild(button);
            }
            dialogueWrapper.appendChild(dialogueBitWrapper);
        });
        if (currentObject.dialogue.length < maxDialogues) {
            const addMoreButtonWrapper = document.createElement("div");
            addMoreButtonWrapper.id = "addMoreButtonWrapper";
            const addMoreButton = document.createElement("button");
            addMoreButton.className = "levelNavigationButton fullWidth marginTop8";
            const plusIcon = document.createElement("img");
            this.populateSvg(plusIcon, "plus", "14", "14", "images/icons/plus.svg");
            addMoreButton.onclick = (event) => {
                const allDialogues = [...currentObject.dialogue];
                allDialogues.push("");
                this.resetDialogueContent(event, attribute, currentObject, dialogueWrapper, allDialogues);
            };
            addMoreButton.appendChild(plusIcon);
            addMoreButtonWrapper.appendChild(addMoreButton);
            dialogueWrapper.appendChild(addMoreButtonWrapper);
        }
    }
}