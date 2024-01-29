import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Book } from '../book/book.model'

@ObjectType()
export class Author {
    @Field(() => ID)
    id: string

    @Field()
    firstName: string

    @Field()
    lastName: string

    @Field(() => [Book])
    books: Book[]
}
