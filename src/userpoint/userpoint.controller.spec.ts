import { Test, TestingModule } from '@nestjs/testing';
import { UserpointController } from './userpoint.controller';

describe('UserpointController', () => {
  let controller: UserpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserpointController],
    }).compile();

    controller = module.get<UserpointController>(UserpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
