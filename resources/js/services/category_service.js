import { http, httpFile } from "./http_service";

export function createCategory(data) {
    return httpFile().post("/categories", data);
}

export function updateCategory(id, data) {
    return httpFile().post(`/categories/${id}`, data);
}

export function loadCategories() {
    return http().get("/categories");
}

export function getCategory(id) {
    return http().get(`/categories/${id}/edit`);
}

export function deleteCategory(id) {
    return http().delete(`/categories/${id}`);
}
