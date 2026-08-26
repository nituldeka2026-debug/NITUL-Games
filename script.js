document.addEventListener("DOMContentLoaded", () => {

    const menuBtn =
        document.getElementById("menuBtn");

    const nav =
        document.getElementById("nav");

    const searchInput =
        document.getElementById("gameSearch");

    const clearSearch =
        document.getElementById("clearSearch");

    const categoryButtons =
        document.querySelectorAll(".category-btn");

    const gameCards =
        document.querySelectorAll(".game-card");

    const noResults =
        document.getElementById("noResults");

    const gameCount =
        document.getElementById("gameCount");


    let activeCategory = "all";


    /* MOBILE MENU */

    if (menuBtn && nav) {

        menuBtn.addEventListener("click", () => {

            nav.classList.toggle("show");

            if (
                nav.classList.contains("show")
            ) {
                menuBtn.textContent = "✕";
            } else {
                menuBtn.textContent = "☰";
            }

        });


        nav.querySelectorAll("a")
            .forEach(link => {

                link.addEventListener("click", () => {

                    nav.classList.remove("show");

                    menuBtn.textContent = "☰";

                });

            });

    }


    /* FILTER GAMES */

    function filterGames() {

        const searchText =
            searchInput.value
                .trim()
                .toLowerCase();


        let visibleGames = 0;


        gameCards.forEach(card => {

            const gameName =
                card.dataset.name
                    .toLowerCase();

            const gameCategory =
                card.dataset.category
                    .toLowerCase();


            const searchMatch =
                gameName.includes(searchText);


            const categoryMatch =
                activeCategory === "all" ||
                gameCategory === activeCategory;


            if (
                searchMatch &&
                categoryMatch
            ) {

                card.style.display = "flex";

                visibleGames++;

            } else {

                card.style.display = "none";

            }

        });


        /* GAME COUNT */

        if (gameCount) {

            gameCount.textContent =
                visibleGames +
                (
                    visibleGames === 1
                        ? " Game"
                        : " Games"
                );

        }


        /* NO RESULT */

        if (noResults) {

            if (visibleGames === 0) {

                noResults.style.display =
                    "block";

            } else {

                noResults.style.display =
                    "none";

            }

        }


        /* CLEAR BUTTON */

        if (clearSearch) {

            if (searchText.length > 0) {

                clearSearch.style.display =
                    "block";

            } else {

                clearSearch.style.display =
                    "none";

            }

        }

    }


    /* SEARCH */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterGames
        );

    }


    /* CLEAR SEARCH */

    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            () => {

                searchInput.value = "";

                filterGames();

                searchInput.focus();

            }
        );

    }


    /* CATEGORY BUTTONS */

    categoryButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                categoryButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                activeCategory =
                    button.dataset.category;


                filterGames();

            }
        );

    });


    /* INITIAL LOAD */

    filterGames();

});
