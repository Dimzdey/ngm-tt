import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Author } from '../author/author.model'

@ObjectType()
export class Book {
    @Field(() => ID)
    id: string

    @Field()
    title: string

    @Field(() => [Author])
    authors: Author[]
}
