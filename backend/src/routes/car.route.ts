import { DataSource } from "typeorm";
import { Router } from "express";
import { CarService } from "../services/car.service";
import { allPropertyValid, givenPropertyValid } from "../validators/car.validator";

export function getCarRoute(dataSource : DataSource) : Router {
    const router = Router();
    const carService = new CarService(dataSource);

    router.get('/', carService.findAll);
    router.post('/', allPropertyValid, carService.save);
    router.put('/:id', carService.checkParamId, allPropertyValid, carService.update);
    router.patch('/:id', carService.checkParamId, givenPropertyValid, carService.patch);
    router.delete('/:id', carService.checkParamId, carService.delete);

    return router;
}