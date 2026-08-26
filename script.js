document.addEventListener("DOMContentLoaded", () => {

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

    const menuBtn =
        document.getElementById("menuBtn");

    const nav =
        document.getElementById("nav");


    let activeCategory = "all";


    /* ================= MOBILE MENU ================= */

    menuBtn.addEventListener("click", () => {

        nav.classList.toggle("show");

        menuBtn.textContent =
            nav.classList.contains("show")
                ? "✕"
                : "☰";

    });


    document.querySelectorAll(".nav a")
        .forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("show");

                menuBtn.textContent = "☰";

            });

        });


    /* ================= FILTER ================= */

    function filterGames() {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();

        let visible = 0;


        gameCards.forEach(card => {

            const name =
                card.dataset.name
                    .toLowerCase();

            const category =
                card.dataset.category
                    .toLowerCase();


            const matchesSearch =
                name.includes(search);

            const matchesCategory =
                activeCategory === "all" ||
                category === activeCategory;


            if (
                matchesSearch &&
                matchesCategory
            ) {

                card.style.display = "";

                visible++;

            } else {

                card.style.display = "none";

            }

        });


        /* GAME COUNT */

        gameCount.textContent =
            `${visible} ${visible === 1 ? "Game" : "Games"}`;


        /* NO RESULTS */

        noResults.style.display =
            visible === 0
                ? "block"
                : "none";


        /* CLEAR BUTTON */

        clearSearch.style.display =
            search.length > 0
                ? "block"
                : "none";

    }


    /* ================= SEARCH ================= */

    searchInput.addEventListener(
        "input",
        filterGames
    );


    clearSearch.addEventListener(
        "click",
        () => {

            searchInput.value = "";

            filterGames();

            searchInput.focus();

        }
    );


    /* ================= CATEGORY ================= */

    categoryButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                categoryButtons
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );

                button.classList.add("active");

                activeCategory =
                    button.dataset.category;

                filterGames();

            }
        );

    });


    /* ================= CARD ANIMATION ================= */

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity = "1";

                        entry.target.style.transform =
                            "translateY(0)";

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.08
            }
        );


    gameCards.forEach(card => {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(18px)";

        card.style.transition =
            "opacity .5s ease, transform .5s ease";

        observer.observe(card);

    });


    /* ================= INITIAL ================= */

    filterGames();

});
