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
}

module.exports = BookModel;