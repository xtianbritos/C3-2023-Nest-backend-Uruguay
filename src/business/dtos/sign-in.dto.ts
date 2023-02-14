import { IsEmail, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class SignInDto {

    @IsEmail(undefined, { message: 'the data provider is not a valid email.' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsNotEmpty({ message: 'the password is required.' })
    @IsString()
    @Length(5, 30)
    password: string;
}