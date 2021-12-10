import http from '../http-common';

export default class ScrapeSetDataService {
    public static forceScrape(webscraperId: number) {
        console.log("Webscraper:", webscraperId)
        return http.post(`/scrapesets`, {"id": webscraperId});
    }
}