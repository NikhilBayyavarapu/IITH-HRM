export const getRollFromEmail = (email: string) => {
  return email.substring(0, email.length - 11).toUpperCase();
};
