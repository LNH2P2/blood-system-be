export class PaginationMeta {
  current: number // Trang hiện tại
  limit: number // Số bản ghi trên một trang
  pages: number // Tổng số trang
  total: number // Tổng số bản ghi
}

export class FindAllResult<T> {
  message: string
  data: {
    meta: PaginationMeta
    result: T[] // Danh sách kết quả (loại `T` là kiểu dữ liệu user)
  }
}
