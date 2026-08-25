document.addEventListener("DOMContentLoaded", function () {

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


    let selectedCategory = "all";


    function filterGames() {

        const searchText =
            searchInput.value
                .toLowerCase()
                .trim();

        let visible = 0;


        gameCards.forEach(function (card) {

            const name =
                card.dataset.name.toLowerCase();

            const category =
                card.dataset.category.toLowerCase();


            const matchesSearch =
                name.includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;


            if (matchesSearch && matchesCategory) {

                card.classList.remove("hidden");

                visible++;

            } else {

                card.classList.add("hidden");

            }

        });


        if (visible === 0) {

            noResults.classList.add("show");

        } else {

            noResults.classList.remove("show");

        }


        if (searchText.length > 0) {

            clearSearch.style.opacity = "1";

        } else {

            clearSearch.style.opacity = "0";

        }

    }


    /* SEARCH */

    searchInput.addEventListener(
        "input",
        filterGames
    );


    /* CLEAR SEARCH */

    clearSearch.addEventListener(
        "click",
        function () {

            searchInput.value = "";

            filterGames();

            searchInput.focus();

        }
    );


    /* CATEGORY */

    categoryButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                categoryButtons.forEach(
                    function (btn) {
                        btn.classList.remove("active");
                    }
                );


                button.classList.add("active");


                selectedCategory =
                    button.dataset.category;


                filterGames();

            }
        );

    });


    /* ESCAPE KEY */

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                searchInput.value = "";

                filterGames();

            }

        }
    );


    /* INITIAL */

    filterGames();

});
