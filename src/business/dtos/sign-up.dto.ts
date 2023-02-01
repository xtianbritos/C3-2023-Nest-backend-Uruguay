import { IsEmail,IsNumberString, IsUUID, IsString, IsNotEmpty, Length } from 'class-validator';

export class SignUpDto {

    @IsUUID(4, { message: "this must to be uuid v4" })
    documentTypeId: string;

    @IsNumberString()
    document: string;

    @IsString()
    fullName: string;

    @IsEmail()
    email: string;

    @IsNumberString()
    phone: string;

    @IsNotEmpty({ message: 'the password is required.' })
    @IsString()
    @Length(5, 30)
    password: string;
}