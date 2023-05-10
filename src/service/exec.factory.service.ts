import { Injectable } from '@nestjs/common';
import { socialType } from '../enums';
import { ExecWeiboService } from './exec.weibo.service';
import { IExec } from 'src/interface/IExec';

@Injectable()
export class ExecFacotryService {
  constructor(private readonly execWeiboService: ExecWeiboService) {}

  getExecService(type: socialType): IExec {
    switch (type) {
      case socialType.weibo:
        return this.execWeiboService;
      default:
        throw new Error(
          `${ExecFacotryService.name} socialType not found, type is ${type}`,
        );
    }
  }
}
