// ======================================
// NITUL GAMES
// SEARCH + CATEGORY FILTER
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("gameSearch");
    const gameCards = document.querySelectorAll(".game-card");
    const noResults = document.getElementById("noResults");
    const categoryButtons =
        document.querySelectorAll(".category-btn");

    let currentCategory = "all";


    // ==============================
    // FILTER GAMES
    // ==============================

    function updateGames() {

        const searchText =
            searchInput.value
                .trim()
                .toLowerCase();

        let visibleGames = 0;


        gameCards.forEach(function (game) {

            const category =
                game.dataset.category || "";

            const searchData =
                game.dataset.search ||
                game.querySelector("h3").innerText;

            const matchesCategory =
                currentCategory === "all" ||
                category === currentCategory;

            const matchesSearch =
                searchData
                    .toLowerCase()
                    .includes(searchText);


            if (matchesCategory && matchesSearch) {

                game.classList.remove("game-hidden");

                visibleGames++;

            } else {

                game.classList.add("game-hidden");

            }

        });


        // NO RESULT MESSAGE

        if (visibleGames === 0) {

            noResults.style.display = "block";

        } else {

            noResults.style.display = "none";

        }

    }


    // ==============================
    // SEARCH
    // ==============================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            updateGames
        );

    }


    // ==============================
    // CATEGORY BUTTONS
    // ==============================

    categoryButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                currentCategory =
                    button.getAttribute("data-category");

                categoryButtons.forEach(function (btn) {

                    btn.classList.remove("active");

                });

                button.classList.add("active");

                updateGames();

            }
        );

    });


    // ==============================
    // INITIAL
    // ==============================

    updateGames();

});


// ======================================
// CATEGORY BUTTON FUNCTION
// ======================================

function filterGames(category, button) {

    const buttons =
        document.querySelectorAll(".category-btn");

    buttons.forEach(function (btn) {

        btn.classList.remove("active");

    });

    button.classList.add("active");


    const searchInput =
        document.getElementById("gameSearch");

    if (searchInput) {

        searchInput.value = "";

    }


    const games =
        document.querySelectorAll(".game-card");

    let visibleGames = 0;

    games.forEach(function (game) {

        const gameCategory =
            game.dataset.category;

        if (
            category === "all" ||
            gameCategory === category
        ) {

            game.classList.remove("game-hidden");

            visibleGames++;

        } else {

            game.classList.add("game-hidden");

        }

    });


    const noResults =
        document.getElementById("noResults");

    if (noResults) {

        noResults.style.display =
            visibleGames === 0
                ? "block"
                : "none";

    }

}
