export const extractAddress = (address: string) => {
  const addressArray = address.split(",");
  const reversedAddressArray = addressArray.reverse();

  return {
    thành_phố: reversedAddressArray[0]?.trim() || null,
    phường: reversedAddressArray[1]?.trim() || null,
    thôn: reversedAddressArray[2]?.trim() || null,
  };
};
