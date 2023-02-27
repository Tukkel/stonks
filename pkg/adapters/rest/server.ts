//implement the server with express here

import express from "express";

import { stock, scraperStock, recommendation } from "../../domain/domain";

interface domain {
  getStonk(ticker: string): Promise<recommendation | undefined>;
  getGainers(): Promise<scraperStock[]>;
  getLoosers(): Promise<scraperStock[]>;
  getTest(): Promise<scraperStock[]>;
  compare(): Promise<void>;
}

export class Server2 {
  private app: express.Application;
  private port: number;
  private d: domain;

  constructor(d: domain) {
    this.d = d;
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    //register routes
    this.registerRoutes();

    this.port = parseInt(process.env.PORT) || 3000;

    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }

  private registerRoutes() {
    this.app.get("/gainers", (req, res) => {
      this.gainers(req, res);
    });

    this.app.get("/loosers", (req, res) => {
      this.loosers(req, res);
    });

    this.app.post("/getStonk", (req, res) => {
      this.getStonk(req, res);
    });

    this.app.post("/test", (req, res) => {
      this.test(req, res);
    })
  }

  //entry point for the getStonk REST method
  private async getStonk(req: express.Request, res: express.Response) {
    console.log("getStonk called");
    try {
      const stock: recommendation = await this.d.getStonk(req.body.ticker);
      if (stock) {
        res.status(200).send(stock);
      }
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  }

  //entry point for the Gainers REST method
  private async gainers(req: express.Request, res: express.Response) {
    console.log("Gainers called");

    try {
      this.d.getGainers().then((stock: scraperStock[]) => {
        if (stock) {
          res.send(stock);
        }
      });
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  }

  //entry point for the Loosers REST method
  private async loosers(req: express.Request, res: express.Response) {
    console.log("Loosers called");
    this.d.getLoosers().then((stock: scraperStock[]) => {
      if (stock) {
        res.send(stock);
      }
    });
  }

  //entry point for the getTest REST method
  private async test(req: express.Request, res: express.Response) {
    console.log("Test called");

    try {
      this.d.getTest().then((stock: scraperStock[]) => {
        if (stock) {
          res.send(stock);
        }
      });
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  }
}
