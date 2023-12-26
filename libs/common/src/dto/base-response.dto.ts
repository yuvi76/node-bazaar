export interface BaseResponse {
  /**
   * The status code of the response.
   */
  statusCode: number;
  /**
   * The message of the response.
   */
  message: string;
  /**
   * The data of the response.
   */
  data?: any;
}
