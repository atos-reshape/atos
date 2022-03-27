import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardSetDto } from './dtos/create-card-set.dto';
import { CardSet } from './entities/card-set.entity';

@Injectable()
export class CardSetService {
  constructor(
    @InjectRepository(CardSet)
    private readonly cardSetRepository: EntityRepository<CardSet>,
  ) {}

  async findAll(): Promise<CardSet[]> {
    return await this.cardSetRepository.findAll();
  }

  async findOne(id: string): Promise<CardSet> {
    return await this.cardSetRepository.findOne(id);
  }

  async create(cardSet: CreateCardSetDto): Promise<CardSet> {
    const newCardSet = this.cardSetRepository.create({
      cards: cardSet.cards,
      type: cardSet.type,
    });
    await this.cardSetRepository.persistAndFlush(newCardSet);
    return newCardSet;
  }

  async update(id: string, cardSetData: CreateCardSetDto): Promise<CardSet> {
    const cardSet = await this.findOne(id);
    if (!cardSet) throw new NotFoundException('Card set not found');
    wrap(cardSet).assign(cardSetData);
    await this.cardSetRepository.flush();

    return cardSet;
  }

  async delete(id: string): Promise<void> {
    const cardSet = await this.findOne(id);
    if (!cardSet) throw new NotFoundException('Card set not found');

    wrap(cardSet).assign({ ...cardSet, isDeleted: new Date() } as CardSet);
    return await this.cardSetRepository.flush();
  }
}
