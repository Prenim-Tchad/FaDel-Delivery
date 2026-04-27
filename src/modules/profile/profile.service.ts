import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../auth/auth.constants';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabaseClient: SupabaseClient,
  ) {}

  async getProfile(userId: string) {
    const { data, error } = await this.supabaseClient.auth.admin.getUserById(userId);

    if (error || !data.user) {
      throw new BadRequestException('Impossible de récupérer le profil.');
    }

    const metadata = data.user.user_metadata || {};

    return {
      id: data.user.id,
      email: data.user.email,
      nom: metadata.nom || '',
      prenom: metadata.prenom || '',
      phone: metadata.phone || '',
      quartier: metadata.quartier || '',
      confirmedAt: data.user.confirmed_at,
      createdAt: data.user.created_at,
      updatedAt: data.user.updated_at,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const { nom, prenom, phone, quartier } = dto;

    // Récupérer les métadonnées actuelles
    const { data: currentUser, error: getError } = await this.supabaseClient.auth.admin.getUserById(userId);

    if (getError || !currentUser.user) {
      throw new BadRequestException('Utilisateur non trouvé.');
    }

    const currentMetadata = currentUser.user.user_metadata || {};

    // Fusionner les nouvelles données avec les existantes
    const updatedMetadata = {
      ...currentMetadata,
      ...(nom !== undefined && { nom }),
      ...(prenom !== undefined && { prenom }),
      ...(phone !== undefined && { phone }),
      ...(quartier !== undefined && { quartier }),
    };

    const { data, error } = await this.supabaseClient.auth.admin.updateUserById(userId, {
      user_metadata: updatedMetadata,
    });

    if (error || !data.user) {
      throw new BadRequestException('Impossible de mettre à jour le profil.');
    }

    return {
      id: data.user.id,
      email: data.user.email,
      nom: updatedMetadata.nom || '',
      prenom: updatedMetadata.prenom || '',
      phone: updatedMetadata.phone || '',
      quartier: updatedMetadata.quartier || '',
      updatedAt: data.user.updated_at,
    };
  }

  async deleteProfile(userId: string) {
    const { error } = await this.supabaseClient.auth.admin.deleteUser(userId);

    if (error) {
      throw new BadRequestException('Impossible de supprimer le profil.');
    }

    return { message: 'Profil supprimé avec succès.' };
  }
}
