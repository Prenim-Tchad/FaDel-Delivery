import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpStatus,
  HttpCode, // ✅ ajout
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request as ExpressRequest } from 'express';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth.guard';
import { UserPayload } from '../../../shared/types/auth.types';

interface AuthenticatedRequest extends ExpressRequest {
  user: UserPayload;
}

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@Controller('food/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  @HttpCode(HttpStatus.CREATED) // ✅ pas besoin de @HttpCode ici, 201 est le défaut de @Post
  @ApiOperation({
    summary: 'Créer une commande',
    description:
      'Validation complète : disponibilité articles, recalcul frais, vérification promo',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Commande créée avec succès',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides ou règles métier non respectées',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Articles non disponibles ou restaurant fermé',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token JWT manquant ou invalide',
  })
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateOrderDto,
  ) {
    const customerId: string = req.user.sub; // ✅ extraction typée
    return this.orderService.create(customerId, dto);
  }
}
