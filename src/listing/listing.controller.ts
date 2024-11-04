import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingService } from './listing.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post()
  create(@Body() createListingDto: CreateListingDto) {
    return this.listingService.create(createListingDto);
  }

  @Post('user')
  @UseGuards(AuthGuard)
  createUserListing(@Req() req) {
    const id = req.id;
    return this.listingService.createUserListing(id);
  }

  @Get('/owner/:id')
  @UseGuards(AuthGuard)
  findByOwner(@Req() req) {
    const id = req.id;
    return this.listingService.findByOwner(id);
  }

  @Get()
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.listingService.findByCategory(category);
    }
    return this.listingService.findAll();
  }

  @Get('verified')
  GetVerifiedListings(@Query('category') category?: string) {
    if (category) {
      return this.listingService.findByCategory(category);
    }
    return this.listingService.findVerified();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingService.findOne(id);
  }

  
  @Put(':id')
  update(@Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
    return this.listingService.update(id, updateListingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingService.remove(id);
  }

  @Get('hosting/listings')
  @UseGuards(AuthGuard)
  async findAllByUserId(@Req() req) {
    const hostId = req.id;
    return this.listingService.findByUserId(hostId);
  }
}
