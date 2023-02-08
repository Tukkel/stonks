import * as grpc from "@grpc/grpc-js";
import { StonkServiceService } from "./proto/stonk/v1/stonk_service_grpc_pb.js";

import { stock } from "../../domain/domain";
import { scraperStock } from "../../domain/domain";

import {
  GetStonkRequest,
  GetStonkResponse,
  GainersRequest,
  GainersResponse,
  LoosersRequest,
  LoosersResponse,
  CompareRequest,
  CompareResponse,
} from "./proto/stonk/v1/stonk_service_pb.js";

import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";

//I need to define the domain interface and then then the server methods should be able to perform call on the domain methods and return the appropiate response
interface domain {
  getStonk(ticker: string): Promise<stock | undefined>;
  getGainers(): Promise<scraperStock[]>;
  getLoosers(): Promise<scraperStock[]>;
  compare(): Promise<void>;
}

export class Server {
  [key: string]: any;

  private d: domain;

  constructor(d: domain) {
    this.d = d;
  }

  //Entry point for the getStonk RPC method
  getStonk(
    call: ServerUnaryCall<GetStonkRequest, GetStonkResponse>,
    callback: sendUnaryData<GetStonkResponse>
  ) {
    const req = call.request.toObject();

    console.log(req);

    //create a stock object with test data

    const stonk: stock = {
      low: 1,
      open: 1,
      close: 1,
      high: 1,
      date: "2021-01-01",
    };

    const res = new GetStonkResponse();
    console.log(call.request.getStonk());
    res.setStonk("SPY");
    res.setBuyornot("BUY");
    res.serializeBinary();
    callback(null, res);
  }

  //Entry point for the Gainers RPC method
  gainers(
    call: ServerUnaryCall<GainersRequest, GainersResponse>,
    callback: sendUnaryData<GainersResponse>
  ) {
    //Implementation
  }

  //entry point for the Losers RPC method
  loosers(
    call: ServerUnaryCall<LoosersRequest, LoosersResponse>,
    callback: sendUnaryData<LoosersResponse>
  ) {}

  //entry point for the Compare RPC method
  compare(
    call: ServerUnaryCall<CompareRequest, CompareResponse>,
    callback: sendUnaryData<CompareResponse>
  ) {
    //Implementation
  }
}

//Needs to accept a server
export function startServer(s: Server) {
  var server = new grpc.Server();

  server.addService(StonkServiceService, s);

  server.bindAsync(
    "0.0.0.0:8000",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
  console.log("Server running at localhost:8000");
}

//I need to rewrite some logic so the generated js filed are going to DIST folder instead of the stonk/v1 folder

//Implement the SayHelloRequest method.
/* function sayHello(call, callback) {
  var reply = new SayHelloResponse();
  reply.setMessage("Hello " + call.request.getName());
  callback(null, reply);
} */
//public sayHello(call: ServerUnaryCall<HelloRequest, HelloResponse>, callback: sendUnaryData<HelloResponse>): void {

/* function getStonk(
  call: ServerUnaryCall<GetStonkRequest, GetStonkResponse>,
  callback: sendUnaryData<GetStonkResponse>
): void {
  // get the request
  const request = call.request;
  console.log("HEHE");
  const stonk = call.request.getStonk;
} */
