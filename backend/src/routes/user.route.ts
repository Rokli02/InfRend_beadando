import { Router } from "express";
import { DataSource } from "typeorm";
import { UserService } from "../services/user.service";
import { isAdmin, validSignUpUser, validLoginUser, isLogedIn } from "../validators/user.validator";

export function getUserRoute(dataSource : DataSource) {
    const router = Router();
    const userService = new UserService(dataSource);

    router.get('/each', isLogedIn, isAdmin, userService.getAll);
    router.post('/login', validLoginUser, userService.login);
    router.post('/signup', isLogedIn, isAdmin, validSignUpUser, userService.signup);
    router.delete('/change/remove/:id', isLogedIn, isAdmin, userService.remove);
    router.patch('/change/password/:id', isLogedIn, isAdmin, userService.changePassword);

    return router;
}