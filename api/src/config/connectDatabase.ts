import { DataSource } from "typeorm";
import { ormConfig } from "../ormConfig";

const connectDB = new DataSource({
    type: "mysql",
    host: ormConfig.host,
    port: Number.parseInt(ormConfig.port || ''),
    username: ormConfig.username,
    password: ormConfig.password,
    database: ormConfig.database,
    entities: ormConfig.entities,
    synchronize: ormConfig.synchronize,
})

export default connectDB;