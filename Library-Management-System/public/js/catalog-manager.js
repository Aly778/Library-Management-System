// Catalog/Books Display Script
class CatalogManager {
  constructor() {
    this.books = [];
    this.filteredBooks = [];
    this.categories = [];
  }

  async loadBooks(filters = {}) {
    try {
      const response = await apiService.getBooks(filters);
      if (response.success) {
        this.books = response.books;
        this.filteredBooks = this.books;
        return this.books;
      }
    } catch (error) {
      showError('Failed to load books: ' + error.message);
      return [];
    }
  }

  async loadCategories() {
    try {
      const response = await apiService.getCategories();
      if (response.success) {
        this.categories = response.categories;
        return this.categories;
      }
    } catch (error) {
      showError('Failed to load categories');
      return [];
    }
  }

  filterByCategory(categoryId) {
    if (!categoryId) {
      this.filteredBooks = this.books;
    } else {
      this.filteredBooks = this.books.filter(b => b.Cid == categoryId);
    }
    return this.filteredBooks;
  }

  searchBooks(query) {
    if (!query) {
      this.filteredBooks = this.books;
    } else {
      const lowerQuery = query.toLowerCase();
      this.filteredBooks = this.books.filter(b => 
        b.Bname.toLowerCase().includes(lowerQuery) || 
        b.BAuthor.toLowerCase().includes(lowerQuery)
      );
    }
    return this.filteredBooks;
  }

  filterByPrice(minPrice, maxPrice) {
    this.filteredBooks = this.books.filter(b => 
      b.Bprice >= minPrice && b.Bprice <= maxPrice
    );
    return this.filteredBooks;
  }

  getBook(bookId) {
    return this.books.find(b => b.Bid == bookId);
  }

 renderBookCard(book) {
  const isAvailable = book.Bquantity > 0;
  
  // Clean the title for JavaScript usage (handles apostrophes in names like Harry Potter)
  const safeName = book.Bname.replace(/'/g, "\\'");
  const safeImage = book.Bimage ? book.Bimage.replace(/'/g, "\\'") : '';

  return `
    <div class="bg-white dark:bg-slate-900 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
      <div class="aspect-square bg-gray-200 dark:bg-slate-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        ${book.Bimage ? 
          `<img src="${book.Bimage}" alt="${book.Bname}" class="w-full h-full object-cover">` : 
          '<span class="material-symbols-outlined text-5xl text-gray-400">menu_book</span>'
        }
      </div>
      <h3 class="font-bold text-lg text-slate-900 dark:text-white truncate">${book.Bname}</h3>
      <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">${book.BAuthor || 'Unknown Author'}</p>
      <p class="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">${book.Bdescription || 'No description'}</p>
      
      <div class="flex justify-between items-center mb-3">
        <span class="text-lg font-bold text-primary">$${book.Bprice}</span>
        <span class="text-xs ${isAvailable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
          ${isAvailable ? `${book.Bquantity} in stock` : 'Out of stock'}
        </span>
      </div>

      <div class="flex gap-2">
        <button onclick="catalogManager.viewDetails(${book.Bid})" class="flex-1 bg-primary hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors">
          View
        </button>
        ${isAvailable ? `
          <button onclick="cartService.addItem(${book.Bid}, {Bname: '${safeName}', Bprice: ${book.Bprice}, Bimage: '${safeImage}'}); showSuccess('Added to cart!');" 
                  class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm transition-colors">
            Cart
          </button>
        ` : ''}
      </div>
    </div>
  `;
}
  viewDetails(bookId) {
    const book = this.getBook(bookId);
    if (book) {
      // Store for detail view
      sessionStorage.setItem('selectedBook', JSON.stringify(book));
      window.location.href = `/catalog?book=${bookId}`;
    }
  }
}

const catalogManager = new CatalogManager();
