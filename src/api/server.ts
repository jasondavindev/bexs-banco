import { app } from './app';

const PORT = Number(process.env.NODE_PORT);

app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});
