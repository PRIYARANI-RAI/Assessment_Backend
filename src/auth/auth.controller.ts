import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GoogleTokenDto } from './dto/google-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('google')
  @ApiOperation({ summary: 'Sign up / Sign in with Google' })
  async loginWithGoogle(@Body() dto: GoogleTokenDto) {
    return this.authService.loginWithGoogle(dto.idToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@CurrentUser('sub') userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) return null;
    const u = user.toObject() as Record<string, unknown>;
    return {
      id: user._id.toHexString(),
      email: u.email,
      displayName: u.displayName,
      picture: u.picture,
      createdAt: u.createdAt,
    };
  }
}
