import {
  type Repository,
  type DeepPartial,
  type ObjectLiteral,
  type ObjectType,
  ILike,
} from 'typeorm';

import { AccountEntity } from 'backend/entities/account.entity';
import { handleTypeOrmError } from 'backend/handlers/commonHandlers';
import { RecordNotFoundError } from 'backend/types/errors/common';
import type {
  GetRecordInputs,
  GetRecordsByKeywordInputs,
  GetRecordsInputs,
} from 'backend/types/service';
import { getRepo } from 'backend/utils/database.helper';

export class CommonService {
  public static async createRecord<E extends ObjectLiteral>(
    entity: ObjectType<E>,
    data: DeepPartial<E>,
  ): Promise<E> {
    try {
      const repository: Repository<E> = await getRepo(entity);
      const entityInstance = repository.create(data);
      const record = await repository.save(entityInstance as DeepPartial<E>);
      return record;
    } catch (error) {
      return handleTypeOrmError(error);
    }
  }

  public static async updateRecord<E extends ObjectLiteral>(
    entity: ObjectType<E>,
    id: number | string,
    data: DeepPartial<E>,
  ): Promise<E> {
    try {
      const repository: Repository<E> = await getRepo(entity);
      const existingRecord = await repository.findOne(id);

      if (!existingRecord) {
        throw new RecordNotFoundError(
          `Entity ${entity.name} with id ${id} not found`,
        );
      }

      const updatedRecord = repository.merge(existingRecord, data);
      const subject = await repository.save(updatedRecord as DeepPartial<E>);

      if (entity === AccountEntity) {
        delete (subject as any).password;
      }

      return subject;
    } catch (error) {
      return handleTypeOrmError(error);
    }
  }

  public static async deleteRecord<E extends ObjectLiteral>(
    entity: ObjectType<E>,
    id: number | string,
  ): Promise<boolean> {
    try {
      const repository: Repository<E> = await getRepo(entity);
      const existingRecord = await repository.findOne(id);

      if (!existingRecord) {
        throw new RecordNotFoundError(
          `Entity ${entity.name} with id ${id} not found`,
        );
      }

      await repository.remove(existingRecord);
      return true;
    } catch (error) {
      return handleTypeOrmError(error);
    }
  }

  public static async getRecord<E extends ObjectLiteral>(
    input: GetRecordInputs<E>,
  ): Promise<E> {
    const { entity, filter, relations, select } = input;
    const repository: Repository<E> = await getRepo(entity);
    const records = await repository.find({
      where: filter,
      relations,
      take: 1,
      select,
      order: {
        createdAt: 'DESC',
      } as any,
    });

    return records[0];
  }

  public static async getRecords<E extends ObjectLiteral>(
    input: GetRecordsInputs<E>,
  ): Promise<[E[], number]> {
    const {
      entity,
      paginationParams,
      filter,
      relations,
      select,
      getAll,
      order,
    } = input;
    const { limit, page } = paginationParams;
    const repository: Repository<E> = await getRepo(entity);

    const finalFilter = (filter || {}) as Record<string, any>;
    if (!getAll) {
      finalFilter.active = true;
    }

    const [records, totalRecords] = await repository.findAndCount({
      where: finalFilter,
      skip: (page - 1) * limit,
      take: limit,
      relations,
      select,
      order:
        order ||
        ({
          createdAt: 'DESC',
        } as any),
    });

    return [records, totalRecords];
  }

  public static async getRecordsByKeyword<E extends ObjectLiteral>(
    input: GetRecordsByKeywordInputs<E>,
  ): Promise<E[]> {
    const { entity, searchParams, filter, relations, select, getAll, order } =
      input;

    const { keyword, fieldName, limit } = searchParams;
    const repository: Repository<E> = await getRepo(entity);

    let finalWhere: any;
    if (Array.isArray(filter)) {
      finalWhere = filter.map((element) => {
        const result: Record<string, any> = {
          ...element,
          [fieldName]: ILike(`%${keyword}%`),
        };
        if (!getAll) {
          result.active = true;
        }
      });
    } else {
      finalWhere = {
        ...filter,
        [fieldName]: ILike(`%${keyword}%`),
      };
      if (!getAll) {
        finalWhere.active = true;
      }
    }

    const records: E[] = await repository.find({
      where: finalWhere,
      take: limit,
      relations,
      select,
      order:
        order ||
        ({
          createdAt: 'DESC',
        } as any),
    });
    return records;
  }
}
