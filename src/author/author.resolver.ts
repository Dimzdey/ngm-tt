import { Args, ID, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Author as AuthorModel, Book as BookModel } from '@prisma/client'

import { Author } from './author.model'
import { AuthorService } from './author.service'
import { CreateAuthorInput } from './dto/create-author.input'
import { Book } from '../book/book.model'

@Resolver(() => Author)
export class AuthorResolver {
    constructor(private authorService: AuthorService) {}

    @ResolveField(() => [Book])
    books(@Parent() author: Author): Promise<BookModel[]> {
        return this.authorService.loadBooksForAuthor(author.id)
    }

    @Query(() => Author, { nullable: true })
    getAuthor(@Args('id', { type: () => String }) id: string): Promise<AuthorModel | null> {
        return this.authorService.getAuthorById(id)
    }

    @Query(() => [Author])
    async getAuthors(
        @Args('minNumberOfBooks', { type: () => Int, nullable: true }) minNumberOfBooks: number,
        @Args('maxNumberOfBooks', { type: () => Int, nullable: true }) maxNumberOfBooks: number
    ): Promise<AuthorModel[]> {
        return this.authorService.getAuthors(minNumberOfBooks, maxNumberOfBooks)
    }

    @Mutation(() => Author)
    createAuthor(@Args('author') createAuthorInput: CreateAuthorInput): Promise<AuthorModel> {
        return this.authorService.createAuthor(createAuthorInput)
    }

    @Mutation(() => Int)
    deleteAuthor(@Args('id', { type: () => ID }) id: string): Promise<number> {
        return this.authorService.deleteAuthor(id)
    }

    @Mutation(() => Int)
    deleteAuthorWithBooks(@Args('id', { type: () => ID }) id: string): Promise<number> {
        return this.authorService.deleteAuthorWithBooks(id)
    }
}
