import { Injectable } from '@nestjs/common'
import { CreateBloodInventoryDto } from './dto/create-blood-inventory.dto'
import { UpdateBloodInventoryDto } from './dto/update-blood-inventory.dto'

@Injectable()
export class BloodInventoryService {
  create(createBloodInventoryDto: CreateBloodInventoryDto) {
    return 'This action adds a new bloodInventory'
  }

  findAll() {
    return `This action returns all bloodInventory`
  }

  findOne(id: number) {
    return `This action returns a #${id} bloodInventory`
  }

  update(id: number, updateBloodInventoryDto: UpdateBloodInventoryDto) {
    return `This action updates a #${id} bloodInventory`
  }

  remove(id: number) {
    return `This action removes a #${id} bloodInventory`
  }
}
