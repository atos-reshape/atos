import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dtos/create-card.dto';
import { wrap } from '@mikro-orm/core';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: EntityRepository<Card>,
  ) {}

  async findAll(): Promise<Card[]> {
    return await this.cardRepository.findAll();
  }

  async findOne(id: string): Promise<Card> {
    return await this.cardRepository.findOne(id);
  }

  async create(card: CreateCardDto): Promise<Card> {
    const newCard = this.cardRepository.create({ text: card.text });
    await this.cardRepository.persistAndFlush(newCard);
    return newCard;
  }

  async update(id: string, cardData: CreateCardDto): Promise<Card> {
    const card = await this.findOne(id);
    if (!card) throw new NotFoundException('Card not found');
    wrap(card).assign(cardData);
    await this.cardRepository.flush();

    return card;
  }

  async delete(id: string): Promise<void> {
    const card = await this.findOne(id);
    if (!card) throw new NotFoundException('Card not found');

    return await this.cardRepository.removeAndFlush(card);
  }
}
