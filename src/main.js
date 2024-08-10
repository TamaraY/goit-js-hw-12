import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { searchImageByQuery } from './js/pixabay-api.js';
import { galleryItems } from './js/render-functions.js';

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('input[name="query"]');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('#load-more');

let currentPage = 1;
let currentQuery = '';
const perPage = 16;

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const userQuery = searchInput.value.trim();
  if (!userQuery) {
    return iziToast.show({
      position: 'center',
      backgroundColor: 'orange',
      messageColor: 'white',
      message: 'Please fill in a search field.',
    });
  }

  loader.style.display = 'block';
  currentQuery = userQuery;
  currentPage = 1;
  gallery.innerHTML = '';

  try {
    const data = await searchImageByQuery(currentQuery, currentPage, perPage);
    loader.style.display = 'none';
    if (data.hits.length === 0) {
      loadMoreBtn.style.display = 'none';
      return iziToast.show({
        position: 'topRight',
        backgroundColor: 'red',
        messageColor: 'white',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    }
    iziToast.show({
      position: 'topRight',
      backgroundColor: 'green',
      messageColor: 'white',
      message: `Found ${data.totalHits} results.`,
    });

    galleryItems(data.hits);
    searchForm.reset();

    if (data.totalHits > perPage) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    loader.style.display = 'none';
    iziToast.show({
      position: 'topRight',
      backgroundColor: 'red',
      messageColor: 'white',
      message: 'Error during the request. Please try again later.',
    });
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  loader.style.display = 'block';

  try {
    const data = await searchImageByQuery(currentQuery, currentPage, perPage);
    loader.style.display = 'none';
    galleryItems(data.hits);

    const totalLoaded = currentPage * perPage;
    if (totalLoaded >= data.totalHits) {
      loadMoreBtn.style.display = 'none';
      iziToast.show({
        position: 'topRight',
        backgroundColor: 'orange',
        messageColor: 'white',
        message: "We're sorry, but you've reached the end of search results.",
      });
    } else {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    loader.style.display = 'none';
    iziToast.show({
      position: 'topRight',
      backgroundColor: 'red',
      messageColor: 'white',
      message: 'Error during the request. Please try again later.',
    });
  }
});
