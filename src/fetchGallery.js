import axios from 'axios';

export default class NewsGalleryApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.PER_PAGE = 40;
    this.totalHits = null;
    this.totalPages = null;
    this.endOfHits = false;
  }

  async fetchGallery() {
    const axiosOptions = {
      method: 'get',
      url: 'https://pixabay.com/api/',
      params: {
        key: `30171525-5f5744ab28056d37d6998fd9a`,
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${this.page}`,
        per_page: `${this.PER_PAGE}`,
      },
    };

    try {
      const response = await axios(axiosOptions);

      const data = response.data;
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  resetEndOfHits() {
    this.endOfHits = false;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
