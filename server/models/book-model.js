class BookModel {
    constructor() {
        this.model = {
            title: '',
            author: '',
            average_rating: '',
            isbn: '',
            isbn13: '',
            prices: {
                kindle: {
                    amazon: '',
                    new_from: '',
                    used_from: ''
                },
                hardcover: {
                    amazon: '',
                    new_from: '',
                    used_from: ''
                },
                paperback: {
                    amazon: '',
                    new_from: '',
                    used_from: ''
                }
            }
        }
    }

    addBookInfo(details) {
        this.model.title = details.title;
        this.model.author = details.author;
        this.model.average_rating = details.average_rating;
        this.model.isbn = details.isbn;
        this.model.isbn13 = details.isbn13;
    }

    addPriceInfo(prices) {
        this.model.prices.kindle = prices.kindle;
        this.model.prices.hardcover = prices.hardcover;
        this.model.prices.paperback = prices.paperback;
    }
}

module.exports = BookModel;