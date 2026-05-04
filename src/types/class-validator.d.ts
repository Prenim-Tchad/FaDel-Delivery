declare module 'class-validator' {
  type DecoratorOptions = Record<string, unknown>;
  type ValidatorOptions = Record<string, unknown>;

  export function IsArray(options?: ValidatorOptions): PropertyDecorator;
  export function IsBoolean(options?: ValidatorOptions): PropertyDecorator;
  export function IsDateString(
    options?: DecoratorOptions,
    validationOptions?: ValidatorOptions,
  ): PropertyDecorator;
  export function IsEmail(
    options?: DecoratorOptions,
    validationOptions?: ValidatorOptions,
  ): PropertyDecorator;
  export function IsEnum(
    entity: object,
    validationOptions?: ValidatorOptions,
  ): PropertyDecorator;
  export function IsInt(options?: ValidatorOptions): PropertyDecorator;
  export function IsLatitude(options?: ValidatorOptions): PropertyDecorator;
  export function IsLongitude(options?: ValidatorOptions): PropertyDecorator;
  export function IsNotEmpty(options?: ValidatorOptions): PropertyDecorator;
  export function IsNumber(
    options?: DecoratorOptions,
    validationOptions?: ValidatorOptions,
  ): PropertyDecorator;
  export function IsObject(options?: ValidatorOptions): PropertyDecorator;
  export function IsOptional(options?: ValidatorOptions): PropertyDecorator;
  export function IsPhoneNumber(
    region?: string,
    validationOptions?: ValidatorOptions,
  ): PropertyDecorator;
  export function IsString(options?: ValidatorOptions): PropertyDecorator;
  export function IsUrl(
    options?: DecoratorOptions,
    validationOptions?: ValidatorOptions,
  ): PropertyDecorator;
  export function IsUUID(
    version?: string,
    validationOptions?: ValidatorOptions,
  ): PropertyDecorator;
  export function ArrayNotEmpty(
    validationOptions?: ValidatorOptions,
  ): PropertyDecorator;
  export function Max(
    maxValue: number,
    validationOptions?: ValidatorOptions,
  ): PropertyDecorator;
  export function Min(
    minValue: number,
    validationOptions?: ValidatorOptions,
  ): PropertyDecorator;
  export function MinLength(
    min: number,
    validationOptions?: ValidatorOptions,
  ): PropertyDecorator;
  export function ValidateNested(options?: ValidatorOptions): PropertyDecorator;
}
