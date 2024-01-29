import { join } from 'path'

import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

import { AuthorModule } from './author/author.module'
import { BookModule } from './book/book.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            playground: true,
            introspection: true,
        }),
        PrismaModule,
        AuthorModule,
        BookModule,
    ],
})
export class AppModule {}
