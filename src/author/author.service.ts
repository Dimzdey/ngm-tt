import { Injectable } from '@nestjs/common'
import { Author as AuthorModel, Book as BookModel } from '@prisma/client'
import * as DataLoader from 'dataloader'

import { CreateAuthorInput } from './dto/create-author.input'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuthorService {
    private readonly authorBooksLoader: DataLoader<string, BookModel[]>

    constructor(private prisma: PrismaService) {
        this.authorBooksLoader = new DataLoader<string, BookModel[]>(keys =>
            this.getBooksByAuthorIds([...keys])
        )
    }

    async loadBooksForAuthor(authorId: string): Promise<BookModel[]> {
        return this.authorBooksLoader.load(authorId)
    }

    private async getBooksByAuthorIds(authorIds: string[]): Promise<BookModel[][]> {
        const bookAuthors = await this.prisma.bookAuthors.findMany({
            where: { authorId: { in: authorIds } },
            include: { book: true },
        })

        const booksByAuthor = authorIds.map(id =>
            bookAuthors.filter(ba => ba.authorId === id).map(ba => ba.book)
        )

        return booksByAuthor
    }

    async getAuthorById(id: string): Promise<AuthorModel> {
        return this.prisma.author.findUnique({
            where: { id },
        })
    }

    async getAuthors(minNumberOfBooks?: number, maxNumberOfBooks?: number): Promise<AuthorModel[]> {
        if (!minNumberOfBooks && !maxNumberOfBooks) {
            return this.prisma.author.findMany()
        }

        const havingClause: Record<string, number> = {}
        if (minNumberOfBooks !== undefined) {
            havingClause.gte = minNumberOfBooks
        }
        if (maxNumberOfBooks !== undefined) {
            havingClause.lte = maxNumberOfBooks
        }

        const authorsWithBookCount = await this.prisma.bookAuthors.groupBy({
            by: ['authorId'],
            having: {
                authorId: {
                    _count: havingClause,
                },
            },
        })

        const authorIds = authorsWithBookCount.map(author => author.authorId)

        return this.prisma.author.findMany({
            where: {
                id: {
                    in: authorIds,
                },
            },
        })
    }

    async createAuthor(data: CreateAuthorInput): Promise<AuthorModel> {
        return this.prisma.author.create({
            data,
        })
    }

    async deleteAuthor(id: string): Promise<number> {
        const result = await this.prisma.author.deleteMany({
            where: { id },
        })
        return result.count
    }

    async deleteAuthorWithBooks(authorId: string): Promise<number> {
        return this.prisma.$transaction(async prisma => {
            let totalAffected = 0

            // Remove author from co-authored books
            const coAuthoredBooksUpdate = await prisma.bookAuthors.deleteMany({
                where: {
                    authorId,
                    book: {
                        BookAuthors: {
                            some: {
                                authorId: { not: authorId },
                            },
                        },
                    },
                },
            })
            totalAffected += coAuthoredBooksUpdate.count

            // Find books that only this author authored
            const soloAuthoredBooks = await prisma.book.findMany({
                where: {
                    BookAuthors: {
                        every: { authorId },
                    },
                },
                select: { id: true },
            })

            // Delete the references in BookAuthors for solo-authored books
            if (soloAuthoredBooks.length > 0) {
                const bookIds = soloAuthoredBooks.map(book => book.id)
                await prisma.bookAuthors.deleteMany({
                    where: {
                        bookId: { in: bookIds },
                    },
                })

                // Delete the solo-authored books
                const soloAuthoredBooksDelete = await prisma.book.deleteMany({
                    where: { id: { in: bookIds } },
                })
                totalAffected += soloAuthoredBooksDelete.count
            }

            // Delete the author
            const authorDelete = await prisma.author.deleteMany({
                where: { id: authorId },
            })
            totalAffected += authorDelete.count

            return totalAffected
        })
    }
}
