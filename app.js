import apiKey from "./apiKey.js"
let searchTerm = "call of duty";

// cached variables
let popupContainer = document.querySelector(".popup-container");
let popup = document.querySelector(".popup");
let cardList = document.querySelector(".card-list");
const searchBtn = document.querySelector(".search-btn");
let searchInput = document.querySelector(".search-input")

/*
documentation

https://rawg.io/apidocs
https://api.rawg.io/docs/#tag/games
https://rawg.io/
*/


// searchBtn.addEventListener("click", _ => {
//     searchInput.value = searchTerm;
//     console.log(searchInput.value, searchTerm)
// })



// get a list of games
let getListOfGames = _ => {
    return fetch(`https://api.rawg.io/api/games?key=${apiKey}&search="${searchTerm}`)
    .then(res => res.json())
    .then(data => {
        let relevantData = data.results.map(item => {
            return {
                 id:item.id,
                 name:item.name,
                 score:item.metacritic,
                 thumbnail:item.background_image,
                }
        });
        return relevantData;
    });
}


let renderCards = games => {
    let markup = "";
    games.forEach(game => {
        markup = `
        <li class="card" id=${game.id}>
            <header class="card__header">
                    <img class="card__header__img" src="${game.thumbnail}">
                    <div class="card__info">
                        <h2 class="card__game-title">${game.name}</h2>
                        <div class="card__score">${game.score} / 100</div>
                    </div>
            </header>
            <div class="card__learn-more">
                <button class="card__learn-more-btn">Learn More</button>
            </div>
        </li>
        `
        cardList.innerHTML += markup;
    });
}

// render to DOM
getListOfGames().then(data => renderCards(data))



let getCurrentCardId = _ => {
    if(event.target.closest(".card__learn-more-btn")) {
        return Number(event.target.parentElement.parentElement.id);
    }
}

let openPopup = _ => {
    if(event.target.closest(".card__learn-more-btn")) {
        popupContainer.classList.add("popup-show")
        document.body.classList.add("disable-scrollbar")
    }
}

/*
- get current game ID
- open the popup
- get the additonal game info and apply it to the popup
*/
cardList.addEventListener("click", event => {
    // getCurrentCardId()
    openPopup()
})



let getAdditionalInfo = _ => {
    
}

// search for a specific game
let gameId = 3498;
    // fetch(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`)
    // .then(res => res.json())
    // .then(data => {
    //     console.log(data)
    // })



// get game trailer
// https://api.rawg.io/api/games/{id}/movies

// fetch(`https://api.rawg.io/api/games/${gameId}/movies?key=${apiKey}`)
// .then(res => res.json())
// .then(data => {
//     console.log(data)
// })