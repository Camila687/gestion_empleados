import { Controller, Get, Post, Param, UseGuards, Request, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('types')
  findAllTypes() {
    return this.documentsService.findAllTypes();
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('employeeId') employeeId: number,
    @Body('documentTypeId') documentTypeId: number,
    @Request() req,
  ) {
    const isAdmin = req.user.isAdmin;
    
    return this.documentsService.uploadDocument(
      employeeId,
      documentTypeId,
      file,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('employee/:id')
  findAllByEmployee(@Param('id') id: string, @Request() req) {
    return this.documentsService.findAllByEmployee(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/url')
  getDocumentUrl(@Param('documentTypeId') documentTypeId: number, @Param('employeeId') employeeId: number) {
    return this.documentsService.getDocumentUrl(documentTypeId, employeeId);
  }
}