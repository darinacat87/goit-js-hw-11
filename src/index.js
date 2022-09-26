import './css/styles.css';
import Notiflix from 'notiflix';
import { lightbox } from './simplelightbox';
import NewsGalleryApiService from './fetchGallery';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  startBtn: document.querySelector('button[data-start]'),
  inputForm: document.querySelector('input'),
};

const GalleryEl = new NewsGalleryApiService();
refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  refs.galleryContainer.innerHTML = '';
  GalleryEl.query = e.currentTarget.elements.searchQuery.value.trim();
  GalleryEl.resetPage();
  if (GalleryEl.query === '') {
    Notiflix.Notify.warning('Please, fill the main field');
    return;
  }
  search().then(() => {
    if (!GalleryEl.totalHits) {
      Notiflix.Notify.warning(
        `Sorry, there are no images matching your search query. Please try again.`
      );
      refs.loadMoreBtn.classList.add('is-hidden');
      return;
    }

    if (GalleryEl.totalHits > 1) {
      Notiflix.Notify.success(
        `Hooray! We found ${GalleryEl.totalHits} images !!!`
      );
    }
  });
}
async function search() {
  return GalleryEl.fetchGallery().then(data => {
    renderGallery(data);
    GalleryEl.totalHits = data.totalHits;
    GalleryEl.totalPages = Math.ceil(GalleryEl.totalHits / GalleryEl.PER_PAGE);
    if (GalleryEl.totalPages > 1) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
    if (GalleryEl.page === GalleryEl.totalPages) {
      refs.loadMoreBtn.classList.add('is-hidden');
    }
  });
}

async function onLoadMore() {
  refs.loadMoreBtn.classList.add('is-hidden');
  GalleryEl.incrementPage();
  search().then(() => {
    if (GalleryEl.page === GalleryEl.totalPages) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

function renderGallery(data) {
  const markup = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        downloads,
        likes,
        views,
        comments,
      }) => {
        return `<div class="photo-card">
                          <a class="link" href="${largeImageURL}">
                            <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
                            <div class="info">
                              <p class="info-item">
                                <b>Likes</b>${likes}
                              </p>
                              <p class="info-item">
                                <b>Views</b>${views}
                              </p>
                              <p class="info-item">
                                <b>Comments</b>${comments}
                              </p>
                              <p class="info-item">
                                <b>Downloads</b>${downloads}
                              </p>
                            </div>
                          </a>
                        </div>`;
      }
    )
    .join('');
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}
