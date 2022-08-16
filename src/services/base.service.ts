import axios, { AxiosInstance } from "axios";

export default class BaseService {

  protected client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL });
  };

};