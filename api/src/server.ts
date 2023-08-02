import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDB from './config/connectDatabase';
import routes from './routes';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Attach the routes
app.use('/', routes);

// Serve uploaded files statically
app.use('/profile', express.static(path.join(__dirname, '../public/uploads')));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Initialize the TypeORM connection and run server
connectDB.initialize()
    .then(() => {
        console.log('Database Connected!')
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => console.log('Database connection error: ', error));

