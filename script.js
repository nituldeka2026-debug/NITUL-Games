// PLAY GAME

function playGame(gameName) {

    alert(
        gameName +
        " is coming soon! 🎮"
    );

}


// ANDROID

function androidMessage() {

    alert(
        "NITUL Games Android games are coming soon! 📱"
    );

}


// CATEGORY FILTER

function filterGames(category) {

    const games =
        document.querySelectorAll(".game-card");

    games.forEach(function(game) {

        if (
            category === "all" ||
            game.dataset.category === category
        ) {

            game.style.display = "block";

        } else {

            game.style.display = "none";

        }

    });

}


// SEARCH

function searchGames() {

    const search =
        document
        .getElementById("gameSearch")
        .value
        .toLowerCase();

    const games =
        document.querySelectorAll(".game-card");

    games.forEach(function(game) {

        const title =
            game
            .querySelector("h3")
            .innerText
            .toLowerCase();

        if (title.includes(search)) {

            game.style.display = "block";

        } else {

            game.style.display = "none";

        }

    });

}