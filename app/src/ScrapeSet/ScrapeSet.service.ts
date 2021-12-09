import http from '../http-common';

export default class ScrapeSetDataService {
    public static forceScrape(webscraperId: number) {
        return http.post(`/scrapesets`, {webscraperId});
    }
}