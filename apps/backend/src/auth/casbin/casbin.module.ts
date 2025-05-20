import { Module, Global } from '@nestjs/common';
import { join } from 'path';
import { newEnforcer } from 'casbin';
import { CasbinService } from '.';

@Global()
@Module({
  providers: [
    {
      provide: CasbinService,
      useFactory: async () => {
        const enforcer = await newEnforcer(
          join(__dirname, '../../../resources/casbin/model.conf'),
          join(__dirname, '../../../resources/casbin/policy.csv'),
        );
        await enforcer.loadPolicy();
        enforcer.enableAutoSave(true);
        return new CasbinService(enforcer);
      },
    },
  ],
  exports: [CasbinService],
})
export class CasbinConfigModule {}
