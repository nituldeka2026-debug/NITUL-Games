document.addEventListener("DOMContentLoaded", () => {

    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav");

    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");

    const categoryButtons =
        document.querySelectorAll(".category");

    const gameCards =
        document.querySelectorAll(".game-card");

    const noGames =
        document.getElementById("noGames");


    let currentCategory = "all";


    /* =========================
       MOBILE MENU
    ========================== */

    if (menuBtn && nav) {

        menuBtn.addEventListener("click", () => {

            nav.classList.toggle("show");

            menuBtn.classList.toggle("active");

        });


        nav.querySelectorAll("a")
        .forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("show");

                menuBtn.classList.remove("active");

            });

        });

    }


    /* =========================
       GAME FILTER FUNCTION
    ========================== */

    function filterGames() {

        const searchText =
            searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";

        let visibleCount = 0;


        gameCards.forEach(card => {

            const gameCategory =
                card.dataset.category
                ? card.dataset.category.toLowerCase()
                : "";

            const gameName =
                card.dataset.name
                ? card.dataset.name.toLowerCase()
                : card.textContent.toLowerCase();


            const categoryMatch =
                currentCategory === "all" ||
                gameCategory === currentCategory;


            const searchMatch =
                gameName.includes(searchText);


            if (categoryMatch && searchMatch) {

                card.style.display = "";

                card.classList.remove("hidden");

                visibleCount++;

            } else {

                card.style.display = "none";

                card.classList.add("hidden");

            }

        });


        /* NO GAMES MESSAGE */

        if (noGames) {

            if (visibleCount === 0) {

                noGames.style.display = "block";

            } else {

                noGames.style.display = "none";

            }

        }

    }


    /* =========================
       CATEGORY BUTTONS
    ========================== */

    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            categoryButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            button.classList.add("active");


            currentCategory =
                button.dataset.category
                ? button.dataset.category.toLowerCase()
                : "all";


            filterGames();

        });

    });


    /* =========================
       SEARCH
    ========================== */

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            filterGames();

        });

    }


    /* =========================
       CLEAR SEARCH
    ========================== */

    if (clearSearch && searchInput) {

        clearSearch.addEventListener("click", () => {

            searchInput.value = "";

            filterGames();

            searchInput.focus();

        });

    }


    /* =========================
       SMOOTH ACTIVE NAVIGATION
    ========================== */

    const navLinks =
        document.querySelectorAll(".nav a");


    navLinks.forEach(link => {

        link.addEventListener("click", function () {

            const href =
                this.getAttribute("href");


            if (
                href &&
                href.startsWith("#")
            ) {

                navLinks.forEach(navLink => {

                    navLink.classList.remove(
                        "active"
                    );

                });


                this.classList.add(
                    "active"
                );

            }

        });

    });


    /* =========================
       ACTIVE NAV ON SCROLL
    ========================== */

    const sections =
        document.querySelectorAll(
            "section[id]"
        );


    window.addEventListener(
        "scroll",
        () => {

            let current = "";

            sections.forEach(section => {

                const sectionTop =
                    section.offsetTop - 150;

                const sectionHeight =
                    section.offsetHeight;


                if (

                    window.scrollY >=
                    sectionTop

                    &&

                    window.scrollY <
                    sectionTop + sectionHeight

                ) {

                    current =
                        section.getAttribute("id");

                }

            });


            if (current) {

                navLinks.forEach(link => {

                    link.classList.remove(
                        "active"
                    );


                    if (

                        link.getAttribute(
                            "href"
                        ) === "#" + current

                    ) {

                        link.classList.add(
                            "active"
                        );

                    }

                });

            }

        }
    );


    /* =========================
       INITIAL FILTER
    ========================== */

    filterGames();

});
