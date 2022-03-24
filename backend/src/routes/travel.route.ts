import { DataSource } from "typeorm";
import { Router } from "express";
import { TravelService } from "../services/travel.service";
import { allPropertyValid, givenPropertyValid } from "../validators/travel.validator";

export function getTravelRoute(dataSource : DataSource) : Router {
    const router = Router();
    const travelService = new TravelService(dataSource);

    router.get('/', travelService.findAll);
    router.post('/', allPropertyValid, travelService.saveBackAndForth);
    router.patch('/:id', travelService.checkParamId, givenPropertyValid, travelService.patchBackAndForth);
    router.delete('/:id', travelService.checkParamId, travelService.deleteBackAndForth);
    router.get('/report', travelService.monthlyReport);
    

    return router;
}