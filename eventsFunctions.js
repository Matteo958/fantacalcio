import { dragOverHandler, dragLeaveHandler, dropHandler, buttonDeleteHandler} from "./eventsHandler.js";
import { carouselPlayersElement } from "./main.js";

export const deleteSelection = (playerSelected) => {
    playerSelected.querySelector('.lineup-player-avatar').querySelector('.avatar-img').remove();
    playerSelected.querySelector('.lineup-player-avatar').classList.remove('lineup-player-avatar-w-description');
    playerSelected.querySelector('.lineup-player-description-container').querySelector('.lineup-player-description').remove();
    playerSelected.querySelector('.lineup-player-description-container').querySelector('.lineup-delete-button').remove();
    playerSelected.querySelector('.lineup-player-description-container').classList.remove('lineup-player-description-container-show');

    playerSelected.addEventListener('dragover', dragOverHandler);
    playerSelected.addEventListener('dragleave', dragLeaveHandler);
    playerSelected.addEventListener('drop', dropHandler);

    const selectablePlayer = [...carouselPlayersElement.children]
                            .find(element => element.dataset.indexPlayer === playerSelected.dataset.indexPlayer);

    selectablePlayer.classList.remove('selected-player');
    selectablePlayer.draggable = true;
    selectablePlayer.dataset.selectable = 'true';
    
    playerSelected.dataset.indexPlayer = '';
}

export const renderElements = (elements, parent) => {
    elements.forEach(
        element => {
            if (!element.tagName) {
                return;
            }
            const node = document.createElement(element.tagName);
            if (element.attributes) {
                for (const key in element.attributes) {
                    node.setAttribute(key, element.attributes[key])
                }
            }
            if (element.listeners) {
                element.listeners.forEach(
                    eventListener => {
                        node.addEventListener(eventListener.event, eventListener.name);
                    }
                )
            }
            if (element.content && typeof element.content === "string" || typeof element.content === "number") {
                node.textContent = element.content;
            }
            if (element.observer) {
                element.observer.observe(node);
            }
            parent.appendChild(node)
            if (element.children && Array.isArray(element.children)) {
                renderElements(element.children, node)
            }
        }
    );
}


export const checkValidPlayerPosition = (dropPosition, playerDragged) => {
    if(dropPosition.dataset.rolePlayer === playerDragged.dataset.rolePlayer){
        dropPosition.classList.add("drop-valid");
    }else{
        dropPosition.classList.add("drop-invalid");
    }
}

export const dropPlayer = (dropPosition, playerDragged) => {
    if (dropPosition.classList.contains('drop-valid')) {
        dropPosition.classList.remove('drop-valid');
        dropPosition.dataset.indexPlayer = playerDragged.dataset.indexPlayer;
        const playerChosen = [
            {
                tagName: 'img',
                attributes: {
                    src: playerDragged.querySelector('.avatar-img').src,
                    class: 'avatar-img',
                }
            }
        ]
        renderElements(playerChosen, dropPosition.querySelector('.lineup-player-avatar'));
        const playerDescriptionElement = [
            {
                tagName: 'div',
                attributes: {
                    class: 'lineup-player-description',
                },
                content: playerDragged.querySelector('.player-name').innerHTML,
            },
            {
                tagName: 'div',
                attributes: {
                    class: 'lineup-delete-button',
                },
                listeners: [
                    {
                        event: 'click',
                        name: buttonDeleteHandler,
                    }
                ],
                content: 'X',
            }
        ]
        renderElements(playerDescriptionElement, dropPosition.querySelector('.lineup-player-description-container'))
        dropPosition.querySelector('.lineup-player-avatar').classList.add('lineup-player-avatar-w-description');
        playerDragged.classList.add('selected-player');
        playerDragged.draggable = false;
        dropPosition.removeEventListener('dragover', dragOverHandler);
        dropPosition.removeEventListener('dragleave', dragLeaveHandler);
        dropPosition.removeEventListener('drop', dropHandler);
        dropPosition.querySelector('.lineup-player-description-container').classList.add('lineup-player-description-container-show');

    } else {
        playerDragged.style.opacity = 1;
        playerDragged.draggable = true;
        playerDragged.dataset.selectable = true;
        dropPosition.classList.remove('drop-invalid');
    }
    playerDragged = null;
}

export const hidePlayers = (role) => {
    [...carouselPlayersElement.children]
    .filter(
        player => player.dataset.rolePlayer === role
    )
    .map(
        player => player.classList.add('selectable-player-hidden')
    );
}

//renderElements(toRender, document.body)