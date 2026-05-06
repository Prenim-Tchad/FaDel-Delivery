import { Controller, Post, Get, Body, Param, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OptionItemService } from '../services/option-item.service';
import { CreateOptionItemDto } from '../dtos/create-option-item.dto';

@ApiTags('food - option items')
@ApiBearerAuth('JWT-auth')
@Controller('food')
export class OptionGroupController {
  constructor(private readonly optionItemService: OptionItemService) {}

  @Post('option-groups/:id/options')
  @ApiOperation({
    summary: 'Ajouter une option individuelle à un groupe',
    description:
      "Crée une option (ex: 'Grande', 500 FCFA) dans un groupe existant.",
  })
  @ApiParam({
    name: 'id',
    description: "ID du groupe d'options",
    example: 'clxxx123',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Option créée avec succès',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Groupe d'options introuvable",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
  })
  async create(
    @Param('id') modifierGroupId: string,
    @Body() dto: CreateOptionItemDto,
  ) {
    return this.optionItemService.create(modifierGroupId, dto);
  }

  @Get('option-groups/:id/options')
  @ApiOperation({ summary: "Lister les options d'un groupe" })
  @ApiParam({
    name: 'id',
    description: "ID du groupe d'options",
    example: 'clxxx123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste des options du groupe',
  })
  async findAll(@Param('id') modifierGroupId: string) {
    return this.optionItemService.findAllByGroup(modifierGroupId);
  }
}
