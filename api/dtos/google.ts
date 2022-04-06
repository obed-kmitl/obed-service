import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GoogleCredentialPayloadDTO {
  user_id : number;

  refresh_token?: string | null;

  expiry_date?: number | null;

  access_token?: string | null;

  token_type?: string | null;

  id_token?: string | null;

  scope?: string;
}

export class GoogleAuthorizationRequestDTO {
  @IsNotEmpty()
  @IsNumber()
  userId: number = -1;

  @IsNotEmpty()
  @IsString()
  code: string = '';
}
