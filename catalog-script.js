document.addEventListener("DOMContentLoaded", () => {
    const filterLinks = document.querySelectorAll(".sort-sidebar a");
    const items = document.querySelectorAll(".item");
  
    filterLinks.forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
  
        filterLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
  
        const selectedCategory = link.getAttribute("data-filter");
  
        items.forEach(item => {
          const categories = item.getAttribute("data-category").split(" ");
          if (selectedCategory === "ALL" || categories.includes(selectedCategory)) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  });
  