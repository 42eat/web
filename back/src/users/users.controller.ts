import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { usersContract } from "@42eat-web/shared";
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @TsRestHandler(usersContract.getAll)
  public async getAll() {
    return tsRestHandler(usersContract.getAll, async () => {
      const members = await this.usersService.getAll();
      return { status: 200 as const, body: members };
    });
  }
}


// import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
// import { Member } from '../generated/prisma/client';
// import { UsersService } from './users.service';

// @Controller('users')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   @Get('all')
//   @HttpCode(HttpStatus.OK)
//   public async getAll(): Promise<Member[]> {
//     return this.usersService.getAll();
//   }
// }
