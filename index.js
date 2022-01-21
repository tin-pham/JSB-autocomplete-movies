import AutoComplete from './AutoComplete.js';
import { fetchMovies, fetchMovie } from './onFetch.js';

const autoCompleteConfig = {
  renderOption(movie) {
    return `
        <img style="width: 40px" src="${
          movie.Poster == 'N/A' ? '' : movie.Poster
        }">
        ${movie.Title}
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  fetchData: fetchMovies,
};

let hasLeftSelect;
let hasRightSelect;
new AutoComplete({
  widget: document.getElementById('left-autocomplete'),
  onOptionSelect(movie) {
    const summaryElement = document.getElementById('left-summary');
    onMovieSelect(movie, summaryElement, 'left');

    // Hide tutorial
    document.querySelector('.tutorial').classList.add('visually-hidden');
  },
  ...autoCompleteConfig,
});

new AutoComplete({
  widget: document.getElementById('right-autocomplete'),
  onOptionSelect(movie) {
    const summaryElement = document.getElementById('right-summary');
    onMovieSelect(movie, summaryElement, 'right');

    // Hide tutorial
    document.querySelector('.tutorial').classList.add('visually-hidden');
  },
  ...autoCompleteConfig,
});

const onMovieSelect = async (movie, summaryElement, onLeftOrRightSelect) => {
  // Fetch the single movie
  const movieDetail = await fetchMovie(movie.imdbID);

  summaryElement.innerHTML = movieTemplate(movieDetail);

  // Compare place
  if (onLeftOrRightSelect == 'left') {
    hasLeftSelect = true;
  } else {
    hasRightSelect = true;
  }

  if (hasLeftSelect && hasRightSelect) {
    compareStatus();
  }
};

const movieTemplate = (movie) => {
  const { Poster, Title, Genre, Plot, Metascore, imdbRating, Awards } = movie;

  const imdbRatingNumber = parseFloat(imdbRating);

  const awardsNumber = Awards.split(' ').reduce((sum, currentItem) => {
    if (!isNaN(parseInt(currentItem))) {
      sum += parseInt(currentItem);
    }

    return sum;
  }, 0);

  return `
        <img src="${Poster}" alt="${Title} Poster"> 

        <div class="summary-text">
          <h1>${Title}</h1>
          <h4>${Genre}</h4>
          <p>${Plot}</p>
        </div>

      <div class="alert alert-secondary" role="alert">
        <p>Metascore: ${Metascore}</p>
      </div>
      <div data-value="${imdbRatingNumber}" class="alert alert-secondary" role="alert">
        <p>Imdb Rating: ${imdbRating}</p>
      </div>
      <div data-value="${awardsNumber}" class="alert alert-secondary" role="alert">
        <p>Awards: ${Awards}</p>
      </div>
  `;
};

function compareStatus() {
  console.log('Start comparing');

  const leftSummaries = document.querySelectorAll('#left-summary .alert');
  const rightSummaries = document.querySelectorAll('#right-summary .alert');

  for (let i = 0; i < leftSummaries.length; i++) {
    const leftValue = +leftSummaries[i].dataset.value;
    console.log(leftValue);
    const rightValue = +rightSummaries[i].dataset.value;
    console.log(rightValue);
    if (leftValue > rightValue) {
      leftSummaries[i].className = 'alert alert-success';
      rightSummaries[i].className = 'alert alert-danger';
    } else if (leftValue < rightValue) {
      leftSummaries[i].className = 'alert alert-danger';
      rightSummaries[i].className = 'alert alert-success';
    } else {
      leftSummaries[i].className = 'alert alert-secondary';
      rightSummaries[i].className = 'alert alert-secondary';
    }
  }
}
