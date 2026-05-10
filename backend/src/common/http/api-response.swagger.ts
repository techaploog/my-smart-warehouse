import { ApiProperty } from "@nestjs/swagger";
import {
  API_RESPONSE_CODE,
  type ApiResponseCode,
  type ApiResponseData,
  type JsonObject,
} from "@warehouse/shared";

const responseCodeValues = Object.values(API_RESPONSE_CODE);

export class ApiSuccessResponseDoc {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ enum: responseCodeValues, example: API_RESPONSE_CODE.SUCCESS })
  code!: ApiResponseCode;

  @ApiProperty({
    oneOf: [
      { type: "object", additionalProperties: true },
      { type: "array", items: { type: "object", additionalProperties: true } },
    ],
    example: { value: "NestJS - Hello World!" },
  })
  data!: ApiResponseData;
}

export class ApiErrorResponseDoc {
  @ApiProperty({ example: false })
  success!: false;

  @ApiProperty({ enum: responseCodeValues, example: API_RESPONSE_CODE.NOT_FOUND })
  code!: ApiResponseCode;

  @ApiProperty({
    type: "object",
    additionalProperties: true,
    example: { message: "Cannot GET /missing", error: "Not Found" },
  })
  data!: JsonObject;
}
