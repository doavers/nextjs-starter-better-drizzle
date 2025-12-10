export interface APIResponse {
  traceId: string;
  code: string;
  message: string;
  data: unknown;
  hostId?: string;
  responseAt?: string;
  timeConsume?: number;
}

export interface EncryptedAPIResponse {
  traceId: string;
  data: string;
  hostId?: string;
  responseAt?: string;
  timeConsume?: number;
}

export interface Paging {
  size: number;
  total_page: number;
  current_page: number;
  total: number;
}

export interface APIPagingResponse extends APIResponse {
  paging?: Paging;
}
