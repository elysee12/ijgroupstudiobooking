import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    try {
      // Increase session max_allowed_packet to 64MB for large base64 strings.
      await this.$executeRawUnsafe('SET SESSION max_allowed_packet = 67108864');
      console.log('✅ MySQL session max_allowed_packet set to 64MB');
    } catch (e) {
      console.warn('⚠️ Could not set MySQL max_allowed_packet session variable:', e.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
