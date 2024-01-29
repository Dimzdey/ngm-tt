import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Book as BookModel, Author as AuthorModel } from '@prisma/client'

import { Book } from './book.model'
import { BookService } from './book.service'
import { CreateBookInput } from './dto/create-book.input'
import { Author } from '../author/author.model'

@Resolver(() => Book)
export class BookResolver {
    constructor(private bookService: BookService) {}

    @ResolveField(() => [Author])
    authors(@Parent() book: Book): Promise<AuthorModel[]> {
        return this.bookService.loadAuthorsForBook(book.id)
    }

    @Query(() => Book, { nullable: true })
    getBook(@Args('id', { type: () => String }) id: string): Promise<BookModel> {
        return this.bookService.getBookById(id)
    }

    @Query(() => [Book])
    async getBooks(
        @Args('title', { type: () => String, nullable: true }) title: string
    ): Promise<BookModel[]> {
        return this.bookService.getBooks(title)
    }

    @Mutation(() => Book)
    createBook(@Args('book') createBookInput: CreateBookInput): Promise<BookModel> {
        return this.bookService.createBook(createBookInput)
    }

    @Mutation(() => Book)
    addAuthor(
        @Args('bookId', { type: () => ID }) bookId: string,
        @Args('authorId', { type: () => ID }) authorId: string
    ): Promise<BookModel> {
        return this.bookService.addAuthorToBook(bookId, authorId)
    }
}
