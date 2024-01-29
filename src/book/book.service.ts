import { Injectable } from '@nestjs/common'
import { Book as BookModel, Author as AuthorModel } from '@prisma/client'
import * as DataLoader from 'dataloader'

import { CreateBookInput } from './dto/create-book.input'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class BookService {
    private readonly bookAuthorsLoader: DataLoader<string, AuthorModel[]>

    constructor(private prisma: PrismaService) {
        this.bookAuthorsLoader = new DataLoader<string, AuthorModel[]>(keys =>
            this.getAuthorsByBookIds([...keys])
        )
    }

    private async getAuthorsByBookIds(bookIds: string[]): Promise<AuthorModel[][]> {
        console.log('getAuthorsByBookIds', bookIds)
        const bookAuthors = await this.prisma.bookAuthors.findMany({
            where: { bookId: { in: bookIds } },
            include: { author: true },
        })

        const authorsByBook = bookIds.map(id =>
            bookAuthors.filter(ba => ba.bookId === id).map(ba => ba.author)
        )

        return authorsByBook
    }

    loadAuthorsForBook(bookId: string): Promise<AuthorModel[]> {
        console.log('loadAuthorsForBook', bookId)
        return this.bookAuthorsLoader.load(bookId)
    }

    async getBookById(id: string): Promise<BookModel | null> {
        return this.prisma.book.findUnique({
            where: { id },
        })
    }

    async getBooks(title?: string): Promise<BookModel[]> {
        return this.prisma.book.findMany({
            where: {
                title: {
                    contains: title,
                    mode: 'insensitive',
                },
            },
        })
    }

    async createBook(data: CreateBookInput): Promise<BookModel> {
        const authorIds = data.authorIds
        for (const authorId of authorIds) {
            const authorExists = await this.prisma.author.findUnique({
                where: { id: authorId },
            })

            if (!authorExists) {
                throw new Error(`Author with ID ${authorId} not found`)
            }
        }

        return this.prisma.book.create({
            data: {
                title: data.title,
                BookAuthors: {
                    create: authorIds.map(authorId => ({
                        authorId,
                    })),
                },
            },
        })
    }

    async addAuthorToBook(bookId: string, authorId: string): Promise<BookModel> {
        const bookExists = await this.prisma.book.findUnique({
            where: { id: bookId },
        })
        if (!bookExists) {
            throw new Error(`Book with ID ${bookId} not found`)
        }

        const authorExists = await this.prisma.author.findUnique({
            where: { id: authorId },
        })
        if (!authorExists) {
            throw new Error(`Author with ID ${authorId} not found`)
        }

        return this.prisma.book.update({
            where: { id: bookId },
            data: {
                BookAuthors: {
                    create: { authorId },
                },
            },
        })
    }
}
