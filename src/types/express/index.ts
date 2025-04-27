import "express";

declare module "express-serve-static-core" {
  interface Request {
    geo?: {
      location: { lat: number; lng: number };
      // add more properties as needed
    };
  }
}
