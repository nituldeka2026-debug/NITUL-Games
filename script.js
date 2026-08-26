document.addEventListener("DOMContentLoaded", function () {

    const cards = document.querySelectorAll(".game-card");
    const search = document.getElementById("searchInput");
    const categories = document.querySelectorAll(".category");
    const noResults = document.getElementById("noResults");

    let selectedCategory = "all";

    function showGames() {

        const text = search
            ? search.value.toLowerCase().trim()
            : "";

        let count = 0;

        cards.forEach(function (card) {

            const name =
                (card.dataset.name || "").toLowerCase();

            const category =
                (card.dataset.category || "").toLowerCase();

            const categoryOK =
                selectedCategory === "all" ||
                category === selectedCategory;

            const searchOK =
                name.includes(text);

            if (categoryOK && searchOK) {

                card.style.display = "block";
                count++;

            } else {

                card.style.display = "none";

            }

        });

        if (noResults) {
            noResults.style.display =
                count === 0 ? "block" : "none";
        }
    }


    /* SEARCH */

    if (search) {
        search.addEventListener("input", showGames);
    }


    /* CATEGORIES */

    categories.forEach(function (button) {

        button.addEventListener("click", function () {

            categories.forEach(function (btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            selectedCategory =
                button.dataset.category || "all";

            showGames();

        });

    });


    /* SHOW ALL GAMES ON START */

    cards.forEach(function (card) {
        card.style.display = "block";
    });

    if (noResults) {
        noResults.style.display = "none";
    }

});
