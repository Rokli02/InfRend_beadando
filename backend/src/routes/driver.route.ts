import { DataSource} from "typeorm";
import { Router } from "express";
import { DriverService } from "../services/driver.service";
import { allPropertyValid, givenPropertyValid } from "../validators/driver.validator"

export function getDriverRoute(dataSource : DataSource) : Router {
    const router = Router();
    const driverService = new DriverService(dataSource);

    router.get('/', driverService.findAll);
    router.post('/', allPropertyValid, driverService.save);
    router.put('/:id', driverService.checkParamId, allPropertyValid, driverService.update);
    router.patch('/:id', driverService.checkParamId, givenPropertyValid, driverService.patch);
    router.delete('/:id', driverService.checkParamId, driverService.delete);

    return router;
}