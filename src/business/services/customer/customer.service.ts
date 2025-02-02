import { HttpException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { CustomerEntity, DocumentTypeEntity } from '../../../data/persistence/entities';
import { CustomerRepository, DocumentTypeRepository } from '../../../data/persistence/repositories';
import { PaginationDto, CustomerDto, DocumentTypeDto, UpdateCustomerDto } from '../../dtos';
import { PAtchDocumentTypeDto } from '../../dtos/patch-document-type.dto';
import { AccountService } from '../../services';

@Injectable()
export class CustomerService {

  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly documentTypeRepository: DocumentTypeRepository,
    private readonly accountService: AccountService) {}

  /**
   * Crear una cliente
   */
  createCustomer(customer: CustomerDto): CustomerEntity {

    let documentTypeExisting = this.documentTypeRepository.findOneById(customer.documentType);
    if(documentTypeExisting.state === false) throw new NotFoundException('DocumentType is not available');

    let documentExisting = this.customerRepository.findAll()
      .findIndex(customerExisting => customerExisting.document === customer.document);
    if(documentExisting != -1) throw new ForbiddenException('This document is already used by another costumer');
    
    let emailExisting = this.customerRepository.findAll()
      .findIndex(customerExisting => customerExisting.email === customer.email);
    if(emailExisting != -1) throw new ForbiddenException('This email is already used by another costumer');

    let phoneExisting = this.customerRepository.findAll()
      .findIndex(customerExisting => customerExisting.phone === customer.phone);
    if(phoneExisting != -1) throw new ForbiddenException('This phone is already used by another costumer');
    
    const newACustomer = new CustomerEntity();
    
    newACustomer.fullName = customer.fullName;
    newACustomer.document = customer.document;
    newACustomer.documentType = documentTypeExisting;
    newACustomer.email = customer.email;
    newACustomer.password = customer.password;
    newACustomer.phone = customer.phone;
    if(customer.avatarUrl) newACustomer.avatarUrl = customer.avatarUrl;

    return this.customerRepository.register(newACustomer);
  }

  /**
   * Obtener información de un cliente
   */
  getCustomerInfo(customerId: string): CustomerEntity {
    const customer = this.customerRepository.findOneById(customerId);
    return customer;
  }

  /**
   * Actualizar información de un cliente
   */
  updatedCustomer(id: string, customer: UpdateCustomerDto): CustomerEntity {
    let customerUpdated = this.customerRepository.findOneById(id);
    
    if(customer.document){
      let documentExisting = this.customerRepository.findAll()
      .findIndex(customerExisting => customerExisting.document === customer.document);
      if(documentExisting != -1) throw new ForbiddenException('This document is already used by another costumer');
      customerUpdated.document = customer.document;
    }

    if(customer.documentType) {
      let documentTypeExisting = this.documentTypeRepository.findOneById(customer.documentType);
      if(documentTypeExisting.state === false) throw new NotFoundException('DocumentType is not available');
      customerUpdated.documentType = documentTypeExisting;
    }
    
    if(customer.email) {
      let emailExisting = this.customerRepository.findAll()
      .findIndex(customerExisting => customerExisting.email === customer.email);
      if(emailExisting != -1) throw new ForbiddenException('This email is already used by another costumer');
      customerUpdated.email = customer.email;
    }

    if(customer.phone) {
      let phoneExisting = this.customerRepository.findAll()
        .findIndex(customerExisting => customerExisting.phone === customer.phone);
      if(phoneExisting != -1) throw new ForbiddenException('This phone is already used by another costumer');
      customerUpdated.phone = customer.phone;
    }

    if(customer.fullName) customerUpdated.fullName = customer.fullName;
    if(customer.password) customerUpdated.password = customer.password;
    if(customer.state != undefined) customerUpdated.state = customer.state;
    if(customer.avatarUrl) customerUpdated.avatarUrl = customer.avatarUrl;
    if(customer.daletedAt) customerUpdated.deletedAt = customer.daletedAt;
    
    return this.customerRepository.update(id, customerUpdated);
  }

  /**
   * Dar de baja a un cliente en el sistema
   */
  unsubscribe(id: string): boolean {
    let customerUpdated = this.customerRepository.findOneById(id);
    if(customerUpdated.state) {
      customerUpdated.state = false;
      this.customerRepository.update(id, customerUpdated);
      return true;
    }
    return false;
  }
  
  /**
   * Borrar un cliente
   */
  deleteCustomer(customerId: string): string {
    let accounts = this.accountService.findAllAccounts();
    let accountsCustomerWithBalance = accounts.filter(account => 
      account.customer.id === customerId && account.balance > 0);

    if(accountsCustomerWithBalance.length > 0) {
      throw new ForbiddenException('The customer has at least one account with balance');
    }

    return this.customerRepository.delete(customerId);
  }
  
  /**
   * Borrar un cliente de forma lógica
   */
  softDeleteCustomer(customerId: string): string {
    let accounts = this.accountService.findAllAccounts();
    let accountsCustomerWithBalance = accounts.filter(account => 
      account.customer.id === customerId && account.balance > 0);

    if(accountsCustomerWithBalance.length > 0) {
      throw new ForbiddenException('The customer has at least one account with balance');
    }

    return this.customerRepository.delete(customerId, true);
  }

  /**
   * Obtener la lista de clientes
   */
  findAllCustomers(pagination?: PaginationDto): CustomerEntity[] {
    const customers = this.customerRepository.findAll();
    let customersPaginated = customers;

    if(pagination?.offset) {
      return customersPaginated = customersPaginated.slice(pagination.offset, pagination.limit || undefined);;
    }
    return customersPaginated;
  }

  /**
   * Cambiar el estado de un cliente
   */
  changeState(customerId: string, state: boolean): void {
    try {
      let customerUpdated = this.customerRepository.findOneById(customerId);
      customerUpdated.state = state;
      this.customerRepository.update(customerId, customerUpdated);

    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }


  findOneByEmailAndPassword(email: string, password: string): boolean {
    return this.customerRepository.findOneByEmailAndPassword(email, password);
  }

  findOneByDocumentTypeAndDocument(documentTypeId: string, document: string): CustomerEntity {
    return this.customerRepository.findOneByDocumentTypeAndDocument(documentTypeId, document);
  }

  findOneByEmail(email: string): CustomerEntity {
    return this.customerRepository.findOneByEmail(email);
  }

  findOneByPhone(phone: string): CustomerEntity {
    return this.customerRepository.findOneByPhone(phone);
  }

  findByState(state: boolean): CustomerEntity[] {
    return this.customerRepository.findByState(state);
  }

  findByFullName(fullName: string): CustomerEntity[] {
    return this.customerRepository.findByFullName(fullName);
  }


  
  createDocumentType(dto: DocumentTypeDto): DocumentTypeEntity {
    let newDocumentType = new DocumentTypeEntity();

    newDocumentType.name = dto.name;
    if(dto.state != undefined) newDocumentType.state = dto.state;

    this.documentTypeRepository.register(newDocumentType);

    return newDocumentType;
  }

  updateDocumentType(id: string, dto: DocumentTypeDto | PAtchDocumentTypeDto): DocumentTypeEntity {
    let documentTypeUpdated = this.documentTypeRepository.findOneById(id);
    
    if(dto.name) documentTypeUpdated.name = dto.name;
    if(dto.state != undefined) documentTypeUpdated.state = dto.state;

    return this.documentTypeRepository.update(id, documentTypeUpdated);
  }

  deleteDocumentType(id: string): string {
    this.documentTypeRepository.delete(id);
    return 'Document type was successfully deleted';
  }

  findAllDocumentType(pagination?: PaginationDto): DocumentTypeEntity[] {
    let allDocumentTypes = this.documentTypeRepository.findAll();

    let ocumentTypesPaginated = allDocumentTypes;

    if(pagination?.offset) {
      return ocumentTypesPaginated = ocumentTypesPaginated.slice(pagination.offset, pagination.limit || undefined);;
    }
    return ocumentTypesPaginated;
  }

  findOneDocumentType(id: string): DocumentTypeEntity {
    return this.documentTypeRepository.findOneById(id);
  }

  findDocumentTypesByState(state: boolean): DocumentTypeEntity[] {
    return this.documentTypeRepository.findByState(state);
  }
  
  findDocumentTypesByName(name: string): DocumentTypeEntity[] {
    return this.documentTypeRepository.findByName(name);
  }
}