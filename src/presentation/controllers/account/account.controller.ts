import { Body, UsePipes, Controller, Get, Post, Param, ParseUUIDPipe, ValidationPipe, Put, Patch, Delete, ParseIntPipe, Query } from '@nestjs/common';

import { AccountService } from '../../../business/services';
import { AccountDto, UpdateAccountDto, AccountTypeDto, PatchAccountTypeDto } from '../../../business/dtos';
import { AccountEntity } from '../../../data/persistence/entities';
import { ParseBoolPipe } from '@nestjs/common/pipes';
import { AccountTypeEntity } from '../../../data/persistence/entities/account-type.entity';
import { PaginationDto } from '../../../business/dtos';

@Controller('account')
export class AccountController {
    constructor(
        private readonly accountService: AccountService) {}

    @Get()
    @UsePipes(new ValidationPipe())
    findAllAccounts(@Query() pagination: PaginationDto|undefined): AccountEntity[] {
        return this.accountService.findAllAccounts(pagination);
    }

    @Get(':id')
    @UsePipes(new ValidationPipe())
    findOneAccountById(@Param('id',ParseUUIDPipe) id: string ): AccountEntity {
        return this.accountService.findOneAccountById(id);
    }

    @Get(':id/balance')
    @UsePipes(new ValidationPipe())
    getBalance(@Param('id',ParseUUIDPipe) id: string ): number {
        return this.accountService.getBalance(id);
    }

    @Patch(':id/balance/add/:amount')
    @UsePipes(new ValidationPipe())
    addBalance(
        @Param('id',ParseUUIDPipe) id: string,
        @Param('amount',ParseIntPipe) amount: number
        ): void {
        this.accountService.addBalance(id, amount);
    }

    @Patch(':id/balance/remove/:amount')
    @UsePipes(new ValidationPipe())
    removeBalance(
        @Param('id',ParseUUIDPipe) id: string,
        @Param('amount',ParseIntPipe) amount: number
        ): void {
        this.accountService.removeBalance(id, amount);
    }

    @Get(':id/balance/verify/:amount')
    @UsePipes(new ValidationPipe())
    verifyAmountIntoBalance(
        @Param('id',ParseUUIDPipe) id: string,
        @Param('amount',ParseIntPipe) amount: number
        ): boolean {
        return this.accountService.verifyAmountIntoBalance(id, amount);
    }

    @Get(':id/state')
    @UsePipes(new ValidationPipe())
    getState(@Param('id',ParseUUIDPipe) id: string ): boolean {
        return this.accountService.getState(id);
    }

    @Patch(':id/state/:bool')
    @UsePipes(new ValidationPipe())
    changeState(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('bool', ParseBoolPipe) bool: boolean ): void {
        return this.accountService.changeState(id, bool);
    }

    @Get(':id/type')
    @UsePipes(new ValidationPipe())
    getAccountType(@Param('id',ParseUUIDPipe) id: string ): AccountTypeEntity {
        return this.accountService.getAccountType(id);
    }

    @Patch(':id/type/:typeid')
    @UsePipes(new ValidationPipe())
    changeAccountType(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('typeid', ParseUUIDPipe) typeId: string ): AccountTypeEntity {
        return this.accountService.changeAccountType(id, typeId);
    }


    @Post()
    @UsePipes(new ValidationPipe())
    createAccount(@Body() account: AccountDto): AccountEntity {
        return this.accountService.createAccount(account);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    updateAccount(@Param('id', ParseUUIDPipe) id: string ,@Body() account: UpdateAccountDto): AccountEntity {
        return this.accountService.updatedAccount(id, account);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    updateSomePropertiesAccount(
        @Param('id', ParseUUIDPipe) id: string ,@Body() account: UpdateAccountDto): AccountEntity {
            return this.accountService.updatedAccount(id, account);
    }

    @Patch(':id/soft')
    @UsePipes(new ValidationPipe())
    softDeleteAccount(@Param('id', ParseUUIDPipe) id: string): string {
        return this.accountService.softDeleteAccount(id);
    }

    @Delete(':id')
    @UsePipes(new ValidationPipe())
    hardDeleteAccount(@Param('id', ParseUUIDPipe) id: string): string {
        return this.accountService.deleteAccount(id);
    }

    @Get('state/:state')
    @UsePipes(new ValidationPipe())
    getAccountsByState(@Param('state', ParseBoolPipe) state: boolean): AccountEntity[] {
        return this.accountService.findAccountsByState(state);
    }

    @Get('customer/:id')
    @UsePipes(new ValidationPipe())
    getAccountsByCustomer(@Param('id', ParseUUIDPipe) id: string): AccountEntity[] {
        return this.accountService.findAccountsByCustomer(id);
    }

    @Get('accounttype/:accountTypeId')
    @UsePipes(new ValidationPipe())
    getAccountsByAccountType(@Param('accountTypeId', ParseUUIDPipe) accountTypeId: string): AccountEntity[] {
        return this.accountService.findAccountsByAccountType(accountTypeId);
    }


    @Post('type')
    @UsePipes(new ValidationPipe())
    createAccountType(@Body() accountType: AccountTypeDto): AccountTypeEntity {
        return this.accountService.createAccountType(accountType);
    }

    @Put('type/:id')
    @UsePipes(new ValidationPipe())
    updateAccountType(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() edit: AccountTypeDto): AccountTypeEntity {
            return this.accountService.updateAccountType(id, edit);
    }

    @Patch('type/:id')
    @UsePipes(new ValidationPipe())
    updateSomePropertiesAccountType(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() edit: PatchAccountTypeDto): AccountTypeEntity {
            return this.accountService.updateAccountType(id, edit);
    }
    
    @Delete('type/:id')
    @UsePipes(new ValidationPipe())
    deleteAccountType(@Param('id', ParseUUIDPipe) id: string): string {
        return this.accountService.deleteAccountType(id);
    }

    @Get('type/all')
    getAllAccountTypes(@Query() pagination: PaginationDto|undefined): AccountTypeEntity[] {
        return this.accountService.findAllAccountTypes(pagination);
    }
    @Get('type/:id')
    @UsePipes(new ValidationPipe())
    getOneAccountType(@Param('id', ParseUUIDPipe) id: string): AccountTypeEntity {
        return this.accountService.findOneAccountType(id);
    }

    @Get('type/state/:state')
    @UsePipes(new ValidationPipe())
    getAccountTypesByState(@Param('state', ParseBoolPipe) state: boolean): AccountTypeEntity[] {
        return this.accountService.findAccountTypesByState(state);
    }

    @Get('type/name/:name')
    @UsePipes(new ValidationPipe())
    getAccountTypesByName(@Param('name') name: string): AccountTypeEntity[] {
        return this.accountService.findAccountTypesByName(name);
    }
}
