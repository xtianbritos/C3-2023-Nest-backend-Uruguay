// Libraries
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ObservableHandler } from '../../observable';

  // Data transfer objects
  import { AccountDto, CustomerDto, SignOutDto, SignUpDto, SignInDto } from '../../dtos';

  // Models
  
  // Repositories
  
  // Services
  import { AccountService, CustomerService } from '../../services';
import { NotFoundException } from '@nestjs/common';
  
  // Entities
  
  @Injectable()
  export class SecurityService extends ObservableHandler{
    constructor(
      private readonly accountService: AccountService,
      private readonly customerService: CustomerService,
      private jwtService: JwtService
    ) {
      super();
    }
  
    /**
     * Identificarse en el sistema
     */
    signIn(user: SignInDto): Object {
      
      const answer = this.customerService.findOneByEmailAndPassword(
        user.username,
        user.password
      );
      const token: string = this.jwtService.sign({username: user.username, password: user.password});

      if (answer) return {jwt: token};
      else throw new UnauthorizedException();
    }
  
    /**
     * Crear usuario en el sistema
     */
    signUp(user: SignUpDto): Object {
    
      const newCustomer: CustomerDto = {
        documentType: user.documentTypeId,
        document: user.document,
        fullName: user.fullName,
        email: user.email,
        phone:user.phone,
        password: user.password,
        avatarUrl: undefined
      };
      
      const customer = this.customerService.createCustomer(newCustomer);
  
      if (customer) {
        
        const newAccount: AccountDto = { 
          customer: customer.id,
          accountType: user.accountTypeId,
        };
        
        const account = this.accountService.createAccount(newAccount);

        this.handle(account).subscribe(account => console.log(account));
        
        const token: string = this.jwtService.sign({id: account.id});
        
        if (account) return {jwt: token};
        else throw new InternalServerErrorException({statusCode: 500, message: 'Account cannot be created'});
      }
      else throw new InternalServerErrorException({statusCode: 500, message: 'Customer cannot be register'});
    }
  
    /**
     * Salir del sistema
     */
    signOut(JWToken: SignOutDto): boolean {
      const customer = this.jwtService.verify(JWToken.jwt);
      
      if(!customer) return false;

      const answer = this.customerService.findOneByEmailAndPassword(
        customer.username,
        customer.password,
      );

      if(answer) return true;
      return false;
      
    }
    
  }