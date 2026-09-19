import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { PrismaModule } from './common/prisma/prisma.module';
import { TextEngineModule } from './modules/text-engine/text-engine.module';
import { FileParserModule } from './modules/file-parser/file-parser.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    PrismaModule,
    TextEngineModule,
    FileParserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
