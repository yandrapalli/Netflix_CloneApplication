# Netflix Clone (2025 Educational Edition)

A responsive, feature-rich Netflix clone built with vanilla HTML, CSS, and JavaScript, designed for educational purposes. This project demonstrates modern web development techniques including glassmorphism, responsive grid layouts, and asynchronous API integration.

## 🚀 Features

*   **Responsive Design**: Fully adaptable layout that works seamlessly on Desktop, Tablet, and Mobile devices.
*   **Dynamic Content**: Fetches real-time movie and TV show data using the [TMDB API](https://www.themoviedb.org/documentation/api).
*   **Search Functionality**: Expandable search bar to find movies, people, and genres with instant visual results.
*   **Interactive UI**:
    *   **Movie Details Modal**: Click anywhere on a movie poster to view detailed information (Overview, Release Date) and a "Watch Trailer" button.
    *   **Glassmorphism**: Modern frosted-glass effect on the navigation bar.
    *   **Hover Effects**: Smooth scale animations on movie cards.
*   **Netflix Aesthetics**: Closely mimics the actual Netflix UI with branded colors, typography, and layout.

## 🛠️ Technologies Used

-   **HTML5**: Semantic structure.
-   **CSS3**: Flexbox, Custom Properties (Variables), Media Queries, Animations, Backdrop Filter.
-   **JavaScript (ES6+)**: Async/Await (Fetch API), DOM Manipulation, Event Handling.
-   **TMDB API**: Source for all movie data and images.

## ⚙️ Setup & Usage

1.  **Clone or Download** the repository to your local machine.
2.  **Open `index.html`** in your preferred web browser (Chrome, Firefox, Edge, etc.).
    *   *Note: No `npm install` or build process is required. It runs directly in the browser.*
3.  **Browse**: Scroll through different categories like Trending, Top Rated, and Actions movies.
4.  **Search**: Hover over the search icon in the top right to type a movie name.
5.  **View Details**: Click on any movie card to open the details modal.

## 🔑 API Key Configuration

The project uses a standard TMDB API key.
*   **Current Key**: Included in `script.js` for demonstration.
*   **Own Key**: To use your own, register at [The Movie Database](https://www.themoviedb.org/), generate an API key, and replace the `API_KEY` constant in `script.js`.

## 📚 Educational Notes

This project was refined to showcase "2025 Standards" for web development education:
-   **Code Clarity**: Key logic sections in `script.js` include educational comments.
-   **Accessibility**: Basic keyboard navigation (Escape key to close modals) is implemented.
-   **Modern Styling**: Uses CSS variables and modern layout techniques instead of older float-based layouts.

## ⚠️ Disclaimer

This is a personal project for educational purposes only. It is not affiliated with Netflix. All movie data and images are provided by TMDB.
