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
// ------------------- INPUTS ------------------
// REQUIRED - Copy your Podcast RSS Feeds into here
const PODCAST_RSS_FEEDS = [
    "https://feeds.simplecast.com/Urk3897_",
    "https://feeds.megaphone.fm/GLT9487939818",
];
// REQUIRED - Enter the number of episodes you want downloading
const AMOUNT = 5;
// OPTIONAL - Enter the path to the folder you want the podcasts to go in.
const DOWNLOAD_PATH = "../../podcasts";
// ------------------- THE SCRIPT ----------------
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
        throw new Error(e);
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
        // Pipe the response data into the file stream
        response.body.pipe(fileStream);
        fileStream.on("finish", () => {
            console.log(`Downloaded podcast at: ${filePath}`);
        });
    }
    catch (e) {
        console.error(e);
    }
});
const downloadFiles = (downloadPath, amount, urls) => __awaiter(void 0, void 0, void 0, function* () {
    let count = amount - 1;
    for (let i = 0; i < urls.length; i++, count--)
        yield downloadFile(downloadPath, urls[i], count);
});
const run = (podcastURLs, amount, downloadPath) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < podcastURLs.length; i++) {
        const { title, links } = yield fetchDownloadLinks(podcastURLs[i], amount);
        const fullPath = path.resolve(downloadPath !== null && downloadPath !== void 0 ? downloadPath : "./", title);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
        downloadFiles(fullPath, amount, links);
    }
});
if (PODCAST_RSS_FEEDS && AMOUNT) {
    run(PODCAST_RSS_FEEDS, AMOUNT, DOWNLOAD_PATH);
}
//# sourceMappingURL=index.js.map