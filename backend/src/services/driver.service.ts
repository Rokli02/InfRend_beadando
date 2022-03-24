import { DataSource } from "typeorm";
import { Driver } from "../entities/Driver";
import { Service } from "./service";

export class DriverService extends Service {
    constructor(dataSource: DataSource){
        super();
        this.repository = dataSource.getRepository(Driver);
    }
}