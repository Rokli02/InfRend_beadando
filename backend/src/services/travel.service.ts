import { Request, Response } from "express";
import { DataSource, Repository } from "typeorm";
import { Car } from "../entities/Car";
import { Driver } from "../entities/Driver";
import { Purpose, Travel } from "../entities/Travel";
import { MonthlyReport, Summary } from "../models/MontlyReport";
import { errorHandler, Service } from "./service";

export class TravelService extends Service {
    private driverRepository : Repository<Driver>;
    private carRepository : Repository<Car>;

    constructor(dataSource: DataSource){
        super();
        this.repository = dataSource.getRepository(Travel);
        this.driverRepository = dataSource.getRepository(Driver);
        this.carRepository = dataSource.getRepository(Car);
    }

    saveBackAndForth = async (req: Request, res: Response) => {
        if(req.body.id) {
            const travelFromDb = await this.repository.findOneBy({id: req.body.id});
            if(travelFromDb) {
                return errorHandler(res, 'Travel with such id already exists!', 400);
            }
        }

        const driver : Driver = await this.driverRepository.findOneBy({id: req.body.driverId});
        if(!driver) {
            return errorHandler(res, "Driver with the given id does not exists!", 404);
        }
        if(this.licenseExpired(new Date(driver.driverLicenseExpiration))){
            return errorHandler(res, "Driver's license is expired!", 400);
        }

        const car : Car = await this.carRepository.findOneBy({id: req.body.carId});
        if(!car) {
            return errorHandler(res, "Car with the given id does not exists!", 404);
        }

        const journeyFromDb = await this.repository.findOneBy({
            from: req.body.from,
            purpose: req.body.purpose,
            startDate: req.body.startDate,
            travelledDistance: req.body.travelledDistance,
            driver: { id: req.body.driver},
            car: { id: req.body.car}
        });
        if(journeyFromDb) {
            return errorHandler(res, "Travel with similar properties already exists!", 406);
        }

        const carMileage = await this.repository.find({
            select: ["newMileage"],
            where: {
                car: {
                    id: car.id
                }
            }
        }).then((values)=> {
            let highest = -1;
            for(let value of values){
                console.log(value);
                if(value.newMileage > highest){
                    highest = value.newMileage;
                }
            }
            return highest;
        }).then((value) => {
            if(value === -1){
                return car.mileage;
            }
            return value;
        });
        
        req.body.driver = driver;
        req.body.car = car;
        
        //Insert from-to
        const newMileage = req.body.travelledDistance + carMileage;
        req.body.newMileage = newMileage;
        
        const travel1 = this.repository.create(req.body);
        try {
            await this.repository.save(travel1);
        }catch(err) {
            return errorHandler(res);
        }
        
        //Insert to-from
        const newTo = req.body.from,
              newFrom = req.body.to;
        const newMileageBackway = req.body.travelledDistance + newMileage;
        if(req.body.id){
            req.body.id = 0;
        }
        req.body.newMileage = newMileageBackway;
        req.body.from = newFrom;
        req.body.to = newTo;

        const travel2 = this.repository.create(req.body);
        try {
            await this.repository.save(travel2);
            res.status(201).send("Travel created successfully!");
        }catch(err) {
            this.repository.remove(travel1);
            return errorHandler(res);
        }
    }

    deleteBackAndForth = async (req: Request, res: Response) => {
        const travel1 : Travel = await this.repository.findOneBy({id: req.params.id});
        if(!travel1){
            return errorHandler(res, "Removable travel is not found!", 404);
        }

        const travel2 = await this.repository.findOneBy({
            from: travel1.to,
            purpose: travel1.purpose,
            startDate: travel1.startDate,
            travelledDistance: travel1.travelledDistance,
            driver: { id: travel1.driver.id},
            car: { id: travel1.car.id}
        });
        if(!travel2){
            return errorHandler(res, "Driver with the car don't have a planed backway!", 404);
        }

        try {
            await this.repository.remove([travel1, travel2]);
            res.status(200).send("Travel(s) has been successfully deleted!");
        }catch(err) {
            errorHandler(res);
        }
    }

