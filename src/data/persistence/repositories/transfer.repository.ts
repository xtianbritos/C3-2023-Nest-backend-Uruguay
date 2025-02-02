import { Injectable, NotFoundException } from '@nestjs/common';

import { TransferEntity } from '../entities';
import { BaseRepository } from './base';
import { TransferRepositoryInterface } from './interfaces/';

@Injectable()
export class TransferRepository
    extends BaseRepository<TransferEntity>
    implements TransferRepositoryInterface {


    register(entity: TransferEntity): TransferEntity {
        this.database.push(entity);
        return this.database.at(-1) ?? entity;
    }

    update(id: string, entity: TransferEntity): TransferEntity {
        const indexCurrentEntity = this.database.findIndex(
            (item) => item.id === id && typeof item.deletedAt === 'undefined'
        );
        if (indexCurrentEntity === -1) throw new NotFoundException();
        return this.database[indexCurrentEntity] = {
            ...this.database[indexCurrentEntity],
            ...entity,
            id,
        } as TransferEntity;
    }

    delete(id: string, soft?: boolean): string {
        const indexCurrentEntity = this.database.findIndex(
            (item) => item.id === id && typeof item.deletedAt === 'undefined',
        );
        if (indexCurrentEntity === -1) throw new NotFoundException();
        
        if(soft) {
            return this.softDelete(indexCurrentEntity);
        }
        return this.hardDelete(indexCurrentEntity);
    }

    private hardDelete(index: number): string {
        try {
            this.database.splice(index, 1);
        } catch (error) {
            return 'The transfer could not be deleted';
        }
        return 'The transfer was successfully deleted';
    }

    private softDelete(index: number): string {
        this.database[index].deletedAt = Date.now();

        if(this.database[index].deletedAt) return 'The transfer was successfully soft deleted'
        return 'The transfer could not be soft deleted';
    }

    findAll(): TransferEntity[] {
        return this.database.filter(
            (item) => typeof item.deletedAt === 'undefined',
        );
    }

    findOneById(id: string): TransferEntity {
        const currentEntity = this.database.find(
            (item) => item.id === id && typeof item.deletedAt === 'undefined',
        );
        if (currentEntity) return currentEntity;
        throw new NotFoundException();
    }

    findOutcomeByDataRange(
        accountId: string,
        dateInit: Date | number,
        dateEnd: Date | number,
    ): TransferEntity[] {
        const transfers = this.database.filter(
            (transfer) => transfer.outcome.id === accountId
                && transfer.dateTime >= dateInit
                && transfer.dateTime <= dateEnd
                && typeof transfer.deletedAt === 'undefined');
        if (transfers) return transfers;
        throw new NotFoundException();
    }

    findIncomeByDataRange(
        accountId: string,
        dateInit: Date | number,
        dateEnd: Date | number,
    ): TransferEntity[] {
        const transfers = this.database.filter(
            (transfer) => transfer.income.id === accountId
                && transfer.dateTime >= dateInit
                && transfer.dateTime <= dateEnd
                && typeof transfer.deletedAt === 'undefined');
        if (transfers) return transfers;
        throw new NotFoundException();
    }
}