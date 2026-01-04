const API_KEY = "408d7a18c91dd24416aa40ad47c75622";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
const IMAGE_SMALL_URL = "https://image.tmdb.org/t/p/w500";

const requests = {
    fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
    fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
    fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
    fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
    fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
    fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
    fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
    fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
    search: `/search/multi?api_key=${API_KEY}&language=en-US&include_adult=false`,
};

// --- DOM Elements ---
const nav = document.getElementById('nav');
const banner = document.getElementById('banner');
const bannerTitle = document.getElementById('banner-title');
const bannerDesc = document.getElementById('banner-description');
const mainContent = document.getElementById('main-content');

// --- Helper Functions ---
function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

// --- Fetch Data ---
async function fetchData(url) {
    try {
        const response = await fetch(`${BASE_URL}${url}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

// --- Display Functions ---
async function buildBanner() {
    const movies = await fetchData(requests.fetchNetflixOriginals);

    // Filter out movies with no backdrop
    const validMovies = movies.filter(movie => movie.backdrop_path);

    if (!validMovies || validMovies.length === 0) return;

    // Pick random movie
    const randomMovie = validMovies[Math.floor(Math.random() * validMovies.length)];

    banner.style.backgroundImage = `url("${IMAGE_BASE_URL}${randomMovie.backdrop_path}")`;
    bannerTitle.innerText = randomMovie.name || randomMovie.title || randomMovie.original_name;
    bannerDesc.innerText = truncate(randomMovie.overview, 150);
}

// --- Helper to create movie item ---
function createMovieItem(movie, isLargeRow, isSearch = false) {
    const path = isLargeRow || isSearch ? movie.poster_path : movie.backdrop_path;
    if (!path) return null;

    const container = document.createElement('div');
    container.className = `row__posterContainer ${isLargeRow ? 'row__posterContainer--large' : ''}`;

    const img = document.createElement('img');
    img.className = `row__poster ${isLargeRow ? 'row__posterLarge' : ''}`;
    img.src = `${IMAGE_BASE_URL}${path}`;
    img.alt = movie.name || movie.title;

    img.onerror = function () {
        console.error("Image failed to load:", this.src);
        // Hide entire container if image fails in search? Or just let it be.
        // container.style.display = 'none'; 
    };

    const name = document.createElement('p');
    name.className = 'row__posterName';
    name.innerText = movie.name || movie.title || movie.original_name || movie.original_title || "";

    // Event Listener for clicking the container (Delegation could be used, but direct binding here is educational/simple)
    container.addEventListener('click', () => {
        openModal(movie);
    });

    container.appendChild(img);
    container.appendChild(name);

    return container;
}

// --- Helper to fetch video ---
async function fetchVideo(movie) {
    try {
        const type = movie.media_type === 'tv' || (!movie.media_type && movie.name) ? 'tv' : 'movie';
        const response = await fetch(`${BASE_URL}/${type}/${movie.id}/videos?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();

        if (data.results) {
            const trailer = data.results.find(vid => vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser"));
            return trailer ? trailer.key : data.results[0]?.key;
        }
        return null;
    } catch (error) {
        console.error("Error fetching video:", error);
        return null;
    }
}

// --- Educational-comment: Modal Logic ---
// 2025 Standard: Modals should be accessible and animated.
const modal = document.getElementById("movie-modal");
const modalClose = document.getElementsByClassName("modal__close")[0];
const modalBanner = document.getElementById("modal-banner");
const modalTitle = document.getElementById("modal-title");
const modalDate = document.getElementById("modal-date");
const modalOverview = document.getElementById("modal-overview");
const modalPlay = document.getElementById("modal-play");

function openModal(movie) {
    modal.style.display = "block";

    // Reset banner content (remove previous iframe if any)
    modalBanner.innerHTML = '';

    // Set content
    const backdrop = movie.backdrop_path || movie.poster_path;
    modalBanner.style.backgroundImage = backdrop ? `url("${IMAGE_BASE_URL}${backdrop}")` : 'none';
    modalTitle.innerText = movie.name || movie.title || movie.original_name;
    modalDate.innerText = `Release: ${movie.first_air_date || movie.release_date || 'N/A'}`;
    modalOverview.innerText = movie.overview || "No overview available.";

    // Trailer logic (Embedded)
    modalPlay.onclick = async () => {
        modalPlay.disabled = true;
        modalPlay.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

        const videoKey = await fetchVideo(movie);

        modalPlay.disabled = false;
        modalPlay.innerHTML = '<i class="fas fa-play"></i> Watch Trailer';

        if (videoKey) {
            // Embed YouTube iframe
            modalBanner.innerHTML = `
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                </iframe>
            `;
            // Clear background image so it doesn't interfere (though iframe covers it)
            modalBanner.style.backgroundImage = 'none';
        } else {
            // Fallback if no video found
            alert("Sorry, no trailer available for this title.");
        }
    };
}

function closeModal() {
    modal.style.display = "none";
    modalBanner.innerHTML = ''; // Stop video
    const currentVideo = modalBanner.querySelector('iframe');
    if (currentVideo) {
        currentVideo.src = ''; // Force stop
    }
}

// Close modal when clicking (x)
if (modalClose) {
    modalClose.onclick = closeModal;
}

// Close modal when clicking outside of it
window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Close on Escape key (Accessibility)
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape" && modal && modal.style.display === "block") {
        closeModal();
    }
});


