/**
 * Represents a user data transfer object.
 */
export interface UserDto {
  /**
   * The unique identifier of the user.
   */
  _id: string;

  /**
   * The name of the user.
   */
  name: string;

  /**
   * The email address of the user.
   */
  email: string;

  /**
   * The password of the user.
   */
  password: string;

  /**
   * The role of the user.
   */
  role?: string;
}
