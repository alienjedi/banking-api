export const checkParams = (providedParams: any, requiredParams: string[]) => {
  let valid = true;
  // Check if at least the first required parameter is provided
  if (providedParams[requiredParams[0]] === undefined) return false;
  requiredParams.forEach((param: string) => {
    if (providedParams[param] === undefined) valid = false;
  });
  return valid;
};
