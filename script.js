const categories = document.querySelectorAll(".category");

const games = document.querySelectorAll(".game-card");

const searchInput =
    document.getElementById("searchInput");

const noResults =
    document.getElementById("noResults");

const menuBtn =
    document.getElementById("menuBtn");

const navLinks =
    document.querySelector(".nav-links");


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


        if (
            categoryMatch &&
            searchMatch
        ) {

            game.style.display =
                "block";

            visibleGames++;

        } else {

            game.style.display =
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

}


/* CATEGORY */

categories.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            categories.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            currentCategory =
                button.dataset.category;


            filterGames();

        }
    );

});


/* SEARCH */

searchInput.addEventListener(
    "input",
    filterGames
);


/* MOBILE MENU */

menuBtn.addEventListener(
    "click",
    () => {

        navLinks.classList.toggle(
            "show-menu"
        );

    }
);


/* CLOSE MENU AFTER CLICK */

navLinks.querySelectorAll("a")
.forEach(link => {

    link.addEventListener(
        "click",
        () => {

            navLinks.classList.remove(
                "show-menu"
            );

        }
    );

});
