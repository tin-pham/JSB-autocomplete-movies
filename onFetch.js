async function fetchMovies(searchText) {
  const url = '/api/';
  const { data } = await axios.get(url, {
    params: {
      apikey: 'ded646ef',
      s: searchText,
    },
  });
  const movies = data.Search;

  return movies;
}

async function fetchMovie(id) {
  const url = '/api/';
  const { data: movie } = await axios.get(url, {
    params: {
      apikey: 'ded646ef',
      i: id,
    },
  });
  return movie;
}

export { fetchMovie, fetchMovies };
