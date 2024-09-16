import bcrypt from "bcryptjs";

const genPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error during salt generation or password hashing:", error);

    throw new Error("Failed to generate salt or hash password");
  }
};
const validatePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
  } catch (error) {
    console.error("Error during password validation", error);

    throw new Error("Failed to validate password");
  }
};

export { genPassword, validatePassword };
