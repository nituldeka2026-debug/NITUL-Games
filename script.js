document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTS
    ========================= */

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


    /* =========================
       MOBILE MENU
    ========================= */

    if (menuBtn && nav) {

        menuBtn.addEventListener("click", () => {

            nav.classList.toggle("show-menu");

            menuBtn.classList.toggle("active");

            menuBtn.textContent =
                nav.classList.contains("show-menu")
                    ? "✕"
                    : "☰";

        });


        nav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("show-menu");

                menuBtn.classList.remove("active");

                menuBtn.textContent = "☰";

            });

        });

    }


    /* =========================
       FILTER GAMES
    ========================= */

    function filterGames() {

        const searchText =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        let visibleCount = 0;


        gameCards.forEach(card => {

            const category =
                (card.dataset.category || "")
                    .toLowerCase();


            const name =
                (card.dataset.name ||
                    card.textContent ||
                    "")
                    .toLowerCase();


            const categoryMatch =
                currentCategory === "all" ||
                category === currentCategory;


            const searchMatch =
                name.includes(searchText);


            const shouldShow =
                categoryMatch &&
                searchMatch;


            if (shouldShow) {

                card.style.display = "";

                card.classList.remove("hidden");

                visibleCount++;

            } else {

                card.style.display = "none";

                card.classList.add("hidden");

            }

        });


        /* =========================
           NO RESULTS
        ========================= */

        if (noResults) {

            noResults.style.display =
                visibleCount === 0
                    ? "block"
                    : "none";

        }

    }


    /* =========================
       CATEGORY BUTTONS
    ========================= */

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


    /* =========================
       SEARCH
    ========================= */

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            filterGames();

        });

    }


    /* =========================
       NAVIGATION ACTIVE STATE
    ========================= */

    const navLinks =
        document.querySelectorAll(".nav-links a");


    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navLinks.forEach(item => {

                item.classList.remove("active");

            });

            link.classList.add("active");

        });

    });


    /* =========================
       SCROLL ACTIVE NAV
    ========================= */

    const sections =
        document.querySelectorAll("section[id]");


    window.addEventListener("scroll", () => {

        let current = "";


        sections.forEach(section => {

            const top =
                section.offsetTop - 160;

            const bottom =
                top + section.offsetHeight;


            if (
                window.scrollY >= top &&
                window.scrollY < bottom
            ) {

                current =
                    section.getAttribute("id");

            }

        });


        if (current) {

            navLinks.forEach(link => {

                link.classList.remove("active");


                if (
                    link.getAttribute("href") ===
                    "#" + current
                ) {

                    link.classList.add("active");

                }

            });

        }

    });


    /* =========================
       CARD IMAGE FALLBACK
       Prevent broken-image look
    ========================= */

    document
        .querySelectorAll(".game-image img")
        .forEach(img => {

            img.addEventListener("error", () => {

                img.style.display = "none";

                img.parentElement.classList.add(
                    "image-error"
                );

            });

        });


    /* =========================
       INITIAL LOAD
    ========================= */

    filterGames();

});
