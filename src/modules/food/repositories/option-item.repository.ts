import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { CreateOptionItemDto } from '../dtos/create-option-item.dto';

@Injectable()
export class OptionItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(modifierGroupId: string, dto: CreateOptionItemDto) {
    const existingCount = await this.prisma.menuModifierOption.count({
      where: { modifierGroupId },
    });

    return this.prisma.menuModifierOption.create({
      data: {
        modifierGroupId,
        name: dto.name,
        price: dto.additionalPrice ?? 0,
        isAvailable: dto.isAvailable ?? true,
        sortOrder: existingCount,
      },
    });
  }

  async findAllByGroup(modifierGroupId: string) {
    return this.prisma.menuModifierOption.findMany({
      where: { modifierGroupId },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
