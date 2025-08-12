import type mongo from 'mongoose';

interface MongooseCache {
  conn: mongo.Connection | null;
  promise: Promise<mongo.Connection> | null;
}

declare global {
  var mongoose: MongooseCache;
}