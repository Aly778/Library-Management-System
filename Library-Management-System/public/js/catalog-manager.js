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
      if (typeof showError === 'function') showError('Failed to load books: ' + error.message);
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
      if (typeof showError === 'function') console.error('Failed to load categories');
      return [];
    }
  }

  filterByCategory(categoryId) {
    if (!categoryId) {
      this.filteredBooks = this.books;
    } else {
      // Find all sub-categories that have this category as a parent
      const subCategoryIds = this.categories
        .filter(c => c.Cparent_id == categoryId)
        .map(c => c.Cid);

      // Filter books matching the selected ID OR any of its sub-categories
      this.filteredBooks = this.books.filter(b => 
        b.Cid == categoryId || subCategoryIds.includes(b.Cid)
      );
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

  renderBookCard(book) {
    const isAvailable = book.Bquantity > 0;
    const safeName = book.Bname.replace(/'/g, "\\'");
    const safeImage = book.Bimage ? book.Bimage.replace(/'/g, "\\'") : '';

    return `
      <div class="bg-white dark:bg-[#1a2230] rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 transition-all duration-300 overflow-hidden flex flex-col h-full">
        <div class="aspect-[3/4] overflow-hidden relative bg-slate-100 dark:bg-slate-950">
          ${book.Bimage ? 
            `<img src="${book.Bimage}" alt="${book.Bname}" class="w-full h-full object-cover">` : 
            `<div class="w-full h-full flex flex-col items-center justify-center text-slate-400">
               <span class="material-symbols-outlined text-5xl">menu_book</span>
               <span class="text-xs mt-1 font-medium">No Image</span>
             </div>`
          }
        </div>

        <div class="p-5 flex flex-col flex-1">
          <div class="mb-4">
            <h3 class="font-bold text-lg text-slate-900 dark:text-white truncate mb-1">${book.Bname}</h3>
            <p class="text-sm font-medium text-primary">${book.BAuthor || 'Unknown Author'}</p>
          </div>
          
          <div class="mt-auto">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xl font-black text-slate-900 dark:text-white">${book.Bprice} EGP</span>
              <span class="text-xs text-slate-400 font-medium">${book.Bquantity} left</span>
            </div>

            ${isAvailable ? `
              <button onclick="cartService.addItem(${book.Bid}, {Bname: '${safeName}', Bprice: ${book.Bprice}, Bimage: '${safeImage}'}); if(typeof showSuccess === 'function') showSuccess('Added to cart!');" 
                class="w-full px-4 py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all active:scale-95">
                Add to Cart
              </button>
            ` : `
              <button disabled class="w-full px-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold text-sm cursor-not-allowed">
                Out of Stock
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }
}

const catalogManager = new CatalogManager();