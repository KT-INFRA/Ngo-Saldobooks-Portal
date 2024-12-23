/**
 * Converts a file to a Base64 string.
 * @param {File} file - The file to convert.
 * @returns {Promise<string>} - A promise that resolves to a Base64 string.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const convertFileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = typeof reader.result === 'string' ? reader.result.split(',')[1] : null;
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};
