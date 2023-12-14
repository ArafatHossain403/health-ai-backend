import { Controller, Get } from "@nestjs/common";

@Controller("/users")
 export class UsersController{
    @Get("/profile")
    getProfile(){
        return {
            name: 'sanim',
            address: 'khulna',
            age: 20
        };
    }
}