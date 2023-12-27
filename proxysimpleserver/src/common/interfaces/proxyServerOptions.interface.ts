import {ProtocolType} from "../types/protocol.type";

export interface IProxyRequestOptions {
    host: string;
    port: number;
    protocol: ProtocolType;
    path: string;
}
