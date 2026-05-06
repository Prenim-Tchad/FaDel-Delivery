import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request as ExpressRequest } from 'express';
import { UserPayload } from '../../shared/types/auth.types';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { ProfileService } from './profile.service';

interface AuthenticatedRequest extends ExpressRequest {
  user: UserPayload;
}

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({ summary: "Récupérer le profil complet de l'utilisateur" })
  @ApiResponse({ status: 200, description: 'Profil récupéré avec succès' })
  @ApiResponse({ status: 401, description: 'Token invalide' })
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.profileService.getProfile(req.user.sub);
  }

  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch()
  @ApiOperation({ summary: 'Mettre à jour le profil utilisateur' })
  @ApiResponse({ status: 200, description: 'Profil mis à jour' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(req.user.sub, dto);
  }

  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete()
  @ApiOperation({ summary: 'Supprimer le profil utilisateur' })
  @ApiResponse({ status: 200, description: 'Profil supprimé' })
  @ApiResponse({ status: 401, description: 'Token invalide' })
  async deleteProfile(@Request() req: AuthenticatedRequest) {
    return this.profileService.deleteProfile(req.user.sub);
  }
}
