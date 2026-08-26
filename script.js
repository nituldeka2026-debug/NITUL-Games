const categories =
    document.querySelectorAll(".category");

const games =
    document.querySelectorAll(".game-card");

const searchInput =
    document.getElementById("searchInput");

const noResults =
    document.getElementById("noResults");


let currentCategory = "all";


function filterGames() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    let visibleGames = 0;


    games.forEach(game => {

        const category =
            game.dataset.category;

        const name =
            game.dataset.name;

        const categoryMatch =
            currentCategory === "all" ||
            category === currentCategory;

        const searchMatch =
            name.includes(searchText);


        if (categoryMatch && searchMatch) {

            game.style.display = "block";

            visibleGames++;

        } else {

            game.style.display = "none";

        }

    });


    noResults.style.display =
        visibleGames === 0
            ? "block"
            : "none";

}


categories.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            categories.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            currentCategory =
                button.dataset.category;

            filterGames();

        }
    );

});


searchInput.addEventListener(
    "input",
    filterGames
);


/* MOBILE MENU */

const menuBtn =
    document.getElementById("menuBtn");


menuBtn.addEventListener(
    "click",
    () => {

        document
            .querySelector(".nav-links")
            .classList.toggle("show-menu");

    }
);
