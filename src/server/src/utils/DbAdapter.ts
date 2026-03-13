import jsonfile from "jsonfile";
import fs from "node:fs/promises";

type DbEntry = { id: string };

class DbAdapter {
  async readEntries<T extends DbEntry>(path: string): Promise<T[]> {
    const data: T[] = await jsonfile.readFile(path, { encoding: "utf8" });
    return data;
  }

  async appendEntry<T extends DbEntry>(path: string, entry: T): Promise<void> {
    const data: T[] = await this.readEntries(path);
    await jsonfile.writeFile(path, [...data, entry], { flag: "w", spaces: 2 });
    console.log(`Appended new entry to '${path}'`);
  }

  async deleteEntryById<T extends DbEntry>(
    path: string,
    id: string,
  ): Promise<void> {
    const data: T[] = await this.readEntries(path);
    const updatedData = data.filter((entry) => entry.id !== id);
    await jsonfile.writeFile(path, updatedData, { flag: "w", spaces: 2 });
    console.log(`Deleted entry '${id}' from '${path}'`);
  }

  async createFile(path: string): Promise<boolean> {
    try {
      await fs.access(path, fs.constants.R_OK);
      return false;
    } catch {
      await fs.writeFile(path, "[]");
      console.log("File created successfully");
      return true;
    }
  }

  async deleteAllEntries(path: string): Promise<void> {
    await jsonfile.writeFile(path, [], { flag: "w", spaces: 2 });
    console.log(`All entries deleted from '${path}'`);
  }

  async deleteFile(path: string): Promise<void> {
    await fs.rm(path);
    console.log(`File '${path}' deleted`);
  }
}

const dbAdapter = new DbAdapter();
export default dbAdapter;
