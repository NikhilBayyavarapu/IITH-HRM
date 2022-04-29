import moment from "moment";

export const getReadableStringFromTimestamp = (timestamp: string) => {
  return moment(new Date(timestamp)).format("MMMM Do YYYY, h:mm:ss a");
};
