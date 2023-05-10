import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfo } from '../db/entitys/user.info.entity';
import { userStatus, userType } from '../enums';

@Injectable()
export class UserInfoService {
  private readonly logger = new Logger(UserInfoService.name);

  constructor(
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
  ) {}

  async create(
    createUserInfoDto: Partial<UserInfo> = {
      status: userStatus.normal,
      user_type: userType.normal,
      create_time: new Date(),
      update_time: new Date(),
    },
  ): Promise<UserInfo> {
    if (
      !createUserInfoDto.email ||
      !createUserInfoDto.password ||
      createUserInfoDto.password.length !== 32
    )
      throw new Error('参数出错');

    const userInfo = this.userInfoRepository.create(createUserInfoDto);
    return await this.userInfoRepository.save(userInfo);
  }

  async findAll(): Promise<UserInfo[]> {
    return await this.userInfoRepository.find();
  }

  async findOneById(id: number): Promise<UserInfo> {
    return await this.userInfoRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<UserInfo> {
    return await this.userInfoRepository.findOne({ where: { email } });
  }

  async update(
    id: number,
    updateUserInfoDto: Partial<UserInfo>,
  ): Promise<UserInfo> {
    const userInfo = await this.userInfoRepository.findOne({ where: { id } });
    if (userInfo) {
      Object.assign(userInfo, updateUserInfoDto);
      return await this.userInfoRepository.save(userInfo);
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    await this.userInfoRepository.delete(id);
  }
}
