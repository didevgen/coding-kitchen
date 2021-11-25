import mongoose from 'mongoose';

interface TInput {
  db: string;
}
export default ({ db }: TInput) => {
  const connect = () => {
    mongoose
      .connect(db)
      .then(() => {
        return console.info(`Successfully connected to ${db}`);
      })
      .catch(error => {
        console.error('Error connecting to database: ', error);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
