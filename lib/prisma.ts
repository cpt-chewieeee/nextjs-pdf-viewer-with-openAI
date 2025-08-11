import { PrismaClient } from "@prisma/client/extension";

let prismaInstance: PrismaClient;

// Add type-safe property to global object
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}


if(process.env.NODE_ENV === 'production') {
  prismaInstance = new PrismaClient();
} 
else {
  if(!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prismaInstance = global.prisma;
}


export default prismaInstance;