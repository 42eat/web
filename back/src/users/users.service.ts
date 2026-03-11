import { Injectable } from '@nestjs/common';
import { Member } from '../generated/prisma/client';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  public async getAll(): Promise<Member[]> {
    return (await this.prisma.member.findMany()).map((m) => (m));
  }
}