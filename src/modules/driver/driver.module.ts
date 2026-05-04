import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
// Pas besoin d'importer RedisModule ici si ton collègue l'a mis en @Global()

@Module({
  controllers: [DriverController],
})
export class DriverModule {}
