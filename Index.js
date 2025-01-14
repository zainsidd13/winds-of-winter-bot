import { AtpAgent } from '@atproto/api';
import dotenv from 'dotenv';
import {fetchLatestPost, readFile, writeFile} from './Post.js';
import {fetchArticles} from './News.js';
import axios from 'axios';
dotenv.config();


const agent = new AtpAgent({
    service: 'https://bsky.social'
});

(async () => {
    try {

        let tweetContent = '';
        // Fetch latest post
        const latestPost = await fetchLatestPost();
        
        const oldPost = await readFile('latestPost.txt');

        // Login to BlueSky Bot
        await agent.login({
            identifier: 'winds-of-winter.bsky.social',
            password: process.env.BLUESKY_PASSWORD
        })


        if (oldPost === latestPost) {
            console.log("No New Post")
        } else {
            console.log("New Post");
            await writeFile('latestPost.txt', latestPost)
            latestPost.toLowerCase().includes("WINDS") 
                ? tweetContent += "New Post By GRRM On His Website!\n\nWinds of Winter Mentioned!" 
                : tweetContent += "New Post By GRRM On His Website!\n\nNo Mention of Winds of Winter";
                
            // Make Post
            await agent.post({
                text: tweetContent,
                createdAt: new Date().toISOString(),
                facets: [
                    {
                      index: {
                        byteStart: 20,
                        byteEnd: 31
                      },
                      features: [{
                        $type: 'app.bsky.richtext.facet#link',
                        uri: 'https://georgerrmartin.com/notablog/'
                      }]
                    }
                  ]
                })
        }

        const articles = await fetchArticles();

        if (articles.length > 0) {

            tweetContent += 'New Top Headline Regarding GRRM!:\n\n';
            tweetContent += articles[0].title;

            const imageResponse = await axios.get(articles[0].urlToImage, {
                responseType: 'arraybuffer', 
            });
        
            const buffer = Buffer.from(imageResponse.data); 
            const encoding = 'image/jpeg'; 
        
            const { data } = await agent.uploadBlob(buffer, { encoding });


            await agent.post({
                text: tweetContent,
                createdAt: new Date().toISOString(),
                embed: {
                    $type: "app.bsky.embed.external",
                    external: {
                      uri: articles[0].url,
                      title: articles[0].title,
                      description: articles[0].description,
                      thumb: data.blob
                    }
                  }
                })
        } else {
            console.log("No headlines");
        }



        
    } catch (err) {
        console.log("Error:", err);

    }
    
})();
