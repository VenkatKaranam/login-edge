import {LoginService} from '../../src/services/loginService';
import {SecurityService} from '../../src/services/securityService';
import {User} from '../../src/models/user';
import Ip from '../../src/models/ip';
import {Request} from 'express';
import {compare} from 'bcrypt';
import * as utils from '../../src/utils/utils';
import * as validation from '../../src/utils/validation';

// Mocking dependencies
jest.mock('../../src/services/securityService');
jest.mock('../../src/models/user');
jest.mock('../../src/models/ip');
jest.mock('bcrypt');
jest.mock('../../src/utils/utils');
jest.mock('../../src/utils/validation');

describe('LoginService', () => {
    let loginService: LoginService;
    let mockSecurityService: jest.Mocked<SecurityService>;
    let mockRequest: Partial<Request>;
    let mockSession: any;
    let mockIp: Partial<Ip>;
    let mockUser: Partial<User>;

    beforeEach(() => {
        // Reset all mocks
        jest.resetAllMocks();

        // Setup mock Security Service
        mockSecurityService = new SecurityService() as jest.Mocked<SecurityService>;
        (SecurityService as jest.MockedClass<typeof SecurityService>).mockImplementation(() => mockSecurityService);

        // Setup mock IP
        mockIp = {
            id: 1,
            ipAddress: '127.0.0.1',
        };

        // Setup mock User
        mockUser = {
            id: 1,
            email: 'test@example.com',
            password: 'hashedPassword',
            suspendedTill: null,
        };

        // Setup mock session
        mockSession = {user: null};

        // Setup mock request
        mockRequest = {
            body: {
                email: 'test@example.com',
                password: 'password123'
            },
            session: mockSession
        };

        // Setup IP find or create
        (Ip.findOrCreate as jest.Mock).mockResolvedValue([mockIp]);

        // Setup getClientIp
        (utils.getClientIp as jest.Mock).mockReturnValue('127.0.0.1');

        // Setup validation
        (validation.validateEmailAndPassword as jest.Mock).mockReturnValue({
            success: true,
            message: 'Successfully validated'
        });

        // Setup security service methods
        mockSecurityService.isIpBlocked = jest.fn().mockResolvedValue(false);
        mockSecurityService.isUserSuspended = jest.fn().mockResolvedValue(false);
        mockSecurityService.recordLoginAttempt = jest.fn().mockResolvedValue(undefined);

        // Setup bcrypt
        (compare as jest.Mock).mockResolvedValue(true);

        // Create login service
        loginService = new LoginService();
    });

    describe('validateLogin', () => {
        it('should return error when IP is blocked', async () => {
            // Setup
            mockSecurityService.isIpBlocked.mockResolvedValue(true);

            // Execute
            const result = await loginService.validateLogin('test@example.com', 'password123', mockIp as Ip);

            // Assert
            expect(result.success).toBe(false);
            expect(result.message).toBe('IP temporarily blocked due to excessive failed login attempts.');
        });

        it('should return error when user is suspended', async () => {
            // Setup
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);
            mockSecurityService.isUserSuspended.mockResolvedValue(true);

            // Execute
            const result = await loginService.validateLogin('test@example.com', 'password123', mockIp as Ip);

            // Assert
            expect(result.success).toBe(false);
            expect(result.message).toBe('Account temporarily suspended due to too many failed attempts.');
        });

        it('should return error when email/password validation fails', async () => {
            // Setup
            (validation.validateEmailAndPassword as jest.Mock).mockReturnValue({
                success: false,
                message: 'Invalid email'
            });

            // Execute
            const result = await loginService.validateLogin('invalid-email', 'password123', mockIp as Ip);

            // Assert
            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid email');
        });

        it('should return error when user is not found', async () => {
            // Setup
            (User.findOne as jest.Mock).mockResolvedValue(null);

            // Execute
            const result = await loginService.validateLogin('nonexistent@example.com', 'password123', mockIp as Ip);

            // Assert
            expect(result.success).toBe(false);
            expect(result.message).toBe('Account not found with this email');
        });


        it('should return error when password is incorrect', async () => {
            // Setup
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);
            (compare as jest.Mock).mockResolvedValue(false);

            // Execute
            const result = await loginService.validateLogin('test@example.com', 'wrongpassword', mockIp as Ip);

            // Assert
            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid credentials');
        });

        it('should return success with user when login is valid', async () => {
            // Setup
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            // Execute
            const result = await loginService.validateLogin('test@example.com', 'password123', mockIp as Ip);

            // Assert
            expect(result.success).toBe(true);
            expect(result.message).toBe('Successfully logged in');
            expect(result.user).toBe(mockUser);
        });

        it('should handle unexpected errors gracefully', async () => {
            // Setup
            const errorMessage = 'Database connection error';
            (User.findOne as jest.Mock).mockRejectedValue(new Error(errorMessage));
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            // Execute
            const result = await loginService.validateLogin('test@example.com', 'password123', mockIp as Ip);

            // Assert
            expect(result.success).toBe(false);
            expect(result.message).toBe('An error occurred during login validation');
            expect(consoleSpy).toHaveBeenCalled();
            expect(consoleSpy.mock.calls[0][0]).toBe('Validation error:');
            consoleSpy.mockRestore();
        });
    });
});
