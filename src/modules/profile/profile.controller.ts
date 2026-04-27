import { Body, Controller, Delete, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(SupabaseAuthGuard)
  @Get()
  async getProfile(@Request() req) {
    return this.profileService.getProfile(req.user.id);
  }

  @UseGuards(SupabaseAuthGuard)
  @Patch()
  async updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(req.user.id, dto);
  }

  @UseGuards(SupabaseAuthGuard)
  @Delete()
  async deleteProfile(@Request() req) {
    return this.profileService.deleteProfile(req.user.id);
  }
}
