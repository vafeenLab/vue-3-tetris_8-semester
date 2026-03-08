export interface Cell {
  value: number
  color: string | null
  colorId: number | null
}

export interface Piece {
  shape: number[][]
  color: string
  colorId: number
  id?: string
}