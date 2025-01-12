import { Test, TestingModule } from '@nestjs/testing';
import { PointhistoryController } from './pointhistory.controller';

describe('PointhistoryController', () => {
  let controller: PointhistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointhistoryController],
    }).compile();

    controller = module.get<PointhistoryController>(PointhistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
