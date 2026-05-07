import { Buffer } from 'node:buffer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

type UploadImageParams = {
  bucket: string;
  path: string;
  file: Buffer;
  contentType: string;
};

@Injectable()
export class SupabaseService {
  private clientInstance?: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  async uploadImage({ bucket, path, file, contentType }: UploadImageParams) {
    const supabase = this.getClient();
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType,
      upsert: false,
    });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to upload image to storage: ${error.message}`,
      );
    }
  }

  getPublicUrl(bucket: string, path: string) {
    const supabase = this.getClient();
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async removeFiles(bucket: string, paths: string[]) {
    if (paths.length === 0) {
      return;
    }

    const supabase = this.getClient();
    const { error } = await supabase.storage.from(bucket).remove(paths);

    if (error) {
      throw new InternalServerErrorException(
        `Failed to remove image from storage: ${error.message}`,
      );
    }
  }

  private getClient() {
    if (this.clientInstance) {
      return this.clientInstance;
    }

    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const serviceRoleKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (!supabaseUrl || !serviceRoleKey) {
      throw new InternalServerErrorException(
        'Supabase environment variables are not configured.',
      );
    }

    this.clientInstance = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    return this.clientInstance;
  }
}
