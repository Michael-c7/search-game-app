import apiKey from "./apiKey.js"
let searchTerm = "call of duty";

// cached variables
let popupContainer = document.querySelector(".popup-container");
let popup = document.querySelector(".popup");
let popupCloseBtn = document.querySelector(".popup__close-btn");
let cardList = document.querySelector(".card-list");
const searchBtn = document.querySelector(".search-btn");
let searchInput = document.querySelector(".search-input");
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

let closePopup = _ => {
    if(event.target.closest(".popup__close-btn")) {
        popupContainer.classList.remove("popup-show")
        document.body.classList.remove("disable-scrollbar")
    }
}





/*
- get current game ID
- open the popup
- get the additonal game info and apply it to the popup
*/
cardList.addEventListener("click", event => {
    openPopup()
    // getAdditionalInfo(getCurrentCardId())
})


let getAdditionalInfo = gameId => {
    // search for a specific game
    gameId = 19476;

    let getInfo = _ => {
        return fetch(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            let getGenre = data.genres.map(item => item.name);
            let getDev = data.developers.map(item => item.name);
            let getPlatform = data.platforms.map(item => item.platform.name);

            return {
                name:data.name,
                releaseDate:data.released,
                esrbRating:data.esrb_rating.name,
                genres:getGenre,
                platforms:getPlatform,
                developers:getDev,
                description:data.description_raw,
            }
        })
    }
    // get game trailer
    let getGameTrailerInfo = _ => {
        return fetch(`https://api.rawg.io/api/games/${gameId}/movies?key=${apiKey}`)
        .then(res => res.json())
        .then(data => {

            /*
            if data is undefined return a default video
            */

            return {
                trailer:data.results[0].data.max,
                name:data.results[0].name,
                thumbnail:data.results[0].preview,
                }
        });
    }

    return {
        gameInfo:getInfo(),
        gameTrailerInfo: getGameTrailerInfo(),
    }
}


let renderPopupInfo = popupInfo => {
    let markup = `
        <div class="popup__info">
            <h2 class="popup__info__heading">Grand Theft Auto V</h2>
            <video class="popup__info__video" src="./videos/no-video-available.mp4" controls></video>
            <div class="popup__info__data">
                <div class="popup__info__release-date">Release Date: 2021</div>
                <div class="popup__info__rating">Rating: Mature</div>
            </div>

            <div class="popup__info__genres">Action, adventure, RPG</div>
            <div class="popup__info__platforms">Platforms: ps4, ps4, pc, xbox 360</div>
            <div class="popup__info__developers">Developers: Rockstar North, Rockstar South</div>
            <p class="popup__info__description">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos,
                alias eos amet error assumenda nobis ipsum numquam dolor quibusdam.
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos,
            </p>
        </div>
        <div class="popup__close">
                    <button class="popup__close-btn">
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </button>
                </div>
    `;


    let info = popupInfo.gameInfo.then(item => {
        const {description, developers, esrbRating,
        genres, name, platforms, releaseDate} = item;
        // name
        document.querySelector(".popup__info__heading").innerHTML = name;
        // release date
        document.querySelector(".popup__info__release-date").innerHTML = `Release Date: ${releaseDate.slice(0,4)}`;
        // rating(esrb)
        document.querySelector(".popup__info__rating").innerHTML = `Rating: ${esrbRating}`;
        // genres
        document.querySelector(".popup__info__genres").innerHTML = `Genres: ${genres}`;
        // developers
        document.querySelector(".popup__info__developers").innerHTML = `Developed by: ${developers}`;
        // platforms
        document.querySelector(".popup__info__platforms").innerHTML = `Platforms: ${platforms}`;
        // description
        document.querySelector(".popup__info__description").innerHTML = description;
    });


    let trailerInfo = popupInfo.gameTrailerInfo.then(item => {
        const {trailer} = item;
        document.querySelector(".popup__info__video").src = trailer;
    })
    popup.innerHTML = markup;
}



let render = () => {
    getListOfGames().then(data => renderCards(data))
    renderPopupInfo(getAdditionalInfo(865))
}

// render()

document.querySelector(".popup__close-btn").addEventListener("click", closePopup)

