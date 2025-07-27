import { Request } from 'express';

export function getClientIp(req: Request): string {
    let ip =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || // from proxy
        req.socket?.remoteAddress ||                                          // direct socket
        req.connection?.remoteAddress ||                                      // fallback
        '';

    ip = ip.replace(/^::ffff:/, '');
    return ip;
}
