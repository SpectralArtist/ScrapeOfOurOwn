import http from '../http-common';

export default class AuthorDataService {
    public static getAllCounts() {
        return http.get(`/tags`);
    }

    public static getTypeCounts() {
        return http.get(`/tags/type`);
    }
}