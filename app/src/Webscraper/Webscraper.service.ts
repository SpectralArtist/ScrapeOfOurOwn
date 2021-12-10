import http from '../http-common';

export default class WebscraperDataService {
    public static getAll() {
        return http.get(`/webscrapers`);
    }

    public static get(id: number) {
        return http.get(`/webscrapers/${id}`);
    }

    public static create(data: object) {
        return http.post(`/webscrapers`, data);
    }

    public static delete(id: number) {
        return http.delete<any>(`/webscrapers/${id}`);
    }
}