import { CustomResponse, LoginValidation } from '../types/commonTypes';
import { User } from '../models/user';
import Ip from '../models/ip';
import bcrypt from 'bcryptjs';
import { Request } from 'express';
import { getClientIp } from '../utils/utils';
import { validateEmailAndPassword } from '../utils/validation';
import { SecurityService } from './securityService';

export class LoginService {
  private securityService: SecurityService;

  constructor() {
    this.securityService = new SecurityService();
  }

  public async login(req: Request): Promise<CustomResponse> {
      const { email, password } = req.body;

      const ipAddress = getClientIp(req);
      if (!ipAddress) {
        return {
          success: false,
          message: 'Unable to get IP address'
        };
      }

      const [ipRecord] = await Ip.findOrCreate({
        where: { ipAddress }
      });

      const validation = await this.validateLogin(email, password, ipRecord);

      await this.securityService.recordLoginAttempt(
        validation.user?.id,
        ipRecord.id,
        validation.success
      );

      if (!validation.success) {
        return {
          success: false,
          message: validation.message
        };
      }

      req.session.user = validation.user;

      return {
        success: true,
        message: 'Successfully logged in'
      };
  }

  public async validateLogin(email: string, password: string, ip: Ip): Promise<LoginValidation> {
    const response: LoginValidation = {
      success: false,
      message: 'Something went wrong!'
    };

    try {
      const isIpBlocked = await this.securityService.isIpBlocked(ip);
      if (isIpBlocked) {
        response.message = 'IP temporarily blocked due to excessive failed login attempts.';
        return response;
      }

      const validation = validateEmailAndPassword(email, password);
      if (!validation.success) {
        response.message = validation.message;
        return response;
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        response.message = 'Account not found with this email';
        return response;
      }

      const isUserSuspended = await this.securityService.isUserSuspended(user);
      if (isUserSuspended) {
        response.message = 'Account temporarily suspended due to too many failed attempts.';
        return response;
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        response.message = 'Invalid credentials';
        return response;
      }

      response.success = true;
      response.message = 'Successfully logged in';
      response.user = user;

      return response;
    } catch (error) {
      console.error('Validation error:', error);
      response.message = 'An error occurred during login validation';
      return response;
    }
  }
}