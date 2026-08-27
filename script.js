document.addEventListener("DOMContentLoaded", () => {


    /* =========================
       ELEMENTS
    ========================= */

    const gameSearch =
        document.getElementById("gameSearch");

    const topSearch =
        document.getElementById("topSearch");

    const clearSearch =
        document.getElementById("clearSearch");

    const categoryButtons =
        document.querySelectorAll(".category-btn");

    const gameCards =
        document.querySelectorAll(".game-card");

    const noResults =
        document.getElementById("noResults");

    const menuBtn =
        document.getElementById("menuBtn");

    const nav =
        document.getElementById("nav");

    const viewAllGames =
        document.getElementById("viewAllGames");


    let activeCategory = "all";


    /* =========================
       SEARCH FUNCTION
    ========================= */

    function filterGames() {

        const searchValue =
            gameSearch.value
                .toLowerCase()
                .trim();

        let visibleGames = 0;


        gameCards.forEach((card) => {

            const gameName =
                card.dataset.name
                    .toLowerCase();

            const gameCategory =
                card.dataset.category;

            const matchesSearch =
                gameName.includes(searchValue);

            const matchesCategory =
                activeCategory === "all" ||
                gameCategory === activeCategory;


            if (
                matchesSearch &&
                matchesCategory
            ) {

                card.style.display =
                    "flex";

                visibleGames++;

            } else {

                card.style.display =
                    "none";

            }

        });


        if (visibleGames === 0) {

            noResults.style.display =
                "block";

        } else {

            noResults.style.display =
                "none";

        }


        if (
            gameSearch.value.length > 0
        ) {

            clearSearch.style.display =
                "block";

        } else {

            clearSearch.style.display =
                "none";

        }

    }


    /* =========================
       MAIN SEARCH
    ========================= */

    gameSearch.addEventListener(
        "input",
        filterGames
    );


    /* =========================
       TOP HEADER SEARCH
    ========================= */

    if (topSearch) {

        topSearch.addEventListener(
            "input",
            () => {

                gameSearch.value =
                    topSearch.value;

                activeCategory =
                    "all";


                categoryButtons.forEach(
                    (button) => {

                        button.classList.remove(
                            "active"
                        );

                    }
                );


                const allButton =
                    document.querySelector(
                        '[data-category="all"]'
                    );


                if (allButton) {

                    allButton.classList.add(
                        "active"
                    );

                }


                filterGames();

            }
        );

    }


    /* =========================
       CLEAR SEARCH
    ========================= */

    clearSearch.addEventListener(
        "click",
        () => {

            gameSearch.value = "";


            if (topSearch) {

                topSearch.value = "";

            }


            filterGames();

            gameSearch.focus();

        }
    );


    /* =========================
       CATEGORY FILTER
    ========================= */

    categoryButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    activeCategory =
                        button.dataset.category;


                    categoryButtons.forEach(
                        (item) => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    filterGames();

                }
            );

        }
    );


    /* =========================
       VIEW ALL GAMES
    ========================= */

    if (viewAllGames) {

        viewAllGames.addEventListener(
            "click",
            () => {

                activeCategory = "all";

                gameSearch.value = "";


                if (topSearch) {

                    topSearch.value = "";

                }


                categoryButtons.forEach(
                    (button) => {

                        button.classList.remove(
                            "active"
                        );

                    }
                );


                document
                    .querySelector(
                        '[data-category="all"]'
                    )
                    .classList.add(
                        "active"
                    );


                filterGames();


                document
                    .getElementById("games")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    }


    /* =========================
       MOBILE MENU
    ========================= */

    if (menuBtn) {

        menuBtn.addEventListener(
            "click",
            () => {

                nav.classList.toggle(
                    "show"
                );


                if (
                    nav.classList.contains(
                        "show"
                    )
                ) {

                    menuBtn.textContent =
                        "✕";

                } else {

                    menuBtn.textContent =
                        "☰";

                }

            }
        );

    }


    /* =========================
       CLOSE MOBILE MENU
    ========================= */

    document
        .querySelectorAll(".nav a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    nav.classList.remove(
                        "show"
                    );

                    menuBtn.textContent =
                        "☰";

                }
            );

        });


});
