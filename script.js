document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");

    const categories = document.querySelectorAll(".category");
    const games = document.querySelectorAll(".game-card");

    const noGames = document.getElementById("noGames");

    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav");


    /* ================= MOBILE MENU ================= */

    if (menuBtn) {

        menuBtn.addEventListener("click", () => {

            nav.classList.toggle("open");

            if (nav.classList.contains("open")) {
                menuBtn.textContent = "✕";
            } else {
                menuBtn.textContent = "☰";
            }

        });

    }


    /* CLOSE MOBILE MENU AFTER CLICK */

    document.querySelectorAll(".nav a").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("open");

            if (menuBtn) {
                menuBtn.textContent = "☰";
            }

        });

    });


    /* ================= GAME FILTER ================= */

    let selectedCategory = "all";


    function filterGames() {

        const searchText =
            searchInput.value
                .trim()
                .toLowerCase();

        let visibleGames = 0;


        games.forEach(game => {

            const gameName =
                game.dataset.name.toLowerCase();

            const gameCategory =
                game.dataset.category.toLowerCase();


            const categoryMatch =
                selectedCategory === "all" ||
                gameCategory === selectedCategory;


            const searchMatch =
                gameName.includes(searchText);


            if (categoryMatch && searchMatch) {

                game.style.display = "";

                visibleGames++;

            } else {

                game.style.display = "none";

            }

        });


        if (visibleGames === 0) {
            noGames.style.display = "block";
        } else {
            noGames.style.display = "none";
        }

    }


    /* CATEGORY BUTTONS */

    categories.forEach(button => {

        button.addEventListener("click", () => {

            categories.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            selectedCategory =
                button.dataset.category;

            filterGames();

        });

    });


    /* SEARCH */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterGames
        );

    }


    /* CLEAR SEARCH */

    if (clearSearch) {

        clearSearch.addEventListener("click", () => {

            searchInput.value = "";

            filterGames();

            searchInput.focus();

        });

    }


    /* ================= SCROLL ANIMATION ================= */

    const cards =
        document.querySelectorAll(".game-card");


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity = "1";
                        entry.target.style.transform =
                            "translateY(0)";

                    }

                });

            },
            {
                threshold: 0.08
            }
        );


    cards.forEach(card => {

        card.style.opacity = "0";
        card.style.transform = "translateY(25px)";
        card.style.transition =
            "opacity .6s ease, transform .6s ease";

        observer.observe(card);

    });


    /* INITIAL FILTER */

    filterGames();

});
