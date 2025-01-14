import * as dotenv from 'dotenv';
dotenv.config();

export const fetchArticles = async () => {
    try {
        var url = 'https://newsapi.org/v2/everything?' +
                    'q=(winds of winter) AND book AND george AND martin' +
                    '&apiKey=' +
                    process.env.API_KEY;

        const response = await fetch(url);
        const articles = await response.json();
    
        return articles.articles;

    } catch (err) {
        console.log("Error: ", err);
    }

}

fetchArticles();