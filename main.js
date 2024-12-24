import { renderElements} from "./eventsFunctions.js";
import { dragStartHandler, dragEndHandler, dragOverHandler, dragLeaveHandler, dropHandler, filterCheckboxHandler } from "./eventsHandler.js";
import { deleteSelection } from "./eventsFunctions.js";

const mainContainer = document.getElementById('main-container');
const maxPlayersInRow = 8;

let teamSelectElement = null;
let lineupSelectElement = null;
let lineupContainerElement = null;
let carouselPlayersContainerElement = null;
export let carouselPlayersElement = null;
let carouselPlayerIndex = 0;
let firstAccess;

const initialize = () => {
    firstAccess = true;
    try {
        if (!mainContainer) {
            throw new Error();
        }
        teamSelectElement = mainContainer.querySelector('#select-team-container').querySelector('.select'); 
        if (!teamSelectElement) {
            throw new Error();
        }
        checkTeamSelected();

    } catch (error) {
        console.log(`%c${error.toString()}`, "color: white; font-size: 20px");
        return;
    }
}

const checkTeamSelected = () => {
    try {
        lineupSelectElement = mainContainer.querySelector('#select-lineup-container').querySelector('.select');
        if (!lineupSelectElement) {
            throw new Error();
        }
        if (teamSelectElement.value == 'not-selected') {
            lineupSelectElement.setAttribute('disabled', true);
        } else {
            lineupSelectElement.removeAttribute('disabled');
        }
        teamSelectElement.addEventListener('change', teamSelectionHandler);
    } catch (error) {
        console.log(`%c${error.toString()}`, "color: white; font-size: 20px");
        return;
    }
}

const teamSelectionHandler = (e) => {
    if (firstAccess) {
        e.target.children[0].remove();
        firstAccess = false;
        lineupSelectElement.removeAttribute('disabled');
        lineupSelectElement.addEventListener('change', instantiateEmptyLineup);
        instantiateLineupContainer();
        instantiateFilterContainer();
        instantiateCarouselPlayersContainer();
        fetchSelectablePlayers();
    }
} 

const instantiateLineupContainer = () => {
    const lineupContainer = [
        {
            tagName: 'div',
            attributes: {
                id: 'lineup-container',
            }
        }
    ];
    renderElements(lineupContainer, mainContainer);
    lineupContainerElement = mainContainer.querySelector('#lineup-container');
    
    instantiateEmptyLineup()
}

