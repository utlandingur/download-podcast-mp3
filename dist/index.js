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
import readline from "readline";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
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
        console.log("title", title);
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
        const filePath = path.resolve(downloadPath, `podcast-${index}.mp3`);
        const fileStream = fs.createWriteStream(filePath);
        // Pipe the response data into the file stream
        response.body.pipe(fileStream);
        fileStream.on("finish", () => {
            console.log(`Downloaded: ${filePath}`);
        });
    }
    catch (e) {
        throw new Error(e);
    }
});
const downloadFiles = (downloadPath, urls) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < urls.length; i++)
        yield downloadFile(downloadPath, urls[i], i);
});
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    rl.question("Enter the URL for the podcast's RSS feed: ", (url) => __awaiter(void 0, void 0, void 0, function* () {
        rl.question("Enter the number of latest podcasts to download: ", (amount) => __awaiter(void 0, void 0, void 0, function* () {
            rl.question("Enter the download path (absolute or relative): ", (downloadPath) => __awaiter(void 0, void 0, void 0, function* () {
                const { title, links } = yield fetchDownloadLinks(url, Number(amount));
                const fullPath = path.resolve(downloadPath, title);
                if (!fs.existsSync(fullPath)) {
                    fs.mkdirSync(fullPath, { recursive: true });
                }
                console.log("path", fullPath);
                downloadFiles(fullPath, links);
                rl.close();
            }));
        }));
    }));
});
run();
//# sourceMappingURL=index.js.map