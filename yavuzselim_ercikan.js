/**
 * Product Carousel Script
 *
 * This script dynamically creates a product carousel on LCW product page.
 * It fetches product data from a specified API, stores it in localStorage,
 * and restores the product list and favorited states upon subsequent runs.
 *
 * Key Features:
 * 1. Dynamically Fetch and Store Products:
 *    - On the first run, the script fetches the product list from an API.
 *    - Stores the fetched data in localStorage for faster access on subsequent runs.
 * 
 * 2. Persistent Favorites:
 *    - Users can mark products as favorites using a heart icon.
 *    - The favorite state is saved in localStorage and restored after a page refresh.
 *
 * 3. Carousel Navigation:
 *    - Users can navigate through the carousel using next and previous buttons.
 *    - Each button smoothly scrolls the carousel by one product.
 *
 * 4. Fully Dynamic:
 *    - The script builds the HTML and CSS entirely using JavaScript and jQuery.
 *    - The generated HTML includes product images, names, prices, and a favorite button.
 *
 * 5. Execution:
 *    - Designed to be executed directly in the Chrome Developer Tools console.
 *    - No external libraries (other than jQuery) or dependencies are required.
 *
 * Structure:
 * - init(): Initializes the carousel by fetching data or loading from localStorage.
 * - fetchProducts(): Fetches the product list from the API.
 * - buildHTML(): Dynamically generates the HTML structure for the carousel.
 * - buildCSS(): Injects CSS styles for the carousel.
 * - setEvents(): Adds interactive functionality, such as arrow navigation and favorites.
 */


(() => {
    const productAPI =
        "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
    const localStorageKey = "productCarouselData";
    const favoritesKey = "favorites";

    const init = async () => {
        let products = JSON.parse(localStorage.getItem(localStorageKey));

        if (!products) {
            products = await fetchProducts();
            localStorage.setItem(localStorageKey, JSON.stringify(products));
        }

        buildHTML(products);
        buildCSS();
        setEvents(products);
    };

    const fetchProducts = async () => {
        const response = await fetch(productAPI);
        if (!response.ok) throw new Error("Failed to fetch products.");
        return response.json();
    };

    const buildHTML = (products) => {
        const html = `
            <div class="carousel-container">
                <h2>You Might Also Like</h2>
                <div class="carousel">
                    <button class="carousel-prev">&lt;</button>
                    <div class="carousel-track-container">
                        <div class="carousel-track">
                            ${products
                                .map(
                                    (product) => `
                                <div class="carousel-item" data-id="${product.id}">
                                    <img src="${product.img}" alt="${product.name}" />
                                    <p>${product.name}</p>
                                    <span>${product.price} TL</span>
                                    <button class="carousel-fav">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path class="heart-outline" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                                            <path class="heart-filled" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.42 3.42 5 5.5 5c1.74 0 3.41 1.01 4.5 2.09C11.09 6.01 12.76 5 14.5 5 16.58 5 18 6.42 18 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                                        </svg>
                                    </button>
                                </div>
                            `
                                )
                                .join("")}
                        </div>
                    </div>
                    <button class="carousel-next">&gt;</button>
                </div>
            </div>
        `;
        $(".product-detail").after(html);
    };

    const buildCSS = () => {
    const css = `
        .carousel-container {
            margin-top: 20px;
        }
        .carousel {
            display: flex;
            align-items: center;
            position: relative;
        }
        .carousel-track-container {
            overflow-x: hidden;
            position: relative;
            width: 100%;
        }
        .carousel-track {
            display: flex;
            justify-content: space-between;
            transition: transform 0.3s ease-in-out;
        }
        .carousel-item {
            flex: 0 0 calc(100% / 6.5);
            text-align: left;
            position: relative
            margin: 0 10px;
        }
        .carousel-item img {
            width: 100%;
            border-radius: 10px;
        }
        .carousel-prev,
        .carousel-next {
            background-color: #333;
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px;
            z-index: 100;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }
        .carousel-prev {
            left: 0;
        }
        .carousel-next {
            right: 0;
        }
        .carousel-fav {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 34px;
            height: 34px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
            border: 0.5px solid #b6b7b9;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }
        .carousel-fav svg {
            width: 20px;
            height: 20px;
        }
        .heart-filled {
            display: none;
            fill: blue;
            stroke: blue;
        }
        .carousel-fav.favorited .heart-filled {
            display: inline;
        }
        .carousel-fav.favorited .heart-outline {
            display: none;
        }
        .carousel-item p {
            color: #333;
            font-size: 16px;
            margin: 8px 0;
            text-align: left;
            font-weight: bold;
        }
        .carousel-item span {
            color: #193db0;
            font-size: 18px;
            display: inline-block;
            line-height: 22px;
            font-weight: bold;
        }
    `;
    $("<style>").html(css).appendTo("head");
};


    const setEvents = (products) => {
    const $trackContainer = $(".carousel-track-container");
    const $track = $(".carousel-track");
    const $items = $(".carousel-item");
    const itemWidth = $items.outerWidth(true);

    $(".carousel-next").on("click", () => {
        const currentScrollLeft = $trackContainer.scrollLeft();
        const maxScrollLeft = $track[0].scrollWidth - $trackContainer.width();

        if (currentScrollLeft + itemWidth <= maxScrollLeft) {
            $trackContainer.animate({ scrollLeft: currentScrollLeft + itemWidth }, 300);
        } else {
            $trackContainer.animate({ scrollLeft: maxScrollLeft }, 300);
        }
    });

    $(".carousel-prev").on("click", () => {
        const currentScrollLeft = $trackContainer.scrollLeft();

        if (currentScrollLeft - itemWidth >= 0) {
            $trackContainer.animate({ scrollLeft: currentScrollLeft - itemWidth }, 300);
        } else {
            $trackContainer.animate({ scrollLeft: 0 }, 300);
        }
    });

    $(".carousel-item").on("click", function () {
        const productId = $(this).data("id");
        const product = products.find((p) => p.id === productId);
        if (product?.url) {
            window.open(product.url, "_blank");
        } else {
            console.error("Product URL not available for product ID:", productId);
        }
    });

    $(".carousel-fav").on("click", function (e) {
        e.stopPropagation();
        const $item = $(this).closest(".carousel-item");
        const productId = $item.data("id");
        const isFavorited = $(this).toggleClass("favorited").hasClass("favorited");

        let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];
        if (isFavorited) {
            favorites.push(productId);
        } else {
            favorites = favorites.filter((id) => id !== productId);
        }
        localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    });

    // Restore favorited state
    const favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];
    favorites.forEach((id) => {
        $(`.carousel-item[data-id="${id}"] .carousel-fav`).addClass("favorited");
    });
};

    init();
})();