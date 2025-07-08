// src/api/auth/dto/refresh-token.dto.ts
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshTokenDto {
  @ApiProperty({ example: 'fdjslakrjelkwqjlvnmldhsaoireoiwq.vdjsalkfjelqwjfoiejaofjdlsa.fjeoiwqfjioewajfodjlsa' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string
}
