import http from '../http-common';

export default class ScrapeSetDataService {
    public static forceScrape(name: string) {
        return http.post(`/scrapesets`, {name});
    }
}