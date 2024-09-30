import axios, { AxiosInstance, AxiosResponse, CancelTokenSource } from 'axios';

// Configuration interface
interface ApiConfig {
  baseURL: string;
  timeout?: number;
}

// Generic API response interface
interface ApiResponse<T> {
  data: T;
  meta?: { [key: string]: any }; // Include any metadata if needed
}

// Base CRUD service class
class ApiService {
  protected axiosInstance: AxiosInstance;
  protected endpoint: string;
  private cancelTokenSource?: CancelTokenSource;

  constructor(config: ApiConfig, endpoint: string) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.endpoint = endpoint;
  }

  // Cancel requests
  cancelRequests(): void {
    this.cancelTokenSource?.cancel('Operation canceled by the user.');
  }

  // Improved error handling
  private handleError(error: any, context: string): never {
    const message = error.response?.data?.message || error.message || 'Unknown error';
    console.error(`Error in ${context}:`, message);
    throw new Error(message); // throw structured error
  }

  // Generic CRUD operations

  async fetchAll<T>(): Promise<ApiResponse<T[]>> {
    this.cancelTokenSource = axios.CancelToken.source();
    try {
      const response: AxiosResponse<T[]> = await this.axiosInstance.get(this.endpoint, {
        cancelToken: this.cancelTokenSource.token,
      });
      return { data: response.data }; // Return wrapped response
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      } else {
        this.handleError(error, `fetchAll from ${this.endpoint}`);
      }
      // Ensure to return an empty response if there's an error
      return { data: [] }; // Return an empty array or handle it as needed
    }
  }

  async fetchById<T>(id: number | string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `fetchById from ${this.endpoint}/${id}`);
    }
  }

  async create<T extends { id?: number | string }>(data: T): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(this.endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error, `create in ${this.endpoint}`);
    }
  }

  async update<T>(id: number | string, data: Partial<T>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.put(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error, `update in ${this.endpoint}/${id}`);
    }
  }

  async delete(id: number | string): Promise<void> {
    try {
      await this.axiosInstance.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      this.handleError(error, `delete from ${this.endpoint}/${id}`);
    }
  }
}

export default ApiService;
