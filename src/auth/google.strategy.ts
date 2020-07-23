import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { AuthService, Provider } from "./auth.service";
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
{
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            clientID: process.env.G_CLIENT_ID, 
            clientSecret: process.env.G_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback',
            passReqToCallback: true,
            scope: ['profile']
        })
    }


    async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function) {
        try {
            console.log(profile);

            const jwt: string = await this.authService.validateOAuthLogin(profile.id, Provider.GOOGLE);
            const user =
            {
                jwt
            }

            done(null, user);
        }
        catch (err) {
            done(err, false);
        }
    }

}