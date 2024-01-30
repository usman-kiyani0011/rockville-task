import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import {
  ChangePasswordRequestDto,
  SignInRequestDto,
  SignUpRequestDto,
  UpdateProfileRequestDto,
  UserRepository,
} from '@shared';
import bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signUp(payload: SignUpRequestDto) {
    const { email, password } = payload;

    try {
      const findEmail = await this.userRepository.findOne(
        { email },
        {},
        { notFoundThrowError: false }
      );
      if (findEmail) {
        throw new ConflictException('Email already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userRepository.create({
        ...payload,
        password: hashedPassword,
      });
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }
  async signIn(payload: SignInRequestDto) {
    const { email, password } = payload;
    try {
      const user = await this.validateUser(email, password);
      console.log('user', user);
      if (!user) throw new UnauthorizedException('Invalid Credentials');
      const payload = { email: user?.email, sub: user?._id };

      return {
        user: user,
        accessToken: this.jwtService.sign(payload,{
          secret:process.env.JWT_SECRET
        }),
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }
  async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOne({ email: username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...restObject } = user;
      return restObject;
    }
    return null;
  }
  async changePassword(payload: ChangePasswordRequestDto) {
    try {
      const { password, newPassword, userId } = payload;
      const user = await this.userRepository.findOne({ _id: userId });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new BadRequestException(`Invalid password`);
      const updatedHash = await bcrypt.hash(newPassword, 10);
      await this.updateUser(userId, {
        password: updatedHash,
      });
      return '';
    } catch (error) {
      throw new RpcException(error);
    }
  }
  async verifyToken({ token }) {
    try {
      const verifiedPayload = await this.jwtService.verify(token,{
        secret:process.env.JWT_SECRET
      });
      if (!verifiedPayload || !verifiedPayload?.sub) {
        throw new UnauthorizedException('Invalid Token');
      }
      const user = await this.userRepository.findOne({
        email: verifiedPayload?.email,
      });
      const { password, ...restObject } = user;
      return restObject;
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async create(payload) {
    try {
      return await this.userRepository.create(payload);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async updateUser(id: string, payload: UpdateProfileRequestDto) {
    try {
      return this.userRepository.findByIdAndUpdate(
        { _id: id },
        { $set: payload }
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
