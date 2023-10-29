export default class RegularException {
  constructor(
    public code: number,
    public type: string,
    public detail: string
  ) {}

  static unauthorized(detail: string): RegularException {
    return new RegularException(401, "Unauthorized", detail);
  }

  static badRequest(detail: string): RegularException {
    return new RegularException(400, "Bad Request", detail);
  }

  static httpRequestError(detail: string): RegularException {
    return new RegularException(503, "Service Unavailable", detail);
  }
}
