// Libraries
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

  // Data transfer objects
  import { SignOutDto, SignUpDto, SignInDto } from '../../dtos';

  // Models
  
  // Repositories
  import { AccountTypeRepository, CustomerRepository, DocumentTypeRepository } from '../../../data/persistence/repositories';
  
  // Services
  import { AccountService } from '../../services';
  
  // Entities
  import {
    CustomerEntity,
  } from '../../../data/persistence/entities';
  
  @Injectable()
  export class SecurityService {
    constructor(
      private readonly customerRepository: CustomerRepository,
      private readonly documentTypeRepository: DocumentTypeRepository,
      private readonly accountTypeRepository: AccountTypeRepository,
      private readonly accountService: AccountService,
      private jwtService: JwtService
    ) {}
  
    /**
     * Identificarse en el sistema
     */
    signIn(user: SignInDto): string {
      const answer = this.customerRepository.findOneByEmailAndPassword(
        user.username,
        user.password,
      );
      const token: string = this.jwtService.sign({username: user.username, password: user.password});

      if (answer) return token;
      else throw new UnauthorizedException();
    }
  
    /**
     * Crear usuario en el sistema
     */
    signUp(user: SignUpDto): string {
      
      const documentType = this.documentTypeRepository.findOneById(user.documentTypeId)

      const newCustomer = new CustomerEntity();
      newCustomer.documentType = documentType;
      newCustomer.document = user.document;
      newCustomer.fullName = user.fullName;
      newCustomer.email = user.email;
      newCustomer.phone = user.phone;
      newCustomer.password = user.password;
      
      const customer = this.customerRepository.register(newCustomer);
  
      if (customer) {
        
        const newAccount = { 
          customer: customer.id,
          accountType: user.accountTypeId,
        };
        
        const account = this.accountService.createAccount(newAccount);
        
        const token: string = this.jwtService.sign({id: account.id});
        
        if (account) return token;
        else throw new InternalServerErrorException({statusCode: 500, message: 'account cannot be created'});
      } else throw new InternalServerErrorException({statusCode: 500, message: 'Customer cannot be register'});
    }
  
    /**
     * Salir del sistema
     */
    signOut(JWToken: SignOutDto): void {
      const customer = this.jwtService.verify(JWToken.jwt);
      
      if(customer) {
        const answer = this.customerRepository.findOneByEmailAndPassword(
          customer.username,
          customer.password,
        );

        if(answer) console.log('The user signed out');
      }
      else throw new InternalServerErrorException();
    }
    
  }