const instantiateFilterContainer  = () => {
    const filterContainer = [
        {
            tagName: 'form',
            attributes: {
                id: 'filters-form',
            },
            children: [
                {
                    tagName: 'div',
                    attributes: {
                        id: 'filters-role-container',
                    },
                    content: 'FILTRA PER RUOLO',
                    children: [
                        {
                            tagName: 'div',
                            attributes: {
                                class: 'role-container',
                            },
                            children: [
                                {
                                    tagName: 'input',
                                    attributes: {
                                        type: 'checkbox',
                                        name: 'role1',
                                        value: 'keeper',
                                        checked: true,
                                    },
                                    listeners: [
                                        {
                                            event: 'change',
                                            name: filterCheckboxHandler,
                                        }
                                    ]
                                },
                                {
                                    tagName: 'label',
                                    attributes: {
                                        for: 'role1',
                                    },
                                    content: 'Keeper',
                                },
                            ]
                        },
                        {
                            tagName: 'div',
                            attributes: {
                                class: 'role-container',
                            },
                            children: [
                                {
                                    tagName: 'input',
                                    attributes: {
                                        type: 'checkbox',
                                        name: 'role2',
                                        value: 'defender',
                                        checked: true,
                                    },
                                },
                                {
                                    tagName: 'label',
                                    attributes: {
                                        for: 'role2',
                                    },
                                    content: 'Defender',
                                },
                            ]
                        },
                        {
                            tagName: 'div',
                            attributes: {
                                class: 'role-container',
                            },
                            children: [
                                {
                                    tagName: 'input',
                                    attributes: {
                                        type: 'checkbox',
                                        name: 'role3',
                                        value: 'mid',
                                        checked: true,
                                    },
                                },
                                {
                                    tagName: 'label',
                                    attributes: {
                                        for: 'role3',
                                    },
                                    content: 'Mid',
                                },
                            ]
                        },
                        {
                            tagName: 'div',
                            attributes: {
                                class: 'role-container',
                            },
                            children: [
                                {
                                    tagName: 'input',
                                    attributes: {
                                        type: 'checkbox',
                                        name: 'role4',
                                        value: 'striker',
                                        checked: true,
                                    },
                                },
                                {
                                    tagName: 'label',
                                    attributes: {
                                        for: 'role4',
                                    },
                                    content: 'Striker',
                                },
                            ]
                        },
                    ]
                },
                {
                    tagName: 'br',
                },
                {
                    tagName: 'div',
                    attributes: {
                        id: 'filters-gender-container',
                    },
                    content: 'FILTRA PER GENERE',
                    children: [
                        {
                            tagName: 'div',
                            attributes: {
                                class: 'gender-container',
                            },
                            children: [
                                {
                                    tagName: 'input',
                                    attributes: {
                                        type: 'checkbox',
                                        name: 'gender1',
                                        value: 'male',
                                        checked: true,
                                    },
                                },
                                {
                                    tagName: 'label',
                                    attributes: {
                                        for: 'gender1',
                                    },
                                    content: 'Male',
                                },
                            ]
                        },
                        {
                            tagName: 'div',
                            attributes: {
                                class: 'gender-container',
                            },
                            children: [
                                {
                                    tagName: 'input',
                                    attributes: {
                                        type: 'checkbox',
                                        name: 'gender2',
                                        value: 'female',
                                        checked: true,
                                    },
                                },
                                {
                                    tagName: 'label',
                                    attributes: {
                                        for: 'gender2',
                                    },
                                    content: 'Female',
                                },
                            ]
                        },
                    ]
                },
            ]
        }
    ]
    renderElements(filterContainer, mainContainer);
    //lineupContainerElement = mainContainer.querySelector('#filter-container');
}

const getFormattedLineup = () =>
    [1, ...lineupSelectElement.value.split("-")].map((el) => parseInt(el));

const instantiateEmptyLineup = () => {
    const lineupRowLengths = getFormattedLineup();
    let lineupContainerArea = "";
    let counter = 0;
    const gridVoidElement = ". ";
    lineupRowLengths.forEach((rowLength, index) => {
        let rowCells = gridVoidElement.repeat(maxPlayersInRow - rowLength);
        for (let i = 0; i < rowLength; i++) {
            let newPlayer = lineupContainerElement.children[counter];
            let newPlayerRole = () => {
                switch(index){
                    case 0:
                        return 'keeper';
                    case 1:
                        return 'defender';
                    case 2:
                        return 'mid';
                    case 3:
                        return 'striker';
                }
            }
            if (!newPlayer) {
                newPlayer = [
                    {
                        tagName: 'div',
                        attributes: {
                            class: 'lineup-player',
                            style: `grid-area: area-${index}-${i}`,
                            'data-role-player': newPlayerRole(),
                            'data-index-player': '',
                        },
                        listeners: [
                            {
                                event: 'dragover',
                                name: dragOverHandler,
                            },
                            {
                                event: 'dragleave',
                                name: dragLeaveHandler,
                            },
                            {
                                event: 'drop',
                                name: dropHandler,
                            },
                        ],
                        children: [
                            {
                                tagName: 'div',
                                attributes: {
                                    class: 'lineup-player-avatar',
                                },
                            },
                            {
                                tagName: 'div',
                                attributes: {
                                    class: 'lineup-player-description-container',
                                },
                            }
                        ]
                    }
                ]
                renderElements(newPlayer, lineupContainerElement);
            }else{
                newPlayer.style.gridArea = `area-${index}-${i}`;
                newPlayer.dataset.rolePlayer = newPlayerRole();
                if(newPlayer.dataset.indexPlayer){
                    deleteSelection(newPlayer);
                }
            }
            rowCells += (`area-${index}-${i} `).repeat(2);
            counter++;
        }
        rowCells += gridVoidElement.repeat(maxPlayersInRow - rowLength);
        lineupContainerArea += `"${rowCells}"\n`;
    });
    lineupContainerElement.style.gridTemplateAreas = lineupContainerArea;
};

