import axiosInstance from "./axiosInstanse.service";

export interface IApiGet{
    get<T>(url: string): Promise<T>;
}

class ApiGet implements IApiGet{
    constructor(private readonly api: typeof axiosInstance){}

    async get<T>(url: string): Promise<T> {
        const repsonse = await this.api.get(url);
        return repsonse.data;
    }
}

export const apiGet = new ApiGet(axiosInstance);