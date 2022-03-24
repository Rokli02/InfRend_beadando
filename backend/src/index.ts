import "reflect-metadata"
import { AppDataSource } from "./data-source";
import * as express from 'express';
import { getDriverRoute } from "./routes/driver.route";
import { DataSource } from "typeorm";
import { getCarRoute } from "./routes/car.route";
import { getTravelRoute } from "./routes/travel.route";

AppDataSource.initialize().then(async (dataSource : DataSource) => {
    console.log('Connected to DB!');
    const app = express();
    //const entityManager = AppDataSource.createEntityManager();

    app.use(express.json());
    
    app.use('/api/driver', getDriverRoute(dataSource));
    app.use('/api/car', getCarRoute(dataSource));
    app.use('/api/travel', getTravelRoute(dataSource));
    app.get('/', (req, res) => {
        res.status(200).send("<h1>Root of API</h1>");
    })

    const port = process.env.port || 3000;
    app.listen(port, () => {
        console.log('Server listening on port:',port);
    });

}).catch(error => {
    if(error instanceof Error){
        console.log(error.message.includes("ECONNREFUSED") ? "Couldn't connect to the database!" : error.message);
    } else {
        console.log(error)
    }
});


