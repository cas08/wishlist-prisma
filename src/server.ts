import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`Wishlist API → http://localhost:${env.PORT}`);
});
