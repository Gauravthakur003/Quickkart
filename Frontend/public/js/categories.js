
document.addEventListener("DOMContentLoaded", () => {
    const categorySearch = document.getElementById("categorySearch");
    const categoryGrid = document.getElementById("categoryGrid");
    const resultCount = document.getElementById("categoryResultCount");
    const emptyState = document.getElementById("categoryEmptyState");
    const clearButton = document.getElementById("clearCategorySearch");
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    if (!categorySearch || !categoryGrid) {
        return;
    }

    const categoryCards = Array.from(
        categoryGrid.querySelectorAll(".category-card")
    );

    function filterCategories() {
        const searchTerm = categorySearch.value
            .trim()
            .toLowerCase();

        let visibleCount = 0;

        categoryCards.forEach((card) => {
            const searchableText = [
                card.dataset.category || "",
                card.dataset.name || "",
                card.querySelector("h3")?.textContent || "",
                card.querySelector("p")?.textContent || ""
            ].join(" ").toLowerCase();

            const matches = searchableText.includes(searchTerm);

            card.hidden = !matches;

            if (matches) {
                visibleCount++;
            }
        });

        if (resultCount) {
            resultCount.textContent =
                `${visibleCount} ${visibleCount === 1 ? "category" : "categories"}`;
        }

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }
    }

    categorySearch.addEventListener("input", filterCategories);

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            categorySearch.value = "";
            filterCategories();
            categorySearch.focus();
        });
    }

    // Show all categories when the page first loads.
    filterCategories();
});
