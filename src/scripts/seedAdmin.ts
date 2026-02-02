import { email } from "better-auth/*"
import { prisma } from "../lib/prisma"
import { UserRole } from "../middlewares/auth"

async function seedAdmin(){
    try{
        console.log("*** Admin  seeding Started..")
        const adminData={
            name:"Admin User",
            email:"hasansaik81@gmail.com",
            role:UserRole.ADMIN,
            password:"admin1234"
           
        }
        console.log("*** cheking admin exist or not")
        // check user exist on db or not 
        const existingUser =await prisma.user.findUnique({
            where:{
                email:adminData.email
            }
        })
        if(existingUser){
            throw new Error("Admin user aleady exist!!")
        }
        const signUpAdmin= await fetch("http://localhost:3000/api/auth/sign-up/email",{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify(adminData)
        })

        if(signUpAdmin.ok){
            console.log("*** Admin created")
            await prisma.user.update({
                where:{
                    email:adminData.email

                },
                data:{
                    emailVerified:true
                }
            })
            console.log("** Email Verification status updated!")
        }
        console.log("** success***")
    }catch(error){
        console.error(error);
    }
}

seedAdmin()