    patchBackAndForth = async (req: Request, res: Response) => {
        if(!req.body) {
            return errorHandler(res, "Necessary informations are not given!", 400);
        }

        const travel1: Travel = await this.repository.findOneBy({id: req.params.id});
        if(!travel1){
            return errorHandler(res, "Data not found with the given id!", 404);
        }
        
        const travel2: Travel = await this.repository.findOneBy({
            from: travel1.to,
            purpose: travel1.purpose,
            startDate: travel1.startDate,
            travelledDistance: travel1.travelledDistance,
            driver: { id: travel1.driver.id},
            car: { id: travel1.car.id}
        });
        if(!travel2){
            return errorHandler(res, "Driver with the car don't have a planed backway!", 404);
        }

        const driver : Driver = await this.repository.findOneBy({id: req.body.driverId});
        if(!driver) {
            return errorHandler(res, "Driver with the given id does not exists!", 404);
        }
        if(this.licenseExpired(new Date(driver.driverLicenseExpiration))){
            return errorHandler(res, "Driver's license is expired!", 400);
        }

        const car : Car = await this.carRepository.findOneBy({id: req.body.carId});
        if(!car) {
            return errorHandler(res, "Car with the given id does not exists!", 404);
        }

        let travel2PatchProperties: any;
        if(req.body.from && req.body.from !== travel1.from){
            travel2PatchProperties.to = req.body.from;
        }
        if(req.body.to && req.body.to !== travel1.to) {
            travel2PatchProperties.from = req.body.to;
        }//A kilóméteróra állás itteni eltárolása törékeny
        if(req.body.travelledDistance && req.body.travelledDistance !== travel1.travelledDistance) {
            const beforeJourneyMileage = travel1.newMileage - travel1.travelledDistance;
            req.body.newMileage = beforeJourneyMileage + req.body.travelledDistance;
            
            travel2PatchProperties.travelledDistance = req.body.travelledDistance;
            travel2PatchProperties.newMileage = beforeJourneyMileage + (req.body.travelledDistance*2);
        }
        if(req.body.purpose && req.body.purpose !== travel1.purpose){
            travel2PatchProperties.purpose = req.body.purpose;
        }
        if(req.body.startDate && req.body.startDate !== travel1.startDate) {
            travel2PatchProperties.startDate = req.body.startDate;
        }
        if(req.body.driver && req.body.driver !== travel1.driver){
            travel2PatchProperties.driver = req.body.driver;
            req.body.driver = driver;
        }
        if(req.body.car && req.body.car !== travel1.car) {
            travel2PatchProperties.car = car;
            req.body.car = car;
        }

        const travel1Patch = this.repository.create(req.body);
        const travel2Patch = this.repository.create(travel2PatchProperties);
        try {
            await this.repository.update({id: req.params.id}, travel1Patch)
            await this.repository.update({id: travel2.id}, travel2Patch);
            res.status(200).send("Travels have been successfully patched!");
        }catch(err) {
            errorHandler(res);
        }
    }

    monthlyReport = async (req: Request, res: Response) => {
        if(!req.query.year || !req.query.month || !req.query.licensePlate) {
            return errorHandler(res, "Required parameters are missing!", 404);
        }

        const licenseNumber : string = String(req.query.licensePlate);

        const travels: Travel[] = await this.repository.findBy(
        {
            car : { 
                licensePlate: licenseNumber
            }
        });
        if(travels.length <= 0){
            return errorHandler(res, "There are no travel information of the car with such license number!", 404);
        }

        //
        //ADOTT ÉV/HÓNAP KERETET ADNI NEKI, MERT NEM A KERETEN BELÜL ADJA VISSZA AZ ÉRTÉKEKET!!!
        //

        const lowestHighestMileage = this.lowestHighestPairs(travels);
        const privateSummary: Summary = this.costSummary(travels.filter((value) => value.purpose === Purpose.PRIVATE), travels[0].car);
        const businesSummary: Summary = this.costSummary(travels.filter((value) => value.purpose === Purpose.BUSINESS), travels[0].car);
        let travelsFromToLocation: string[] = [];

        for(let travel of travels) {
            console.log(travel.from+" - "+travel.to);
            travelsFromToLocation.push(travel.from+" - "+travel.to);
        }
        
        const car = travels[0].car;
        let monthlyReport : MonthlyReport = {
            car: car,
            startingMileage: lowestHighestMileage[0],
            finishingMileage: lowestHighestMileage[1],
            travels: travelsFromToLocation,
            privateSummary: privateSummary,
            businesSummary: businesSummary
        };

        res.json(monthlyReport);
    }

    lowestHighestPairs(travels: Travel[]) {
        let lowestMileage: number = travels[0].newMileage, highestMileage: number = 0;
        for(let travel of travels) {
            if(travel.newMileage < lowestMileage)
                lowestMileage = travel.newMileage;
            if(travel.newMileage > highestMileage)
                highestMileage = travel.newMileage;
        }
        return [lowestMileage, highestMileage];
    }

    private costSummary(travels: Travel[], car: Car): Summary {
        if(travels.length <= 0) {
            return {
                travelledDistance: 0,
                consumptionCost: 0,
                flatRate: 0,
                totalCost: 0}
        }

        const costOfFuel: number = 480,
              flatRate: number = 10,
              consumption: number = car.consumption;
        let summary: Summary;
        let lowestHighestMileage: number[],
            fuelSum: number = 0;

        lowestHighestMileage = this.lowestHighestPairs(travels);
        const distanceSum = lowestHighestMileage[1] - lowestHighestMileage[0];
        fuelSum = consumption * (distanceSum / 100)

        summary = {
            travelledDistance: distanceSum,
            consumptionCost: costOfFuel*fuelSum,
            flatRate: flatRate*distanceSum,
            totalCost: (costOfFuel*fuelSum) + (flatRate*distanceSum)
        };

        return summary;
    }

    private licenseExpired(licenseDate: Date): boolean {
        if(Date.now() < licenseDate.getTime()) {
            return false;
        }
        return true;
    }
}