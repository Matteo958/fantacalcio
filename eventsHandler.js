import { deleteSelection } from "./eventsFunctions.js";
import { checkValidPlayerPosition, dropPlayer, showPlayers, hidePlayers } from "./eventsFunctions.js";

// drag'n drop events

let playerDragged;
let playerDropped;

export const dragStartHandler = (e, className) => {
    playerDragged = e.target;
    setTimeout(() => {
        if (className)
            playerDragged.classList.add(className);
        playerDragged.draggable = false;
        playerDragged.dataset.selectable = false;
        }, 0);
};

export const dragEndHandler = (className) => {
    if(!playerDropped){
        if (className)
            playerDragged.classList.remove(className);
        playerDragged.draggable = true;
        playerDragged.dataset.selectable = true;
    }
    playerDropped = false;
    playerDragged = null;
};

export const dragOverHandler = (e) => {
    e.preventDefault();
    checkValidPlayerPosition(e.target, playerDragged);
};

export const dragLeaveHandler = (e) => {
    e.target.classList.remove("drop-valid");
    e.target.classList.remove("drop-invalid");
};

export const dropHandler = (e) => {
    playerDropped = true;
    dropPlayer(e.target, playerDragged, true);
    playerDragged = null;
};

export const buttonDeleteHandler = (e) => {
    e.stopPropagation();
    deleteSelection(e.target.parentElement.parentElement, false);
}

export const filterCheckboxHandler = (e, filterType) => {
    if (e.target.checked) {
        showPlayers(e.target.value, filterType);
    } else {
        hidePlayers(e.target.value, filterType);
    }
}