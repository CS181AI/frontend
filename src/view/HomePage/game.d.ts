// 定义棋子类型和方格类型
declare type chessPiece= 'white'|'black'|null
declare type Grid={
    x:number
    y:number
    canPlace:boolean
    chessPieceType:chessPiece
}
export default Grid;
