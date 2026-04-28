import express from "express";
import session from "express-session";
import { storage } from "./storage";
import type { Customer } from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    customerId?: number;
    customer?: Customer;
    adminUserId?: number;
  }
}

export function setupSession(app: express.Application) {
  app.use(session({
    secret: process.env.SESSION_SECRET || "pollyfort-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));
}

export async function authenticateCustomer(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.session.customerId) {
    try {
      const customer = await storage.getCustomer(req.session.customerId);
      if (customer) {
        req.session.customer = customer;
        return next();
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  }
  
  return res.status(401).json({ message: "Authentication required" });
}

export function optionalAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.session.customerId) {
    storage.getCustomer(req.session.customerId)
      .then(customer => {
        if (customer) {
          req.session.customer = customer;
        }
        next();
      })
      .catch(() => next());
  } else {
    next();
  }
}