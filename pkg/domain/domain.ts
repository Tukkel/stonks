export type stock = {
  afterHours: number;
  close: number;
  from: string;
  high: number;
  low: number;
  open: number;
  preMarket: number;
  status: string;
  symbol: string;
  volume: number;
};

export type recommendation = {
  ticker: string;
  buyornot: string;
};

export type scraperStock = {
  symbol: string;
  name: string;
  price: string;
  change: string;
  percentChange: string;
  volume: string;
  avgVolume: string;
  marketCap: string;
  peRatio: string;
  week52High: string;
  unused: string;
};

export interface client {
  getStockData(date: string, ticker: string): Promise<stock | undefined>;
}

export interface scraper {
  scrapeGainers(): Promise<scraperStock[]>;
  scrapeLoosers(): Promise<scraperStock[]>;
}

export interface repo {
  getStockData(date: string, ticker: string): Promise<stock | undefined>;
  insertStockData(data: stock): Promise<void>;
  insertGainerData(data: scraperStock[]): Promise<void>;
  insertLooserData(data: scraperStock[]): Promise<void>;
}

export class Domain {
  constructor(c: client, r: repo, s: scraper) {
    this.c = c;
    this.r = r;
    this.s = s;
  }

  private c: client;
  private r: repo;
  private s: scraper;

  //Returns a recommendation
  async getStonk(ticker: string): Promise<recommendation | undefined> {
    //find out what date it is here

    
    //Get stock data
    const data = await this.c.getStockData("", ticker);

    if (!data) {
      throw new Error("No data");
    }

    const rec: recommendation = {
      ticker: ticker,
      buyornot: "Buy",
    };

    return rec;
  }

  //Returns top 10 gainers of the day
  async getGainers(): Promise<scraperStock[]> {
    const data = await this.s.scrapeGainers();

    //check if data is empty
    if (!data || !data.length) {
      throw new Error("No data");
    }

    //Serialize the data to the database
    await this.r.insertGainerData(data);

    //Return the data back to the calling server
    return data;
  }

  //Returns top 10 loosers of the day
  async getLoosers(): Promise<scraperStock[]> {
    const data = await this.s.scrapeLoosers();

    //check if data is empty
    if (!data || !data.length) {
      throw new Error("No data");
    }

    //Serialize the data to the database
    await this.r.insertLooserData(data);

    //return the data back to the calling server
    return data;
  }

  //Not ready to be implemented yet
  async compare() {
    //Implementation
  }
}

function getDate() {
  const d = new Date();
  const date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  console.log(date);

  console.log(d.getDay());

  for (let i = 0; i < 5; i++) {
    const n = new Date(d);
    n.setDate(n.getDate() - i);

    const prior =
      n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + n.getDate();
    console.log(prior);
  }
}
