import app from './app.js';
import { env } from './config/index.js';

app.listen(env.PORT, () => {
  console.log(`Wishlist API → http://localhost:${env.PORT}`);
});
