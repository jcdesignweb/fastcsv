import readline from "readline";
import { Readable } from "stream";

export class ChunkManager {
  public async read(input: Readable): Promise<string[]> {
    const response: string[] = [];
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input,
      });

      rl.on("line", (line) => {
        response.push(line);
      });

      rl.on("close", () => {
        resolve(response);

        console.log("CSV parsing completed");
      });

      rl.on("error", (err: unknown) => {
        reject(err);
      });
    });
  }
}
