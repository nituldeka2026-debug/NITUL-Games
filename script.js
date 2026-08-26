document.addEventListener("DOMContentLoaded", () => {

    const menuBtn = document.getElementById("menuBtn");
    const nav = document.querySelector(".nav-links");

    const searchInput = document.getElementById("searchInput");

    const categoryButtons =
        document.querySelectorAll(".category");

    const gameCards =
        document.querySelectorAll(".game-card");

    const noResults =
        document.getElementById("noResults");

    let currentCategory = "all";


    /* MOBILE MENU */

    if (menuBtn && nav) {

        menuBtn.addEventListener("click", () => {

            nav.classList.toggle("show");

            menuBtn.classList.toggle("active");

        });

    }


    /* GAME FILTER */

    function filterGames() {

        const searchText = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        let visibleCount = 0;


        gameCards.forEach(card => {

            const category =
                (card.dataset.category || "")
                .toLowerCase();

            const name =
                (card.dataset.name || "")
                .toLowerCase();


            const categoryMatch =
                currentCategory === "all" ||
                category === currentCategory;

            const searchMatch =
                name.includes(searchText);


            if (categoryMatch && searchMatch) {

                card.style.display = "flex";

                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });


        if (noResults) {

            noResults.style.display =
                visibleCount === 0
                    ? "block"
                    : "none";

        }

    }


    /* CATEGORY */

    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            categoryButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            currentCategory =
                (
                    button.dataset.category ||
                    "all"
                ).toLowerCase();

            filterGames();

        });

    });


    /* SEARCH */

    if (searchInput) {

        searchInput.addEventListener("input", () => {
            filterGames();
        });

    }


    /* INITIAL */

    filterGames();

});
