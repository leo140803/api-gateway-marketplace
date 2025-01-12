import { Test, TestingModule } from '@nestjs/testing';
import { GoldpriceController } from './goldprice.controller';

describe('GoldpriceController', () => {
  let controller: GoldpriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoldpriceController],
    }).compile();

    controller = module.get<GoldpriceController>(GoldpriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
