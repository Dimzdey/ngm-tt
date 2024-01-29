import { InputType, Field, ID } from '@nestjs/graphql'

@InputType()
export class CreateBookInput {
    @Field()
    title: string

    @Field(() => [ID])
    authorIds: string[]
}
