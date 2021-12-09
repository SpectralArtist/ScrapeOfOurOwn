import http from '../http-common';

export default class WebscraperDataService {
    public static getAll() {
        return http.get(`/webscrapers`);
    }

    public static get(name: string) {
        return http.get(`/webscrapers/${name}`);
    }

    public static create(data: object) {
        return http.post(`/webscrapers`, data);
    }

    public static delete(name: string) {
        return http.delete<any>(`/webscrapers/${name}`);
    }
}