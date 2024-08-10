import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '45322930-bdaa0e26907d60cc8a145e4be';

async function searchImageByQuery(query, page = 1, perPage = 16) {
  try {
    const params = new URLSearchParams({
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: perPage,
    });

    const response = await axios.get(`${URL}?${params}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.status);
  }
}

export { searchImageByQuery };
