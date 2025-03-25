import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');

export const setupApp  = (app: any) => {
    app.use(cookieSession({
        keys: ['123abc']
      }));
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true
        })
      );
};