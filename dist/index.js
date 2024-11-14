#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
// ------------------- DEFAULT VALUES ------------------
const PODCAST_RSS_FEEDS = process.env.PODCAST_RSS_FEEDS
    ? process.env.PODCAST_RSS_FEEDS.split(",")
    : [];
const AMOUNT = process.env.AMOUNT ? parseInt(process.env.AMOUNT, 10) : 5;
const DOWNLOAD_PATH = process.env.DOWNLOAD_PATH || ".";
// ------------------- THE SCRIPT ------------------
const fetchDownloadLinks = (url, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        const text = yield response.text();
        const title = text.match(/<title>([^<]*)</)[1];
        const enclosureTags = text.match(/<enclosure[^>]*>/g);
        let links = [];
        for (let i = 0; i < amount; i++) {
            links.push(enclosureTags[i].match(/url="([^"]*)"/)[1]);
        }
        return { title, links };
    }
    catch (e) {
        console.error(e);
    }
});
const downloadFile = (downloadPath, url, index) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch file");
        }
        const filePath = path.resolve(downloadPath, `podcast-${index + 1}.mp3`);
        const fileStream = fs.createWriteStream(filePath);
        response.body.pipe(fileStream);
        fileStream.on("finish", () => {
            console.log(`Downloaded: ${filePath}`);
        });
    }
    catch (e) {
        console.error(e);
    }
});
const downloadFiles = (downloadPath, amount, urls) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < urls.length; i++) {
        yield downloadFile(downloadPath, urls[i], i);
    }
});
const run = (podcastURLs, amount, downloadPath) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < podcastURLs.length; i++) {
        const { title, links } = yield fetchDownloadLinks(podcastURLs[i], amount);
        const fullPath = path.resolve(downloadPath, title);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
        yield downloadFiles(fullPath, amount, links);
    }
});
const argv = yargs(hideBin(process.argv))
    .option("rss", {
    alias: "r",
    type: "array",
    description: "Comma-separated list of podcast RSS feed URLs",
    demandOption: true,
})
    .option("amount", {
    alias: "a",
    type: "number",
    description: "Number of episodes to download",
    default: 5,
})
    .option("path", {
    alias: "p",
    type: "string",
    description: "Path to save downloaded podcasts",
    default: "./",
}).argv;
run(argv.rss, argv.amount, argv.path);
//# sourceMappingURL=index.js.map