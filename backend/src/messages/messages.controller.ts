import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations/my')
  @ApiOperation({ summary: 'Get current user conversations' })
  getMyConversations(@CurrentUser() user: any) {
    return this.messagesService.findMyConversations(user.id);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Get or create a conversation (optionally linked to booking)' })
  getOrCreate(
    @CurrentUser() user: any,
    @Body() body: { bookingId?: number },
  ) {
    return this.messagesService.getOrCreateConversation(user.id, body.bookingId);
  }

  @Get('conversations')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] List all conversations' })
  findAll() {
    return this.messagesService.findAllConversations();
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  getMessages(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.getMessages(id, user.id, user.role);
  }

  @Post('conversations/:id/send')
  @ApiOperation({ summary: 'Send a message in a conversation' })
  sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body() body: { content: string },
  ) {
    const isFromAdmin = user.role === 'ADMIN';
    return this.messagesService.sendMessage(id, user.id, body.content, isFromAdmin);
  }
}
