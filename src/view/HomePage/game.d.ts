// 定义棋子类型和方格类型
declare type ChessPiece = 'white'|'black'|null
declare type Grid={
    x:number
    y:number
    canPlace:boolean
    chessPiece:ChessPiece
    showHint: boolean
}
export { Grid, ChessPiece };
