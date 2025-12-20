function shoalnumToArr(num: number): number[] {
    return [Math.floor((num - 1) / 3) + 1, (num - 1) % 3 + 1];
}

function arrToShoalNum(arr: number[]): number {
    return (arr[0] - 1) * 3 + arr[1];
}