// function changeForm2(){

// import { renderElements} from "./script4.js";

const toRender = [
    {
        tagName: 'div',
        attributes: {
             class: 'selectable-player',
             draggable: true,
             'data-role-player': player.role,
             'data-selectable': true,
             'data-index-player': player.id,
        },
        // listeners: [
        //     {
        //         event: 'dragstart',
        //         name: dragStartHandler,
        //     },
        //     {
        //         event: 'dragend',
        //         name: dragEndHandler,
        //     },
        // ],
        children: [
            {
                tagName: 'img',
                attributes: {
                    src: player.img,
                    class: 'avatar-img',
                }
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

//     clearElements();

//     let arr = [1];

//     const selectionArr = selection.value.split('-');

//     selectionArr.forEach(element => {
//         arr.push(Number.parseInt(element, 10));
//     });

//     for (let i = 0; i < arr.length; i ++) {
//         let child = container.children[i];

//         child.classList.add(`item${i+1}`);

//         child.style.gridRow = i+1;
//         child.style.display = 'flex';
//         child.style.width = 'inherit';
//         child.style.justifyContent = 'center';
//         child.style.columnGap = '100px';

//         for(let j = 0; j < arr[i]; j ++){
//             let newPlayer = document.createElement('div');
//             newPlayer.setAttribute('class', 'player');
//             child.append(newPlayer);
//         }
//     }
// }

// const changeForm = () => {

//     clearElements();

//     const formationRowLengths = [1, ...selection.value.split('-')];

//     formationRowLengths.forEach(
//         (rowLength, i) => {

//             // creare div messo hardcoded nell'HTML
//             const rowContainer = document.createElement('div');

//             try {
//                 if (!container) {
//                     throw new Error();
//                 }

//                 rowLength = parseInt(rowLength);

//                 if (isNaN(rowLength)) {
//                     throw new Error();
//                 }

//                 container.append(rowContainer);
//                 rowContainer.classList.add('base-item');
//                 rowContainer.style.gridRow = i + 1;

//                 [...Array(rowLength).keys()].forEach(
//                     () => {
//                         const newPlayer = document.createElement('div');
//                         newPlayer.classList.add('player');
//                         rowContainer.append(newPlayer);
//                     }
//                 );
//             } catch (error) {
//                 console.error(`%c${error.toString()}`, 'color:white;font-size:20px');
//                 return;
//             }
//         }
//     );
// }

// function clearElements() {

//     // cancellare container
//     // e ricrearlo
//     for (let i = container.children.length - 1; i >= 0; i--) {
//         let childCount = container.children[i].children.length;
//         for (let j = childCount - 1; j >= 0; j--) {
//             container.children[i].children[j].remove();

//         }
//         container.children[i].remove();
//     }
// }

const container = document.getElementById("players-container");
const selectedFormation = document.getElementById("formazioni");
const filterContainer = document.getElementById("filter-container");
const maxRow = 8;

const playersSelectionContainer = document.getElementById("player-selection-carousel");

container.style.gridTemplateColumns = `repeat(${maxRow * 2}, 1fr)`;
container.style.gridTemplateRows = `repeat(${4}, 1fr)`;

const initializeForm = () => {
    try {
        if (!container) {
            throw new Error();
        }
        getPlayers();
    } catch (error) {
        console.log(`%c${error.toString()}`, "color: white; font-size: 20px");
        return;
    }
};

const getPlayers = () => {
    
    fetch("players.json")
        .then((response) => response.json())
        .then((data) => {
            for(let player of data.players){
                const toRender = [
                    {
                        tagName: 'div',
                        attributes: {
                             class: 'selectable-player',
                             draggable: true,
                             'data-role-player': player.role,
                             'data-selectable': true,
                             'data-index-player': player.id,
                        },
                        listeners: [
                            {
                                event: 'dragstart',
                                name: dragStartHandler,
                            },
                            {
                                event: 'dragend',
                                name: dragEndHandler,
                            },
                        ],
                        children: [
                            {
                                tagName: 'img',
                                attributes: {
                                    src: player.img,
                                    class: 'avatar-img',
                                }
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
                renderElements(toRender, playersSelectionContainer);
            }
            
            instantiatePlayers();
        })
        .catch((error) => {
            console.log("ERRORE: " + error);
        });
};

const getFormattedFormation = () =>
    [1, ...selectedFormation.value.split("-")].map((el) => parseInt(el));

const instantiatePlayers = () => {
    const formRowLengths = getFormattedFormation();
    let containerArea = "";
    let counter = 0;
    const gridVoidElement = ". ";
    formRowLengths.forEach((rowLength, index) => {
        let rowCells = gridVoidElement.repeat(maxRow - rowLength);
        for (let i = 0; i < rowLength; i++) {
            let newPlayer = container.children[counter];
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
                            class: 'player',
                            style: `grid-area: area-${index}-${i}`,
                            'data-role-player': newPlayerRole(),
                            'data-index-player': '',
                        },
                        listeners: [
                            {
                                event: 'click',
                                name: buttonPlayerHandler,
                            },
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
                                    class: 'player-avatar',
                                },
                            },
                            {
                                tagName: 'div',
                                attributes: {
                                    class: 'player-description-container',
                                },
                            }
                        ]
                    }
                ]
                renderElements(newPlayer, container);
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
        rowCells += gridVoidElement.repeat(maxRow - rowLength);
        containerArea += `"${rowCells}"\n`;
    });
    container.style.gridTemplateAreas = containerArea;
};

const checkValidPlayerPosition = (dropPosition, playerDragged) => {
    if(dropPosition.dataset.rolePlayer === playerDragged.dataset.rolePlayer){
        dropPosition.classList.add("drop-valid");
    }else{
        dropPosition.classList.add("drop-invalid");
    }
}

const dropPlayer = (dropPosition, playerDragged) => {
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
        renderElements(playerChosen, dropPosition.querySelector('.player-avatar'));
        const playerDescriptionElement = [
            {
                tagName: 'div',
                attributes: {
                    class: 'player-description',
                },
                content: playerDragged.querySelector('.player-name').innerHTML,
            },
            {
                tagName: 'div',
                attributes: {
                    class: 'delete-button',
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
        renderElements(playerDescriptionElement, dropPosition.querySelector('.player-description-container'))
        dropPosition.querySelector('.player-avatar').classList.add('player-avatar-w-description');
        playerDragged.classList.add('selected-player');
        playerDragged.draggable = false;
        dropPosition.removeEventListener('dragover', dragOverHandler);
        dropPosition.removeEventListener('dragleave', dragLeaveHandler);
        dropPosition.removeEventListener('drop', dropHandler);
        dropPosition.removeEventListener('click', buttonPlayerHandler);
        dropPosition.querySelector('.player-description-container').classList.add('player-description-container-show');

    } else {
        playerDragged.style.opacity = 1;
        playerDragged.draggable = true;
        playerDragged.dataset.selectable = true;
        dropPosition.classList.remove('drop-invalid');
    }
    playerDragged = null;
}

export let playerDragged = null;
let playerDropped = false;
let filterRoleActive = false;

const dragStartHandler = (e) => {
    console.log("dragStart");
    playerDragged = e.target;

    setTimeout(() => {
        e.target.classList.add('selected-player');
        e.target.draggable = false;
        e.target.dataset.selectable = false;
        
        }, 0);
        
};


const dragEndHandler = (e) => {
    if(!playerDropped){
        console.log("dragEnd");
        e.target.classList.remove('selected-player');
        e.target.draggable = true;
        e.target.dataset.selectable = true;
    }
    playerDropped = false;
    playerDragged = null;
};

const dragOverHandler = (e) => {
    e.preventDefault();
    checkValidPlayerPosition(e.target, playerDragged);
    console.log("dragOver");
};

const dragLeaveHandler = (e) => {
    console.log("dragLeave");
    e.target.classList.remove("drop-valid");
    e.target.classList.remove("drop-invalid");
};

const dropHandler = (e) => {
    console.log("drop");
    playerDropped = true;
    dropPlayer(e.target, playerDragged);
    playerDragged = null;
};

const buttonPlayerHandler = (e) => {
    if(!filterRoleActive){
        filterRoleActive = true;
        addFilter('Player role');
    }
    
    filterSelectablePlayers(e.target.dataset.rolePlayer);
}

const filterSelectablePlayers = (rolePlayerFilter) => {
    
    [...playersSelectionContainer.children].forEach(
        player => {
            if(player.dataset.rolePlayer !== rolePlayerFilter)
                player.classList.add('selectable-player-hidden');
            else
                player.classList.remove('selectable-player-hidden');
        }
    )
}

const buttonDeleteHandler = (e) => {
    e.stopPropagation();
    deleteSelection(e.target.parentElement.parentElement);
}

const deleteSelection = (playerSelected) => {
    playerSelected.querySelector('.player-avatar').querySelector('.avatar-img').remove();
    playerSelected.querySelector('.player-avatar').classList.remove('player-avatar-w-description');
    playerSelected.querySelector('.player-description-container').querySelector('.player-description').remove();
    playerSelected.querySelector('.player-description-container').querySelector('.delete-button').remove();
    playerSelected.querySelector('.player-description-container').classList.remove('player-description-container-show');

    playerSelected.addEventListener('click', buttonPlayerHandler);
    playerSelected.addEventListener('dragover', dragOverHandler);
    playerSelected.addEventListener('dragleave', dragLeaveHandler);
    playerSelected.addEventListener('drop', dropHandler);

    const selectablePlayer = [...playersSelectionContainer.children]
                            .find(
                                element => element.dataset.indexPlayer === playerSelected.dataset.indexPlayer
                            );

    selectablePlayer.classList.remove('selected-player');
    selectablePlayer.draggable = true;
    selectablePlayer.dataset.selectable = 'true';
    
    playerSelected.dataset.indexPlayer = '';
}

const addFilter = (filterType) => {
    const filter = [
        {
            tagName: 'div',
            attributes: {
                class: 'filter',
            },
            children: [
                {
                    tagName: 'div',
                    attributes: {
                        class: 'filter-description',
                    },
                    content: filterType,
                },
                {
                    tagName: 'div',
                    attributes: {
                        class: 'filter-delete-button',
                    },
                    listeners: [
                        {
                            event: 'click',
                            name: deleteFilterHandler,
                        },
                    ],
                    content: 'X',
                }
            ]
        }
    ]

    renderElements(filter, filterContainer);
}

const deleteFilterHandler = (e) => {
    deleteFilter(e.target.parentElement);
}

const deleteFilter = (filter) => {
    filter.remove();
    [...playersSelectionContainer.children].forEach(
        element => element.classList.remove('selectable-player-hidden')
    );
    filterRoleActive = false;
}


initializeForm();

window.instantiatePlayers = instantiatePlayers;

