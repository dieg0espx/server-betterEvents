
import express from "express";
import { cron } from './controllers/cron.js';

const app = express();

app.use('/cron', cron);

export const cron = () => {
    
  //code for the automated task
  console.log('HEREEEEE !!');

};