import gravatar from "gravatar";

export const generateAvatar = async (email: string) => {
  try {
    return gravatar.url(email, { s: "400", d: "retro", r: "pg" });
  } catch (error) {
    throw error;
  }
};
