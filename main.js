import { dropPlayer, renderElements} from "./eventsFunctions.js";
import { dragStartHandler, dragEndHandler, dragOverHandler, dragLeaveHandler, dropHandler, filterCheckboxHandler } from "./eventsHandler.js";
import { deleteSelection, teamAPlayers, teamBPlayers, setCarouselExtremaIndices, moveCarousel} from "./eventsFunctions.js";


const mainContainer = document.getElementById('main-container');
const maxPlayersInRow = 8;

let teamSelectElement = null;
let lineupSelectElement = null;
let lineupContainerElement = null;
export let carouselPlayersContainerElement = null;
export let carouselPlayersElement = null;

export let teamSelected;
let lineupTeamA;
let lineupTeamB;

// const reloadPage = (e) => {
//     e.preventDefault();
// }

const initialize = () => {
    try {
        if (!mainContainer) {
            throw new Error();
        }
        teamSelectElement = mainContainer.querySelector('#select-team'); 
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
        lineupSelectElement = mainContainer.querySelector('#select-lineup');
        if (!lineupSelectElement) {
            throw new Error();
        }
        if (teamSelectElement.value == 'not-selected') {
            lineupSelectElement.setAttribute('disabled', true);
        } 
        teamSelectElement.addEventListener('change', teamSelectionHandler);
    } catch (error) {
        console.log(`%c${error.toString()}`, "color: white; font-size: 20px");
        return;
    }
}

const teamSelectionHandler = (e) => {
    if (!teamSelected) {
        e.target.children[0].remove(); //Remove the '---' option from team selection
        lineupSelectElement.removeAttribute('disabled');
        lineupSelectElement.addEventListener('change', instantiateEmptyLineup);
        instantiateLineupContainer();
        instantiateFilterContainer();
        instantiateCarouselPlayersContainer();
        fetchSelectablePlayers(e.target.value);
    }
    console.log(teamSelected);
    if (teamSelected === 'A') {
        lineupTeamA = lineupSelectElement.value;
    } else {
        lineupTeamB = lineupSelectElement.value;
    }
    console.log(lineupTeamA);
    console.log(lineupTeamB);
    clearCurrentLineup();
    teamSelected = e.target.value;
    retrievePlayers();
} 

const retrievePlayers = () => {

    switch(teamSelected) {
        case 'A':
            if (!lineupTeamA) {
                lineupSelectElement.value = lineupSelectElement.children[0].value;
            } else {
                lineupSelectElement.value = lineupTeamA;
            }
            instantiateEmptyLineup();
            teamAPlayers.forEach(
                el => {
                    lineupContainerElement.children[el[1]].classList.add('drop-valid');
                    dropPlayer(lineupContainerElement.children[el[1]], carouselPlayersElement.children[el[0]], false);
                }
            )
            break;
        case 'B':
            if (!lineupTeamB) {
                lineupSelectElement.value = lineupSelectElement.children[0].value;
            } else {
                lineupSelectElement.value = lineupTeamB;
            }
            instantiateEmptyLineup();
            teamBPlayers.forEach(
                el => {
                    lineupContainerElement.children[el[1]].classList.add('drop-valid');
                    dropPlayer(lineupContainerElement.children[el[1]], carouselPlayersElement.children[el[0]], false);
                }
            )
            break;
    }
}

const clearCurrentLineup = () => {
    [...lineupContainerElement.children].forEach(
        el => {
            if(el.dataset.indexPlayer)
                deleteSelection(el)
        }
    );
    
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
                    content: 'Filtra per ruolo',
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
                                            name: function(e) {filterCheckboxHandler(e, 'role')},
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
                                    listeners: [
                                        {
                                            event: 'change',
                                            name: function(e) {filterCheckboxHandler(e, 'role')},
                                        }
                                    ]
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
                                    listeners: [
                                        {
                                            event: 'change',
                                            name: function(e) {filterCheckboxHandler(e, 'role')},
                                        }
                                    ]
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
                                    listeners: [
                                        {
                                            event: 'change',
                                            name: function(e) {filterCheckboxHandler(e, 'role')},
                                        }
                                    ]
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
                    content: 'Filtra per genere',
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
                                        value: 'M',
                                        checked: true,
                                    },
                                    listeners: [
                                        {
                                            event: 'change',
                                            name: function(e) {filterCheckboxHandler(e, 'gender')},
                                        }
                                    ]
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
                                        value: 'F',
                                        checked: true,
                                    },
                                    listeners: [
                                        {
                                            event: 'change',
                                            name: function(e) {filterCheckboxHandler(e, 'gender')},
                                        }
                                    ]
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
                            'data-index-position': `${counter}`,
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
    carouselPlayersElement = mainContainer.querySelector('#carousel-players');
    
    
}

const fetchSelectablePlayers = (teamSelected) => {
    console.log(teamSelected);
    let url = teamSelected == 'A' ? "/playersTeamA.json" : "/playersTeamB.json"

    fetch(url)
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
                             'data-filter-counter': 0,
                             'data-index-player': player.id,
                             'data-gender-player': player.gender,
                        },
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
            setCarouselExtremaIndices(carouselPlayersElement.children.length - 1);

            instantiatePlayers();
        })
        .catch((error) => {
            console.log("ERRORE: " + error);
        });
};

// window.addEventListener('beforeunload', reloadPage);

initialize();





