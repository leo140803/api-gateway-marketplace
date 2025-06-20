import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request, Response } from 'express';
import * as fs from 'fs';

@Controller('/nota')
export class NotaController {
  constructor(
    @Inject('TRANSACTION')
    private readonly transactionClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/*')
  async getNota(@Req() req: Request, @Res() res: Response) {
    try {
      console.log(req.params[0]);
      const id = req.params[0];
      if (!id) {
        return res.status(400).json({ message: 'Transaction ID is required' });
      }

      const filePath: string = await this.transactionClient
        .send({ cmd: 'get:transaction-nota/*' }, { params: { id } })
        .toPromise();

      if (!filePath || !fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Nota file not found' });
      }
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=nota-${id}.pdf`,
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.sendFile(filePath, (err) => {
        if (err) {
          res.status(500).json({ message: 'Error sending file' });
        }
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  }
}
