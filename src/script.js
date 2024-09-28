const apiKey = 'nzl4PRGyRm4xGogKUTIpHtLfgG7p8uQA';
const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

document.getElementById("home-btn").addEventListener("click", async () => {
    const articles = await fetchRandomNews();
    displayBlogs(articles);
});

document.getElementById("sports-btn").addEventListener("click", async () => {
    const articles = await fetchNewsByCategory('sports');
    displayBlogs(articles);
});

document.getElementById("business-btn").addEventListener("click", async () => {
    const articles = await fetchNewsByCategory('business');
    displayBlogs(articles);
});

document.getElementById("government-btn").addEventListener("click", async () => {
    const articles = await fetchNewsByCategory('politics');
    displayBlogs(articles);
});

document.getElementById("arts-btn").addEventListener("click", async () => {
    const articles = await fetchNewsByCategory('arts');
    displayBlogs(articles);
});

searchButton.addEventListener("click", async () => {
    const query = searchField.value.trim();
    if (query) {
        const articles = await fetchNewsBySearch(query);
        displayBlogs(articles);
    } else {
        alert("Please enter a search term.");
    }
});

async function fetchRandomNews() {
    try {
        const apiUrl = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${apiKey}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching random news", error);
        return [];
    }
}

async function fetchNewsByCategory(category) {
    try {
        const apiUrl = `https://api.nytimes.com/svc/topstories/v2/${category}.json?api-key=${apiKey}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error(`Error fetching ${category} news`, error);
        return [];
    }
}

async function fetchNewsBySearch(query) {
    try {
        const apiUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${apiKey}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.response.docs || [];
    } catch (error) {
        console.error(`Error fetching search results for ${query}`, error);
        return [];
    }
}

function displayBlogs(articles) {
    blogContainer.innerHTML = "";

    if (!Array.isArray(articles) || articles.length === 0) {
        blogContainer.innerHTML = "<p>No articles available.</p>";
        return;
    }

    articles.forEach((article) => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        const img = document.createElement("img");
        const imageUrl = article.multimedia && article.multimedia.length > 0 
                         ? article.multimedia[0].url 
                         : "https://via.placeholder.com/150";

        img.src = imageUrl;
        img.alt = article.title || "No title available";

        img.onerror = function() {
            img.src = "https://via.placeholder.com/150";
        };

        const title = document.createElement("h2");
        const truncatedTitle = 
            article.title && article.title.length > 100
                ? article.title.slice(0, 100) + "......."
                : article.title || "No title available";
        title.textContent = truncatedTitle;

        const description = document.createElement("p");
        const truncatedDes = 
            article.abstract && article.abstract.length > 250
                ? article.abstract.slice(0, 250) + "......."
                : article.abstract || "No description available";
        description.textContent = truncatedDes;

        blogCard.appendChild(img);
        blogCard.appendChild(title);
        blogCard.appendChild(description);
        blogCard.addEventListener('click', () => {
            window.open(article.url, '_blank');
        });

        blogContainer.appendChild(blogCard);
    });
}

window.onload = async () => {
    const articles = await fetchRandomNews();
    displayBlogs(articles);
};
