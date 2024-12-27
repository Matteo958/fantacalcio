import { dragOverHandler, dragLeaveHandler, dropHandler, buttonDeleteHandler} from "./eventsHandler.js";
import { carouselPlayersContainerElement, carouselPlayersElement, teamSelected } from "./main.js";

export const deleteSelection = (playerSelected, savePlayer) => {

    if(!savePlayer) {
        switch(teamSelected) {
            case 'A':
                teamAPlayers = teamAPlayers.filter(
                    player => !(player[0] === playerSelected.dataset.indexPlayer && player[1] === playerSelected.dataset.indexPosition)
                );
                break;
            case 'B':
                teamBPlayers.filter(
                    player => !(player[0] === playerSelected.dataset.indexPlayer && player[1] === playerSelected.dataset.indexPosition)
                );
                break;
        }
    }
    
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

export let teamAPlayers = [];
export let teamBPlayers = [];

export const dropPlayer = (dropPosition, playerDragged, insertFromDrag) => {
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

        if(insertFromDrag) {
            if(teamSelected == 'A'){
                teamAPlayers.push([playerDragged.dataset.indexPlayer, dropPosition.dataset.indexPosition]);
            }else{
                teamBPlayers.push([playerDragged.dataset.indexPlayer, dropPosition.dataset.indexPosition]);
            }
        }
        
    } else {
        playerDragged.style.opacity = 1;
        playerDragged.draggable = true;
        playerDragged.dataset.selectable = true;
        dropPosition.classList.remove('drop-invalid');
    }
    playerDragged = null;
}

let carouselFirstPlayerIndex;
let carouselLastPlayerIndex;
let carouselPlayerIndex = 0;

export const setCarouselExtremaIndices = (carouselLength) => {
    carouselFirstPlayerIndex = 0;
    carouselLastPlayerIndex = carouselLength;
}

export const moveCarousel = (direction) => {
    
    if(carouselPlayerIndex < carouselFirstPlayerIndex) 
        carouselPlayerIndex = carouselFirstPlayerIndex;
    else if(carouselPlayerIndex > carouselLastPlayerIndex)
        carouselPlayerIndex = carouselLastPlayerIndex;

    carouselPlayerIndex += direction;

    if (carouselPlayersElement.children[carouselPlayerIndex].classList.contains('selectable-player-hidden')){
        moveCarousel(direction);
    } else {
        carouselPlayersElement.children[carouselPlayerIndex].scrollIntoView({
            behavior: "smooth"
        });
    }
    modifyCarouselArrows();
}

export const modifyCarouselArrows = (carouselEmpty) => {
    if (carouselEmpty) {
        carouselPlayersContainerElement.querySelector('.button-carousel-right').classList.add('hidden');
        carouselPlayersContainerElement.querySelector('.button-carousel-left').classList.add('hidden');
    } else {
        if (carouselPlayerIndex == carouselLastPlayerIndex) {
            carouselPlayersContainerElement.querySelector('.button-carousel-right').classList.add('hidden');
        } else if (carouselPlayerIndex == carouselFirstPlayerIndex) {
            carouselPlayersContainerElement.querySelector('.button-carousel-left').classList.add('hidden');
        } else {
            carouselPlayersContainerElement.querySelector('.button-carousel-right').classList.remove('hidden');
            carouselPlayersContainerElement.querySelector('.button-carousel-left').classList.remove('hidden');
        }
    }
    
}

export const resetIndexPlayer = () => {

    for (let i = carouselPlayersElement.children.length - 1; i >= 0; i--) {
        if (!carouselPlayersElement.children[i].classList.contains('selectable-player-hidden')) {
            carouselLastPlayerIndex = parseInt(carouselPlayersElement.children[i].dataset.indexPlayer);
            break;
        }
    }

    for (let i = 0; i < carouselPlayersElement.children.length; i++) {
        if (!carouselPlayersElement.children[i].classList.contains('selectable-player-hidden')) {
            carouselFirstPlayerIndex = parseInt(carouselPlayersElement.children[i].dataset.indexPlayer);
            break;
        }
    }

    if (carouselPlayersElement.children[carouselPlayerIndex].classList.contains('selectable-player-hidden')) {
        if (carouselPlayerIndex > carouselLastPlayerIndex) {
            carouselPlayerIndex = carouselLastPlayerIndex;
        } else {
            for (let i = carouselPlayerIndex + 1; i <= carouselLastPlayerIndex; i++) {
                if (!carouselPlayersElement.children[i].classList.contains('selectable-player-hidden')) {
                    carouselPlayerIndex = i;
                    break;
                }
            }
        }
        carouselPlayersElement.children[carouselPlayerIndex].scrollIntoView({
            behavior: "smooth"
        });
    }
    modifyCarouselArrows(false);
}

let counterSelectablePlayers;
let counterFilteredPlayers = 0;

export const hidePlayers = (role, filterType) => {
    switch(filterType) {
        case 'role':
            [...carouselPlayersElement.children]
            .filter(
                player => player.dataset.rolePlayer === role
            )
            .map(
                player => {
                    player.dataset.filterCounter++;
                    player.classList.add('selectable-player-hidden');
                    counterFilteredPlayers++;
                }
            );
            break;
        case 'gender':
            [...carouselPlayersElement.children]
            .filter(
                player => player.dataset.genderPlayer === role
            )
            .map(
                player => {
                    player.dataset.filterCounter++;
                    player.classList.add('selectable-player-hidden');
                    counterFilteredPlayers++;
                }
            );
            break;
    }
    counterSelectablePlayers = carouselPlayersElement.children.length - counterFilteredPlayers;
    resetIndexPlayer();
    if (counterSelectablePlayers == 0) {
        modifyCarouselArrows(true);
    }
}

export const showPlayers = (role, filterType) => {
    switch(filterType) {
        case 'role':
            [...carouselPlayersElement.children]
            .filter(
                player => player.dataset.rolePlayer === role
            )
            .map(
                player => {
                    player.dataset.filterCounter--;
                    if(player.dataset.filterCounter == 0){
                        player.classList.remove('selectable-player-hidden')
                        counterFilteredPlayers--;
                    }
                }
            );
            break;
        case 'gender':
            [...carouselPlayersElement.children]
            .filter(
                player => player.dataset.genderPlayer === role
            )
            .map(
                player => {
                    player.dataset.filterCounter--;
                    if(player.dataset.filterCounter == 0){
                        player.classList.remove('selectable-player-hidden')
                        counterFilteredPlayers--;
                    }
                }
            );
            break;
    }
    counterSelectablePlayers = carouselPlayersElement.children.length - counterFilteredPlayers;
    resetIndexPlayer();

    modifyCarouselArrows(false);
}


