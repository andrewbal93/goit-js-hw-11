import axios from "axios";
import { Notify } from "notiflix";
import SimpleLightbox from 'simplelightbox';

Notify.init({
    width: '300px',
    position: 'right-top',
    fontSize: '16px',
})

const selectors = {
    searchForm: document.querySelector('.search-form'),
    searchInput: document.querySelector('.search-input'),
    imagesGallery: document.querySelector('.gallery'),
    MoreBtn: document.querySelector('.load-more'),
}

selectors.searchForm.addEventListener('submit', pressSearch);
selectors.MoreBtn.addEventListener('click', loadMore);
selectors.MoreBtn.style.display = "none";

let page = 1;
let per_page = 40;
let currentSearch = '';

selectors.MoreBtn.style.display = 'none';

async function getApi(searchImg, page, perPage) {
    const URL = 'https://pixabay.com/api/';
    const API_KEY = "40442533-4b6791bab363289733298af78";

    try {
      const response = await axios.get(
        `${URL}?key=${API_KEY}&q=${searchImg}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
      return response.data;
      
    } catch (error) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
    
  }
  getApi()

async function pressSearch(e){
    e.preventDefault();
    const searchImg = selectors.searchInput.value;
    selectors.searchInput.value = '';
    page = 1;
    currentSearch = searchImg;
    selectors.imagesGallery.innerHTML= '';
    try {
        const data = await getApi(searchImg, page, per_page);
        const images = data.hits;
        const markup = createMarkup(images);
        selectors.imagesGallery.insertAdjacentHTML('beforeend', markup);
        if(images.length === 0) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        } else if (images.length < per_page){
            selectors.MoreBtn.style.display = 'none';
        } else {
            selectors.MoreBtn.style.display = 'block';
        }

    }catch (error) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again');
    }
}
function createMarkup(images) {
    const gallery = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'title',
    captionPosition: 'bottom',
  });
    return images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
    `<div class="photo-card">
     <a href="${largeImageURL}" data-lightbox="image" data-large="${largeImageURL}" title="${tags}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${likes}</p>
        <p class="info-item"><b>Views:</b> ${views}</p>
        <p class="info-item"><b>Comments:</b> ${comments}</p>
        <p class="info-item"><b>Downloads:</b> ${downloads}</p>
      </div>
    </div>`
  ).join('');
}


async function loadMore() {
    page += 1;
    const searchImg = selectors.searchInput.value;
  
    try {
      const data = await getApi(currentSearch, page, per_page);
      const images = data.hits;
      const markup = createMarkup(images);
      selectors.imagesGallery.insertAdjacentHTML('beforeend', markup);
      if (images.length < per_page) {
        selectors.MoreBtn.style.display = 'none';
      }
    } catch (error) {
        console.error(error.message);
    }
  }