/* =========================================
   NITUL GAMES
   SEARCH + CATEGORY FILTER
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =========================
           ELEMENTS
        ========================= */

        const searchInput =
            document.getElementById(
                "gameSearch"
            );


        const clearSearch =
            document.getElementById(
                "clearSearch"
            );


        const categoryButtons =
            document.querySelectorAll(
                ".category-btn"
            );


        const gameCards =
            document.querySelectorAll(
                ".game-card"
            );


        const noResults =
            document.getElementById(
                "noResults"
            );


        /* =========================
           CURRENT CATEGORY
        ========================= */

        let selectedCategory = "all";


        /* =========================
           FILTER FUNCTION
        ========================= */

        function filterGames() {

            const searchText =
                searchInput.value
                    .toLowerCase()
                    .trim();


            let visibleGames = 0;


            gameCards.forEach(
                function (card) {


                    const category =
                        card.dataset.category
                            .toLowerCase();


                    const name =
                        card.dataset.name
                            .toLowerCase();


                    const categoryMatch =
                        selectedCategory === "all" ||
                        category === selectedCategory;


                    const searchMatch =
                        name.includes(
                            searchText
                        );


                    if (
                        categoryMatch &&
                        searchMatch
                    ) {

                        card.classList.remove(
                            "hidden"
                        );

                        visibleGames++;

                    } else {

                        card.classList.add(
                            "hidden"
                        );

                    }

                }
            );


            /* =========================
               NO RESULT
            ========================= */

            if (visibleGames === 0) {

                noResults.classList.add(
                    "show"
                );

            } else {

                noResults.classList.remove(
                    "show"
                );

            }


            /* =========================
               CLEAR BUTTON
            ========================= */

            if (
                searchText.length > 0
            ) {

                clearSearch.classList.add(
                    "show"
                );

            } else {

                clearSearch.classList.remove(
                    "show"
                );

            }

        }


        /* =========================
           CATEGORY CLICK
        ========================= */

        categoryButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {


                        /* Remove active */

                        categoryButtons.forEach(
                            function (btn) {

                                btn.classList.remove(
                                    "active"
                                );

                            }
                        );


                        /* Add active */

                        this.classList.add(
                            "active"
                        );


                        /* Get category */

                        selectedCategory =
                            this.dataset.category;


                        /* Filter */

                        filterGames();

                    }
                );

            }
        );


        /* =========================
           SEARCH INPUT
        ========================= */

        searchInput.addEventListener(
            "input",
            function () {

                filterGames();

            }
        );


        /* =========================
           CLEAR SEARCH
        ========================= */

        clearSearch.addEventListener(
            "click",
            function () {

                searchInput.value = "";

                searchInput.focus();

                filterGames();

            }
        );


        /* =========================
           ENTER KEY
        ========================= */

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                ) {

                    searchInput.value = "";

                    filterGames();

                }

            }
        );


        /* =========================
           INITIAL LOAD
        ========================= */

        filterGames();


    }
);
