import * as z from "zod";

export type TServerActionResponse<T> =
  | { success: true; data: T; message: string; error?: never }
  | { success: false; data?: never; message: string; error: string };

export function createServerAction<T extends z.ZodType, R>(
  schema: T,
  action: (data: z.infer<T>, userId?: string) => Promise<R>,
  options?: {
    protected?: boolean;
  },
) {
  return async (rawInput: unknown): Promise<TServerActionResponse<R>> => {
    try {
      if (options?.protected) {
        // Authenticated frontend actions will be wired to the backend API later.
      }

      const result = schema.safeParse(rawInput);
      if (!result.success) {
        const { fieldErrors, formErrors } = result.error.flatten();
        const messages = [
          ...formErrors,
          ...Object.values(fieldErrors).flatMap((msgs) => msgs ?? []),
        ];
        return {
          success: false,
          message: "Invalid Input",
          error: messages.join(", "),
        };
      }

      const data = await action(result.data);

      return { success: true, data, message: "Success" };
    } catch (e: unknown | Error) {
      if (e instanceof Error && e.message === "NEXT_REDIRECT") {
        throw e;
      }

      console.error("[ERROR] : Server action error", e);
      const errorMessage = (e as Error).message || "An unknown error occurred";
      return { success: false, message: "Server Error", error: errorMessage };
    }
  };
}
