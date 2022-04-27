export const blockCodes = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

const floors = [1, 2, 3, 4, 5, 6];

export const roomsByFloor: {
  roomNo: number;
  floor: number;
  occupied?: boolean;
}[][] = floors.map((floorNumber) => {
  return [...Array(32).keys()].map((i) => {
    return { roomNo: floorNumber * 100 + i + 1, floor: floorNumber };
  });
});
