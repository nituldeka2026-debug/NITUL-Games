/* =====================================================
   NITUL GAMES V2
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.getElementById("searchInput");

    const cards =
        document.querySelectorAll(".game-card");

    const categoryButtons =
        document.querySelectorAll(".category-card");

    const noResults =
        document.getElementById("noResults");


    let currentCategory = "all";


    /* ===============================
       FILTER GAMES
    =============================== */

    function filterGames() {

        const search =
            searchInput.value
                .toLowerCase()
                .trim();

        let visible = 0;


        cards.forEach(card => {

            const name =
                card.dataset.name
                    .toLowerCase();

            const category =
                card.dataset.category
                    .toLowerCase();


            const categoryMatch =
                currentCategory === "all" ||
                category === currentCategory;


            const searchMatch =
                name.includes(search);


            if (categoryMatch && searchMatch) {

                card.style.display = "";

                visible++;

            } else {

                card.style.display = "none";

            }

        });


        noResults.style.display =
            visible === 0
                ? "block"
                : "none";

    }


    /* ===============================
       SEARCH
    =============================== */

    searchInput.addEventListener(
        "input",
        filterGames
    );


    /* ===============================
       CATEGORY BUTTONS
    =============================== */

    categoryButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                categoryButtons
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );


                button.classList.add("active");


                currentCategory =
                    button.dataset.filter;


                filterGames();

            }
        );

    });


    /* ===============================
       SMOOTH NAVIGATION
    =============================== */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const target =
                    document.querySelector(
                        link.getAttribute("href")
                    );


                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    });


    /* ===============================
       IMAGE FALLBACK
    =============================== */

    document.querySelectorAll(
        ".game-image img"
    ).forEach(img => {

        img.addEventListener(
            "error",
            () => {

                img.style.display = "none";

                img.parentElement.classList.add(
                    "image-error"
                );

            }
        );

    });


    /* ===============================
       CARD REVEAL
    =============================== */

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
                threshold: .1
            }
        );


    cards.forEach(card => {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(20px)";

        card.style.transition =
            "opacity .5s ease, transform .5s ease";

        observer.observe(card);

    });

});
