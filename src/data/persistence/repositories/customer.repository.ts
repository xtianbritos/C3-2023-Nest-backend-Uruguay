import { Injectable, NotFoundException } from '@nestjs/common';

import { CustomerEntity } from '../entities';
import { BaseRepository } from './base';
import { CustomerRepositoryInterface } from './interfaces';
import { ObservableHandler } from '../../../business/observable/observable-handler';

@Injectable()
export class CustomerRepository
  extends BaseRepository<CustomerEntity>
  implements CustomerRepositoryInterface {
    constructor(private readonly observableHandler: ObservableHandler) {
      super();
    }

  register(entity: CustomerEntity): CustomerEntity {
    this.database.push(entity);
    return this.database.at(-1) ?? entity;
  }

  update(id: string, entity: CustomerEntity): CustomerEntity {
    const indexCurrentEntity = this.database.findIndex(
      (item) => item.id === id && typeof item.deletedAt === 'undefined'
    );
    if (indexCurrentEntity >= 0)
      this.database[indexCurrentEntity] = {
        ...this.database[indexCurrentEntity],
        ...entity,
        id
      } as CustomerEntity;
    else throw new NotFoundException();
    return this.database[indexCurrentEntity];
  }

  delete(id: string, soft?: boolean): void {
    const indexCurrentEntity = this.database.findIndex(
      (item) => item.id === id && typeof item.deletedAt === 'undefined'
    );
    if(indexCurrentEntity === -1) throw new NotFoundException();

    if(soft) {
      this.database[indexCurrentEntity].deletedAt = new Date();
      this.observableHandler.handle(this.database[indexCurrentEntity]).subscribe(customer => console.log(customer));
    }
    else {
      this.database.splice(indexCurrentEntity, 1);
    }
  }

  findAll(): CustomerEntity[] {
    return this.database.filter(
      (item) => typeof item.deletedAt === 'undefined'
    );
  }

  findOneById(id: string): CustomerEntity {
    const currentEntity = this.database.find(
      (item) => item.id === id && typeof item.deletedAt === 'undefined'
    );
    if (currentEntity) return currentEntity;
    throw new NotFoundException('The customer with this id does not exist');
  }

  findOneByEmailAndPassword(email: string, password: string): boolean {
    const indexCurrentEntity = this.database.findIndex(
      (item) =>
        item.email === email &&
        item.password === password &&
        typeof item.deletedAt === 'undefined'
    );
    return indexCurrentEntity === -1 ? false : true;
  }

  findOneByDocumentTypeAndDocument(
    documentTypeId: string,
    document: string,
  ): CustomerEntity {
    const currentEntity = this.database.find(
      (item) =>
      item.documentType.id === documentTypeId
      && item.document === document
      && typeof item.deletedAt === 'undefined');
    if (currentEntity) return currentEntity;
    throw new NotFoundException();
  }

  findOneByEmail(email: string): CustomerEntity {
    const currentEntity = this.database.find(
      (item) => item.email === email && typeof item.deletedAt === 'undefined');
    if (currentEntity) return currentEntity;
    throw new NotFoundException();
  }

  findOneByPhone(phone: string): CustomerEntity {
    const currentEntity = this.database.find(
      (item) => item.phone === phone && typeof item.deletedAt === 'undefined');
    if (currentEntity) return currentEntity;
    throw new NotFoundException();
  }

  findByState(state: boolean): CustomerEntity[] {
    const currentEntities = this.database.filter(
      (item) => item.state === state && typeof item.deletedAt === 'undefined');
   if (currentEntities) return currentEntities;
   throw new NotFoundException();
  }

  findByFullName(fullName: string): CustomerEntity[] {
    const currentEntities = this.database.filter(
      (item) => item.fullName === fullName && typeof item.deletedAt === 'undefined');
    if (currentEntities) return currentEntities;
    throw new NotFoundException();
  }
}