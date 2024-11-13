var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fetchURLs = (url) => __awaiter(this, void 0, void 0, function* () {
    try {
        const fetch = (yield import("node-fetch")).default;
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        const text = yield response.text();
        // const podcastTitle = xml.rss.channel.title;
        // console.log("Podcast Title: ", podcastTitle);
        // const podcastLinks = xml.rss.channel.item
        //   .map((item: any) => {
        //     if (item.enclosure && item.enclosure.url) {
        //       return item.enclosure.url;
        //     } else {
        //       console.warn("No enclosure URL found for item:", item);
        //       return null;
        //     }
        //   })
        //   .filter((url: string | null) => url !== null);
        // console.log("Podcast Links: ", podcastLinks);
        return podcastLinks;
    }
    catch (e) {
        console.error(e);
        return [];
    }
});
const run = () => __awaiter(this, void 0, void 0, function* () {
    yield fetchURLs("https://feeds.simplecast.com/Urk3897_");
});
run();
//# sourceMappingURL=index.js.map