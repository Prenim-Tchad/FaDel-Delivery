import { Body, Controller, Delete, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({ summary: 'Récupérer le profil complet de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Profil récupéré avec succès' })
  @ApiResponse({ status: 401, description: 'Token invalide' })
  async getProfile(@Request() req) {
    return this.profileService.getProfile(req.user.id);
  }

  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch()
  @ApiOperation({ summary: 'Mettre à jour le profil utilisateur' })
  @ApiResponse({ status: 200, description: 'Profil mis à jour' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(req.user.id, dto);
  }

  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete()
  @ApiOperation({ summary: 'Supprimer le profil utilisateur' })
  @ApiResponse({ status: 200, description: 'Profil supprimé' })
  @ApiResponse({ status: 401, description: 'Token invalide' })
  async deleteProfile(@Request() req) {
    return this.profileService.deleteProfile(req.user.id);
  }
}