function createRow(title, movies, isLargeRow = false) {
    const row = document.createElement('div');
    row.className = 'row';

    const rowTitle = document.createElement('h2');
    rowTitle.className = 'row__title';
    rowTitle.innerText = title;
    row.appendChild(rowTitle);

    const rowPosters = document.createElement('div');
    rowPosters.className = 'row__posters';

    movies.forEach(movie => {
        const item = createMovieItem(movie, isLargeRow);
        if (item) rowPosters.appendChild(item);
    });

    row.appendChild(rowPosters);
    mainContent.appendChild(row);
}
// Search logic... (leave listener as is)

// ...

function createSearchRow(title, movies) {
    const row = document.createElement('div');
    row.className = 'row';

    // Add extra padding/margin so it stands out at the top
    row.style.marginTop = "20px";

    const rowTitle = document.createElement('h2');
    rowTitle.className = 'row__title';
    rowTitle.innerText = title;
    row.appendChild(rowTitle);

    const rowPosters = document.createElement('div');
    rowPosters.className = 'row__posters';

    movies.forEach(movie => {
        const item = createMovieItem(movie, true, true); // true for large row
        if (item) rowPosters.appendChild(item);
    });

    row.appendChild(rowPosters);
    searchResultsContainer.appendChild(row);
}

async function buildRows() {
    // We execute these in order
    const originals = await fetchData(requests.fetchNetflixOriginals);
    if (originals.length > 0) createRow("NETFLIX ORIGINALS", originals, true);

    const trending = await fetchData(requests.fetchTrending);
    if (trending.length > 0) createRow("Trending Now", trending);

    const topRated = await fetchData(requests.fetchTopRated);
    if (topRated.length > 0) createRow("Top Rated", topRated);

    const action = await fetchData(requests.fetchActionMovies);
    if (action.length > 0) createRow("Action Movies", action);

    const comedy = await fetchData(requests.fetchComedyMovies);
    if (comedy.length > 0) createRow("Comedy Movies", comedy);

    const horror = await fetchData(requests.fetchHorrorMovies);
    if (horror.length > 0) createRow("Horror Movies", horror);

    const romance = await fetchData(requests.fetchRomanceMovies);
    if (romance.length > 0) createRow("Romance Movies", romance);

    const doc = await fetchData(requests.fetchDocumentaries);
    if (doc.length > 0) createRow("Documentaries", doc);
}

// --- Event Listeners ---
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('black');
    } else {
        nav.classList.remove('black');
    }
});

// --- Init ---
async function init() {
    await buildBanner();
    await buildRows();
}

init();
