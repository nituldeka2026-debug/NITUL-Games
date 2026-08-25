document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");

    const categoryButtons =
        document.querySelectorAll(".category-btn");

    const gameCards =
        document.querySelectorAll(".game-card");

    const noResults =
        document.getElementById("noResults");


    let selectedCategory = "all";


    function filterGames() {

        const searchText =
            searchInput.value
                .toLowerCase()
                .trim();

        let visibleGames = 0;


        gameCards.forEach(function (card) {

            const gameName =
                (card.dataset.name || "")
                .toLowerCase();

            const gameCategory =
                (card.dataset.category || "")
                .toLowerCase();


            const searchMatch =
                gameName.includes(searchText);


            const categoryMatch =
                selectedCategory === "all" ||
                gameCategory === selectedCategory;


            if (searchMatch && categoryMatch) {

                card.classList.remove("hidden");

                visibleGames++;

            } else {

                card.classList.add("hidden");

            }

        });


        /* NO RESULTS */

        if (visibleGames === 0) {

            noResults.classList.add("show");

        } else {

            noResults.classList.remove("show");

        }


        /* CLEAR BUTTON */

        if (searchText.length > 0) {

            clearSearch.style.opacity = "1";
            clearSearch.style.pointerEvents = "auto";

        } else {

            clearSearch.style.opacity = "0";
            clearSearch.style.pointerEvents = "none";

        }

    }



    /* ================= SEARCH ================= */

    searchInput.addEventListener(
        "input",
        function () {

            filterGames();

        }
    );



    /* ================= CLEAR SEARCH ================= */

    clearSearch.addEventListener(
        "click",
        function () {

            searchInput.value = "";

            filterGames();

            searchInput.focus();

        }
    );



    /* ================= CATEGORY FILTER ================= */

    categoryButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {


                /* Remove active */

                categoryButtons.forEach(
                    function (btn) {

                        btn.classList.remove("active");

                    }
                );


                /* Add active */

                button.classList.add("active");


                /* Selected category */

                selectedCategory =
                    button.dataset.category;


                /* Filter */

                filterGames();


                /* Smooth scroll */

                document.getElementById("games")
                    .scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

            }
        );

    });



    /* ================= ESC KEY ================= */

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                searchInput.value = "";

                filterGames();

            }

        }
    );



    /* ================= PLAY BUTTON FEEDBACK ================= */

    const playButtons =
        document.querySelectorAll(".game-button");


    playButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                button.style.opacity = "0.7";

            }
        );

    });



    /* ================= INITIAL LOAD ================= */

    filterGames();

});