const instantiateCarouselPlayersContainer = () => {
    const carouselPlayersContainer = [
        {
            tagName: 'div',
            attributes: {
                id: 'carousel-players-container',
            },
            children: [
                {
                    tagName: 'div',
                    attributes: {
                        id: 'carousel-players',
                    }, 
                },
                {
                    tagName: 'div',
                    attributes: {
                        id: 'carousel-buttons',
                    },
                    children: [
                        {
                            tagName: 'div',
                            attributes: {
                                class: 'button-carousel-left hidden',
                            },
                            children: [
                                {
                                    tagName: 'img',
                                    attributes: {
                                        class: 'button-left-img',
                                        src: 'Icons/arrow_icon_left.png',
                                    },
                                    listeners: [
                                        {
                                            event: 'click',
                                            name: () => {moveCarousel(-1)},
                                        }
                                    ]
                                },
                            ]
                        },
                        {
                            tagName: 'div',
                            attributes: {
                                class: 'button-carousel-right',
                            },
                            children: [
                                {
                                    tagName: 'img',
                                    attributes: {
                                        class: 'button-right-img',
                                        src: 'Icons/arrow_icon_right.png',
                                    },
                                    listeners: [
                                        {
                                            event: 'click',
                                            name: () => {moveCarousel(1)},
                                        }
                                    ]
                                },
                            ]
                        },
                    ]
                },
            ]
        }
    ];
    renderElements(carouselPlayersContainer, mainContainer);
    carouselPlayersContainerElement = mainContainer.querySelector('#carousel-players-container');
    carouselPlayersElement = mainContainer.querySelector('#carousel-players')
}

const moveCarousel = (direction) => {
    carouselPlayerIndex = (carouselPlayerIndex + direction) == carouselPlayersElement.children.length? 0 : 
                            (carouselPlayerIndex + direction) == -1 ? carouselPlayersElement.children.length - 1 : carouselPlayerIndex += direction;

    if (carouselPlayerIndex == carouselPlayersElement.children.length - 1) {
        carouselPlayersContainerElement.querySelector('.button-carousel-right').classList.add('hidden');
    } else if (carouselPlayerIndex == 0) {
        carouselPlayersContainerElement.querySelector('.button-carousel-left').classList.add('hidden');
    } else {
        carouselPlayersContainerElement.querySelector('.button-carousel-right').classList.remove('hidden');
        carouselPlayersContainerElement.querySelector('.button-carousel-left').classList.remove('hidden');
    }
    
    carouselPlayersElement.children[carouselPlayerIndex].scrollIntoView({
        behavior: "smooth"
    });
}

const fetchSelectablePlayers = () => {
    fetch("/playersTeamA.json")
        .then((response) => response.json())
        .then((data) => {
            for(let player of data.players){
                const selectablePlayer = [
                    {
                        tagName: 'div',
                        attributes: {
                             class: 'selectable-player',
                             draggable: true,
                             'data-role-player': player.role,
                             'data-selectable': true,
                             'data-index-player': player.id,
                        },
                        // observer: getObserver(),
                        listeners: [
                        {
                            event: 'dragstart',
                            name: function(e) {dragStartHandler(e, 'selected-player')},
                        },
                        {
                            event: 'dragend',
                            name: function() {dragEndHandler('selected-player')},
                        },
                    ],  
                    children: [
                        {
                            tagName: 'div',
                            attributes: {
                                class: 'avatar-img-container',
                            },
                            children: [
                                {
                                    tagName: 'img',
                                    attributes: {
                                        class: 'avatar-img',
                                        src: player.img,
                                    }
                                }
                            ]
                        }, 
                        {
                            tagName: "div",
                            attributes: {
                                class: "stats-container",
                            },
                            children: [
                                {
                                    tagName: "div",
                                    attributes: {
                                        class: "player-name",
                                    },
                                    content: player.name,
                                },
                                {
                                    tagName: "div",
                                    content: player.role,
                                }
                            ]
                        }
                    ] 
                    }
                ]
                renderElements(selectablePlayer, carouselPlayersElement);
            }
            
            instantiatePlayers();
        })
        .catch((error) => {
            console.log("ERRORE: " + error);
        });
};

initialize();

