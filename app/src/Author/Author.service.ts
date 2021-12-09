import http from '../http-common';

export default class AuthorDataService {
    public static getAll() {
        return http.get(`/authors`);
    }

    public static getAuthorWithWord(search: string) {
        return http.get(`/authors?search=${search}`);
    }

    public static get(id: string) {
        return http.get(`/authors/${id}`);
    }

    public static create(data: object) {
        return http.post(`/authors`, data);
    }
}