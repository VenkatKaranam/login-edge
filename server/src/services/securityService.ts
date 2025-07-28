import { Op } from 'sequelize';
import Ip from '../models/ip';
import UserLoginAttempt from '../models/userLoginAttempt';
import { User } from '../models/user';
import { AUTH_CONFIG } from '../config/authConfig';
import { getDateMinutesAgo, getDateMinutesLater } from '../utils/dateUtils';

/**
 * Security service for managing login attempt security
 */
export class SecurityService {
  /**
   * Check if an IP is currently blocked or should be blocked
   */
  public async isIpBlocked(ip: Ip): Promise<boolean> {
    const now = new Date();

    // Check if IP is already blocked
    if (ip.blockedTill && ip.blockedTill >= now) {
      return true;
    }

    const windowStart = getDateMinutesAgo(AUTH_CONFIG.WINDOW_MINUTES);

    const failedAttempts = await UserLoginAttempt.findAll({
      where: {
        ipId: ip.id,
        success: false,
        createdAt: {
          [Op.gte]: windowStart
        }
      }
    });

    // Block IP if too many failed attempts
    if (failedAttempts.length >= AUTH_CONFIG.MAX_IP_ATTEMPTS) {
      const blockUntil = getDateMinutesLater(AUTH_CONFIG.LOCK_MINUTES);
      await ip.update({ blockedTill: blockUntil });
      return true
    }

    return false;
  }

  /**
   * Check if a user account is suspended or should be suspended
   */
  public async isUserSuspended(user: User): Promise<Boolean> {
    const now = new Date();

    // Check if user is already suspended
    if (user.suspendedTill && user.suspendedTill >= now) {
      return true;
    }

    // Check failed attempts within window
    const windowStart = getDateMinutesAgo(AUTH_CONFIG.WINDOW_MINUTES);

    const failedAttempts = await UserLoginAttempt.findAll({
      where: {
        userId: user.id,
        success: false,
        createdAt: {
          [Op.gte]: windowStart
        }
      }
    });

    // Suspend user if too many failed attempts
    if (failedAttempts.length >= AUTH_CONFIG.MAX_USER_ATTEMPTS) {
      const suspendUntil = getDateMinutesLater(AUTH_CONFIG.LOCK_MINUTES);
      await user.update({ suspendedTill: suspendUntil });
      return true;
    }

    return false;
  }

  /**
   * Record a login attempt
   */
  public async recordLoginAttempt(userId: number | undefined, ipId: number, success: boolean): Promise<void> {
    await UserLoginAttempt.create({
      userId,
      ipId,
      success
    });
  }
}
