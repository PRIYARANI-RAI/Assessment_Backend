import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

export interface GoogleUserProfile {
  googleId: string;
  email: string;
  displayName?: string;
  picture?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createFromGoogle(profile: GoogleUserProfile): Promise<UserDocument> {
    const user = new this.userModel({
      googleId: profile.googleId,
      email: profile.email,
      displayName: profile.displayName ?? null,
      picture: profile.picture ?? null,
    });
    return user.save();
  }

  async findOrCreateFromGoogle(profile: GoogleUserProfile): Promise<UserDocument> {
    let user = await this.findByGoogleId(profile.googleId);
    if (!user) {
      user = await this.createFromGoogle(profile);
    }
    return user;
  }
}
