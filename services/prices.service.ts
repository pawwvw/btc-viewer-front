import { apiGet } from "./api";


export interface IPrice {
    id: number;
    price: number;
    timestamp: Date;
}

export interface IPriceService {
    getPrices(startDate?: string, endDate?: string): Promise<IPrice[]>;
}

class PriceService implements IPriceService{
    constructor(private readonly api: typeof apiGet){}
    async getPrices(startDate?: string, endDate?: string): Promise<IPrice[]> {
        const data: IPrice[] = await this.api.get<IPrice[]>(endDate && startDate ? `/price-fetcher?startDate=${startDate}&endDate=${endDate}` : "/price-fetcher");
        return data;
    }
}

export const priceService = new PriceService(apiGet);