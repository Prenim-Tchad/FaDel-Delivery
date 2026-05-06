import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { CreateOptionGroupDto } from '../dtos/create-option-group.dto';
import { OptionGroupRepository } from '../repositories/option-group.repository';

@Injectable()
export class OptionGroupService {
  constructor(
    private readonly optionGroupRepository: OptionGroupRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(menuItemId: string, dto: CreateOptionGroupDto) {
    const menuItem = await this.prisma.menuItem.findFirst({
      where: { id: menuItemId, isDeleted: false },
    });

    if (!menuItem) {
      throw new NotFoundException(`Article #${menuItemId} introuvable`);
    }

    return this.optionGroupRepository.create(menuItemId, dto);
  }

  async findAllByMenuItem(menuItemId: string) {
    const menuItem = await this.prisma.menuItem.findFirst({
      where: { id: menuItemId, isDeleted: false },
    });

    if (!menuItem) {
      throw new NotFoundException(`Article #${menuItemId} introuvable`);
    }

    return this.optionGroupRepository.findAllByMenuItem(menuItemId);
  }
}
