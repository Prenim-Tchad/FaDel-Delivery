import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from '../../../shared/types';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        // Pour RS256, nous utilisons une clé publique
        // En production, chargez la clé publique depuis un fichier ou une variable d'environnement
        const publicKey = process.env.JWT_PUBLIC_KEY || 'your-public-key-here';
        done(null, publicKey);
      },
      algorithms: ['RS256'],
    });
  }

  async validate(payload: UserPayload): Promise<any> {
    const user = await this.authService.validateUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }
    return user;
  }
}
