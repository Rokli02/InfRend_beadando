import { Car } from "../entities/Car";

export interface MonthlyReport {
    car : Car;
    startingMileage : number;
    finishingMileage : number;
    travels : string[];
    privateSummary : Summary;
    businesSummary : Summary;
}

export interface Summary {
    travelledDistance: number;
    consumptionCost: number;
    flatRate: number;
    totalCost: number;
}