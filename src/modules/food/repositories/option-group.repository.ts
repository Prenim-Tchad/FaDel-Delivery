import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import {
  CreateOptionGroupDto,
  SelectionType,
} from '../dtos/create-option-group.dto';

@Injectable()
export class OptionGroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(menuItemId: string, dto: CreateOptionGroupDto) {
    return this.prisma.menuModifierGroup.create({
      data: {
        menuItemId,
        name: dto.name, // ou ce que tu as déjà
        type: dto.selectionType ?? SelectionType.SINGLE,
        minSelections: 0,
        maxSelections: dto.selectionType === SelectionType.SINGLE ? 1 : null,
        options: {
          create: dto.options.map((opt, index) => ({
            name: opt.name,
            price: opt.additionalPrice ?? 0,
            sortOrder: index,
          })),
        },
      },
      include: { options: true },
    });
  }

  async findAllByMenuItem(menuItemId: string) {
    return this.prisma.menuModifierGroup.findMany({
      where: { menuItemId },
      include: {
        options: {
          where: { isAvailable: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
