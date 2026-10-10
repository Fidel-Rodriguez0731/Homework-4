// *********************************************************************
// Homework 4 Public APIs
// *********************************************************************

function formatYearFromStr(dateString) {
  return dateString.split('-')[0];
}

function formatPercentage(value) {
  return `${(value * 100).toFixed(2)}%`;
}

localStorage.setItem("game_id", "11710");
localStorage.setItem("api_key", "7282426f9aba4a14bcc96ee6363dd191");



async function load(){
    
    // add as many more as needed
    let gameID = localStorage.getItem("game_id");
    let apiKey = localStorage.getItem("api_key");
    
    // **************** Write you code below **************** 
  // Section#1
  try {
    const response = await fetch(`https://api.gamebrain.co/v1/games/${gameID}?api-key=${apiKey}`);
    if (!response.ok) return;

    const rawData = await response.json();
    const game = rawData.game || rawData.result || rawData.data || rawData;

    // a. Game Title
    const titleEl = document.querySelector("#game-name");
    if (titleEl) {
      titleEl.textContent = game.name || game.title || game.name_original || 'N/A';
    }

    // b. Artwork / Image
    const imageEl = document.querySelector(".game-image img");
    if (imageEl) {
      imageEl.src = game.image || game.background_image || game.cover || game.image_url || '';
      imageEl.alt = game.name || game.title || 'Game Artwork';
    }

    // e. Genre
    const genreEl = document.querySelector(".game-genre");
    if (genreEl) {
      let genreText = 'N/A';
      if (Array.isArray(game.genres) && game.genres.length > 0) {
        genreText = game.genres.map(g => (typeof g === 'object' ? (g.name || g.title) : g)).join(', ');
      } else if (typeof game.genre === 'string') {
        genreText = game.genre;
      } else if (typeof game.genres === 'string') {
        genreText = game.genres;
      }
      genreEl.textContent = genreText;
    }

    // c. Developer & d. Release date (formatted using formatYearFromStr)
    const metaEl = document.querySelector(".game-meta");
    if (metaEl) {
      let devText = 'N/A';
      if (Array.isArray(game.developers) && game.developers.length > 0) {
        devText = game.developers.map(d => (typeof d === 'object' ? (d.name || d.title) : d)).join(', ');
      } else if (game.developer) {
        devText = typeof game.developer === 'object' ? (game.developer.name || 'N/A') : game.developer;
      }

      const rawRelease = game.released || game.release_date || game.year || '';
      const releaseYear = formatYearFromStr(String(rawRelease));

      metaEl.textContent = `${devText} • ${releaseYear}`;
    }

  } catch (err) {
    console.error("Error loading Hero section:", err);
  }

  //Section#2

  try {
    const newsResponse = await fetch(`https://api.gamebrain.co/v1/games/${gameID}/news?api-key=${apiKey}`);
    if (newsResponse.ok) {
      const newsData = await newsResponse.json();
      const newsList = newsData.news || newsData.results || newsData || [];

      const newsCards = document.querySelectorAll(".news-list .news-card");

      newsCards.forEach((card, index) => {
        if (index < 3 && newsList[index]) {
          const item = newsList[index];

          const newsImg = card.querySelector("img");
          const newsTitle = card.querySelector("h3");
          const newsDate = card.querySelector(".news-published");

          if (newsImg) {
            newsImg.src = item.image || item.urlToImage || item.cover || '';
            newsImg.alt = item.title || 'News Image';
          }

          if (newsTitle) {
            newsTitle.textContent = item.title || 'Untitled News';
          }

          if (newsDate) {
            const pubDate = item.published || item.publishedAt || item.date || 'N/A';
            newsDate.textContent = `Published ${pubDate}`;
          }
        }
      });
    }
  } catch (err) {
    console.error("Error loading Game News section:", err);
  }
}

load();


   