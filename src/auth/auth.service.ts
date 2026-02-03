import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { UsersService, GoogleUserProfile } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { JwtPayload } from '../common/decorators/current-user.decorator';

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.googleClient = new OAuth2Client(clientId);
  }

  async validateGoogleToken(idToken: string): Promise<UserDocument> {
    let ticket;
    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });
    } catch {
      throw new UnauthorizedException('Invalid Google ID token');
    }
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException('Invalid Google token payload');
    }
    const profile: GoogleUserProfile = {
      googleId: payload.sub,
      email: payload.email,
      displayName: payload.name ?? undefined,
      picture: payload.picture ?? undefined,
    };
    return this.usersService.findOrCreateFromGoogle(profile);
  }

  async loginWithGoogle(
    idToken: string,
  ): Promise<{ accessToken: string; user: UserDocument }> {
    const user = await this.validateGoogleToken(idToken);
    const accessToken = this.jwtService.sign({
      sub: user._id.toHexString(),
      email: user.email,
    } as JwtPayload);
    return { accessToken, user };
  }

  async validateJwtPayload(payload: JwtPayload): Promise<UserDocument | null> {
    return this.usersService.findById(payload.sub);
  }
}
