import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { OptionItemRepository } from '../repositories/option-item.repository';
import { CreateOptionItemDto } from '../dtos/create-option-item.dto';

@Injectable()
export class OptionItemService {
  constructor(
    private readonly optionItemRepository: OptionItemRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(modifierGroupId: string, dto: CreateOptionItemDto) {
    const group = await this.prisma.menuModifierGroup.findUnique({
      where: { id: modifierGroupId },
    });

    if (!group) {
      throw new NotFoundException(
        `Groupe d'options #${modifierGroupId} introuvable`,
      );
    }

    return this.optionItemRepository.create(modifierGroupId, dto);
  }

  async findAllByGroup(modifierGroupId: string) {
    const group = await this.prisma.menuModifierGroup.findUnique({
      where: { id: modifierGroupId },
    });

    if (!group) {
      throw new NotFoundException(
        `Groupe d'options #${modifierGroupId} introuvable`,
      );
    }

    return this.optionItemRepository.findAllByGroup(modifierGroupId);
  }
}
