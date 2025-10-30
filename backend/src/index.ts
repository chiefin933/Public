import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const port = Number(process.env.PORT || 4000);
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}`);
});

export default server;
