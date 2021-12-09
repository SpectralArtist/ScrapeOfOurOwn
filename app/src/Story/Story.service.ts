import http from '../http-common';

export default class AuthorDataService {
    public static getAll() {
        return http.get(`/stories`);
    }

    public static getStoriesWithWord(search: string) {
        return http.get(`/stories?search=${search}`);
    }

    public static getCompletedStats(xaxis?: string, yaxis?: string) {
        return http.get(`/stories/stats/completed?xaxis=${xaxis}&yaxis=${yaxis}`);
    }

    public static getStoryTotals() {
        return http.get(`/stories/stats/total`);
    }

    // public static get(id: string) {
    //     return http.get(`/authors/${id}`);
    // }

    // public static create(data: object) {
    //     return http.post(`/authors`, data);
    // }
}