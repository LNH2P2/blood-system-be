import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
  ValidateNested
} from 'class-validator'
import { AccountType, Gender, IsCreatedBy, UserRole } from '../user-type/enum/user.enum'

class AddressDto {
  @ApiProperty({ example: '249 Nguyen Trai' })
  @IsNotEmpty()
  @IsString()
  street: string

  @ApiProperty({ example: 'District 1' })
  @IsNotEmpty()
  @IsString()
  district: string

  @ApiProperty({ example: 'Ho Chi Minh City' })
  @IsNotEmpty()
  @IsString()
  city: string

  @ApiProperty({ example: 'Vietnam' })
  @IsNotEmpty()
  @IsString()
  nation: string
}

class CreatedByDto {
  @ApiProperty({ example: 'fdsjalrjeoiqwruioewqjfod' })
  @IsNotEmpty()
  @IsString()
  _id: string

  @ApiProperty({ example: 'hehehe@gmail.com' })
  @IsNotEmpty()
  @IsString()
  email: string
}

class UpdateByDto {
  @IsString()
  _id: string

  @IsString()
  email: string
}

class DeleteByDto {
  @IsString()
  _id: string

  @IsString()
  email: string
}

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  fullName: string

  @ApiProperty({ example: 'johndoe123' })
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ example: '123456123456' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ example: '0987654321' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(0|\+84)(3[2-9]|5[6|8|9]|7[06-9]|8[1-5]|9[0-9])[0-9]{7}$/, {
    message: 'Phone number is not valid'
  })
  phoneNumber: string

  @ApiProperty({ example: Gender.Male, enum: Gender })
  @IsEnum(Gender)
  gender: Gender

  @ApiProperty({ example: '1990-01-01' })
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date

  @ApiProperty({ example: 'https://example.com/avatar.png', required: false })
  @IsOptional()
  @IsString()
  image?: string

  @ApiProperty({ type: AddressDto })
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  address: AddressDto

  @ApiProperty({ example: UserRole.Member, enum: UserRole, required: true })
  @IsEnum(UserRole)
  role?: UserRole

  @ApiProperty({ example: AccountType.Local, enum: AccountType, required: true })
  @IsEnum(AccountType)
  accountType?: AccountType

  @ApiProperty({ example: IsCreatedBy.self, enum: IsCreatedBy, required: true })
  @IsEnum(IsCreatedBy)
  isCreatedBy?: IsCreatedBy

  @ApiProperty({
    example: {
      _id: '60c72b2f9b1e8d001c8e4f1a',
      email: 'admin@gmail.com'
    },
    required: true
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreatedByDto)
  createdBy: CreatedByDto

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateByDto)
  updatedAtBy: UpdateByDto

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DeleteByDto)
  isDeletedBy: DeleteByDto

  @IsOptional()
  @IsNumber()
  codeId: number

  @IsOptional()
  @IsDate()
  codeExpired: Date

  @IsOptional()
  @IsBoolean()
  verified: boolean = false
}
