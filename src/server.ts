import app from './app';
import { env } from './config';

app.listen(env.PORT, () => {
  console.log(`Wishlist API → http://localhost:${env.PORT}`);
});
