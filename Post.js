import * as cheerio from 'cheerio';
import * as fs from 'fs';

const url = 'https://georgerrmartin.com/notablog/';
let newPost = false;

const fetch_demo = new Promise((res, rej) => {
    res(fetch(url));

})

export const fetchLatestPost = () => {
    return fetch_demo.then((res) => {
        return res.text();
    }).then((res) => {
        const $ = cheerio.load(res);
        const latestPost = $('.post-main').first();
        return latestPost.text().trim();
    });
};

export const readFile = (path) =>
  new Promise((resolve, reject) =>
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) reject(err);

      resolve(data.trim());
    }),
  );

export const writeFile = (path, data) =>
  new Promise((resolve, reject) =>
    fs.writeFile(path, data, (err) => {
      if (err) reject(err);

      resolve();
    }),
  );
