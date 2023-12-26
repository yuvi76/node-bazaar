import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger } from '@nestjs/common';

/**
 * Abstract repository class for database operations.
 * @template TDocument - The type of the document.
 */
export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  /**
   * Create a new document.
   * @param document - The document to be created.
   * @returns The created document.
   */
  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  /**
   * Find a single document based on the filter query.
   * @param filterQuery - The filter query to find the document.
   * @returns The found document.
   * @throws NotFoundException if the document is not found.
   */
  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);

    return document;
  }

  /**
   * Find a single document based on the filter query and update it.
   * @param filterQuery - The filter query to find the document.
   * @param update - The update query to update the document.
   * @returns The updated document.
   * @throws NotFoundException if the document is not found.
   */
  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, { new: true })
      .lean<TDocument>(true);

    return document;
  }

  /**
   * Find multiple documents based on the filter query.
   * @param filterQuery - The filter query to find the documents.
   * @returns An array of found documents.
   */
  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  /**
   * Find a single document based on the filter query and delete it.
   * @param filterQuery - The filter query to find the document.
   * @returns The deleted document.
   * @throws NotFoundException if the document is not found.
   */
  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model.findOneAndDelete(filterQuery);

    return document;
  }

  /**
   * Delete multiple documents based on the filter query.
   * @param filterQuery - The filter query to find the documents.
   * @returns The number of documents deleted.
   */
  async deleteMany(filterQuery: FilterQuery<TDocument>): Promise<number> {
    const { deletedCount } = await this.model.deleteMany(filterQuery);
    return deletedCount;
  }
}
