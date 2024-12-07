import { describe, expect, it, jest } from "@jest/globals";
import mongoose from "mongoose";

import { Media } from "../../../src/models";
import { generateMedia } from "../../utils/media";

// replaced "mongoose-update-if-current";
// Increment/include the 'version' number whenever the primary service
// responsible for a record emits an event to describe a record mutation (create/destroy/update)
describe("optimistic concurrency control", () => {
  it("throw an error if concurrency version doesn't match", async () => {
    // Create an instance of a Media
    const userId = new mongoose.Types.ObjectId().toHexString();

    const media = new Media({
      ...generateMedia("concert"),
      userId,
    });
    // Save the ticket to the database
    await media.save();
    // fetch the ticket twice
    const firstInstance = await Media.findById(media.id);
    const secondInstance = await Media.findById(media.id);
    // make two septate changes to the tickets we fetched
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    // save the first fetched ticket
    await firstInstance!.save();
    // save the second fetched ticket
    await expect(() => secondInstance!.save()).rejects.toThrowError(mongoose.Error.VersionError);
  });

  it("increments the version number on multiple saves", async () => {
    // Create an instance of a Media
    const userId = new mongoose.Types.ObjectId().toHexString();

    const media = new Media({
      ...generateMedia("concert"),
      userId,
    });

    // Save the ticket to the database
    await media.save();

    let i = media.version;

    expect(media.version).toEqual(0);

    while (i < 4) {
      ++i;
      media!.set({ price: i });
      await media.save();
      expect(media.version).toEqual(i);
    }
  });
});
